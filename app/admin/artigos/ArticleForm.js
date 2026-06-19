'use client'
import { useState, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const CATS = ['Comunidade', 'Imigração', 'Negócios', 'Saúde', 'Esportes', 'Cultura e Lazer']

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
        <Link href="/admin/bot" className={active==='bot'?'active':''}><span className="nav-icon">🤖</span> Bot / Automação</Link>
        <Link href="/admin/facebook" className={active==='facebook'?'active':''}><span className="nav-icon">📣</span> Facebook</Link>
        <Link href="/admin/analytics" className={active==='analytics'?'active':''}><span className="nav-icon">📈</span> Analytics</Link>
        <Link href="/admin/config" className={active==='config'?'active':''}><span className="nav-icon">⚙️</span> Configurações</Link>
        <div className="admin-nav-section">Site</div>
        <Link href="/" target="_blank"><span className="nav-icon">🌐</span> Ver Site</Link>
      </nav>
      <div className="admin-footer">
        <a href="/admin" style={{ color: 'rgba(255,255,255,.35)', fontSize: 11, display: 'block', padding: '8px 0' }}>Sair →</a>
      </div>
    </aside>
  )
}

// Minimal markdown preview renderer
function MarkdownPreview({ content, catColor }) {
  if (!content) return <p style={{ color: '#555', textAlign: 'center', marginTop: 40 }}>Comece a digitar para ver o preview...</p>

  const lines = content.split('\n')
  const elements = []
  let i = 0
  let key = 0

  function toHtml(text) {
    if (!text) return ''
    return text
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      .replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, '<a href="$2" style="color:#F4622A;text-decoration:underline">$1</a>')
  }

  while (i < lines.length) {
    const line = lines[i]
    if (!line.trim()) { i++; continue }

    if (line.startsWith('## ')) {
      elements.push(<h2 key={key++} style={{ fontSize: 17, fontWeight: 800, color: '#fff', margin: '18px 0 8px', borderBottom: '2px solid ' + (catColor||'#F4622A'), paddingBottom: 6 }}>{line.slice(3)}</h2>)
      i++; continue
    }
    if (line.startsWith('### ')) {
      elements.push(<h3 key={key++} style={{ fontSize: 14, fontWeight: 700, color: '#ddd', margin: '14px 0 6px' }}>{line.slice(4)}</h3>)
      i++; continue
    }
    if (line === '---') {
      elements.push(<hr key={key++} style={{ border: 'none', borderTop: '1px solid #333', margin: '16px 0' }} />)
      i++; continue
    }
    if (line.startsWith('> ')) {
      elements.push(<blockquote key={key++} style={{ borderLeft: '3px solid ' + (catColor||'#F4622A'), paddingLeft: 12, color: '#aaa', fontStyle: 'italic', margin: '10px 0' }} dangerouslySetInnerHTML={{ __html: toHtml(line.slice(2)) }} />)
      i++; continue
    }
    // Collect bullet list
    if (line.startsWith('- ') || line.startsWith('* ')) {
      const items = []
      while (i < lines.length && (lines[i].startsWith('- ') || lines[i].startsWith('* '))) {
        items.push(lines[i].replace(/^[-*]\s*/, ''))
        i++
      }
      elements.push(
        <ul key={key++} style={{ paddingLeft: 18, margin: '8px 0', color: '#ccc', fontSize: 13, lineHeight: 1.7 }}>
          {items.map((item, j) => <li key={j} dangerouslySetInnerHTML={{ __html: toHtml(item) }} />)}
        </ul>
      )
      continue
    }
    // Numbered list
    if (/^\d+\./.test(line)) {
      const items = []
      while (i < lines.length && /^\d+\./.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s*/, ''))
        i++
      }
      elements.push(
        <ol key={key++} style={{ paddingLeft: 18, margin: '8px 0', color: '#ccc', fontSize: 13, lineHeight: 1.7 }}>
          {items.map((item, j) => <li key={j} dangerouslySetInnerHTML={{ __html: toHtml(item) }} />)}
        </ol>
      )
      continue
    }
    // Table
    if (line.includes('|')) {
      const rows = []
      while (i < lines.length && lines[i].includes('|')) {
        if (!lines[i].match(/^\|[-\s|]+\|$/)) rows.push(lines[i])
        i++
      }
      elements.push(
        <table key={key++} style={{ width: '100%', borderCollapse: 'collapse', margin: '10px 0', fontSize: 12 }}>
          {rows.map((row, ri) => {
            const cells = row.split('|').filter(c => c.trim())
            const Tag = ri === 0 ? 'th' : 'td'
            return <tr key={ri}>{cells.map((cell, ci) => <Tag key={ci} style={{ padding: '6px 8px', border: '1px solid #333', background: ri===0?'#222':'transparent', color: ri===0?'#fff':'#ccc' }} dangerouslySetInnerHTML={{ __html: toHtml(cell.trim()) }} />)}</tr>
          })}
        </table>
      )
      continue
    }

    elements.push(<p key={key++} style={{ fontSize: 13, color: '#bbb', lineHeight: 1.8, margin: '6px 0' }} dangerouslySetInnerHTML={{ __html: toHtml(line) }} />)
    i++
  }

  return <div>{elements}</div>
}

