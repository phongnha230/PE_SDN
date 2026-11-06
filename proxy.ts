import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const token = request.cookies.get('session_token')?.value
  const { pathname } = request.nextUrl

  // Các route công khai
  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/register')
  const isPublicApi =
    pathname.startsWith('/api/auth/login') ||
    pathname.startsWith('/api/auth/register') ||
    pathname.startsWith('/api/auth/logout') ||
    pathname.startsWith('/api/auth/me')

  // Chưa đăng nhập mà truy cập route được bảo vệ
  if (!token && !isAuthPage && !isPublicApi && pathname !== '/') {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Chuyển hướng /dashboard về /reading-logs nếu có truy cập
  if (pathname === '/dashboard') {
    return NextResponse.redirect(new URL('/reading-logs', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
