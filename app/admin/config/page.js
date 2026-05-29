'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const AdminNav = () => (
  <aside className="admin-sidebar">
    <div className="admin-logo"><div className="al-title">Miami Brasileiro</div><div className="al-sub">Painel Admin</div></div>
    <nav className="admin-nav">
      <Link href="/admin/dashboard"><span className="nav-icon">📊</span> Dashboard</Link>
      <Link href="/admin/artigos"><span className="nav-icon">📰</span> Artigos</Link>
      <Link href="/admin/artigos/novo"><span className="nav-icon">✏️</span> Novo Artigo</Link>
      <Link href="/admin/config" className="active"><span className="nav-icon">⚙️</span> Configurações</Link>
      <div className="admin-nav-section">Site</div>
      <Link href="/" target="_blank"><span className="nav-icon">🌐</span> Ver Site</Link>
    </nav>
  </aside>
)

export default function AdminConfig() {
  const [config, setConfig] = useState(null)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState(null)
  const router = useRouter()

  useEffect(() => {
    fetch('/api/admin/config')
      .then(r => { if (r.status === 401) router.push('/admin'); return r.json() })
      .then(d => setConfig(d))
  }, [])

  function set(field, val) { setConfig(c => ({ ...c, [field]: val })) }

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    setMsg(null)
    const res = await fetch('/api/admin/config', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config)
    })
    const d = await res.json()
    setMsg(res.ok
      ? { type: 'success', text: 'Configuracoes salvas! O site sera atualizado em alguns minutos.' }
      : { type: 'error', text: d.error || 'Erro ao salvar' }
    )
    setSaving(false)
  }

  if (!config) return (
    <div className="admin-wrap">
      <AdminNav />
      <main className="admin-main"><div className="admin-content"><p>Carregando...</p></div></main>
    </div>
  )

  return (
    <div className="admin-wrap">
      <AdminNav />
      <main className="admin-main">
        <div className="admin-topbar">
          <h1>Configurações do Site</h1>
          <button onClick={handleSave} disabled={saving} className="admin-btn admin-btn-primary">
            {saving ? 'Salvando...' : 'Salvar Configurações'}
          </button>
        </div>
        <div className="admin-content">
          {msg && <div className={`admin-alert ${msg.type === 'success' ? 'alert-success' : 'alert-error'}`}>{msg.text}</div>}

          <form onSubmit={handleSave}>
            <div className="admin-card">
              <h2>Identidade do Site</h2>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Nome do Site</label>
                  <input type="text" value={config.siteName || ''} onChange={e => set('siteName', e.target.value)} />
                </div>
                <div className="admin-form-group">
                  <label>Tagline</label>
                  <input type="text" value={config.tagline || ''} onChange={e => set('tagline', e.target.value)} />
                </div>
              </div>
              <div className="admin-form-group">
                <label>Descrição (SEO)</label>
                <textarea rows={2} value={config.description || ''} onChange={e => set('description', e.target.value)} />
              </div>
            </div>

            <div className="admin-card">
              <h2>Cores do Tema</h2>
              <p style={{ fontSize: 13, color: '#9CA3AF', marginBottom: 16 }}>
                Alterar as cores requer um novo deploy do site para entrar em vigor.
              </p>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Cor Principal (Verde/Teal)</label>
                  <div className="color-row">
                    <input type="color" value={config.primaryColor || '#00897B'} onChange={e => set('primaryColor', e.target.value)} />
                    <input type="text" value={config.primaryColor || ''} onChange={e => set('primaryColor', e.target.value)} style={{ fontFamily: 'monospace' }} />
                  </div>
                </div>
                <div className="admin-form-group">
                  <label>Cor de Destaque (Laranja)</label>
                  <div className="color-row">
                    <input type="color" value={config.accentColor || '#F4622A'} onChange={e => set('accentColor', e.target.value)} />
                    <input type="text" value={config.accentColor || ''} onChange={e => set('accentColor', e.target.value)} style={{ fontFamily: 'monospace' }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="admin-card">
              <h2>Redes Sociais e Contato</h2>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Facebook</label>
                  <input type="url" value={config.socialFacebook || ''} onChange={e => set('socialFacebook', e.target.value)} placeholder="https://facebook.com/..." />
                </div>
                <div className="admin-form-group">
                  <label>Instagram</label>
                  <input type="url" value={config.socialInstagram || ''} onChange={e => set('socialInstagram', e.target.value)} placeholder="https://instagram.com/..." />
                </div>
              </div>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>YouTube</label>
                  <input type="url" value={config.socialYoutube || ''} onChange={e => set('socialYoutube', e.target.value)} placeholder="https://youtube.com/..." />
                </div>
                <div className="admin-form-group">
                  <label?WhatsApp</label>
                  <input type="url" value={config.socialWhatsapp || ''} onChange={e => set('socialWhatsapp', e.target.value)} placeholder="https://wa.me/..." />
                </div>
              </div>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Email de Contato</label>
                  <input type="email" value={config.contactEmail || ''} onChange={e => set('contactEmail', e.target.value)} />
                </div>
                <div className="admin-form-group">
                  <label>Email de Publicidade</label>
                  <input type="email" value={config.adEmail || ''} onChange={e => set('adEmail', e.target.value)} />
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
