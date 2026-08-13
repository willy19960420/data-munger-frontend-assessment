import { NextRequest, NextResponse } from 'next/server';

// 不需要認證的公開路由
const publicRoutes = ['/login', '/api/auth/login', '/api/auth/refresh'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 檢查是否為公開路由
  const isPublicRoute = publicRoutes.some((route) => pathname === route);

  if (isPublicRoute) {
    return NextResponse.next();
  }

  // 檢查cookie中的accessToken
  const accessToken = request.cookies.get('accessToken')?.value;

  // 如果沒有token且不是公開路由，重導向到登入頁
  if (!accessToken && !pathname.startsWith('/api')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 如果已登入卻訪問登入頁，重導向到首頁
  if (accessToken && pathname === '/login') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
