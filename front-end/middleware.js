import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

// Routes yêu cầu auth
const PROTECTED_ROUTES = ['/campaigns', '/lists'];
const AUTH_ROUTE = '/auth/login';

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get('access_token')?.value;
  const refreshToken = request.cookies.get('refresh_token')?.value;

  // 1. Bỏ qua nếu không phải route protected
  if (!PROTECTED_ROUTES.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // 2. Kiểm tra access token bằng jose
  if (accessToken) {
    try {
      const isValid = await verifyTokenViaAPI(accessToken);
      if (isValid) return NextResponse.next();
    } catch (error) {
      console.error('Token verify error:', error);
    }
  }

  // 3. Xử lý refresh token nếu có
  if (refreshToken) {
    try {
      const newTokens = await refreshAccessToken(refreshToken);
      if (newTokens) {
        const response = NextResponse.next();        
        // Set lại cookies mới
        response.cookies.set('access_token', newTokens.access_token, cookieOptions);
        response.cookies.set('refresh_token', newTokens.refresh_token, cookieOptions);
        
        return response;
      }
    } catch (error) {
      console.error('Refresh token failed:', error);
    }
  }

  // 4. Redirect về login nếu không có token hợp lệ
  return NextResponse.redirect(new URL(AUTH_ROUTE, request.url));
}

// Gọi API laravel để verify token
async function verifyTokenViaAPI(token) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      return res.ok;
    } catch (error) {
      return false;
    }
  }

// Hàm refresh token
async function refreshAccessToken(refreshToken) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (res.ok) {
      return await res.json();
    }
  } catch (error) {
    return null;
  }
}

// Cấu hình cookies
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
};

export const config = {
    matcher: [
      /*
       * Match all request paths except for the ones starting with:
       * - api (API routes)
       * - _next/static (static files)
       * - _next/image (image optimization files)
       * - favicon.ico, sitemap.xml, robots.txt (metadata files)
       */
      "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
    ],
};