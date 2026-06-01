'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const AdminNav = ({ active }) => (
  <aside className="admin-sidebar">
    <div className="admin-logo">
      <div className="al-title">Miami Brasileira</div>
    </div>
    <nav className="admin-nav">
      <Link href="/admin/analytics" className={active === 'analytics' ? 'active' : ''}>Analytics</Link>
    </nav>
  </aside>
)

export default function AdminAnalytics() {
  const [articles, setArticles] = useState([])
  const [pageviews, setPageviews] = useState({})
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState('7d')
  const router = useRouter()

  useEffect(() => {
    fetch('/api/admin/artigos')
      .then(function(r) {
        if (r.status === 401) router.push('/admin')
        return r.json()
      })
      .then(function(d) {
        if (Array.isArray(d)) setArticles(d)
        setLoading(false)
      })
    fetch('/api/admin/analytics?period=' + period)
      .then(function(r) { return r.json() })
      .then(function(d) { if (d.pageviews) setPageviews(d.pageviews) })
      .catch(function() {})
  }, [period])

  const totalViews = Object.values(pageviews).reduce(function(s, v) { return s + v }, 0)
  const articlesWithViews = articles.map(function(a) {
    return Object.assign({}, a, { views: pageviews['/artigo/' + a.id] || 0 })
  }).sort(function(a, b) { return b.views - a.views })

  return (
    <div className="admin-wrap">
      <AdminNav active="analytics" />
      <main className="admin-main">
        <h1>Analytics</h1>
        <p style={{ color: '#9CA3AF' }}>Total Views: {totalViews}</p>
      </main>
    </div>
  )
}
