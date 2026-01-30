import Razorpay from 'razorpay'
import crypto from 'crypto'
import { env } from './env'

// Only initialize Razorpay if credentials are provided
export const razorpay =
  env.NEXT_PUBLIC_RAZORPAY_KEY_ID && env.RAZORPAY_KEY_SECRET
    ? new Razorpay({
        key_id: env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        key_secret: env.RAZORPAY_KEY_SECRET,
      })
    : null

export function verifyPaymentSignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  // If Razorpay is not configured, payment verification will always fail
  if (!env.RAZORPAY_KEY_SECRET) {
    return false
  }

  const text = orderId + '|' + paymentId
  const generated = crypto
    .createHmac('sha256', env.RAZORPAY_KEY_SECRET)
    .update(text)
    .digest('hex')

  return generated === signature
}
