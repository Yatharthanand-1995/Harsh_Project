import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { logger } from '@/lib/logger';
import {
  errorResponse,
  unauthorizedResponse,
  badRequestResponse,
  successResponse,
} from '@/lib/api-response';

// Validation schema for UPI payment verification
const verifyPaymentSchema = z.object({
  orderId: z.string().min(1, 'Order ID is required'),
  upiTransactionId: z.string().min(12, 'Valid UPI Transaction ID is required').max(50),
});

/**
 * POST /api/orders/verify
 * Submits UPI transaction ID for payment verification
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return unauthorizedResponse('Please sign in to submit payment details');
    }

    // Parse and validate request body
    const body = await request.json();
    const { orderId, upiTransactionId } = verifyPaymentSchema.parse(body);

    // Find the order - orderId can be either the order ID or order number
    const order = await prisma.order.findFirst({
      where: {
        OR: [
          { id: orderId },
          { orderNumber: orderId },
        ],
        userId: session.user.id,
      },
    });

    if (!order) {
      return badRequestResponse('Order not found');
    }

    // Check if order is already paid
    if (order.paymentStatus === 'PAID') {
      return badRequestResponse('Order is already paid');
    }

    // Check for duplicate UPI transaction ID
    const existingOrder = await prisma.order.findFirst({
      where: {
        paymentId: upiTransactionId,
        id: { not: order.id },
      },
    });

    if (existingOrder) {
      logger.error({
        orderId: order.id,
        upiTransactionId,
        userId: session.user.id
      }, 'Duplicate UPI transaction ID detected');
      return badRequestResponse('This transaction ID has already been used for another order');
    }

    // Update order in a transaction
    const updatedOrder = await prisma.$transaction(async (tx) => {
      // Update order with UPI transaction ID
      const updated = await tx.order.update({
        where: { id: order.id },
        data: {
          paymentId: upiTransactionId,
          paymentStatus: 'PENDING', // Will be verified by admin
          paidAt: new Date(),
        },
        include: {
          items: {
            include: {
              product: {
                select: {
                  name: true,
                  thumbnail: true,
                },
              },
            },
          },
          deliveryAddress: true,
        },
      });

      // Clear user's cart after payment submission
      await tx.cartItem.deleteMany({
        where: { userId: session.user.id },
      });

      return updated;
    });

    logger.info('UPI payment details submitted', {
      orderId: updatedOrder.id,
      upiTransactionId,
      userId: session.user.id,
    });

    // TODO: Send order confirmation email
    // await sendOrderConfirmationEmail(updatedOrder);

    return successResponse({
      success: true,
      message: 'Payment details submitted successfully. Your order will be processed once verified.',
      order: {
        id: updatedOrder.id,
        orderNumber: updatedOrder.orderNumber,
        total: updatedOrder.total,
        status: updatedOrder.status,
        paymentStatus: updatedOrder.paymentStatus,
        items: updatedOrder.items,
        address: updatedOrder.deliveryAddress,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse(error, 'Invalid payment verification data');
    }

    logger.error({ error }, 'Error submitting payment details');
    return errorResponse(error, 'Failed to submit payment details');
  }
}
