import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { verifyPaymentSignature } from '@/lib/razorpay';
import { z } from 'zod';
import { logger } from '@/lib/logger';
import {
  errorResponse,
  unauthorizedResponse,
  badRequestResponse,
  successResponse,
} from '@/lib/api-response';

// Validation schema for payment verification
const verifyPaymentSchema = z.object({
  orderId: z.string().min(1, 'Order ID is required'),
  razorpayOrderId: z.string().min(1, 'Razorpay order ID is required'),
  razorpayPaymentId: z.string().min(1, 'Razorpay payment ID is required'),
  razorpaySignature: z.string().min(1, 'Payment signature is required'),
});

/**
 * POST /api/orders/verify
 * Verifies Razorpay payment signature and updates order status
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return unauthorizedResponse('Please sign in to verify payment');
    }

    // Parse and validate request body
    const body = await request.json();
    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } =
      verifyPaymentSchema.parse(body);

    // Find the order
    const order = await prisma.order.findFirst({
      where: {
        orderNumber: orderId,
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

    // Verify payment signature
    const isValid = verifyPaymentSignature(
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    );

    if (!isValid) {
      // Log failed verification attempt
      logger.error({
        orderId,
        razorpayOrderId,
        razorpayPaymentId,
        userId: session.user.id,
      }, 'Payment verification failed');

      return badRequestResponse('Invalid payment signature');
    }

    // Update order in a transaction
    const updatedOrder = await prisma.$transaction(async (tx) => {
      // Update order status
      const updated = await tx.order.update({
        where: { id: order.id },
        data: {
          paymentId: razorpayPaymentId,
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

      // Clear user's cart after successful payment
      await tx.cartItem.deleteMany({
        where: { userId: session.user.id },
      });

      return updated;
    });

    // TODO: Send order confirmation email
    // await sendOrderConfirmationEmail(updatedOrder);

    return successResponse({
      success: true,
      message: 'Payment verified successfully',
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

    logger.error({ error }, 'Error verifying payment');
    return errorResponse(error, 'Failed to verify payment');
  }
}
