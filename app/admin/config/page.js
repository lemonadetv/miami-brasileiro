'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const NAV = ({ active }) => (
  <aside className="admin-sidebar">
    <div className="admin-logo">
      <div className="al-title">Miami Brasileira</div>
      <div className="al-sub">Painel Admin</div>
    </div>
    <nav className="admin-nav">
      <Link href="/admin/dashboard"><span className="nav-icon">Dashboard</span></Link>
      <Link href="/admin/artigos"><span className="nav-icon">Artigos</span></Link>
      <Link href="/admin/artigos/novo"><span className="nav-icon">Novo Artigo</span></Link>
      <Link href="/admin/analytics"><span className="nav-icon">Analytics</span></Link>
      <Link href="/admin/config" className={active === 'config' ? 'active' : ''}><span className="nav-icon">Configuracoes</span></Link>
      <div className="admin-nav-section">Site</div>
      <Link href="/" target="_blank"><span className="nav-icon">Ver Site</span></Link>
    </nav>
  </aside>
)

export default function AdminConfig() {
  const [config, setConfig] = useState(null)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState(null)
  const [newLink, setNewLink] = useState({ label: '', url: '' })
  const router = useRouter()

  useEffect(function() {
    fetch('/api/admin/config')
      .then(function(r) { if (r.status === 401) router.push('/admin'); return r.json() })
      .then(function(d) { setConfig(d) })
  }, [])

  function upd(field, val) { setConfig(function(c) { return Object.assign({}, c, { [field]: val }) }) }

  function addFooterLink() {
    if (!newLink.label || !newLink.url) return
    const links = (config.footerLinks || []).concat({ label: newLink.label, url: newLink.url })
    setConfig(function(c) { return Object.assign({}, c, { footerLinks: links }) })
    setNewLink({ label: '', url: '' })
  }

  function removeFooterLink(idx) {
    const links = (config.footerLinks || []).filter(function(_, i) { return i !== idx })
    setConfig(function(c) { return Object.assign({}, c, { footerLinks: links }) })
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
    setMsg(res.ok
      ? { type: 'success', text: 'Salvo! O site sera atualizado em alguns minutos apos o novo deploy.' }
      : { type: 'error', text: d.error || 'Erro ao salvar' }
    )
    setSaving(false)
  }

  if (!config) return (
    <div className="admin-wrap">
      <NAV active="config" />
      <main className="admin-main"><div className="admin-content"><p style={{ color: '#9CA3AF' }}>Carregando...</p></div></main>
    </div>
  )

  return (
    <div className="admin-wrap">
      <NAV active="config" />
      <main className="admin-main">
        <div className="admin-topbar">
          <h1>Configuracoes do Site</h1>
          <button onClick={handleSave} disabled={saving} className="admin-btn admin-btn-primary">
            {saving ? 'Salvando...' : 'Salvar Tudo'}
          </button>
        </div>
        <div className="admin-content">
          {msg && (
            <div className={msg.type === 'success' ? 'admin-alert alert-success' : 'admin-alert alert-error'}>
              {msg.text}
            </div>
          )}

          <form onSubmit={handleSave}>

            {/* IDENTIDADE */}
            <div className="admin-card">
              <h2>Identidade do Site</h2>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Nome do Site</label>
                  <input type="text" value={config.siteName || ''} onChange={function(e) { upd('siteName', e.target.value) }} />
                </div>
                <div className="admin-form-group">
                  <label>Tagline</label>
                  <input type="text" value={config.tagline || ''} onChange={function(e) { upd('tagline', e.target.value) }} />
                </div>
              </div>
              <div className="admin-form-group">
                <label>Descricao (SEO)</label>
                <textarea rows={2} value={config.description || ''} onChange={function(e) { upd('description', e.target.value) }} />
              </div>
              <div className="admin-form-group">
                <label>Texto do Rodape (sobre o portal)</label>
                <textarea rows={2} value={config.footerAbout || ''} onChange={function(e) { upd('footerAbout', e.target.value) }} />
              </div>
            </div>

            {/* REDES SOCIAIS */}
            <div className="admin-card">
              <h2>Redes Sociais</h2>
              <p style={{ fontSize: 13, color: '#9CA3AF', marginBottom: 16 }}>
                Insira a URL completa de cada perfil. Deixe em branco para nao mostrar no site.
              </p>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Facebook</label>
                  <input type="url" value={config.socialFacebook || ''} onChange={function(e) { upd('socialFacebook', e.target.value) }} placeholder="https://facebook.com/suapagina" />
                </div>
                <div className="admin-form-group">
                  <label>Instagram</label>
                  <input type="url" value={config.socialInstagram || ''} onChange={function(e) { upd('socialInstagram', e.target.value) }} placeholder="https://instagram.com/suapagina" />
                </div>
              </div>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>YouTube</label>
                  <input type="url" value={config.socialYoutube || ''} onChange={function(e) { upd('socialYoutube', e.target.value) }} placeholder="https://youtube.com/@suacanal" />
                </div>
                <div className="admin-form-group">
                  <label>WhatsApp (link wa.me)</label>
                  <input type="url" value={config.socialWhatsapp || ''} onChange={function(e) { upd('socialWhatsapp', e.target.value) }} placeholder="https://wa.me/13050000000" />
                </div>
              </div>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>X / Twitter</label>
                  <input type="url" value={config.socialTwitter || ''} onChange={function(e) { upd('socialTwitter', e.target.value) }} placeholder="https://x.com/suapagina" />
                </div>
                <div className="admin-form-group">
                  <label>TikTok</label>
                  <input type="url" value={config.socialTiktok || ''} onChange={function(e) { upd('socialTiktok', e.target.value) }} placeholder="https://tiktok.com/@suapagina" />
                </div>
              </div>
            </div>

            {/* EMAILS */}
            <div className="admin-card">
              <h2>Email de Contato</h2>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Email de Contato (aparece na pagina de contato)</label>
                  <input type="email" value={config.contactEmail || ''} onChange={function(e) { upd('contactEmail', e.target.value) }} />
                </div>
                <div className="admin-form-group">
                  <label>Email de Publicidade</label>
                  <input type="email" value={config.adEmail || ''} onChange={function(e) { upd('adEmail', e.target.value) }} />
                </div>
              </div>
            </div>

            {/* LINKS DO RODAPE */}
            <div className="admin-card">
              <h2>Links do Rodape</h2>
              <p style={{ fontSize: 13, color: '#9CA3AF', marginBottom: 16 }}>
                Links uteis que aparecem no rodape do site (ex: Consulado, USCIS, etc.)
              </p>

              {/* Existing links */}
              <div style={{ marginBottom: 16 }}>
                {(config.footerLinks || []).map(function(link, idx) {
                  return (
                    <div key={idx} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8, padding: '10px 12px', background: '#F9FAFB', borderRadius: 6 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#1F2937' }}>{link.label}</div>
                        <div style={{ fontSize: 12, color: '#9CA3AF' }}>{link.url}</div>
                      </div>
                      <button type="button" onClick={function() { removeFooterLink(idx) }} className="admin-btn admin-btn-danger admin-btn-sm">
                        Remover
                      </button>
                    </div>
                  )
                })}
                {(!config.footerLinks || config.footerLinks.length === 0) && (
                  <p style={{ color: '#9CA3AF', fontSize: 13 }}>Nenhum link adicionado ainda.</p>
                )}
              </div>

              {/* Add new link */}
              <div style={{ background: '#F0FDF4', padding: 16, borderRadius: 8, border: '1px solid #BBF7D0' }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#15803D', marginBottom: 12 }}>Adicionar novo link:</p>
                <div className="admin-form-row">
                  <div className="admin-form-group" style={{ marginBottom: 0 }}>
                    <label>Nome do link</label>
                    <input type="text" value={newLink.label} onChange={function(e) { setNewLink(function(l) { return Object.assign({}, l, { label: e.target.value }) }) }} placeholder="Ex: Consulado do Brasil" />
                  </div>
                  <div className="admin-form-group" style={{ marginBottom: 0 }}>
                    <label>URL</label>
                    <input type="url" value={newLink.url} onChange={function(e) { setNewLink(function(l) { return Object.assign({}, l, { url: e.target.value }) }) }} placeholder="https://..." />
                  </div>
                </div>
                <button type="button" onClick={addFooterLink} className="admin-btn admin-btn-primary" style={{ marginTop: 12 }}>
                  + Adicionar Link
                </button>
              </div>
            </div>

            {/* CORES */}
            <div className="admin-card">
              <h2>Cores do Tema</h2>
              <p style={{ fontSize: 13, color: '#9CA3AF', marginBottom: 16 }}>
                Alterar cores requer novo deploy para entrar em vigor.
              </p>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Cor Principal</label>
                  <div className="color-row">
                    <input type="color" value={config.primaryColor || '#00897B'} onChange={function(e) { upd('primaryColor', e.target.value) }} />
                    <input type="text" value={config.primaryColor || ''} onChange={function(e) { upd('primaryColor', e.target.value) }} style={{ fontFamily: 'monospace' }} />
                  </div>
                </div>
                <div className="admin-form-group">
                  <label>Cor de Destaque</label>
                  <div className="color-row">
                    <input type="color" value={config.accentColor || '#F4622A'} onChange={function(e) { upd('accentColor', e.target.value) }} />
                    <input type="text" value={config.accentColor || ''} onChange={function(e) { upd('accentColor', e.target.value) }} style={{ fontFamily: 'monospace' }} />
                  </div>
                </div>
              </div>
            </div>

            <button type="submit" disabled={saving} className="admin-btn admin-btn-primary" style={{ padding: '14px 32px', fontSize: 15, width: '100%', justifyContent: 'center' }}>
              {saving ? 'Salvando...' : 'Salvar Todas as Configuracoes'}
            </button>

          </form>
        </div>
      </main>
    </div>
  )
}
