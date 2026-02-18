import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { generateUpiQrCode } from '@/lib/qr-code-utils'
import { PAYMENT_CONFIG } from '@/lib/payment-config'
import {
  errorResponse,
  unauthorizedResponse,
  badRequestResponse,
} from '@/lib/api-response'
import { logger } from '@/lib/logger'

// Validation schema for QR code generation request
const qrCodeRequestSchema = z.object({
  orderId: z.string().cuid('Invalid order ID'),
  amount: z.number().positive('Amount must be greater than 0'),
  orderNumber: z.string().min(1, 'Order number is required'),
})

// Simple in-memory cache for QR codes (5 minute TTL)
const qrCache = new Map<
  string,
  {
    qrCodeDataUrl: string
    upiLink: string
    timestamp: number
  }
>()

const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

/**
 * POST /api/qrcode
 * Generates a dynamic QR code for UPI payment
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth()
    if (!session?.user?.id) {
      return unauthorizedResponse('Please sign in to generate payment QR code')
    }

    // Parse and validate request body
    const body = await request.json()
    const validatedData = qrCodeRequestSchema.parse(body)

    // Verify order exists and belongs to the authenticated user
    const order = await prisma.order.findUnique({
      where: {
        id: validatedData.orderId,
      },
      select: {
        id: true,
        orderNumber: true,
        total: true,
        userId: true,
        paymentStatus: true,
      },
    })

    if (!order) {
      return badRequestResponse('Order not found')
    }

    if (order.userId !== session.user.id) {
      return unauthorizedResponse('You do not have permission to access this order')
    }

    // Verify amount matches order total (security check)
    if (order.total !== validatedData.amount) {
      logger.warn('QR code amount mismatch', {
        orderId: order.id,
        expectedAmount: order.total,
        requestedAmount: validatedData.amount,
      })
      return badRequestResponse('Amount does not match order total')
    }

    // Check cache first
    const cacheKey = `${order.id}_${order.total}`
    const cached = qrCache.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      logger.info('QR code served from cache', { orderId: order.id })
      return NextResponse.json({
        success: true,
        qrCodeDataUrl: cached.qrCodeDataUrl,
        upiLink: cached.upiLink,
        upiId: PAYMENT_CONFIG.UPI_ID,
        amount: validatedData.amount,
        orderNumber: order.orderNumber,
        cached: true,
      })
    }

    // Generate UPI link
    const upiLink = `upi://pay?pa=${encodeURIComponent(PAYMENT_CONFIG.UPI_ID)}&pn=${encodeURIComponent(PAYMENT_CONFIG.BUSINESS_NAME)}&am=${validatedData.amount.toFixed(2)}&tn=${encodeURIComponent(`Payment for Order #${order.orderNumber}`)}&cu=INR`

    // Generate QR code
    const qrCodeDataUrl = await generateUpiQrCode(
      validatedData.amount,
      PAYMENT_CONFIG.UPI_ID,
      order.orderNumber
    )

    // Cache the result
    qrCache.set(cacheKey, {
      qrCodeDataUrl,
      upiLink,
      timestamp: Date.now(),
    })

    // Clean up old cache entries (simple cache maintenance)
    const now = Date.now()
    for (const [key, value] of qrCache.entries()) {
      if (now - value.timestamp > CACHE_TTL) {
        qrCache.delete(key)
      }
    }

    logger.info('QR code generated successfully', {
      orderId: order.id,
      orderNumber: order.orderNumber,
      amount: validatedData.amount,
    })

    return NextResponse.json({
      success: true,
      qrCodeDataUrl,
      upiLink,
      upiId: PAYMENT_CONFIG.UPI_ID,
      amount: validatedData.amount,
      orderNumber: order.orderNumber,
      cached: false,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return badRequestResponse(
        'Invalid request data',
        error.errors.map((e) => `${e.path.join('.')}: ${e.message}`)
      )
    }

    logger.error('Error generating QR code', {
      error: error instanceof Error ? error.message : 'Unknown error',
    })

    return errorResponse('Failed to generate payment QR code')
  }
}
