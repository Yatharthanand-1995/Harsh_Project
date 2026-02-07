import { describe, it, expect } from '@jest/globals'

describe('Utility Functions', () => {
  describe('Price Calculations', () => {
    it('should calculate subtotal correctly', () => {
      const items = [
        { price: 100, quantity: 2 },
        { price: 50, quantity: 3 },
      ]

      const subtotal = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      )

      expect(subtotal).toBe(350) // (100*2) + (50*3) = 200 + 150
    })

    it('should apply free delivery correctly', () => {
      const FREE_DELIVERY_THRESHOLD = 500
      const DELIVERY_FEE = 50

      // Below threshold
      const subtotal1 = 400
      const fee1 = subtotal1 >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE
      expect(fee1).toBe(50)

      // Above threshold
      const subtotal2 = 600
      const fee2 = subtotal2 >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE
      expect(fee2).toBe(0)

      // Exactly at threshold
      const subtotal3 = 500
      const fee3 = subtotal3 >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE
      expect(fee3).toBe(0)
    })

    it('should calculate GST correctly', () => {
      const GST_RATE = 0.05

      const subtotal1 = 100
      const gst1 = Math.round(subtotal1 * GST_RATE)
      expect(gst1).toBe(5)

      const subtotal2 = 500
      const gst2 = Math.round(subtotal2 * GST_RATE)
      expect(gst2).toBe(25)
    })

    it('should calculate total correctly', () => {
      const subtotal = 400
      const deliveryFee = 50
      const gst = Math.round(subtotal * 0.05)
      const total = subtotal + deliveryFee + gst

      expect(total).toBe(470) // 400 + 50 + 20
    })
  })

  describe('String Formatting', () => {
    it('should format currency correctly', () => {
      const formatCurrency = (amount: number) => `₹${amount}`

      expect(formatCurrency(100)).toBe('₹100')
      expect(formatCurrency(1000)).toBe('₹1000')
      expect(formatCurrency(0)).toBe('₹0')
    })
  })

  describe('Date Validation', () => {
    it('should validate future dates', () => {
      const today = new Date()
      const tomorrow = new Date()
      tomorrow.setDate(today.getDate() + 1)

      const yesterday = new Date()
      yesterday.setDate(today.getDate() - 1)

      expect(tomorrow > today).toBe(true)
      expect(yesterday < today).toBe(true)
    })

    it('should format date for input', () => {
      const date = new Date('2026-02-15')
      const formatted = date.toISOString().split('T')[0]

      expect(formatted).toBe('2026-02-15')
    })
  })
})
