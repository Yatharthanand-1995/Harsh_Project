import { Resend } from 'resend'
import crypto from 'crypto'

const resend = new Resend(process.env.RESEND_API_KEY)

const ADMIN_EMAIL = 'harsh.homespun@gmail.com'
const FROM_EMAIL = 'Homespun Orders <onboarding@resend.dev>'

function getAppUrl() {
  return process.env.NEXT_PUBLIC_APP_URL || 'https://homespun-seven.vercel.app'
}

/** Generate a HMAC token for a given orderId + action (approve/reject) */
export function generateOrderToken(orderId: string, action: 'approve' | 'reject'): string {
  const secret = (process.env.NEXTAUTH_SECRET || '').trim()
  return crypto.createHmac('sha256', secret).update(`${orderId}:${action}`).digest('hex')
}

/** Verify a HMAC token */
export function verifyOrderToken(orderId: string, action: 'approve' | 'reject', token: string): boolean {
  const expected = generateOrderToken(orderId, action)
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(token))
}

interface OrderEmailData {
  orderId: string
  orderNumber: string
  total: number
  customerName: string
  customerEmail: string
  items: Array<{ quantity: number; product: { name: string } }>
  deliveryAddress: {
    name: string
    street: string
    city: string
    state: string
    pincode: string
  }
}

export async function sendPaymentVerificationEmail(order: OrderEmailData) {
  const appUrl = getAppUrl()
  const approveToken = generateOrderToken(order.orderId, 'approve')
  const rejectToken = generateOrderToken(order.orderId, 'reject')

  const approveUrl = `${appUrl}/api/orders/${order.orderId}/confirm?token=${approveToken}`
  const rejectUrl = `${appUrl}/api/orders/${order.orderId}/reject?token=${rejectToken}`

  const itemsHtml = order.items
    .map(
      (item) =>
        `<li style="padding: 4px 0; color: #374151;">${item.product.name} × ${item.quantity}</li>`
    )
    .join('')

  const html = `
    <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #FFF8F0; padding: 32px; border-radius: 12px;">
      <h2 style="color: #8B4513; margin-top: 0;">💰 New Payment to Verify</h2>

      <div style="background: white; border-radius: 8px; padding: 20px; margin-bottom: 20px; border-left: 4px solid #8B4513;">
        <p style="margin: 0 0 8px; font-size: 13px; color: #6B7280; text-transform: uppercase; letter-spacing: 0.05em;">Order</p>
        <p style="margin: 0; font-size: 22px; font-weight: bold; color: #1F2937;">#${order.orderNumber}</p>
        <p style="margin: 8px 0 0; font-size: 28px; font-weight: bold; color: #8B4513;">₹${order.total}</p>
      </div>

      <div style="background: white; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
        <p style="margin: 0 0 8px; font-size: 13px; color: #6B7280; text-transform: uppercase; letter-spacing: 0.05em;">Customer</p>
        <p style="margin: 0; font-weight: bold; color: #1F2937;">${order.customerName}</p>
        <p style="margin: 4px 0 0; color: #6B7280; font-size: 14px;">${order.customerEmail}</p>
      </div>

      <div style="background: white; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
        <p style="margin: 0 0 12px; font-size: 13px; color: #6B7280; text-transform: uppercase; letter-spacing: 0.05em;">Items Ordered</p>
        <ul style="margin: 0; padding-left: 20px;">${itemsHtml}</ul>
      </div>

      <div style="background: white; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
        <p style="margin: 0 0 8px; font-size: 13px; color: #6B7280; text-transform: uppercase; letter-spacing: 0.05em;">Delivery Address</p>
        <p style="margin: 0; color: #374151; line-height: 1.6;">
          ${order.deliveryAddress.name}<br>
          ${order.deliveryAddress.street}, ${order.deliveryAddress.city}<br>
          ${order.deliveryAddress.state} – ${order.deliveryAddress.pincode}
        </p>
      </div>

      <div style="background: #FEF3C7; border-radius: 8px; padding: 16px; margin-bottom: 24px; border: 1px solid #F59E0B;">
        <p style="margin: 0; color: #92400E; font-weight: bold;">
          👉 Check your UPI app (harshaggarwal04@okicici) for a payment of ₹${order.total}
        </p>
        <p style="margin: 8px 0 0; color: #92400E; font-size: 14px;">
          If you see the payment, click Confirm. If not, click Reject.
        </p>
      </div>

      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 16px;">
        <tr>
          <td style="padding-right: 8px;">
            <a href="${approveUrl}"
              style="display: block; background: #16A34A; color: white; text-align: center; padding: 16px; border-radius: 32px; text-decoration: none; font-weight: bold; font-size: 16px;">
              ✅ Confirm Order
            </a>
          </td>
          <td style="padding-left: 8px;">
            <a href="${rejectUrl}"
              style="display: block; background: white; color: #DC2626; text-align: center; padding: 14px; border-radius: 32px; text-decoration: none; font-weight: bold; font-size: 16px; border: 2px solid #DC2626;">
              ❌ Reject
            </a>
          </td>
        </tr>
      </table>

      <p style="color: #9CA3AF; font-size: 12px; text-align: center; margin: 0;">
        Homespun — harshaggarwal04@okicici
      </p>
    </div>
  `

  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: [ADMIN_EMAIL],
    subject: `New Payment — Order #${order.orderNumber} (₹${order.total})`,
    html,
  })

  if (error) {
    throw new Error(`Email send failed: ${error.message}`)
  }
}
