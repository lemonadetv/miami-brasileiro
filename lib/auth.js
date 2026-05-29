// lib/auth.js - Admin authentication helper
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export function getSessionToken() {
  const pwd = process.env.ADMIN_PASSWORD || 'admin123'
  return Buffer.from(pwd + 'miami2026secret').toString('base64').slice(0, 32)
}

export function requireAdmin() {
  const cookieStore = cookies()
  const session = cookieStore.get('admin_session')
  if (session?.value !== getSessionToken()) {
    redirect('/admin')
  }
}

export function isLoggedIn() {
  try {
    const cookieStore = cookies()
    const session = cookieStore.get('admin_session')
    return session?.value === getSessionToken()
  } catch {
    return false
  }
}
