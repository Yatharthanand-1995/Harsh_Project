import { validateUpiId, validateUpiTransactionId } from './qr-code-utils'

/**
 * Payment Configuration
 * Update these details with your UPI payment information
 */

export const PAYMENT_CONFIG = {
  // Your UPI ID for receiving payments
  // TODO: Update this with your actual UPI ID
  UPI_ID: 'harshaggarwal04@okicici',

  // Business/Account holder name
  BUSINESS_NAME: 'Harsh Business',

  // Instructions for customers
  PAYMENT_INSTRUCTIONS: [
    'Scan the QR code using any UPI app (Google Pay, PhonePe, Paytm, etc.)',
    'Or manually enter the UPI ID to make payment',
    'After payment, enter the UPI Transaction ID (12-16 alphanumeric characters)',
    'We will verify and process your order within 24 hours',
  ],

  // Whether to show QR code (dynamic QR codes are now generated on-demand)
  SHOW_QR_CODE: true,

  // Whether to allow "Pay Later" option
  ALLOW_PAY_LATER: true,
}

/**
 * Generates UPI payment link with order details
 *
 * @param amount - Payment amount in INR
 * @param orderId - Order ID for tracking
 * @param orderNumber - Human-readable order number
 * @returns UPI deep link string
 */
export function generateUpiPaymentLink(
  amount: number,
  orderId: string,
  orderNumber: string
): string {
  const params = new URLSearchParams({
    pa: PAYMENT_CONFIG.UPI_ID, // Payee address
    pn: PAYMENT_CONFIG.BUSINESS_NAME, // Payee name
    am: amount.toFixed(2), // Amount (2 decimal places)
    cu: 'INR', // Currency
    tn: `Payment for Order #${orderNumber}`, // Transaction note
  })

  return `upi://pay?${params.toString()}`
}

/**
 * Returns context-aware payment instructions
 *
 * @param showQr - Whether QR code is being shown
 * @returns Array of instruction strings
 */
export function getPaymentInstructions(showQr: boolean = true): string[] {
  if (!showQr) {
    return [
      'Manually enter the UPI ID in your payment app',
      'Complete the payment',
      'Enter the UPI Transaction ID (12-16 alphanumeric characters)',
      'We will verify and process your order within 24 hours',
    ]
  }

  return PAYMENT_CONFIG.PAYMENT_INSTRUCTIONS
}

/**
 * Validates payment configuration
 * Throws error if configuration is invalid
 */
export function validatePaymentConfig(): void {
  if (!validateUpiId(PAYMENT_CONFIG.UPI_ID)) {
    throw new Error(
      'Invalid UPI ID in payment configuration. Please update PAYMENT_CONFIG.UPI_ID with a valid UPI ID.'
    )
  }

  if (!PAYMENT_CONFIG.BUSINESS_NAME || PAYMENT_CONFIG.BUSINESS_NAME.trim() === '') {
    throw new Error('Business name is required in payment configuration')
  }
}

// Re-export validation functions for convenience
export { validateUpiId, validateUpiTransactionId } from './qr-code-utils'
