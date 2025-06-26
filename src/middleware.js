// src/middleware.js
import { NextResponse } from 'next/server';

// Define which routes require authentication
const protectedRoutes = [
  '/api/meals',
  '/api/nutrition',
  '/api/user/profile',
];

// Define which routes should redirect authenticated users
const authRoutes = [
  '/login',
  '/register',
];

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some(route => pathname === route);
  
  // Get the session token from cookies
  const sessionToken = request.cookies.get('session_token')?.value;
  
  // If the route is protected and there's no session token, redirect to login
  if (isProtectedRoute && !sessionToken) {
    const url = new URL('/login', request.url);
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }
  
  // If the route is an auth route and there's a session token, redirect to dashboard
  if (isAuthRoute && sessionToken) {
    return NextResponse.redirect(new URL('/calorie-counter', request.url));
  }
  
  return NextResponse.next();
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};