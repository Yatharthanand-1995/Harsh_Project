/**
 * Payment Configuration
 * Update these details with your UPI payment information
 */

export const PAYMENT_CONFIG = {
  // Your UPI ID for receiving payments
  UPI_ID: 'your-upi-id@paytm', // Update this with your actual UPI ID

  // Business/Account holder name
  BUSINESS_NAME: 'Homespun',

  // Path to your UPI QR code image
  // Place your QR code image in public/upi-qr.png
  QR_CODE_PATH: '/upi-qr.png',

  // Instructions for customers
  PAYMENT_INSTRUCTIONS: [
    'Scan the QR code using any UPI app (Google Pay, PhonePe, Paytm, etc.)',
    'Or manually enter the UPI ID to make payment',
    'After payment, enter the UPI Transaction ID (12-digit number)',
    'We will verify and process your order within 24 hours',
  ],

  // Whether to show QR code (set to false if you only want to show UPI ID)
  SHOW_QR_CODE: true,

  // Whether to allow "Pay Later" option
  ALLOW_PAY_LATER: true,
}

// Helper function to generate UPI payment link (optional)
export function generateUpiPaymentLink(amount: number): string {
  const params = new URLSearchParams({
    pa: PAYMENT_CONFIG.UPI_ID,
    pn: PAYMENT_CONFIG.BUSINESS_NAME,
    am: amount.toString(),
    cu: 'INR',
    tn: 'Payment for Homespun Order',
  })

  return `upi://pay?${params.toString()}`
}
