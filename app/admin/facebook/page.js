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
        <Link href="/admin/facebook" className={active==='facebook'?'active':''}><span className="nav-icon">📣</span> Facebook</Link>
        <Link href="/admin/analytics"><span className="nav-icon">📈</span> Analytics</Link>
        <Link href="/admin/config"><span className="nav-icon">⚙️</span> Configurações</Link>
        <div className="admin-nav-section">Site</div>
        <Link href="/" target="_blank"><span className="nav-icon">🌐</span> Ver Site</Link>
      </nav>
    </aside>
  )
}

export default function FacebookPage() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [posting, setPosting] = useState(null)
  const [posted, setPosted] = useState({})
  const [batchRunning, setBatchRunning] = useState(false)
  const [batchMsg, setBatchMsg] = useState(null)
  const [filter, setFilter] = useState('')

  useEffect(() => {
    fetch('/api/admin/artigos')
      .then(r => r.json())
      .then(d => { if (Array.isArray(d)) setArticles(d); setLoading(false) })
  }, [])

  async function postOne(article) {
    setPosting(article.id)
    try {
      const res = await fetch('/api/facebook-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articleId: article.id })
      })
      const data = await res.json()
      setPosted(p => ({ ...p, [article.id]: res.ok ? '✓' : '✗' }))
    } catch {
      setPosted(p => ({ ...p, [article.id]: '✗' }))
    }
    setPosting(null)
  }

  async function postBatch() {
    setBatchRunning(true)
    setBatchMsg(null)
    try {
      const res = await fetch('/api/facebook-batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-cron-secret': 'miami2026' }
      })
      const data = await res.json()
      setBatchMsg(res.ok ? { ok: true, text: `✓ ${data.posted || 0} artigos postados!` } : { ok: false, text: data.error || 'Erro' })
    } catch (e) {
      setBatchMsg({ ok: false, text: e.message })
    }
    setBatchRunning(false)
  }

  const filtered = articles.filter(a =>
    !filter || a.title.toLowerCase().includes(filter.toLowerCase()) || a.category.toLowerCase().includes(filter.toLowerCase())
  )
  const recent = [...filtered].sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))

  return (
    <div className="admin-wrap">
      <AdminNav active="facebook" />
      <main className="admin-main">
        <div className="admin-topbar">
          <h1>📣 Facebook</h1>
          <button onClick={postBatch} disabled={batchRunning} className="admin-btn admin-btn-primary"
            style={{ background: '#1877f2' }}>
            {batchRunning ? '⏳ Postando...' : '📣 Postar Todos Recentes'}
          </button>
        </div>
        <div className="admin-content">
          {batchMsg && (
            <div style={{
              marginBottom: 16, padding: '12px 16px', borderRadius: 6, fontSize: 13,
              background: batchMsg.ok ? '#0d2e1a' : '#2e0d0d',
              color: batchMsg.ok ? '#4ade80' : '#f87171',
              border: '1px solid ' + (batchMsg.ok ? '#166534' : '#991b1b')
            }}>{batchMsg.text}</div>
          )}

          <div className="admin-card" style={{ marginBottom: 16, padding: '14px 18px' }}>
            <div style={{ fontSize: 13, color: '#666', lineHeight: 1.7 }}>
              <strong style={{ color: '#888' }}>Configuração necessária no Vercel:</strong>{' '}
              <code style={{ color: '#a78bfa' }}>FACEBOOK_PAGE_ID</code> e{' '}
              <code style={{ color: '#a78bfa' }}>FACEBOOK_ACCESS_TOKEN</code>.{' '}
              <Link href="/admin/bot" style={{ color: '#F4622A', textDecoration: 'underline' }}>Ver como configurar →</Link>
            </div>
          </div>

          <div className="admin-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <h2 style={{ margin: 0, border: 'none', padding: 0 }}>Artigos para Postar</h2>
              <input type="search" placeholder="Filtrar..." value={filter} onChange={e => setFilter(e.target.value)}
                style={{ padding: '6px 12px', background: '#222', border: '1px solid #333', borderRadius: 6, color: '#fff', fontSize: 13, width: 200, outline: 'none' }} />
            </div>
            {loading ? <p style={{ color: '#555' }}>Carregando...</p> : (
              <table className="admin-table">
                <thead>
                  <tr><th>Título</th><th>Categoria</th><th>Data</th><th style={{ textAlign: 'right' }}>Facebook</th></tr>
                </thead>
                <tbody>
                  {recent.map(a => (
                    <tr key={a.id}>
                      <td className="t-title">
                        <div>{a.title}</div>
                      </td>
                      <td style={{ fontSize: 11, color: '#666' }}>{a.category}</td>
                      <td style={{ fontSize: 12, color: '#555', whiteSpace: 'nowrap' }}>
                        {new Date(a.publishedAt).toLocaleDateString('pt-BR')}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        {posted[a.id] === '✓' ? (
                          <span style={{ color: '#4ade80', fontSize: 13, fontWeight: 600 }}>✓ Postado</span>
                        ) : posted[a.id] === '✗' ? (
                          <span style={{ color: '#f87171', fontSize: 13 }}>✗ Erro</span>
                        ) : (
                          <button onClick={() => postOne(a)} disabled={posting === a.id}
                            className="admin-btn admin-btn-sm"
                            style={{ background: '#1877f2', color: '#fff', opacity: posting === a.id ? .6 : 1 }}>
                            {posting === a.id ? '...' : '📣 Postar'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
