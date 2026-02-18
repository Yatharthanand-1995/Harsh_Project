import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import {
  successResponse,
  unauthorizedResponse,
  badRequestResponse,
  errorResponse,
} from '@/lib/api-response'
import { logger } from '@/lib/logger'

const verifySchema = z.object({
  action: z.enum(['approve', 'reject']),
})

/**
 * POST /api/admin/orders/[id]/verify
 * Approve or reject a UPI payment (admin only)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    if (!session?.user?.id || (session.user as { role?: string }).role !== 'ADMIN') {
      return unauthorizedResponse('Admin access required')
    }

    const { id } = await params
    const body = await request.json()
    const { action } = verifySchema.parse(body)

    const order = await prisma.order.findUnique({
      where: { id },
      select: {
        id: true,
        orderNumber: true,
        userId: true,
        paymentStatus: true,
        paymentId: true,
        total: true,
      },
    })

    if (!order) {
      return badRequestResponse('Order not found')
    }

    if (order.paymentStatus !== 'VERIFICATION_PENDING') {
      return badRequestResponse(
        `Order is not awaiting verification (current status: ${order.paymentStatus})`
      )
    }

    if (action === 'approve') {
      await prisma.$transaction(async (tx) => {
        await tx.order.update({
          where: { id },
          data: {
            paymentStatus: 'PAID',
            status: 'CONFIRMED',
            paidAt: new Date(),
          },
        })
        // Clear the customer's cart now that payment is confirmed
        await tx.cartItem.deleteMany({
          where: { userId: order.userId },
        })
      })

      logger.info('Admin approved UPI payment', {
        orderId: order.id,
        orderNumber: order.orderNumber,
        transactionId: order.paymentId,
        adminId: session.user.id,
        amount: order.total,
      })

      return successResponse({
        message: `Order #${order.orderNumber} approved. Customer has been confirmed.`,
      })
    } else {
      // Reject: clear the transaction ID so customer can resubmit
      await prisma.order.update({
        where: { id },
        data: {
          paymentStatus: 'FAILED',
          paymentId: null,
        },
      })

      logger.info('Admin rejected UPI payment', {
        orderId: order.id,
        orderNumber: order.orderNumber,
        transactionId: order.paymentId,
        adminId: session.user.id,
      })

      return successResponse({
        message: `Order #${order.orderNumber} rejected. Customer can resubmit their transaction ID.`,
      })
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return badRequestResponse('Invalid action. Must be "approve" or "reject".')
    }
    logger.error(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      'Admin verify error'
    )
    return errorResponse('Failed to process verification')
  }
}