export default function ArticleForm({ initial, isNew }) {
  const router = useRouter()
  const [form, setForm] = useState(initial || {
    title: '', excerpt: '', content: '', category: 'Comunidade',
    image: '', source: 'Redação', sourceUrl: '#', featured: false
  })
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState(null)
  const [preview, setPreview] = useState(false)
  const [imgError, setImgError] = useState(false)
  const contentRef = useRef(null)

  const catColor = {
    'Imigração': '#F4622A', 'Comunidade': '#00897B', 'Saúde': '#15803D',
    'Negócios': '#7C3AED', 'Esportes': '#DC2626', 'Cultura e Lazer': '#D97706'
  }[form.category] || '#F4622A'

  function set(field, val) { setForm(f => ({ ...f, [field]: val })) }

  // Insert markdown helper at cursor
  function insertMd(prefix, suffix = '') {
    const ta = contentRef.current
    if (!ta) return
    const start = ta.selectionStart
    const end = ta.selectionEnd
    const selected = form.content.substring(start, end)
    const newText = form.content.substring(0, start) + prefix + selected + suffix + form.content.substring(end)
    set('content', newText)
    setTimeout(() => {
      ta.focus()
      ta.setSelectionRange(start + prefix.length, end + prefix.length)
    }, 0)
  }

  async function handleSave(e) {
    e.preventDefault()
    if (!form.title.trim()) { setMsg({ type: 'error', text: 'Título é obrigatório' }); return }
    setSaving(true)
    setMsg(null)
    const url = isNew ? '/api/admin/artigos' : `/api/admin/artigos/${initial.id || initial.slug}`
    const method = isNew ? 'POST' : 'PUT'
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    const data = await res.json()
    if (res.ok) {
      setMsg({ type: 'success', text: isNew ? '✓ Artigo criado! O site será atualizado em alguns minutos.' : '✓ Artigo salvo! O site será atualizado em alguns minutos.' })
      if (isNew && data.id) setTimeout(() => router.push(`/admin/artigos/${data.id}`), 1800)
    } else {
      setMsg({ type: 'error', text: data.error || 'Erro ao salvar. Verifique a variável GITHUB_TOKEN no Vercel.' })
    }
    setSaving(false)
  }

  const wordCount = form.content.trim() ? form.content.trim().split(/\s+/).length : 0
  const charCount = form.content.length

  return (
    <div className="admin-wrap">
      <AdminNav active={isNew ? 'novo' : 'artigos'} />
      <main className="admin-main">
        {/* Top bar */}
        <div className="admin-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Link href="/admin/artigos" className="admin-btn admin-btn-ghost" style={{ padding: '6px 10px' }}>← Voltar</Link>
            <h1>{isNew ? 'Novo Artigo' : 'Editar Artigo'}</h1>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <span style={{ fontSize: 11, color: '#555' }}>{wordCount} palavras · {charCount} chars</span>
            {!isNew && (
              <Link href={`/artigo/${initial?.slug || initial?.id}`} target="_blank" className="admin-btn admin-btn-ghost">
                👁 Ver Artigo
              </Link>
            )}
            <button onClick={() => setPreview(p => !p)} className="admin-btn admin-btn-ghost">
              {preview ? '✏️ Editor' : '👁 Preview'}
            </button>
            <button onClick={handleSave} disabled={saving} className="admin-btn admin-btn-primary" style={{ padding: '8px 20px' }}>
              {saving ? '⏳ Salvando...' : '💾 Salvar'}
            </button>
          </div>
        </div>

        {msg && (
          <div style={{
            margin: '0 24px', padding: '12px 16px', borderRadius: 6, fontSize: 13, fontWeight: 600,
            background: msg.type === 'success' ? '#0d2e1a' : '#2e0d0d',
            color: msg.type === 'success' ? '#4ade80' : '#f87171',
            border: `1px solid ${msg.type === 'success' ? '#166534' : '#991b1b'}`,
          }}>
            {msg.text}
          </div>
        )}

        <div className="admin-content" style={{ display: 'grid', gridTemplateColumns: preview ? '1fr 1fr' : '340px 1fr', gap: 16, alignItems: 'start' }}>
          
          {/* Left column: meta fields */}
          <div>
            {/* Main info */}
            <div className="admin-card">
              <h2>📝 Informações</h2>
              <div className="admin-form-group">
                <label>Título *</label>
                <input type="text" value={form.title} onChange={e => set('title', e.target.value)}
                  placeholder="Título da matéria" required style={{ fontWeight: 600 }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="admin-form-group">
                  <label>Categoria</label>
                  <select value={form.category} onChange={e => set('category', e.target.value)}
                    style={{ borderLeft: `3px solid ${catColor}` }}>
                    {CATS.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="admin-form-group">
                  <label>Fonte</label>
                  <input type="text" value={form.source} onChange={e => set('source', e.target.value)} placeholder="Nome da fonte" />
                </div>
              </div>
              <div className="admin-form-group">
                <label>Resumo (listagem)</label>
                <textarea value={form.excerpt} onChange={e => set('excerpt', e.target.value)}
                  placeholder="2-3 frases que aparecem na listagem..." rows={3} />
              </div>
              <div className="admin-form-group">
                <label>URL da fonte original</label>
                <input type="url" value={form.sourceUrl} onChange={e => set('sourceUrl', e.target.value)} placeholder="https://..." />
              </div>
            </div>

            {/* Image */}
            <div className="admin-card">
              <h2>🖼 Imagem de Capa</h2>
              <div className="admin-form-group">
                <input type="url" value={form.image} onChange={e => { set('image', e.target.value); setImgError(false) }}
                  placeholder="https://exemplo.com/foto.jpg" />
              </div>
              {form.image && !imgError ? (
                <div style={{ position: 'relative', borderRadius: 6, overflow: 'hidden', aspectRatio: '16/9', background: '#111' }}>
                  <img src={form.image} alt="" onError={() => setImgError(true)}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                </div>
              ) : imgError ? (
                <div style={{ padding: '20px', background: '#1a1a1a', borderRadius: 6, textAlign: 'center', color: '#f87171', fontSize: 12 }}>
                  ⚠️ Imagem não carregou. Verifique a URL.
                </div>
              ) : (
                <div style={{ padding: '20px', background: '#1a1a1a', borderRadius: 6, textAlign: 'center', color: '#444', fontSize: 12 }}>
                  Nenhuma imagem selecionada
                </div>
              )}
              <p style={{ fontSize: 11, color: '#555', marginTop: 8 }}>
                💡 Dica: use imagens de wlrn.org, miamiherald.com ou qualquer newsroom
              </p>
            </div>

            {/* Destaque */}
            <div className="admin-card">
              <h2>⭐ Configurações</h2>
              <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', padding: '10px 14px', background: form.featured ? '#1a2e1a' : '#1a1a1a', borderRadius: 6, border: '1px solid ' + (form.featured ? '#166534' : '#2a2a2a'), transition: 'all .2s' }}>
                <div style={{
                  width: 40, height: 22, borderRadius: 11, background: form.featured ? '#22c55e' : '#333',
                  transition: 'background .2s', position: 'relative', flexShrink: 0
                }}>
                  <div style={{
                    position: 'absolute', top: 3, left: form.featured ? 20 : 3,
                    width: 16, height: 16, borderRadius: '50%', background: '#fff', transition: 'left .2s'
                  }} />
                </div>
                <input type="checkbox" checked={form.featured} onChange={e => set('featured', e.target.checked)} style={{ display: 'none' }} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>Artigo em Destaque</div>
                  <div style={{ fontSize: 11, color: '#666' }}>Aparece no hero da homepage</div>
                </div>
              </label>
            </div>

            {/* Quick formatting help */}
            <div className="admin-card">
              <h2>📖 Guia Markdown</h2>
              <div style={{ fontSize: 11, color: '#666', lineHeight: 2, fontFamily: 'monospace' }}>
                <div><span style={{ color: '#888' }}>## Título Seção</span></div>
                <div><span style={{ color: '#888' }}>### Sub-título</span></div>
                <div><span style={{ color: '#888' }}>**negrito**  *itálico*</span></div>
                <div><span style={{ color: '#888' }}>- item de lista</span></div>
                <div><span style={{ color: '#888' }}>1. lista numerada</span></div>
                <div><span style={{ color: '#888' }}>&gt; citação</span></div>
                <div><span style={{ color: '#888' }}>---  (linha divisória)</span></div>
                <div><span style={{ color: '#888' }}>Col1|Col2 (tabela)</span></div>
              </div>
            </div>
          </div>

          {/* Right column: editor or preview */}
          {preview ? (
            /* Preview mode */
            <div className="admin-card" style={{ minHeight: 600 }}>
              <h2 style={{ marginBottom: 20 }}>
                👁 Preview — <span style={{ color: catColor, fontWeight: 900 }}>{form.category}</span>
              </h2>
              {form.image && <img src={form.image} alt="" style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', borderRadius: 8, marginBottom: 20 }} />}
              {form.title && <h1 style={{ fontSize: 22, fontWeight: 900, color: '#fff', lineHeight: 1.3, marginBottom: 12 }}>{form.title}</h1>}
              {form.excerpt && <p style={{ fontSize: 14, color: '#aaa', lineHeight: 1.6, marginBottom: 20, fontStyle: 'italic' }}>{form.excerpt}</p>}
              <MarkdownPreview content={form.content} catColor={catColor} />
            </div>
          ) : (
            /* Editor mode */
            <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
              {/* Toolbar */}
              <div style={{ display: 'flex', gap: 2, padding: '10px 12px', borderBottom: '1px solid #222', flexWrap: 'wrap', background: '#111' }}>
                {[
                  ['H2', () => insertMd('\n## ', '')],
                  ['H3', () => insertMd('\n### ', '')],
                  ['B', () => insertMd('**', '**')],
                  ['I', () => insertMd('*', '*')],
                  ['• Lista', () => insertMd('\n- ')],
                  ['1. Lista', () => insertMd('\n1. ')],
                  ['> Citar', () => insertMd('\n> ')],
                  ['---', () => insertMd('\n---\n')],
                  ['Link', () => insertMd('[texto](', ')')],
                ].map(([label, fn]) => (
                  <button key={label} onClick={fn} type="button"
                    style={{ padding: '4px 10px', background: '#1e1e1e', border: '1px solid #2a2a2a', borderRadius: 4, color: '#aaa', fontSize: 11, cursor: 'pointer', fontWeight: 600, fontFamily: 'monospace' }}>
                    {label}
                  </button>
                ))}
                <div style={{ flex: 1 }} />
                <button onClick={() => setPreview(true)} type="button"
                  style={{ padding: '4px 10px', background: '#1e2e1e', border: '1px solid #2a4a2a', borderRadius: 4, color: '#4ade80', fontSize: 11, cursor: 'pointer' }}>
                  👁 Ver Preview
                </button>
              </div>
              <textarea
                ref={contentRef}
                value={form.content}
                onChange={e => set('content', e.target.value)}
                placeholder={`Escreva o conteúdo da matéria aqui...\n\n## Título da Seção\n\nDigite o texto do parágrafo.\n\n### Sub-título\n\n- Item 1\n- Item 2`}
                style={{
                  width: '100%', minHeight: 640, border: 'none', background: '#161616',
                  color: '#e5e7eb', fontSize: 13, lineHeight: 1.8, padding: '20px',
                  resize: 'vertical', fontFamily: '"Courier New", monospace', outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          )}
        </div>

        <div style={{ padding: '0 24px 24px', display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <Link href="/admin/artigos" className="admin-btn admin-btn-ghost">Cancelar</Link>
          <button onClick={handleSave} disabled={saving} className="admin-btn admin-btn-primary" style={{ padding: '10px 28px', fontSize: 14 }}>
            {saving ? '⏳ Salvando no GitHub...' : '💾 Salvar Artigo'}
          </button>
        </div>
      </main>
    </div>
  )
}
