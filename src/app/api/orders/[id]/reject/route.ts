import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyOrderToken } from '@/lib/email'
import { logger } from '@/lib/logger'

function html(title: string, body: string, color: string) {
  return new Response(
    `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <style>
    body { font-family: Georgia, serif; background: #FFF8F0; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; }
    .card { background: white; border-radius: 16px; padding: 48px; max-width: 480px; text-align: center; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
    h1 { color: ${color}; margin-top: 0; }
    p { color: #6B7280; line-height: 1.6; }
    a { color: #8B4513; font-weight: bold; }
  </style>
</head>
<body>
  <div class="card">${body}</div>
</body>
</html>`,
    { headers: { 'Content-Type': 'text/html' } }
  )
}

/**
 * GET /api/admin/orders/[id]/reject?token=<hmac>
 * One-click order rejection from the email link.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const token = request.nextUrl.searchParams.get('token') ?? ''

  if (!verifyOrderToken(id, 'reject', token)) {
    return html('Unauthorized', '<h1>❌ Invalid Link</h1><p>This rejection link is invalid or has expired.</p>', '#DC2626')
  }

  const order = await prisma.order.findUnique({
    where: { id },
    select: { id: true, orderNumber: true, paymentStatus: true, total: true },
  })

  if (!order) {
    return html('Not Found', '<h1>❌ Order Not Found</h1><p>This order could not be found.</p>', '#DC2626')
  }

  if (order.paymentStatus === 'FAILED') {
    return html('Already Rejected', `<h1>Already Rejected</h1><p>Order #${order.orderNumber} was already rejected.</p>`, '#6B7280')
  }

  if (order.paymentStatus !== 'VERIFICATION_PENDING') {
    return html('Cannot Reject', `<h1>⚠️ Cannot Reject</h1><p>Order #${order.orderNumber} is not in a verifiable state (status: ${order.paymentStatus}).</p>`, '#D97706')
  }

  await prisma.order.update({
    where: { id },
    data: { paymentStatus: 'FAILED' },
  })

  logger.info('Order rejected via email link', { orderId: id, orderNumber: order.orderNumber })

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://homespun-seven.vercel.app'
  return html(
    'Order Rejected',
    `<h1 style="font-size: 48px; margin-bottom: 8px;">❌</h1>
     <h1>Payment Rejected</h1>
     <p>Order <strong>#${order.orderNumber}</strong> (₹${order.total}) has been rejected.<br>The customer&apos;s order remains pending and they can contact you directly.</p>
     <p><a href="${appUrl}/admin/orders">View all pending orders →</a></p>`,
    '#DC2626'
  )
}
