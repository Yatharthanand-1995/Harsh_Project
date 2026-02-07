import { describe, it, expect } from '@jest/globals'
import {
  loginSchema,
  registerSchema,
  cartItemSchema,
  orderSchema,
} from '../validations'

describe('Validation Schemas', () => {
  describe('loginSchema', () => {
    it('should validate correct login data', () => {
      const validData = {
        email: 'test@example.com',
        password: 'ValidPass123!',
      }

      const result = loginSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should reject invalid email', () => {
      const invalidData = {
        email: 'not-an-email',
        password: 'ValidPass123!',
      }

      const result = loginSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject short password', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'short',
      }

      const result = loginSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })
  })

  describe('registerSchema', () => {
    it('should validate correct registration data', () => {
      const validData = {
        email: 'test@example.com',
        name: 'Test User',
        phone: '9876543210',
        password: 'ValidPass123!',
        confirmPassword: 'ValidPass123!',
      }

      const result = registerSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should reject password without uppercase', () => {
      const invalidData = {
        email: 'test@example.com',
        name: 'Test User',
        phone: '9876543210',
        password: 'validpass123!',
        confirmPassword: 'validpass123!',
      }

      const result = registerSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject password without special character', () => {
      const invalidData = {
        email: 'test@example.com',
        name: 'Test User',
        phone: '9876543210',
        password: 'ValidPass123',
        confirmPassword: 'ValidPass123',
      }

      const result = registerSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject mismatched passwords', () => {
      const invalidData = {
        email: 'test@example.com',
        name: 'Test User',
        phone: '9876543210',
        password: 'ValidPass123!',
        confirmPassword: 'DifferentPass123!',
      }

      const result = registerSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject invalid phone number', () => {
      const invalidData = {
        email: 'test@example.com',
        name: 'Test User',
        phone: '123', // Too short
        password: 'ValidPass123!',
        confirmPassword: 'ValidPass123!',
      }

      const result = registerSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })
  })

  describe('cartItemSchema', () => {
    it('should validate correct cart data', () => {
      const validData = {
        productId: 'clx123abc',
        quantity: 2,
      }

      const result = cartItemSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should reject negative quantity', () => {
      const invalidData = {
        productId: 'clx123abc',
        quantity: -1,
      }

      const result = cartItemSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject zero quantity', () => {
      const invalidData = {
        productId: 'clx123abc',
        quantity: 0,
      }

      const result = cartItemSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })
  })

  describe('orderSchema', () => {
    it('should validate correct order data', () => {
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)

      const validData = {
        addressId: 'clx123abc',
        deliverySlot: 'morning',
        deliveryDate: tomorrow.toISOString(),
        deliveryNotes: 'Please ring doorbell',
        isGift: false,
      }

      const result = orderSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should reject invalid delivery slot', () => {
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)

      const invalidData = {
        addressId: 'clx123abc',
        deliverySlot: 'invalid-slot',
        deliveryDate: tomorrow.toISOString(),
      }

      const result = orderSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should accept valid gift data', () => {
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)

      const validData = {
        addressId: 'clx123abc',
        deliverySlot: 'evening',
        deliveryDate: tomorrow.toISOString(),
        isGift: true,
        giftMessage: 'Happy Birthday!',
      }

      const result = orderSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })
  })
})
