import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { PRICING } from '@/lib/constants';
import { logger } from '@/lib/logger';
import {
  errorResponse,
  unauthorizedResponse,
  badRequestResponse,
  createdResponse,
} from '@/lib/api-response';

// Validation schema for order creation
const createOrderSchema = z.object({
  addressId: z.string().cuid('Invalid address ID'),
  deliverySlot: z.enum(['morning', 'afternoon', 'evening', 'midnight']),
  deliveryDate: z.string().datetime().or(z.string().date()),
  deliveryNotes: z.string().max(500).optional(),
  giftMessage: z.string().max(200).optional(),
  isGift: z.boolean().default(false),
  idempotencyKey: z.string().min(16).max(128).optional(), // Client-generated unique key
});

/**
 * POST /api/orders
 * Creates a new order from the user's cart
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return unauthorizedResponse('Please sign in to create an order');
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = createOrderSchema.parse(body);

    // Check for idempotency - prevent duplicate orders
    if (validatedData.idempotencyKey) {
      const existingOrder = await prisma.order.findUnique({
        where: {
          idempotencyKey: validatedData.idempotencyKey,
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

      if (existingOrder) {
        logger.info(
          'Idempotent request: returning existing order',
          { orderId: existingOrder.id, idempotencyKey: validatedData.idempotencyKey }
        );
        return NextResponse.json({
          success: true,
          order: {
            id: existingOrder.id,
            orderNumber: existingOrder.orderNumber,
            total: existingOrder.total,
            status: existingOrder.status,
            paymentStatus: existingOrder.paymentStatus,
            items: existingOrder.items,
            address: existingOrder.deliveryAddress,
            deliverySlot: existingOrder.deliverySlot,
            deliveryDate: existingOrder.deliveryDate,
          },
          idempotent: true,
        });
      }
    }

    // Fetch cart items with product details
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: session.user.id },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            stock: true,
            isActive: true,
          },
        },
      },
    });

    // Validate cart is not empty
    if (cartItems.length === 0) {
      return badRequestResponse('Your cart is empty');
    }

    // Validate all products are available and in stock
    for (const item of cartItems) {
      if (!item.product.isActive) {
        return badRequestResponse(`Product "${item.product.name}" is no longer available`);
      }
      if (item.product.stock < item.quantity) {
        return badRequestResponse(
          `Insufficient stock for "${item.product.name}". Only ${item.product.stock} available.`
        );
      }
    }

    // Verify address belongs to user
    const address = await prisma.address.findUnique({
      where: {
        id: validatedData.addressId,
        userId: session.user.id,
      },
    });

    if (!address) {
      return badRequestResponse('Invalid delivery address');
    }

    // Calculate order totals
    const subtotal = cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
    const deliveryFee =
      subtotal >= PRICING.FREE_DELIVERY_THRESHOLD ? 0 : PRICING.DELIVERY_FEE;
    const tax = Math.round(subtotal * PRICING.GST_RATE);
    const total = subtotal + deliveryFee + tax;

    // Generate unique order number
    const orderNumber = `HOM${Date.now()}${Math.floor(Math.random() * 1000)}`;

    // Create order with items in a transaction
    const order = await prisma.$transaction(async (tx) => {
      // Create the order
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          userId: session.user.id,
          addressId: validatedData.addressId,
          deliverySlot: validatedData.deliverySlot,
          deliveryDate: new Date(validatedData.deliveryDate),
          ...(validatedData.deliveryNotes && { deliveryNotes: validatedData.deliveryNotes }),
          ...(validatedData.giftMessage && { giftMessage: validatedData.giftMessage }),
          isGift: validatedData.isGift,
          ...(validatedData.idempotencyKey && { idempotencyKey: validatedData.idempotencyKey }),
          subtotal,
          deliveryFee,
          tax,
          total,
          status: 'PENDING',
          paymentStatus: 'PENDING',
          items: {
            create: cartItems.map((item) => ({
              productId: item.productId,
              name: item.product.name,
              price: item.product.price,
              quantity: item.quantity,
            })),
          },
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

      // Update product stock
      for (const item of cartItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      return newOrder;
    });

    // Return created order
    return createdResponse({
      success: true,
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        total: order.total,
        status: order.status,
        paymentStatus: order.paymentStatus,
        items: order.items,
        address: order.deliveryAddress,
        deliverySlot: order.deliverySlot,
        deliveryDate: order.deliveryDate,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse(error, 'Invalid order data');
    }

    logger.error({ error }, 'Error creating order');
    return errorResponse(error, 'Failed to create order');
  }
}

/**
 * GET /api/orders
 * Retrieves orders for the authenticated user
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return unauthorizedResponse('Please sign in to view orders');
    }

    // Parse query parameters for pagination
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const skip = (page - 1) * limit;

    // Fetch orders with items
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: { userId: session.user.id },
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
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.order.count({
        where: { userId: session.user.id },
      }),
    ]);

    return NextResponse.json({
      success: true,
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    logger.error({ error }, 'Error fetching orders');
    return errorResponse(error, 'Failed to fetch orders');
  }
}
