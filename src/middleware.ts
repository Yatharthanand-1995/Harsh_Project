import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from './lib/auth';

/**
 * Authentication Middleware
 * Protects routes that require authentication
 * - /cart/* - Requires authenticated user
 * - /checkout/* - Requires authenticated user
 * - /account/* - Requires authenticated user
 * - /admin/* - Requires authenticated user with ADMIN role
 */
export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Public routes that don't require authentication
  if (
    path.startsWith('/login') ||
    path.startsWith('/register') ||
    path.startsWith('/api/auth') ||
    path.startsWith('/_next') ||
    path.startsWith('/api/cart') || // Cart API has its own auth check
    path.startsWith('/api/orders') || // Orders API has its own auth check
    path === '/' ||
    path.startsWith('/products') ||
    path.startsWith('/about') ||
    path.startsWith('/contact')
  ) {
    return NextResponse.next();
  }

  // Check authentication for protected routes
  const session = await auth();

  // Redirect to login if not authenticated
  if (!session) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', path);
    return NextResponse.redirect(loginUrl);
  }

  // Check admin role for admin routes
  if (path.startsWith('/admin') && session.user?.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
