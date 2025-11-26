// Next.js Middleware for Authentication
// Protects routes and handles authentication checks

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// JWT Configuration
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const TOKEN_COOKIE_NAME = 'auth_token';

// Routes that require admin role
const ADMIN_ONLY_ROUTES = [
  '/admin',
];

// Public routes (no auth required)
// All other routes require authentication by default
const PUBLIC_ROUTES = [
  '/login',
  '/api/auth/login',
  '/api/auth/signup', // Protected by requireAdmin in route handler
  '/api/auth/me',
  '/api/auth/logout',
  '/test', // Test pages (remove in production)
  '/test-fonts',
  '/test-header-fix',
  '/test-pdfmake',
  '/test-thai-fix',
  '/test-thai-solutions',
];

interface JWTPayload {
  userId: string;
  email: string;
  role: 'ADMIN' | 'USER';
  name: string;
}

async function verifyAuth(token: string): Promise<JWTPayload | null> {
  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as JWTPayload;
  } catch (error) {
    console.error('JWT verification failed in middleware:', error);
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static files and Next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/fonts') ||
    pathname.match(/\.(png|jpg|jpeg|gif|svg|ico|css|js)$/)
  ) {
    return NextResponse.next();
  }

  // Allow public routes
  if (PUBLIC_ROUTES.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Get token from cookie
  const token = request.cookies.get(TOKEN_COOKIE_NAME)?.value;

  // Check if route is public (if not public, it requires authentication)
  const isPublicRoute = PUBLIC_ROUTES.some(route => pathname.startsWith(route));
  const isAdminRoute = ADMIN_ONLY_ROUTES.some(route => pathname.startsWith(route));

  // Require authentication for all non-public routes
  if (!isPublicRoute) {
    // No token - redirect to login
    if (!token) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Verify token
    const user = await verifyAuth(token);

    if (!user) {
      // Invalid token - redirect to login
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete(TOKEN_COOKIE_NAME);
      return response;
    }

    // Check admin access
    if (isAdminRoute && user.role !== 'ADMIN') {
      // Not admin - redirect to home
      return NextResponse.redirect(new URL('/', request.url));
    }

    // User is authenticated and authorized
    // Add user info to headers for use in API routes
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', user.userId);
    requestHeaders.set('x-user-email', user.email);
    requestHeaders.set('x-user-role', user.role);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  // For non-protected routes, continue
  return NextResponse.next();
}

// Configure which routes middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
