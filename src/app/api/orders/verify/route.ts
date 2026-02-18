import { NextRequest } from 'next/server';
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
import { validateUpiTransactionId, formatTransactionId } from '@/lib/qr-code-utils';

// Validation schema for UPI payment verification
const verifyPaymentSchema = z.object({
  orderId: z.string().min(1, 'Order ID is required'),
  upiTransactionId: z
    .string()
    .min(12, 'Transaction ID must be at least 12 characters')
    .max(16, 'Transaction ID must be at most 16 characters')
    .refine(
      (val) => validateUpiTransactionId(val),
      'Invalid transaction ID format. Must be 12-16 alphanumeric characters'
    ),
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
    const validatedData = verifyPaymentSchema.parse(body);

    // Format transaction ID (trim, uppercase)
    const formattedTransactionId = formatTransactionId(validatedData.upiTransactionId);

    // Find the order - orderId can be either the order ID or order number
    const order = await prisma.order.findFirst({
      where: {
        OR: [
          { id: validatedData.orderId },
          { orderNumber: validatedData.orderId },
        ],
        userId: session.user.id,
      },
      select: {
        id: true,
        orderNumber: true,
        status: true,
        paymentStatus: true,
        paymentId: true,
        total: true,
        userId: true,
      },
    });

    if (!order) {
      logger.warn('Order not found for payment verification', {
        orderId: validatedData.orderId,
        userId: session.user.id,
      });
      return badRequestResponse('Order not found or does not belong to you');
    }

    // Check if order is already paid
    if (order.paymentStatus === 'PAID') {
      logger.info('Attempted to verify already paid order', {
        orderId: order.id,
        userId: session.user.id,
      });
      return badRequestResponse('This order has already been verified and paid');
    }

    // Check if transaction ID has already been submitted for this order
    if (order.paymentId && order.paymentId === formattedTransactionId) {
      logger.info('Transaction ID already submitted for this order', {
        orderId: order.id,
        userId: session.user.id,
      });
      return successResponse({
        success: true,
        message: 'Transaction ID already submitted. Awaiting admin verification.',
        order: {
          id: order.id,
          orderNumber: order.orderNumber,
          paymentStatus: order.paymentStatus,
        },
      });
    }

    // Check for duplicate UPI transaction ID across ALL orders
    const existingOrder = await prisma.order.findFirst({
      where: {
        paymentId: formattedTransactionId,
        id: { not: order.id },
      },
      select: {
        id: true,
        orderNumber: true,
      },
    });

    if (existingOrder) {
      logger.error(
        {
          orderId: order.id,
          existingOrderId: existingOrder.id,
          transactionId: formattedTransactionId,
          userId: session.user.id,
        },
        'Duplicate UPI transaction ID detected'
      );
      return badRequestResponse(
        'This transaction ID has already been used for another order. Please verify your transaction ID or contact support.'
      );
    }

    // Update order in a transaction
    const updatedOrder = await prisma.$transaction(async (tx) => {
      // Update order with UPI transaction ID and confirm immediately
      const updated = await tx.order.update({
        where: { id: order.id },
        data: {
          paymentId: formattedTransactionId,
          paymentStatus: 'PAID',
          status: 'CONFIRMED',
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

    logger.info('UPI payment confirmed successfully', {
      orderId: updatedOrder.id,
      orderNumber: updatedOrder.orderNumber,
      transactionId: formattedTransactionId,
      userId: session.user.id,
      amount: updatedOrder.total,
    });

    // TODO: Send order confirmation email
    // await sendOrderConfirmationEmail(updatedOrder);

    return successResponse({
      success: true,
      message: 'Payment confirmed! Your order is now being prepared.',
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
      const firstError = error.issues[0];
      logger.warn('Payment verification validation failed', {
        validationErrors: error.issues,
      });
      return badRequestResponse(
        firstError?.message || 'Invalid payment verification data'
      );
    }

    logger.error(
      {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      },
      'Error submitting payment details'
    );

    return errorResponse('Failed to submit payment details. Please try again or contact support.');
  }
}
