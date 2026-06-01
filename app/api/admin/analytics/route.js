import { NextResponse } from 'next/server'
import { getSessionToken } from '../../../../lib/auth'
import { cookies } from 'next/headers'
function checkAuth() { const c = cookies().get('admin_session'); return c?.value === getSessionToken() }
export async function GET(request) {
  if (!checkAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { searchParams } = new URL(request.url)
  const period = searchParams.get('period') || '7d'
  const now = Date.now()
  const periodMs = { '7d': 7, '30d': 30, '90d': 90 }[period] || 7
  const from = now - periodMs * 86400000
  try {
    const token = process.env.VERCEL_TOKEN || ''
    if (!token) return NextResponse.json({ pageviews: {} })
    const res = await fetch(`https://vercel.com/api/web/insights?projectId=miami-brasileiro&from=${from}&to=${now}`, { headers: { Authorization: `Bearer ${token}` } })
    if (!res.ok) return NextResponse.json({ pageviews: {} })
    const data = await res.json()
    const pageviews = {}
    if (data && data.data) data.data.forEach(item => { if (item.path && item.total) pageviews[item.path] = item.total })
    return NextResponse.json({ pageviews, period })
  } catch (e) {
    return NextResponse.json({ pageviews: {}, error: e.message })
  }
}
