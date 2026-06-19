import { NextResponse } from 'next/server'
import { getSessionToken } from '../../../../lib/auth'
import { cookies } from 'next/headers'

function checkAuth() {
  const c = cookies().get('admin_session')
  return c?.value === getSessionToken()
}

export async function GET(request) {
  if (!checkAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const period = searchParams.get('period') || '7d'
  const now = Date.now()
  const periodDays = { '7d': 7, '30d': 30, '90d': 90 }[period] || 7
  const from = now - periodDays * 86400000

  const token = process.env.VERCEL_TOKEN || ''
  if (!token) return NextResponse.json({ pageviews: {}, error: 'VERCEL_TOKEN not set' })

  const projectId = 'prj_lwi0FKpEoyxATNAMSR6ExwoUe9cH'

  // Try Vercel Web Analytics API
  const endpoints = [
    `https://vercel.com/api/web/insights/stats/page-views?projectId=${projectId}&from=${from}&to=${now}&environment=production`,
    `https://vercel.com/api/web/insights?projectId=${projectId}&from=${from}&to=${now}`,
    `https://vercel.com/api/v1/web/analytics?projectId=${projectId}&from=${from}&to=${now}`,
  ]

  for (const url of endpoints) {
    try {
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        next: { revalidate: 300 }
      })
      if (!res.ok) continue
      const data = await res.json()

      // Parse response - different endpoints return different shapes
      const pageviews = {}
      if (data?.data) {
        data.data.forEach(item => {
          if (item.path && item.total) pageviews[item.path] = item.total
          else if (item.page && item.count) pageviews[item.page] = item.count
          else if (item.key && item.value) pageviews[item.key] = item.value
        })
      } else if (data?.pageviews) {
        Object.assign(pageviews, data.pageviews)
      } else if (Array.isArray(data)) {
        data.forEach(item => {
          if (item.path) pageviews[item.path] = item.total || item.count || 1
        })
      }

      return NextResponse.json({ pageviews, period, source: url })
    } catch (e) {
      continue
    }
  }

  return NextResponse.json({ pageviews: {}, error: 'Could not fetch analytics from Vercel API', period })
}
