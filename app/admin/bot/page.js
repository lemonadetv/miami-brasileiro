'use client'
import { useState } from 'react'
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
        <Link href="/admin/bot" className={active==='bot'?'active':''}><span className="nav-icon">🤖</span> Bot / Automação</Link>
        <Link href="/admin/facebook" className={active==='facebook'?'active':''}><span className="nav-icon">📣</span> Facebook</Link>
        <Link href="/admin/analytics"><span className="nav-icon">📈</span> Analytics</Link>
        <Link href="/admin/config"><span className="nav-icon">⚙️</span> Configurações</Link>
        <div className="admin-nav-section">Site</div>
        <Link href="/" target="_blank"><span className="nav-icon">🌐</span> Ver Site</Link>
      </nav>
    </aside>
  )
}

export default function BotPage() {
  const [running, setRunning] = useState(false)
  const [log, setLog] = useState(null)

  async function run(type) {
    setRunning(type)
    setLog(null)
    try {
      const url = type === 'bot' ? '/api/buscar-noticias' : '/api/facebook-batch'
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'x-cron-secret': 'miami2026', 'Content-Type': 'application/json' }
      })
      const data = await res.json()
      setLog({ ok: res.ok, data, type })
    } catch (e) {
      setLog({ ok: false, data: { error: e.message }, type })
    }
    setRunning(false)
  }

  return (
    <div className="admin-wrap">
      <AdminNav active="bot" />
      <main className="admin-main">
        <div className="admin-topbar">
          <h1>🤖 Bot / Automação</h1>
          <Link href="/admin/dashboard" className="admin-btn admin-btn-ghost">← Dashboard</Link>
        </div>
        <div className="admin-content" style={{ maxWidth: 700 }}>

          {log && (
            <div style={{
              marginBottom: 20, padding: '14px 18px', borderRadius: 8, fontSize: 13,
              background: log.ok ? '#0d2e1a' : '#2e0d0d',
              color: log.ok ? '#4ade80' : '#f87171',
              border: '1px solid ' + (log.ok ? '#166534' : '#991b1b'),
              whiteSpace: 'pre-wrap', fontFamily: 'monospace'
            }}>
              {JSON.stringify(log.data, null, 2)}
            </div>
          )}

          <div className="admin-card">
            <h2>📡 Bot de Notícias</h2>
            <p style={{ fontSize: 13, color: '#888', lineHeight: 1.7, marginBottom: 20 }}>
              O bot busca automaticamente notícias sobre brasileiros em Miami nas principais fontes: 
              WLRN, Miami Herald, Miami New Times, Goal.com e InfoNegocios Miami.
              Elimina duplicatas e adiciona apenas artigos novos ao site.
            </p>
            <div style={{ background: '#111', borderRadius: 6, padding: '14px 16px', marginBottom: 20, fontSize: 12, color: '#666', lineHeight: 1.8 }}>
              <div>⏰ <strong style={{ color: '#888' }}>Agendamento automático:</strong> 2x por dia (8h e 20h UTC)</div>
              <div>🔑 <strong style={{ color: '#888' }}>Secret:</strong> Configurado via env <code style={{ color: '#a78bfa' }}>CRON_SECRET</code></div>
              <div>📂 <strong style={{ color: '#888' }}>Destino:</strong> data/articles.json → GitHub → Vercel auto-deploy</div>
            </div>
            <button onClick={() => run('bot')} disabled={!!running} className="admin-btn admin-btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '13px', fontSize: 15, marginBottom: 10 }}>
              {running === 'bot' ? '⏳ Buscando notícias...' : '▶ Executar Bot Agora'}
            </button>
            <p style={{ fontSize: 11, color: '#444', textAlign: 'center' }}>
              O bot pode levar 30–60 segundos para buscar e processar notícias.
            </p>
          </div>

          <div className="admin-card">
            <h2>📣 Bot do Facebook</h2>
            <p style={{ fontSize: 13, color: '#888', lineHeight: 1.7, marginBottom: 20 }}>
              Publica todos os artigos recentes na página do Facebook automaticamente.
              Requer que <code style={{ color: '#a78bfa' }}>FACEBOOK_PAGE_ID</code> e <code style={{ color: '#a78bfa' }}>FACEBOOK_ACCESS_TOKEN</code> estejam configurados no Vercel.
            </p>
            <button onClick={() => run('facebook')} disabled={!!running} className="admin-btn admin-btn-ghost"
              style={{ width: '100%', justifyContent: 'center', padding: '13px', fontSize: 15, marginBottom: 10, background: '#1a1f2e', color: '#60a5fa' }}>
              {running === 'facebook' ? '⏳ Postando no Facebook...' : '📣 Postar Todos no Facebook'}
            </button>
            <p style={{ fontSize: 11, color: '#444', textAlign: 'center' }}>
              Para postar artigos individuais, use a seção <Link href="/admin/facebook" style={{ color: '#F4622A' }}>Facebook</Link>.
            </p>
          </div>

          <div className="admin-card">
            <h2>⚙️ Configurações de Ambiente</h2>
            <p style={{ fontSize: 13, color: '#666', marginBottom: 16 }}>
              Configure estas variáveis no painel do Vercel (Settings → Environment Variables):
            </p>
            {[
              { key: 'ADMIN_PASSWORD', desc: 'Senha do painel admin', required: true },
              { key: 'GITHUB_TOKEN', desc: 'PAT com permissão repo (para salvar artigos)', required: true },
              { key: 'GITHUB_REPO', desc: 'Repositório no formato user/repo', required: true },
              { key: 'CRON_SECRET', desc: 'Senha secreta do bot agendado', required: false },
              { key: 'FACEBOOK_PAGE_ID', desc: 'ID da página no Facebook', required: false },
              { key: 'FACEBOOK_ACCESS_TOKEN', desc: 'Token de acesso à API do Facebook', required: false },
              { key: 'NEWS_API_KEY', desc: 'API key do NewsAPI.org (bot de notícias)', required: false },
            ].map(v => (
              <div key={v.key} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid #1a1a1a' }}>
                <code style={{ fontSize: 12, color: '#a78bfa', background: '#1a1a2e', padding: '3px 8px', borderRadius: 4, minWidth: 200 }}>{v.key}</code>
                <span style={{ fontSize: 12, color: '#666', flex: 1 }}>{v.desc}</span>
                {v.required
                  ? <span style={{ fontSize: 10, color: '#f87171', background: '#2e0d0d', padding: '2px 6px', borderRadius: 4 }}>obrigatório</span>
                  : <span style={{ fontSize: 10, color: '#888', background: '#1a1a1a', padding: '2px 6px', borderRadius: 4 }}>opcional</span>
                }
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
