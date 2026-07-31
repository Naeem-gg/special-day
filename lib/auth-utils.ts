import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

const secretKey = process.env.JWT_SECRET
if (!secretKey && process.env.NODE_ENV === 'production') {
  console.error('FATAL: JWT_SECRET environment variable is not set')
}
const key = new TextEncoder().encode(secretKey || 'dev-only-insecure-secret')

function cookieOptions(expires: Date) {
  return {
    expires,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
  }
}

export async function encrypt(payload: any, expireTime: string = '2h') {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expireTime)
    .sign(key)
}

export async function decrypt(input: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(input, key, {
      algorithms: ['HS256'],
    })
    return payload
  } catch {
    return null
  }
}

export async function login(username: string) {
  const expires = new Date(Date.now() + 2 * 60 * 60 * 1000)
  const session = await encrypt({ username, expires })
  ;(await cookies()).set('admin_session', session, cookieOptions(expires))
}

export async function logout() {
  ;(await cookies()).set('admin_session', '', cookieOptions(new Date(0)))
}

export async function getSession() {
  const session = (await cookies()).get('admin_session')?.value
  if (!session) return null
  const payload = await decrypt(session)
  if (!payload?.username) return null
  return payload
}

export async function updateSession(request: NextRequest) {
  const session = request.cookies.get('admin_session')?.value
  if (!session) return null

  const parsed = await decrypt(session)
  if (!parsed) return null

  parsed.expires = new Date(Date.now() + 2 * 60 * 60 * 1000)
  const res = new Response()
  res.headers.set(
    'Set-Cookie',
    `admin_session=${await encrypt(parsed)}; HttpOnly; Path=/; SameSite=Lax${
      process.env.NODE_ENV === 'production' ? '; Secure' : ''
    }; Expires=${parsed.expires.toUTCString()}`
  )
  return res
}

export async function userLogin(userId: number, email: string) {
  const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
  const session = await encrypt({ userId, email, role: 'user', expires }, '30d')
  ;(await cookies()).set('user_session', session, cookieOptions(expires))
}

export async function userLogout() {
  ;(await cookies()).set('user_session', '', cookieOptions(new Date(0)))
}

export async function getUserSession() {
  const session = (await cookies()).get('user_session')?.value
  if (!session) return null
  const payload = await decrypt(session)
  if (!payload?.email || !payload?.userId) return null
  return payload
}

/** Require a valid admin session; returns a 401 response when missing. */
export async function requireAdmin(): Promise<{ username: string } | NextResponse> {
  const session = await getSession()
  if (!session?.username) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return session as { username: string }
}
