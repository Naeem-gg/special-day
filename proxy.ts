import { NextRequest, NextResponse } from 'next/server'
import { decrypt } from '@/lib/auth-utils'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protect /adminn routes
  if (pathname.startsWith('/adminn')) {
    if (pathname === '/adminn/login') {
      return NextResponse.next()
    }

    const session = request.cookies.get('admin_session')?.value

    if (!session) {
      return NextResponse.redirect(new URL('/adminn/login', request.url))
    }

    const payload = await decrypt(session)
    if (!payload) {
      const res = NextResponse.redirect(new URL('/adminn/login', request.url))
      res.cookies.set('admin_session', '', { expires: new Date(0), path: '/' })
      return res
    }

    return NextResponse.next()
  }

  // Protect /api/admin routes
  if (pathname.startsWith('/api/admin')) {
    if (pathname === '/api/admin/login') {
      return NextResponse.next()
    }

    const session = request.cookies.get('admin_session')?.value
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await decrypt(session)
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/adminn/:path*', '/api/admin/:path*'],
}
