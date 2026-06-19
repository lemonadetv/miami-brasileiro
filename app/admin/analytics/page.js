'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

function AdminNav({ active }) {
  return (
    <aside className="admin-sidebar">
      <div className="admin-logo">
        <div className="al-icon">🌴</div>
        <div className="al-title">Miami Brasileiro</div>
        <div className="al-sub">Painel Admin</div>
      </div>
      <nav className="admin-nav">
        <Link href="/admin/dashboard"><span className="nav-icon">📊</span> Dashboard</Link>
        <Link href="/admin/artigos"><span className="nav-icon">📰</span> Artigos</Link>
        <Link href="/admin/artigos/novo"><span className="nav-icon">✏️</span> Novo Artigo</Link>
        <Link href="/admin/bot"><span className="nav-icon">🤖</span> Bot / Automação</Link>
        <Link href="/admin/facebook"><span className="nav-icon">📣</span> Facebook</Link>
        <Link href="/admin/analytics" className={active==='analytics'?'active':''}><span className="nav-icon">📈</span> Analytics</Link>
        <Link href="/admin/config"><span className="nav-icon">⚙️</span> Configurações</Link>
        <div className="admin-nav-section">Site</div>
        <Link href="/" target="_blank"><span className="nav-icon">🌐</span> Ver Site</Link>
      </nav>
    </aside>
  )
}

const CAT_CONFIG = [
  { label: 'Comunidade',      key: 'Comunidade',      color: '#00897B' },
  { label: 'Imigração',       key: 'Imigração',       color: '#F4622A' },
  { label: 'Negócios',        key: 'Negócios',        color: '#7C3AED' },
  { label: 'Saúde',           key: 'Saúde',           color: '#15803D' },
  { label: 'Esportes',        key: 'Esportes',        color: '#DC2626' },
  { label: 'Cultura e Lazer', key: 'Cultura e Lazer', color: '#D97706' },
]

export default function Analytics() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/artigos').then(r => r.json()).then(arts => {
      if (Array.isArray(arts)) setArticles(arts)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const total = articles.length
  const byCategory = articles.reduce((acc, a) => {
    acc[a.category] = (acc[a.category] || 0) + 1; return acc
  }, {})

  // Articles by month (last 6 months)
  const now = new Date()
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1)
    return {
      label: d.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }),
      count: articles.filter(a => {
        const ad = new Date(a.publishedAt)
        return ad.getMonth() === d.getMonth() && ad.getFullYear() === d.getFullYear()
      }).length
    }
  })
  const maxMonthCount = Math.max(...months.map(m => m.count), 1)

  // Recent articles (last 7 days)
  const sevenDaysAgo = new Date(Date.now() - 7 * 86400000)
  const recentArticles = articles.filter(a => new Date(a.publishedAt) > sevenDaysAgo)

  return (
    <div className="admin-wrap">
      <AdminNav active="analytics" />
      <main className="admin-main">
        <div className="admin-topbar">
          <h1>📈 Analytics</h1>
        </div>
        <div className="admin-content">
          {loading ? <p style={{ color: '#555' }}>Carregando...</p> : (<>

            {/* Live Analytics Card */}
            <div className="admin-card" style={{ background: 'linear-gradient(135deg, #0d1f3c 0%, #1a2f50 100%)', border: '1px solid #1e3a5f', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
                <div>
                  <h2 style={{ margin: '0 0 8px', color: '#60a5fa' }}>📡 Visitas ao Vivo — Vercel Analytics</h2>
                  <p style={{ fontSize: 13, color: '#94a3b8', margin: '0 0 16px' }}>
                    O tracking está ativo no site. Veja dados em tempo real no painel da Vercel.
                  </p>
                  <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                    {[
                      { label: 'Visitantes (7 dias)', value: '—', note: 'Ver no Vercel' },
                      { label: 'Page Views (7 dias)', value: '—', note: 'Ver no Vercel' },
                      { label: 'Bounce Rate', value: '—', note: 'Ver no Vercel' },
                    ].map(s => (
                      <div key={s.label} style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 22, fontWeight: 900, color: '#fff' }}>{s.value}</div>
                        <div style={{ fontSize: 10, color: '#64748b', marginTop: 2 }}>{s.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <a
                  href="https://vercel.com/ricardo-8237s-projects/miami-brasileiro/analytics"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    background: '#3b82f6', color: '#fff', padding: '12px 20px',
                    borderRadius: 8, fontWeight: 700, fontSize: 14, textDecoration: 'none',
                    whiteSpace: 'nowrap'
                  }}>
                  Ver Analytics Completo ↗
                </a>
              </div>
            </div>

            {/* Summary stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
              {[
                { label: 'Total de Artigos', value: total, color: '#fff' },
                { label: 'Artigos esta Semana', value: recentArticles.length, color: '#4ade80' },
                { label: 'Categorias Ativas', value: Object.keys(byCategory).length, color: '#60a5fa' },
              ].map(s => (
                <div key={s.label} className="admin-card" style={{ textAlign: 'center', margin: 0, padding: '18px' }}>
                  <div style={{ fontSize: 28, fontWeight: 900, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: '#666', marginTop: 4 }}>{s.label}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              {/* Monthly chart */}
              <div className="admin-card">
                <h2>📅 Artigos por Mês (últimos 6 meses)</h2>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 120, padding: '0 8px' }}>
                  {months.map((m, i) => (
                    <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                      <span style={{ fontSize: 11, color: '#666' }}>{m.count}</span>
                      <div style={{
                        width: '100%', background: '#F4622A',
                        height: Math.max((m.count / maxMonthCount) * 90, m.count > 0 ? 6 : 2) + 'px',
                        borderRadius: '4px 4px 0 0', opacity: i === 5 ? 1 : 0.6, transition: 'height .5s'
                      }} />
                      <span style={{ fontSize: 10, color: '#555', whiteSpace: 'nowrap' }}>{m.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Category distribution */}
              <div className="admin-card">
                <h2>🗂 Distribuição por Categoria</h2>
                {CAT_CONFIG.map(c => {
                  const count = byCategory[c.key] || 0
                  const pct = total > 0 ? Math.round((count / total) * 100) : 0
                  return (
                    <div key={c.key} style={{ marginBottom: 10 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 3 }}>
                        <span style={{ color: '#ddd' }}>{c.label}</span>
                        <span style={{ color: '#555' }}>{count} ({pct}%)</span>
                      </div>
                      <div style={{ background: '#222', borderRadius: 3, height: 5 }}>
                        <div style={{ width: pct + '%', height: '100%', background: c.color, borderRadius: 3, transition: 'width .5s' }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Recent articles */}
            {recentArticles.length > 0 && (
              <div className="admin-card">
                <h2>🆕 Artigos Publicados nos Últimos 7 Dias</h2>
                <table className="admin-table">
                  <thead><tr><th>Título</th><th>Categoria</th><th>Data</th></tr></thead>
                  <tbody>
                    {recentArticles.slice(0, 10).map((a, i) => (
                      <tr key={i}>
                        <td style={{ fontSize: 13 }}>
                          <Link href={`/artigo/${a.slug || a.id}`} target="_blank" style={{ color: '#a78bfa' }}>
                            {a.title}
                          </Link>
                        </td>
                        <td style={{ fontSize: 12, color: '#888' }}>{a.category}</td>
                        <td style={{ fontSize: 12, color: '#555' }}>
                          {new Date(a.publishedAt).toLocaleDateString('pt-BR')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

          </>)}
        </div>
      </main>
    </div>
  )
}
