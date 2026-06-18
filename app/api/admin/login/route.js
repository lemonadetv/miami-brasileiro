// app/api/admin/login/route.js
import { NextResponse } from 'next/server'
import { getSessionToken } from '../../../../lib/auth'

export async function POST(request) {
  const { password } = await request.json()
  const expected = process.env.ADMIN_PASSWORD || 'Lemonade@2026'

  if (password !== expected) {
    return NextResponse.json({ error: 'Senha incorreta' }, { status: 401 })
  }

  const token = getSessionToken()
  const res = NextResponse.json({ ok: true })
  res.cookies.set('admin_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7 // 7 days
  })
  return res
}
