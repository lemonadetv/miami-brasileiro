'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const AdminNav = ({ active }) => (
  <aside className="admin-sidebar">
    <div className="admin-logo"><div className="al-title">Miami Brasileiro</div><div className="al-sub">Painel Admin</div></div>
    <nav className="admin-nav">
      <Link href="/admin/dashboard"><span className="nav-icon">📊</span> Dashboard</Link>
      <Link href="/admin/artigos"><span className="nav-icon">📰</span> Artigos</Link>
      <Link href="/admin/artigos/novo" className={active==='novo'?'active':''}><span className="nav-icon">✏️</span> Novo Artigo</Link>
      <Link href="/admin/config"><span className="nav-icon">⚙️</span> Configurações</Link>
      <div className="admin-nav-section">Site</div>
      <Link href="/" target="_blank"><span className="nav-icon">🌐</span> Ver Site</Link>
    </nav>
  </aside>
)

const CATS = ['Comunidade', 'Imigração', 'Negócios', 'Saúde', 'Esportes']

export default function ArticleForm({ initial, isNew }) {
  const router = useRouter()
  const [form, setForm] = useState(initial || {
    title: '', excerpt: '', content: '', category: 'Comunidade',
    image: '', source: 'Redacao', sourceUrl: '#', featured: false
  })
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState(null)

  function set(field, val) { setForm(f => ({ ...f, [field]: val })) }

  async function handleSave(e) {
    e.preventDefault()
    if (!form.title.trim()) { setMsg({ type: 'error', text: 'Titulo e obrigatorio' }); return }
    setSaving(true)
    setMsg(null)
    const url = isNew ? '/api/admin/artigos' : `/api/admin/artigos/${initial.id}`
    const method = isNew ? 'POST' : 'PUT'
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    const data = await res.json()
    if (res.ok) {
      setMsg({ type: 'success', text: isNew ? 'Artigo criado! O site sera atualizado em alguns minutos.' : 'Artigo salvo! O site sera atualizado em alguns minutos.' })
      if (isNew && data.id) setTimeout(() => router.push(`/admin/artigos/${data.id}`), 1500)
    } else {
      setMsg({ type: 'error', text: data.error || 'Erro ao salvar' })
    }
    setSaving(false)
  }

  return (
    <div className="admin-wrap">
      <AdminNav active={isNew ? 'novo' : ''} />
      <main className="admin-main">
        <div className="admin-topbar">
          <h1>{isNew ? 'Novo Artigo' : 'Editar Artigo'}</h1>
          <div style={{ display: 'flex', gap: 10 }}>
            <Link href="/admin/artigos" className="admin-btn admin-btn-ghost">Cancelar</Link>
            <button onClick={handleSave} disabled={saving} className="admin-btn admin-btn-primary">
              {saving ? 'Salvando...' : 'Salvar Artigo'}
            </button>
          </div>
        </div>
        <div className="admin-content">
          {msg && <div className={`admin-alert ${msg.type === 'success' ? 'alert-success' : 'alert-error'}`}>{msg.text}</div>}
          <form onSubmit={handleSave}>
            <div className="admin-card">
              <h2>Informações Principais</h2>
              <div className="admin-form-group">
                <label>Título *</label>
                <input type="text" value={form.title} onChange={e => set('title', e.target.value)} placeholder="Digite o título da matéria" required />
              </div>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Categoria</label>
                  <select value={form.category} onChange={e => set('category', e.target.value)}>
                    {CATS.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="admin-form-group">
                  <label>Fonte / Jornal</label>
                  <input type="text" value={form.source} onChange={e => set('source', e.target.value)} placeholder="Nome da fonte" />
                </div>
              </div>
              <div className="admin-form-group">
                <label>Resumo (aparece na listagem)</label>
                <textarea value={form.excerpt} onChange={e => set('excerpt', e.target.value)} placeholder="2 ou 3 frases resumindo a materia..." rows={3} />
              </div>
            </div>

            <div className="admin-card">
              <h2>Conteúdo da Matéria</h2>
              <p style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 12 }}>
                Separe paragrafos com uma linha em branco. Use **Titulo** para criar subtitulos em negrito.
              </p>
              <div className="admin-form-group">
                <textarea
                  className="tall"
                  value={form.content}
                  onChange={e => set('content', e.target.value)}
                  placeholder="Digite o conteudo completo da materia aqui..."
                />
              </div>
            </div>

            <div className="admin-card">
              <h2>Imagem e Links</h2>
              <div className="admin-form-group">
                <label>URL da Imagem de Capa</label>
                <input type="url" value={form.image} onChange={e => set('image', e.target.value)} placeholder="https://exemplo.com/imagem.jpg" />
                {form.image && <img src={form.image} alt="" style={{ marginTop: 10, maxHeight: 160, borderRadius: 6, objectFit: 'cover' }} />}
              </div>
              <div className="admin-form-group">
                <label>URL da Fonte Original</label>
                <input type="url" value={form.sourceUrl} onChange={e => set('sourceUrl', e.target.value)} placeholder="https://..." />
              </div>
              <div className="admin-form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                  <input type="checkbox" checked={form.featured} onChange={e => set('featured', e.target.checked)} style={{ width: 18, height: 18 }} />
                  <span>Marcar como artigo em DESTAQUE (aparece no hero da homepage)</span>
                </label>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
