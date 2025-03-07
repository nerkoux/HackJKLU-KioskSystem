import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  
  // Define protected routes that require authentication
  const protectedPaths = [
    '/assessment',
    '/consultation',
    '/skills',
    '/profile',
    '/insights',
    '/home',
  ];
  
  // Check if the current path is a protected route
  const isProtectedPath = protectedPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  );
  
  // If it's a protected route and user is not authenticated, redirect to sign in
  if (isProtectedPath && !token) {
    const url = new URL('/auth/signin', request.url);
    url.searchParams.set('callbackUrl', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  
  // If user is authenticated and trying to access auth pages, redirect to home
  if (token && (
    request.nextUrl.pathname.startsWith('/auth/signin') || 
    request.nextUrl.pathname.startsWith('/auth/signup')
  )) {
    return NextResponse.redirect(new URL('/home', request.url));
  }
  
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/assessment/:path*',
    '/consultation/:path*',
    '/skills/:path*',
    '/profile/:path*',
    '/insights/:path*',
    '/home/:path*',
    '/auth/:path*',
  ],
};