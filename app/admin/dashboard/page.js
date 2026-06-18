'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

function AdminNav({ active }) {
  const router = useRouter()
  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin')
  }
  return (
    <aside className="admin-sidebar">
      <div className="admin-logo">
        <div className="al-icon">🌴</div>
        <div className="al-title">Miami Brasileiro</div>
        <div className="al-sub">Painel Admin</div>
      </div>
      <nav className="admin-nav">
        <Link href="/admin/dashboard" className={active==='dashboard'?'active':''}><span className="nav-icon">📊</span> Dashboard</Link>
        <Link href="/admin/artigos" className={active==='artigos'?'active':''}><span className="nav-icon">📰</span> Artigos</Link>
        <Link href="/admin/artigos/novo" className={active==='novo'?'active':''}><span className="nav-icon">✏️</span> Novo Artigo</Link>
        <Link href="/admin/bot" className={active==='bot'?'active':''}><span className="nav-icon">🤖</span> Bot / Automação</Link>
        <Link href="/admin/facebook" className={active==='facebook'?'active':''}><span className="nav-icon">📣</span> Facebook</Link>
        <Link href="/admin/analytics" className={active==='analytics'?'active':''}><span className="nav-icon">📈</span> Analytics</Link>
        <Link href="/admin/config" className={active==='config'?'active':''}><span className="nav-icon">⚙️</span> Configurações</Link>
        <div className="admin-nav-section">Site</div>
        <Link href="/" target="_blank"><span className="nav-icon">🌐</span> Ver Site</Link>
      </nav>
      <div className="admin-footer">
        <button onClick={logout} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,.35)', fontSize: 11 }}>
          Sair da conta →
        </button>
      </div>
    </aside>
  )
}

const CAT_CONFIG = [
  { label: 'Comunidade',     key: 'Comunidade',     color: '#00897B', emoji: '🏡' },
  { label: 'Imigração',      key: 'Imigração',      color: '#F4622A', emoji: '🛂' },
  { label: 'Negócios',       key: 'Negócios',       color: '#7C3AED', emoji: '💼' },
  { label: 'Saúde',          key: 'Saúde',           color: '#15803D', emoji: '🏥' },
  { label: 'Esportes',       key: 'Esportes',       color: '#DC2626', emoji: '⚽' },
  { label: 'Cultura e Lazer',key: 'Cultura e Lazer',color: '#D97706', emoji: '🎭' },
]

