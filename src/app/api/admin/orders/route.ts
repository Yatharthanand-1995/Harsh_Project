import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { successResponse, unauthorizedResponse } from '@/lib/api-response'

/**
 * GET /api/admin/orders
 * Returns orders awaiting payment verification (admin only)
 */
export async function GET(_request: NextRequest) {
  const session = await auth()

  if (!session?.user?.id || (session.user as { role?: string }).role !== 'ADMIN') {
    return unauthorizedResponse('Admin access required')
  }

  const orders = await prisma.order.findMany({
    where: { paymentStatus: 'VERIFICATION_PENDING' },
    include: {
      user: {
        select: { name: true, email: true },
      },
      items: {
        include: {
          product: { select: { name: true } },
        },
      },
      deliveryAddress: true,
    },
    orderBy: { updatedAt: 'asc' },
  })

  return successResponse({ orders })
}
