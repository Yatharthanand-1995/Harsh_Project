import { NextResponse } from 'next/server'
import { getClientCsrfToken, CSRF_HEADER_NAME_EXPORT } from '@/lib/csrf'

/**
 * GET /api/csrf
 * Returns a CSRF token for the client to use in subsequent requests
 * The token is also set as an httpOnly cookie for validation
 */
export async function GET() {
  try {
    const token = await getClientCsrfToken()

    return NextResponse.json({
      token,
      headerName: CSRF_HEADER_NAME_EXPORT,
    })
  } catch (error) {
    console.error('Error generating CSRF token:', error)
    return NextResponse.json(
      { error: 'Failed to generate CSRF token' },
      { status: 500 }
    )
  }
}
