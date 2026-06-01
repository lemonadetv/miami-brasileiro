'use client'
import { useState, useEffect } from 'react'
export default function AdminAnalytics() {
  const [views, setViews] = useState({})
  useEffect(() => { fetch('/api/admin/analytics').then(r => r.json()).then(d => { if (d.pageviews) setViews(d.pageviews) }).catch(() => {}) }, [])
  const total = Object.values(views).reduce((s, v) => s + v, 0)
  return (<div className="admin-wrap"><main><h1>Analytics</h1><p >{total} views</p></main></div>)
}
