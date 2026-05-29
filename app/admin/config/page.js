'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const NAV = () => (
  <aside className="admin-sidebar">
    <div className="admin-logo">
      <div className="al-title">Miami Brasileiro</div>
      <div className="al-sub">Painel Admin</div>
    </div>
    <nav className="admin-nav">
      <Link href="/admin/dashboard"><span className="nav-icon">Dashboard</span></Link>
      <Link href="/admin/artigos"><span className="nav-icon">Artigos</span></Link>
      <Link href="/admin/artigos/novo"><span className="nav-icon">Novo Artigo</span></Link>
      <Link href="/admin/config" className="active"><span className="nav-icon">Configuracoes</span></Link>
      <div className="admin-nav-section">Site</div>
      <Link href="/" target="_blank"><span className="nav-icon">Ver Site</span></Link>
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
      .then(function(r) {
        if (r.status === 401) router.push('/admin')
        return r.json()
      })
      .then(function(d) { setConfig(d) })
  }, [])

  function updateField(field, val) {
    setConfig(function(c) { return Object.assign({}, c, { [field]: val }) })
  }

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
    if (res.ok) {
      setMsg({ type: 'success', text: 'Configuracoes salvas! O site sera atualizado em alguns minutos.' })
    } else {
      setMsg({ type: 'error', text: d.error || 'Erro ao salvar' })
    }
    setSaving(false)
  }

  if (!config) {
    return (
      <div className="admin-wrap">
        <NAV />
        <main className="admin-main">
          <div className="admin-content"><p>Carregando...</p></div>
        </main>
      </div>
    )
  }

  return (
    <div className="admin-wrap">
      <NAV />
      <main className="admin-main">
        <div className="admin-topbar">
          <h1>Configuracoes do Site</h1>
          <button onClick={handleSave} disabled={saving} className="admin-btn admin-btn-primary">
            {saving ? 'Salvando...' : 'Salvar Configuracoes'}
          </button>
        </div>
        <div className="admin-content">
          {msg && (
            <div className={msg.type === 'success' ? 'admin-alert alert-success' : 'admin-alert alert-error'}>
              {msg.text}
            </div>
          )}

          <form onSubmit={handleSave}>
            <div className="admin-card">
              <h2>Identidade do Site</h2>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Nome do Site</label>
                  <input type="text" value={config.siteName || ''} onChange={function(e) { updateField('siteName', e.target.value) }} />
                </div>
                <div className="admin-form-group">
                  <label>Tagline</label>
                  <input type="text" value={config.tagline || ''} onChange={function(e) { updateField('tagline', e.target.value) }} />
                </div>
              </div>
              <div className="admin-form-group">
                <label>Descricao (SEO)</label>
                <textarea rows={2} value={config.description || ''} onChange={function(e) { updateField('description', e.target.value) }} />
              </div>
            </div>

            <div className="admin-card">
              <h2>Cores do Tema</h2>
              <p style={{ fontSize: 13, color: '#9CA3AF', marginBottom: 16 }}>
                Alterar as cores requer um novo deploy para entrar em vigor.
              </p>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Cor Principal</label>
                  <div className="color-row">
                    <input type="color" value={config.primaryColor || '#00897B'} onChange={function(e) { updateField('primaryColor', e.target.value) }} />
                    <input type="text" value={config.primaryColor || ''} onChange={function(e) { updateField('primaryColor', e.target.value) }} style={{ fontFamily: 'monospace' }} />
                  </div>
                </div>
                <div className="admin-form-group">
                  <label>Cor de Destaque</label>
                  <div className="color-row">
                    <input type="color" value={config.accentColor || '#F4622A'} onChange={function(e) { updateField('accentColor', e.target.value) }} />
                    <input type="text" value={config.accentColor || ''} onChange={function(e) { updateField('accentColor', e.target.value) }} style={{ fontFamily: 'monospace' }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="admin-card">
              <h2>Redes Sociais</h2>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Facebook</label>
                  <input type="url" value={config.socialFacebook || ''} onChange={function(e) { updateField('socialFacebook', e.target.value) }} placeholder="https://facebook.com/..." />
                </div>
                <div className="admin-form-group">
                  <label>Instagram</label>
                  <input type="url" value={config.socialInstagram || ''} onChange={function(e) { updateField('socialInstagram', e.target.value) }} placeholder="https://instagram.com/..." />
                </div>
              </div>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>YouTube</label>
                  <input type="url" value={config.socialYoutube || ''} onChange={function(e) { updateField('socialYoutube', e.target.value) }} placeholder="https://youtube.com/..." />
                </div>
                <div className="admin-form-group">
                  <label>WhatsApp</label>
                  <input type="url" value={config.socialWhatsapp || ''} onChange={function(e) { updateField('socialWhatsapp', e.target.value) }} placeholder="https://wa.me/..." />
                </div>
              </div>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Email de Contato</label>
                  <input type="email" value={config.contactEmail || ''} onChange={function(e) { updateField('contactEmail', e.target.value) }} />
                </div>
                <div className="admin-form-group">
                  <label>Email de Publicidade</label>
                  <input type="email" value={config.adEmail || ''} onChange={function(e) { updateField('adEmail', e.target.value) }} />
                </div>
              </div>
            </div>

            <div className="admin-card" style={{ background: '#FFF7ED', border: '1px solid #FED7AA' }}>
              <h2 style={{ color: '#C2410C' }}>Variaveis de Ambiente</h2>
              <p style={{ fontSize: 13, color: '#92400E', lineHeight: 1.7 }}>
                Configure estas variaveis no Vercel em Settings / Environment Variables:
              </p>
              <ul style={{ fontSize: 13, color: '#92400E', lineHeight: 2, marginLeft: 20, marginTop: 8 }}>
                <li>ADMIN_PASSWORD - Senha de acesso ao painel</li>
                <li>ANTHROPIC_API_KEY - Chave da API do Claude</li>
                <li>NEWS_API_KEY - Chave da NewsAPI</li>
                <li>GITHUB_TOKEN - Token do GitHub</li>
                <li>GITHUB_REPO - Ex: lemonadetv/miami-brasileiro</li>
              </ul>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
