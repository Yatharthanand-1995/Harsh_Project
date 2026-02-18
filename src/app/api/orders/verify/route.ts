import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { logger } from '@/lib/logger'
import {
  errorResponse,
  unauthorizedResponse,
  badRequestResponse,
  successResponse,
} from '@/lib/api-response'
import { sendPaymentVerificationEmail } from '@/lib/email'

const verifyPaymentSchema = z.object({
  orderId: z.string().min(1, 'Order ID is required'),
})

/**
 * POST /api/orders/verify
 * Customer confirms they have made the UPI payment.
 * Marks the order as VERIFICATION_PENDING and emails the admin.
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return unauthorizedResponse('Please sign in to confirm payment')
    }

    const body = await request.json()
    const { orderId } = verifyPaymentSchema.parse(body)

    // Find the order (must belong to this user)
    const order = await prisma.order.findFirst({
      where: {
        OR: [{ id: orderId }, { orderNumber: orderId }],
        userId: session.user.id,
      },
      include: {
        user: { select: { name: true, email: true } },
        items: { include: { product: { select: { name: true } } } },
        deliveryAddress: true,
      },
    })

    if (!order) {
      return badRequestResponse('Order not found or does not belong to you')
    }

    if (order.paymentStatus === 'PAID') {
      return badRequestResponse('This order has already been paid and confirmed')
    }

    if (order.paymentStatus === 'VERIFICATION_PENDING') {
      return successResponse({
        success: true,
        message: 'Your payment notification has already been sent. We will confirm your order shortly.',
        order: { id: order.id, orderNumber: order.orderNumber, paymentStatus: order.paymentStatus },
      })
    }

    // Mark as awaiting admin verification
    await prisma.order.update({
      where: { id: order.id },
      data: { paymentStatus: 'VERIFICATION_PENDING' },
    })

    // Send email to admin with one-click confirm/reject links
    try {
      await sendPaymentVerificationEmail({
        orderId: order.id,
        orderNumber: order.orderNumber,
        total: order.total,
        customerName: order.user.name ?? 'Customer',
        customerEmail: order.user.email ?? '',
        items: order.items,
        deliveryAddress: order.deliveryAddress,
      })
    } catch (emailError) {
      // Email failure should not block the customer — log and continue
      logger.error(
        { error: emailError instanceof Error ? emailError.message : 'Unknown' },
        'Failed to send payment verification email'
      )
    }

    logger.info('Customer confirmed UPI payment — awaiting admin verification', {
      orderId: order.id,
      orderNumber: order.orderNumber,
      userId: session.user.id,
      amount: order.total,
    })

    return successResponse({
      success: true,
      message: 'Thank you! We have been notified and will confirm your order shortly.',
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        total: order.total,
        status: order.status,
        paymentStatus: 'VERIFICATION_PENDING',
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return badRequestResponse(error.issues[0]?.message || 'Invalid request')
    }
    logger.error(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      'Error in payment verification'
    )
    return errorResponse('Failed to submit payment. Please try again or contact support.')
  }
}
