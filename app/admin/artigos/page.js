'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

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
        <Link href="/admin/artigos" className={active==='artigos'?'active':''}><span className="nav-icon">📰</span> Artigos</Link>
        <Link href="/admin/artigos/novo" className={active==='novo'?'active':''}><span className="nav-icon">✏️</span> Novo Artigo</Link>
        <Link href="/admin/bot"><span className="nav-icon">🤖</span> Bot / Automação</Link>
        <Link href="/admin/facebook"><span className="nav-icon">📣</span> Facebook</Link>
        <Link href="/admin/analytics"><span className="nav-icon">📈</span> Analytics</Link>
        <Link href="/admin/config"><span className="nav-icon">⚙️</span> Configurações</Link>
        <div className="admin-nav-section">Site</div>
        <Link href="/" target="_blank"><span className="nav-icon">🌐</span> Ver Site</Link>
      </nav>
    </aside>
  )
}

const CAT_COLORS = {
  'Comunidade': '#00897B', 'Imigração': '#F4622A', 'Negócios': '#7C3AED',
  'Saúde': '#15803D', 'Esportes': '#DC2626', 'Cultura e Lazer': '#D97706'
}

export default function AdminArtigos() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(null)
  const [filter, setFilter] = useState('')
  const [catFilter, setCatFilter] = useState('')
  const router = useRouter()

  function load() {
    fetch('/api/admin/artigos')
      .then(r => { if (r.status === 401) router.push('/admin'); return r.json() })
      .then(d => { if (Array.isArray(d)) setArticles(d); setLoading(false) })
  }

  useEffect(() => { load() }, [])

  async function handleDelete(id, title) {
    if (!confirm(`Deletar "${title}"?\n\nEsta ação não pode ser desfeita.`)) return
    setDeleting(id)
    await fetch(`/api/admin/artigos/${id}`, { method: 'DELETE' })
    setDeleting(null)
    load()
  }

  const filtered = articles.filter(a => {
    const matchText = !filter || a.title.toLowerCase().includes(filter.toLowerCase())
    const matchCat = !catFilter || a.category === catFilter
    return matchText && matchCat
  })
  const sorted = [...filtered].sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))

  const cats = [...new Set(articles.map(a => a.category))].sort()

  return (
    <div className="admin-wrap">
      <AdminNav active="artigos" />
      <main className="admin-main">
        <div className="admin-topbar">
          <h1>Artigos <span style={{ color: '#555', fontSize: 14, fontWeight: 400 }}>({articles.length} total)</span></h1>
          <Link href="/admin/artigos/novo" className="admin-btn admin-btn-orange">+ Novo Artigo</Link>
        </div>
        <div className="admin-content">
          <div className="admin-card">
            <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
              <input type="search" placeholder="🔍 Buscar artigos..." value={filter}
                onChange={e => setFilter(e.target.value)}
                style={{ padding: '8px 14px', background: '#111', border: '1.5px solid #2a2a2a', borderRadius: 6,
                  fontSize: 13, color: '#fff', outline: 'none', flex: 1, minWidth: 200, fontFamily: 'inherit' }} />
              <select value={catFilter} onChange={e => setCatFilter(e.target.value)}
                style={{ padding: '8px 14px', background: '#111', border: '1.5px solid #2a2a2a', borderRadius: 6,
                  fontSize: 13, color: catFilter ? '#fff' : '#666', outline: 'none', fontFamily: 'inherit' }}>
                <option value="">Todas as categorias</option>
                {cats.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              {(filter || catFilter) && (
                <button onClick={() => { setFilter(''); setCatFilter('') }}
                  className="admin-btn admin-btn-ghost" style={{ padding: '8px 14px' }}>
                  Limpar ×
                </button>
              )}
            </div>

            {loading ? <p style={{ color: '#555', padding: '20px 0' }}>Carregando...</p> : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Imagem</th>
                    <th>Título</th>
                    <th>Categoria</th>
                    <th>Data</th>
                    <th>Dest.</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.map(a => {
                    const color = CAT_COLORS[a.category] || '#555'
                    return (
                      <tr key={a.id || a.slug}>
                        <td style={{ width: 60 }}>
                          {a.image ? (
                            <img src={a.image} alt="" style={{ width: 52, height: 36, objectFit: 'cover', borderRadius: 4, display: 'block' }} />
                          ) : (
                            <div style={{ width: 52, height: 36, background: '#1a1a1a', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>📰</div>
                          )}
                        </td>
                        <td className="t-title">
                          <div style={{ maxWidth: 320 }}>{a.title}</div>
                          <div style={{ fontSize: 10, color: '#444', marginTop: 2 }}>{a.id}</div>
                        </td>
                        <td>
                          <span style={{
                            display: 'inline-block', padding: '2px 8px', borderRadius: 4, fontSize: 11,
                            fontWeight: 600, background: color + '22', color
                          }}>{a.category}</span>
                        </td>
                        <td style={{ whiteSpace: 'nowrap', fontSize: 12, color: '#666' }}>
                          {new Date(a.publishedAt).toLocaleDateString('pt-BR')}
                        </td>
                        <td>{a.featured ? '⭐' : ''}</td>
                        <td>
                          <div style={{ display: 'flex', gap: 5 }}>
                            <Link href={`/artigo/${a.slug || a.id}`} target="_blank" className="admin-btn admin-btn-ghost admin-btn-sm">Ver</Link>
                            <Link href={`/admin/artigos/${a.id || a.slug}`} className="admin-btn admin-btn-primary admin-btn-sm">Editar</Link>
                            <button onClick={() => handleDelete(a.id || a.slug, a.title)} disabled={deleting === a.id}
                              className="admin-btn admin-btn-danger admin-btn-sm">
                              {deleting === a.id ? '...' : '🗑'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
            {!loading && sorted.length === 0 && (
              <p style={{ color: '#555', textAlign: 'center', padding: '40px 0' }}>Nenhum artigo encontrado.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
