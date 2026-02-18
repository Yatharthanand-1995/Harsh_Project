import QRCode from 'qrcode'

/**
 * Validates UPI ID format
 * UPI ID format: username@bankname
 * Examples: john@paytm, user.name@okaxis, 9876543210@ybl
 */
export function validateUpiId(upiId: string): boolean {
  if (!upiId || typeof upiId !== 'string') {
    return false
  }

  // UPI ID regex: alphanumeric/dots/underscores @ alphanumeric
  const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/
  return upiRegex.test(upiId)
}

/**
 * Formats UPI payment link according to NPCI standards
 * Reference: https://www.npci.org.in/what-we-do/upi/upi-specifications
 *
 * @param upiId - UPI ID of the receiver
 * @param amount - Payment amount in INR
 * @param note - Transaction note/description
 * @returns UPI deep link string
 */
export function formatUpiLink(
  upiId: string,
  amount: number,
  note: string
): string {
  if (!validateUpiId(upiId)) {
    throw new Error('Invalid UPI ID format')
  }

  if (amount <= 0) {
    throw new Error('Amount must be greater than 0')
  }

  // UPI deep link format: upi://pay?pa=UPI_ID&pn=NAME&am=AMOUNT&tn=NOTE&cu=INR
  const params = new URLSearchParams({
    pa: upiId, // Payee address (UPI ID)
    pn: 'Harsh Business', // Payee name
    am: amount.toFixed(2), // Amount
    tn: note, // Transaction note
    cu: 'INR', // Currency
  })

  return `upi://pay?${params.toString()}`
}

/**
 * Generates QR code as base64 data URL from UPI payment link
 *
 * @param amount - Payment amount in INR
 * @param upiId - UPI ID for payment
 * @param orderNumber - Order number for reference
 * @returns Promise resolving to base64 data URL
 */
export async function generateUpiQrCode(
  amount: number,
  upiId: string,
  orderNumber: string
): Promise<string> {
  try {
    // Create UPI payment link
    const note = `Payment for Order #${orderNumber}`
    const upiLink = formatUpiLink(upiId, amount, note)

    // Generate QR code with enhanced options for better scanning
    const qrCodeDataUrl = await new Promise<string>((resolve, reject) => {
      QRCode.toDataURL(
        upiLink,
        {
          errorCorrectionLevel: 'H',
          margin: 2,
          width: 300,
          color: {
            dark: '#000000',
            light: '#FFFFFF',
          },
        },
        (err, url) => {
          if (err) reject(err)
          else resolve(url)
        }
      )
    })

    return qrCodeDataUrl
  } catch (error) {
    console.error('Error generating QR code:', error)
    throw new Error('Failed to generate QR code')
  }
}

/**
 * Validates UPI transaction ID format
 * Transaction IDs are typically 12-16 alphanumeric characters
 */
export function validateUpiTransactionId(transactionId: string): boolean {
  if (!transactionId || typeof transactionId !== 'string') {
    return false
  }

  // Remove whitespace and convert to uppercase
  const cleaned = transactionId.trim().toUpperCase()

  // Check length (12-16 characters is typical)
  if (cleaned.length < 12 || cleaned.length > 16) {
    return false
  }

  // Must be alphanumeric
  const alphanumericRegex = /^[A-Z0-9]+$/
  return alphanumericRegex.test(cleaned)
}

/**
 * Formats transaction ID to standard format
 * Removes whitespace and converts to uppercase
 */
export function formatTransactionId(transactionId: string): string {
  return transactionId.trim().toUpperCase()
}
