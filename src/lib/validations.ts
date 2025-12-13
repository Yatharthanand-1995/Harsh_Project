import { z } from 'zod'

// Auth Schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Invalid Indian phone number'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

// Product Schemas
export const productSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters').max(100),
  slug: z.string().min(3).max(100),
  description: z.string().min(10, 'Description must be at least 10 characters').max(2000),
  shortDesc: z.string().max(200).optional(),
  price: z.number().positive('Price must be positive'),
  comparePrice: z.number().positive().optional(),
  cost: z.number().positive().optional(),
  categoryId: z.string().cuid(),
  images: z.array(z.string().url()).min(1, 'At least one image is required').max(5),
  thumbnail: z.string().url(),
  stock: z.number().int().min(0),
  sku: z.string().optional(),
  weight: z.number().positive().optional(),
  dimensions: z.string().optional(),
  tags: z.array(z.string()).optional(),
  ingredients: z.string().optional(),
  allergens: z.string().optional(),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
})

// Address Schema
export const addressSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Invalid phone number'),
  street: z.string().min(5, 'Street address must be at least 5 characters'),
  city: z.string().min(2, 'City must be at least 2 characters'),
  state: z.string().min(2, 'State must be at least 2 characters'),
  pincode: z.string().regex(/^\d{6}$/, 'Invalid pincode'),
  isDefault: z.boolean().default(false),
})

// Order Schema
export const orderSchema = z.object({
  addressId: z.string().cuid(),
  deliverySlot: z.enum(['morning', 'afternoon', 'evening', 'midnight']),
  deliveryDate: z.string().or(z.date()),
  deliveryNotes: z.string().max(500).optional(),
  giftMessage: z.string().max(200).optional(),
  isGift: z.boolean().default(false),
})

// Cart Item Schema
export const cartItemSchema = z.object({
  productId: z.string().cuid(),
  quantity: z.number().int().positive().max(100),
  variantId: z.string().cuid().optional(),
  variantName: z.string().optional(),
  customization: z.any().optional(),
})

// Review Schema
export const reviewSchema = z.object({
  productId: z.string().cuid(),
  rating: z.number().int().min(1).max(5),
  title: z.string().min(5, 'Title must be at least 5 characters').max(100),
  comment: z.string().min(10, 'Comment must be at least 10 characters').max(1000),
  images: z.array(z.string().url()).max(5).optional(),
})

// Corporate Account Schema
export const corporateAccountSchema = z.object({
  companyName: z.string().min(2),
  gst: z.string().regex(/^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}$/, 'Invalid GST number'),
  pan: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN number').optional(),
  contactName: z.string().min(2),
  contactEmail: z.string().email(),
  contactPhone: z.string().regex(/^[6-9]\d{9}$/),
  billingAddress: z.string().min(10),
  creditLimit: z.number().min(0).default(0),
  creditTerms: z.number().int().positive().default(30),
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type ProductInput = z.infer<typeof productSchema>
export type AddressInput = z.infer<typeof addressSchema>
export type OrderInput = z.infer<typeof orderSchema>
export type CartItemInput = z.infer<typeof cartItemSchema>
export type ReviewInput = z.infer<typeof reviewSchema>
export type CorporateAccountInput = z.infer<typeof corporateAccountSchema>
