/**
 * Client-side CSRF utilities
 * Handles fetching and including CSRF tokens in requests
 */

let csrfToken: string = ''
let csrfHeaderName = 'x-csrf-token'

/**
 * Fetches a fresh CSRF token from the server
 */
export async function fetchCsrfToken(): Promise<string> {
  try {
    const response = await fetch('/api/csrf')

    if (!response.ok) {
      throw new Error('Failed to fetch CSRF token')
    }

    const data = await response.json()
    csrfToken = data.token
    csrfHeaderName = data.headerName || 'x-csrf-token'

    return csrfToken
  } catch (error) {
    console.error('Error fetching CSRF token:', error)
    throw error
  }
}

/**
 * Gets the current CSRF token, fetching if necessary
 */
export async function getCsrfToken(): Promise<string> {
  if (!csrfToken) {
    return await fetchCsrfToken()
  }
  return csrfToken
}

/**
 * Invalidates the current CSRF token, forcing a refresh on next use
 */
export function invalidateCsrfToken(): void {
  csrfToken = ''
}

/**
 * Enhanced fetch wrapper that automatically includes CSRF token
 * Use this instead of regular fetch for mutation requests
 */
export async function fetchWithCsrf(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const method = options.method?.toUpperCase() || 'GET'

  // Only add CSRF token for state-changing methods
  if (['POST', 'PATCH', 'DELETE', 'PUT'].includes(method)) {
    const token = await getCsrfToken()

    options.headers = {
      ...options.headers,
      [csrfHeaderName]: token,
    }
  }

  const response = await fetch(url, options)

  // If CSRF validation fails, invalidate token and retry once
  if (response.status === 403) {
    const error = await response.json().catch(() => ({}))
    if (error.error?.includes('CSRF')) {
      invalidateCsrfToken()

      // Retry once with fresh token
      const newToken = await fetchCsrfToken()
      options.headers = {
        ...options.headers,
        [csrfHeaderName]: newToken,
      }
      return fetch(url, options)
    }
  }

  return response
}

/**
 * Helper to add CSRF token to headers object
 * Useful when you need to manually construct headers
 */
export async function addCsrfToHeaders(headers: HeadersInit = {}): Promise<HeadersInit> {
  const token = await getCsrfToken()
  return {
    ...headers,
    [csrfHeaderName]: token,
  }
}