export default function AdminDashboard() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [botRunning, setBotRunning] = useState(false)
  const [botMsg, setBotMsg] = useState(null)

  useEffect(() => {
    fetch('/api/admin/artigos')
      .then(r => { if (r.status === 401) location.href = '/admin'; return r.json() })
      .then(d => { if (Array.isArray(d)) setArticles(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  async function runBot() {
    setBotRunning(true)
    setBotMsg(null)
    try {
      const res = await fetch('/api/buscar-noticias', { method: 'POST', headers: { 'x-cron-secret': 'miami2026' } })
      const data = await res.json()
      if (res.ok) setBotMsg({ type: 'success', text: `✓ Bot executado! ${data.added || 0} artigos adicionados.` })
      else setBotMsg({ type: 'error', text: data.error || 'Erro ao executar bot' })
    } catch (e) {
      setBotMsg({ type: 'error', text: 'Falha na conexão com o bot' })
    }
    setBotRunning(false)
  }

  const byCategory = articles.reduce((acc, a) => {
    acc[a.category] = (acc[a.category] || 0) + 1; return acc
  }, {})
  const total = articles.length
  const featured = articles.filter(a => a.featured).length
  const thisMonth = articles.filter(a => {
    const d = new Date(a.publishedAt)
    const now = new Date()
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  }).length

  const recent = [...articles].sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)).slice(0, 6)

  return (
    <div className="admin-wrap">
      <AdminNav active="dashboard" />
      <main className="admin-main">
        <div className="admin-topbar">
          <h1>Dashboard</h1>
          <Link href="/admin/artigos/novo" className="admin-btn admin-btn-orange">+ Novo Artigo</Link>
        </div>
        <div className="admin-content">
          {loading ? (
            <div style={{ textAlign: 'center', padding: 60, color: '#555' }}>Carregando...</div>
          ) : (<>
            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
              {[
                { label: 'Total de Artigos', value: total, color: '#fff', icon: '📰' },
                { label: 'Em Destaque', value: featured, color: '#F4622A', icon: '⭐' },
                { label: 'Este Mês', value: thisMonth, color: '#4ade80', icon: '📅' },
                { label: 'Categorias', value: CAT_CONFIG.length, color: '#a78bfa', icon: '🗂' },
              ].map(s => (
                <div key={s.label} className="admin-card" style={{ textAlign: 'center', padding: '20px 16px', margin: 0 }}>
                  <div style={{ fontSize: 24 }}>{s.icon}</div>
                  <div style={{ fontSize: 30, fontWeight: 900, color: s.color, lineHeight: 1.2 }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: '#666', marginTop: 4 }}>{s.label}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {/* Category breakdown */}
              <div className="admin-card">
                <h2>📊 Artigos por Categoria</h2>
                {CAT_CONFIG.map(c => {
                  const count = byCategory[c.key] || 0
                  const pct = total > 0 ? Math.round((count / total) * 100) : 0
                  return (
                    <div key={c.key} style={{ marginBottom: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 12 }}>
                        <span style={{ color: '#ddd' }}>{c.emoji} {c.label}</span>
                        <span style={{ color: '#666' }}>{count} artigos · {pct}%</span>
                      </div>
                      <div style={{ background: '#222', borderRadius: 4, height: 6, overflow: 'hidden' }}>
                        <div style={{ width: pct + '%', height: '100%', background: c.color, borderRadius: 4, transition: 'width .5s' }} />
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Bot control */}
              <div className="admin-card">
                <h2>🤖 Bot de Notícias</h2>
                <p style={{ fontSize: 13, color: '#888', marginBottom: 16, lineHeight: 1.6 }}>
                  O bot busca notícias sobre a comunidade brasileira em Miami nas principais fontes e adiciona artigos automaticamente.
                </p>
                {botMsg && (
                  <div style={{
                    padding: '10px 14px', borderRadius: 6, marginBottom: 14, fontSize: 13,
                    background: botMsg.type === 'success' ? '#0d2e1a' : '#2e0d0d',
                    color: botMsg.type === 'success' ? '#4ade80' : '#f87171',
                    border: '1px solid ' + (botMsg.type === 'success' ? '#166534' : '#991b1b')
                  }}>{botMsg.text}</div>
                )}
                <button onClick={runBot} disabled={botRunning} className="admin-btn admin-btn-primary"
                  style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: 14 }}>
                  {botRunning ? '⏳ Executando bot...' : '▶ Executar Bot Agora'}
                </button>
                <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
                  <Link href="/admin/bot" className="admin-btn admin-btn-ghost" style={{ flex: 1, justifyContent: 'center' }}>
                    Configurar Bot
                  </Link>
                  <Link href="/admin/facebook" className="admin-btn admin-btn-ghost" style={{ flex: 1, justifyContent: 'center' }}>
                    Postar Facebook
                  </Link>
                </div>
              </div>
            </div>

            {/* Recent articles */}
            <div className="admin-card" style={{ marginTop: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <h2 style={{ margin: 0, borderBottom: 'none', padding: 0 }}>📰 Artigos Recentes</h2>
                <Link href="/admin/artigos" className="admin-btn admin-btn-ghost admin-btn-sm">Ver todos →</Link>
              </div>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Título</th>
                    <th>Categoria</th>
                    <th>Data</th>
                    <th>Destaque</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map(a => {
                    const cat = CAT_CONFIG.find(c => c.key === a.category)
                    return (
                      <tr key={a.id}>
                        <td className="t-title">{a.title}</td>
                        <td>
                          <span style={{
                            display: 'inline-block', padding: '2px 8px', borderRadius: 4, fontSize: 11,
                            fontWeight: 600, background: (cat?.color || '#555') + '22', color: cat?.color || '#aaa'
                          }}>{a.category}</span>
                        </td>
                        <td style={{ whiteSpace: 'nowrap', fontSize: 12, color: '#666' }}>
                          {new Date(a.publishedAt).toLocaleDateString('pt-BR')}
                        </td>
                        <td>{a.featured ? <span style={{ color: '#F4622A' }}>⭐</span> : <span style={{ color: '#333' }}>–</span>}</td>
                        <td>
                          <div style={{ display: 'flex', gap: 6 }}>
                            <Link href={`/artigo/${a.id}`} target="_blank" className="admin-btn admin-btn-ghost admin-btn-sm">Ver</Link>
                            <Link href={`/admin/artigos/${a.id}`} className="admin-btn admin-btn-primary admin-btn-sm">Editar</Link>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </>)}
        </div>
      </main>
    </div>
  )
}
