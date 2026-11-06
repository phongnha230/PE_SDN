import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const token = request.cookies.get('session_token')?.value
  const { pathname } = request.nextUrl

  // Các route công khai
  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/register')
  const isPublicApi = pathname.startsWith('/api/auth/login') || pathname.startsWith('/api/auth/register')

  // Chưa đăng nhập mà truy cập route được bảo vệ
  if (!token && !isAuthPage && !isPublicApi && pathname !== '/') {
    // Nếu là API route thì trả về JSON 401 Unauthorized
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    // Nếu là Web page thì chuyển hướng về /login
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Đã đăng nhập mà vào lại /login hoặc /register -> Chuyển về /reading-logs
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/reading-logs', request.url))
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
