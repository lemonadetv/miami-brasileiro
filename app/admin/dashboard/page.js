'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function AdminDashboard() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetch('/api/admin/artigos')
      .then(r => { if (r.status === 401) router.push('/admin'); return r.json() })
      .then(d => { if (Array.isArray(d)) setArticles(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin')
  }

  const byCategory = articles.reduce((acc, a) => {
    acc[a.category] = (acc[a.category] || 0) + 1
    return acc
  }, {})

  const cats = [
    { label: 'Comunidade', key: 'Comunidade', color: '#00897B' },
    { label: 'Imigração',  key: 'Imigração',  color: '#F4622A' },
    { label: 'Negócios',   key: 'Negócios',   color: '#7C3AED' },
    { label: 'Saúde',      key: 'Saúde',       color: '#15803D' },
    { label: 'Esportes',   key: 'Esportes',    color: '#DC2626' },
  ]

  return (
    <div className="admin-wrap">
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <div className="al-title">Miami Brasileiro</div>
          <div className="al-sub">Painel Admin</div>
        </div>
        <nav className="admin-nav">
          <Link href="/admin/dashboard" className="active"><span className="nav-icon">📊</span> Dashboard</Link>
          <Link href="/admin/artigos"><span className="nav-icon">📰</span> Artigos</Link>
          <Link href="/admin/artigos/novo"><span className="nav-icon">✏️</span> Novo Artigo</Link>
          <Link href="/admin/config"><span className="nav-icon">⚙️</span> Configurações</Link>
          <div className="admin-nav-section">Site</div>
          <Link href="/" target="_blank"><span className="nav-icon">🌐</span> Ver Site</Link>
        </nav>
        <div className="admin-footer">
          <button onClick={logout} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,.5)', fontSize: 12 }}>
            Sair da conta →
          </button>
        </div>
      </aside>
      <main className="admin-main">
        <div className="admin-topbar">
          <h1>Dashboard</h1>
          <Link href="/admin/artigos/novo" className="admin-btn admin-btn-orange">+ Novo Artigo</Link>
        </div>
        <div className="admin-content">
          {loading ? <p>Carregando...</p> : (
            <>
              <div className="stat-grid">
                <div className="stat-card">
                  <div className="sc-num">{articles.length}</div>
                  <div className="sc-label">Total de Artigos</div>
                </div>
                {cats.map(c => (
                  <div className="stat-card" key={c.key}>
                    <div className="sc-num" style={{ color: c.color }}>{byCategory[c.key] || 0}</div>
                    <div className="sc-label">{c.label}</div>
                  </div>
                ))}
              </div>

              <div className="admin-card">
                <h2>Últimos Artigos</h2>
                <table className="admin-table">
                  <thead><tr><th>Título</th><th>Categoria</th><th>Data</th><th>Ações</th></tr></thead>
                  <tbody>
                    {articles.slice(0, 8).map(a => (
                      <tr key={a.id}>
                        <td className="t-title">{a.title}</td>
                        <td><span className="admin-badge badge-blue">{a.category}</span></td>
                        <td style={{ whiteSpace: 'nowrap' }}>{new Date(a.publishedAt).toLocaleDateString('pt-BR')}</td>
                        <td>
                          <Link href={`/admin/artigos/${a.id}`} className="admin-btn admin-btn-ghost admin-btn-sm">Editar</Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {articles.length > 8 && (
                  <div style={{ marginTop: 12 }}>
                    <Link href="/admin/artigos" className="admin-btn admin-btn-ghost">Ver todos os {articles.length} artigos</Link>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
