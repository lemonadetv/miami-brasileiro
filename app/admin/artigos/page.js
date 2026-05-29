'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const AdminNav = ({ active }) => (
  <aside className="admin-sidebar">
    <div className="admin-logo"><div className="al-title">Miami Brasileiro</div><div className="al-sub">Painel Admin</div></div>
    <nav className="admin-nav">
      <Link href="/admin/dashboard"><span className="nav-icon">📊</span> Dashboard</Link>
      <Link href="/admin/artigos" className={active==='artigos'?'active':''}><span className="nav-icon">📰</span> Artigos</Link>
      <Link href="/admin/artigos/novo" className={active==='novo'?'active':''}><span className="nav-icon">✏️</span> Novo Artigo</Link>
      <Link href="/admin/config" className={active==='config'?'active':''}><span className="nav-icon">⚙️</span> Configurações</Link>
      <div className="admin-nav-section">Site</div>
      <Link href="/" target="_blank"><span className="nav-icon">🌐</span> Ver Site</Link>
    </nav>
  </aside>
)

export default function AdminArtigos() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(null)
  const [filter, setFilter] = useState('')
  const router = useRouter()

  function load() {
    fetch('/api/admin/artigos')
      .then(r => { if (r.status === 401) router.push('/admin'); return r.json() })
      .then(d => { if (Array.isArray(d)) setArticles(d); setLoading(false) })
  }

  useEffect(() => { load() }, [])

  async function handleDelete(id, title) {
    if (!confirm(`Deletar "${title}"? Esta acao nao pode ser desfeita.`)) return
    setDeleting(id)
    await fetch(`/api/admin/artigos/${id}`, { method: 'DELETE' })
    setDeleting(null)
    load()
  }

  const filtered = articles.filter(a =>
    !filter || a.title.toLowerCase().includes(filter.toLowerCase()) || a.category.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div className="admin-wrap">
      <AdminNav active="artigos" />
      <main className="admin-main">
        <div className="admin-topbar">
          <h1>Artigos ({articles.length})</h1>
          <Link href="/admin/artigos/novo" className="admin-btn admin-btn-orange">+ Novo Artigo</Link>
        </div>
        <div className="admin-content">
          <div className="admin-card">
            <div style={{ marginBottom: 16 }}>
              <input
                type="search"
                placeholder="Buscar artigos..."
                value={filter}
                onChange={e => setFilter(e.target.value)}
                style={{ padding: '8px 14px', border: '1.5px solid #E5E7EB', borderRadius: 6, fontSize: 14, width: 300, fontFamily: 'inherit', outline: 'none' }}
              />
            </div>
            {loading ? <p>Carregando...</p> : (
              <table className="admin-table">
                <thead>
                  <tr><th>Título</th><th>Categoria</th><th>Data</th><th>Destaque</th><th>Ações</th></tr>
                </thead>
                <tbody>
                  {filtered.map(a => (
                    <tr key={a.id}>
                      <td className="t-title">
                        <div>{a.title}</div>
                        <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>{a.id}</div>
                      </td>
                      <td><span className="admin-badge badge-blue">{a.category}</span></td>
                      <td style={{ whiteSpace: 'nowrap', fontSize: 12 }}>{new Date(a.publishedAt).toLocaleDateString('pt-BR')}</td>
                      <td>{a.featured ? <span className="admin-badge badge-green">Sim</span> : <span className="admin-badge badge-gray">Nao</span>}</td>
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <Link href={`/artigo/${a.id}`} target="_blank" className="admin-btn admin-btn-ghost admin-btn-sm">Ver</Link>
                          <Link href={`/admin/artigos/${a.id}`} className="admin-btn admin-btn-primary admin-btn-sm">Editar</Link>
                          <button
                            onClick={() => handleDelete(a.id, a.title)}
                            disabled={deleting === a.id}
                            className="admin-btn admin-btn-danger admin-btn-sm"
                          >
                            {deleting === a.id ? '...' : 'Deletar'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {!loading && filtered.length === 0 && (
              <p style={{ color: '#9CA3AF', textAlign: 'center', padding: '30px 0' }}>Nenhum artigo encontrado.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
