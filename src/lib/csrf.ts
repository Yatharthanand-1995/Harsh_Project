/**
 * CSRF Protection Utilities
 * Implements token-based CSRF protection for state-changing operations
 */

import { randomBytes, createHash } from 'crypto'
import { cookies } from 'next/headers'

const CSRF_TOKEN_LENGTH = 32
const CSRF_COOKIE_NAME = 'csrf-token'
const CSRF_HEADER_NAME = 'x-csrf-token'
const CSRF_SECRET_ENV = process.env.CSRF_SECRET || 'dev-csrf-secret-change-in-production'

/**
 * Generates a random CSRF token
 */
export function generateCsrfToken(): string {
  return randomBytes(CSRF_TOKEN_LENGTH).toString('hex')
}

/**
 * Creates a hash of the token for storage
 */
function hashToken(token: string): string {
  return createHash('sha256')
    .update(`${token}:${CSRF_SECRET_ENV}`)
    .digest('hex')
}

/**
 * Sets CSRF token in a cookie
 * Call this in API routes or middleware that need CSRF protection
 */
export async function setCsrfCookie(token?: string): Promise<string> {
  const csrfToken = token || generateCsrfToken()
  const cookieStore = await cookies()

  cookieStore.set(CSRF_COOKIE_NAME, hashToken(csrfToken), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/',
  })

  return csrfToken
}

/**
 * Gets the CSRF token from cookies
 */
export async function getCsrfTokenFromCookie(): Promise<string | undefined> {
  const cookieStore = await cookies()
  return cookieStore.get(CSRF_COOKIE_NAME)?.value
}

/**
 * Validates a CSRF token against the stored hash
 */
export async function validateCsrfToken(token: string): Promise<boolean> {
  const storedHash = await getCsrfTokenFromCookie()

  if (!storedHash) {
    return false
  }

  const tokenHash = hashToken(token)
  return tokenHash === storedHash
}

/**
 * Gets CSRF token from request headers
 */
export function getCsrfTokenFromHeaders(headers: Headers): string | null {
  return headers.get(CSRF_HEADER_NAME)
}

/**
 * Middleware to validate CSRF token on state-changing requests
 * Use this in API routes that modify data (POST, PATCH, DELETE, PUT)
 */
export async function validateCsrfMiddleware(request: Request): Promise<{
  valid: boolean
  error?: string
}> {
  const method = request.method

  // Only validate on state-changing methods
  if (!['POST', 'PATCH', 'DELETE', 'PUT'].includes(method)) {
    return { valid: true }
  }

  // Skip CSRF check for auth endpoints (NextAuth handles its own CSRF)
  if (request.url.includes('/api/auth/')) {
    return { valid: true }
  }

  const token = getCsrfTokenFromHeaders(request.headers)

  if (!token) {
    return {
      valid: false,
      error: 'CSRF token missing. Please include X-CSRF-Token header.',
    }
  }

  const isValid = await validateCsrfToken(token)

  if (!isValid) {
    return {
      valid: false,
      error: 'Invalid CSRF token. Please refresh and try again.',
    }
  }

  return { valid: true }
}

/**
 * Hook to get CSRF token for client-side use
 * Returns the plain token that should be included in requests
 */
export async function getClientCsrfToken(): Promise<string> {
  // Generate new token if none exists
  const token = generateCsrfToken()
  await setCsrfCookie(token)
  return token
}

/**
 * API route to get CSRF token for client use
 * Clients should call GET /api/csrf to get a token before making mutations
 */
export const CSRF_HEADER_NAME_EXPORT = CSRF_HEADER_NAME
