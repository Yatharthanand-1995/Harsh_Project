/**
 * Application-wide constants
 * Centralizes magic numbers and configuration values
 */

export const PRICING = {
  /** Minimum order value for free delivery (in INR) */
  FREE_DELIVERY_THRESHOLD: 500,
  /** Delivery fee for orders below threshold (in INR) */
  DELIVERY_FEE: 50,
  /** GST rate as decimal (5%) */
  GST_RATE: 0.05,
} as const;

export const CART = {
  /** Maximum quantity per cart item */
  MAX_QUANTITY: 100,
  /** Debounce delay for quantity updates (in ms) */
  UPDATE_DEBOUNCE_MS: 500,
} as const;

export const PASSWORD = {
  /** Minimum password length */
  MIN_LENGTH: 12,
  /** Password requirements message */
  REQUIREMENTS: 'Password must be at least 12 characters and contain uppercase, lowercase, number, and special character',
} as const;

export const RATE_LIMITS = {
  /** Login attempts per window */
  LOGIN_ATTEMPTS: 5,
  /** Login rate limit window (in seconds) */
  LOGIN_WINDOW_SECONDS: 15 * 60, // 15 minutes
  /** Registration attempts per window */
  REGISTER_ATTEMPTS: 3,
  /** Registration rate limit window (in seconds) */
  REGISTER_WINDOW_SECONDS: 60 * 60, // 1 hour
  /** Cart API requests per window */
  CART_REQUESTS: 100,
  /** Cart rate limit window (in seconds) */
  CART_WINDOW_SECONDS: 60, // 1 minute
  /** Payment API requests per window */
  PAYMENT_REQUESTS: 10,
  /** Payment rate limit window (in seconds) */
  PAYMENT_WINDOW_SECONDS: 60, // 1 minute
} as const;

export const SESSION = {
  /** Session max age (in seconds) - 7 days */
  MAX_AGE: 7 * 24 * 60 * 60,
  /** Session update age (in seconds) - 1 day */
  UPDATE_AGE: 24 * 60 * 60,
} as const;

export const PAGINATION = {
  /** Default number of items per page */
  DEFAULT_PAGE_SIZE: 20,
  /** Maximum number of items per page */
  MAX_PAGE_SIZE: 100,
} as const;

export const TEST_USER = {
  EMAIL: 'test@homespun.com',
  PASSWORD: 'password123',
  /** Show test credentials only in development */
  SHOW_IN_DEV: process.env.NODE_ENV === 'development',
} as const;
