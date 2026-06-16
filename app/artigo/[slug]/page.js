// app/artigo/[slug]/page.js
import { notFound } from 'next/navigation'
import Footer from '../../../components/Footer'
import Sidebar from '../../../components/Sidebar'
import ShareButtons from '../../../components/ShareButtons'
import Link from 'next/link'
import { getAllArticles, getArticleBySlug, formatDate, readingTime } from '../../../lib/articles'

// Converte markdown inline em HTML: **negrito**, *italico*, [link](url)
function toHtml(text) {
  if (!text) return ''
  return text
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer" style="color:#4DB6AC;text-decoration:underline;font-weight:600">$1</a>')
}

function ArticleContent({ content }) {
  if (!content) return null
  const blocks = content.split(/\n\n+/).filter(function(b) { return b.trim().length > 0 })

  return (
    <div className="article-content" style={{ fontFamily: 'Georgia, serif' }}>
      {blocks.map(function(block, i) {
        const b = block.trim()

        // Imagem inline: ![alt](url)
        const imgMatch = b.match(/^!\[([^\]]*)\]\((https?:\/\/[^)]+)\)$/)
        if (imgMatch) {
          return (
            <figure key={i} style={{ margin: '32px 0', borderRadius: 10, overflow: 'hidden' }}>
              <img src={imgMatch[2]} alt={imgMatch[1]} style={{ width: '100%', maxHeight: 420, objectFit: 'cover', display: 'block' }} />
              {imgMatch[1] && <figcaption style={{ fontSize: 13, color: '#9CA3AF', padding: '8px 12px', textAlign: 'center', fontStyle: 'italic', fontFamily: 'sans-serif' }}>{imgMatch[1]}</figcaption>}
            </figure>
          )
        }

        // H2: ## Titulo
        if (b.startsWith('## ')) {
          return <h2 key={i} style={{ fontFamily: 'Georgia, serif', fontSize: 24, fontWeight: 700, margin: '40px 0 16px', color: '#F3F4F6', borderBottom: '3px solid #F4622A', paddingBottom: 8 }}>{b.slice(3)}</h2>
        }

        // H3: ### Titulo
        if (b.startsWith('### ')) {
          return <h3 key={i} style={{ fontSize: 19, fontWeight: 700, margin: '28px 0 12px', color: '#E5E7EB' }}>{b.slice(4)}</h3>
        }

        // Bold-only = heading
        if (b.startsWith('**') && b.endsWith('**') && !b.slice(2,-2).includes('**')) {
          return <h3 key={i} style={{ fontSize: 19, fontWeight: 700, margin: '28px 0 12px', color: '#E5E7EB' }}>{b.slice(2,-2)}</h3>
        }

        // --- separador
        if (b === '---') {
          return <hr key={i} style={{ border: 'none', borderTop: '1px solid #374151', margin: '32px 0' }} />
        }

        // > blockquote
        if (b.startsWith('> ')) {
          return <blockquote key={i} style={{ borderLeft: '4px solid #F4622A', margin: '28px 0', padding: '14px 20px', background: 'rgba(244,98,42,.08)', borderRadius: '0 6px 6px 0', fontStyle: 'italic', fontSize: 18, color: '#D1D5DB' }} dangerouslySetInnerHTML={{ __html: toHtml(b.slice(2)) }} />
        }

        // Caixa de dica: **Dica:** ou **Importante:**
        if (b.startsWith('**Dica') || b.startsWith('**Importante') || b.startsWith('**Atenção') || b.startsWith('**Nota')) {
          return <div key={i} style={{ background: 'rgba(244,98,42,.1)', border: '1px solid rgba(244,98,42,.3)', borderRadius: 8, padding: '14px 18px', margin: '24px 0', color: '#FCA5A5', fontSize: 16, lineHeight: 1.7 }} dangerouslySetInnerHTML={{ __html: toHtml(b) }} />
        }

        // Tabela | col | col |
        if (b.includes('|') && b.split('\n')[0].includes('|')) {
          const rows = b.split('\n').filter(function(r) { return r.trim() && !r.match(/^\|[-\s|]+\|$/) })
          return (
            <div key={i} style={{ overflowX: 'auto', margin: '24px 0' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 15 }}>
                {rows.map(function(row, ri) {
                  const cells = row.split('|').filter(function(c) { return c.trim() })
                  const Tag = ri === 0 ? 'th' : 'td'
                  return (
                    <tr key={ri} style={{ background: ri === 0 ? '#1E3A5F' : ri % 2 === 0 ? 'rgba(255,255,255,.03)' : 'transparent' }}>
                      {cells.map(function(cell, ci) {
                        return <Tag key={ci} style={{ padding: '10px 14px', border: '1px solid #374151', color: ri === 0 ? '#F3F4F6' : '#D1D5DB', fontWeight: ri === 0 ? 700 : 400, textAlign: 'left' }} dangerouslySetInnerHTML={{ __html: toHtml(cell.trim()) }} />
                      })}
                    </tr>
                  )
                })}
              </table>
            </div>
          )
        }

        // Lista numerada
        if (/^\d+\./.test(b)) {
          const lines = b.split('\n').filter(Boolean)
          return (
            <ol key={i} style={{ margin: '4px 0 24px 24px', lineHeight: 1.9, color: '#E5E7EB' }}>
              {lines.map(function(line, j) {
                const text = line.replace(/^\d+\.\s*/, '')
                return <li key={j} style={{ marginBottom: 8 }} dangerouslySetInnerHTML={{ __html: toHtml(text) }} />
              })}
            </ol>
          )
        }

        // Lista com marcador
        if (b.startsWith('- ') || b.startsWith('* ')) {
          const lines = b.split('\n').filter(Boolean)
          return (
            <ul key={i} style={{ margin: '4px 0 24px 24px', lineHeight: 1.9, color: '#E5E7EB' }}>
              {lines.map(function(line, j) {
                const text = line.replace(/^[-*]\s*/, '')
                return <li key={j} style={{ marginBottom: 8 }} dangerouslySetInnerHTML={{ __html: toHtml(text) }} />
              })}
            </ul>
          )
        }

        // Link isolado [texto](url)
        const linkMatch = b.match(/^\[([^\]]+)\]\((https?:\/\/[^)]+)\)(.*)$/)
        if (linkMatch) {
          return (
            <p key={i} style={{ marginBottom: 10 }}>
              <a href={linkMatch[2]} target="_blank" rel="noreferrer" style={{ color: '#4DB6AC', textDecoration: 'underline', fontWeight: 600 }}>{linkMatch[1]}</a>
              {linkMatch[3] && <span style={{ color: '#9CA3AF' }}>{linkMatch[3]}</span>}
            </p>
          )
        }

        // Paragrafo normal
        const html = toHtml(b)
        if (!html.trim()) return null
        return <p key={i} style={{ marginBottom: 22, fontSize: 17, lineHeight: 1.9, color: '#E5E7EB' }} dangerouslySetInnerHTML={{ __html: html }} />
      })}
    </div>
  )
}

const CAT_COLORS = {
  'Imigracao': '#F4622A', 'Comunidade': '#00897B',
  'Saude': '#15803D', 'Negocios': '#7C3AED', 'Esportes': '#DC2626',
  'Cultura e Lazer': '#E91E8C',
}

export async function generateStaticParams() {
  return getAllArticles().map(function(a) { return { slug: a.id } })
}

export async function generateMetadata(props) {
  const article = getArticleBySlug(props.params.slug)
  if (!article) return { title: 'Artigo nao encontrado' }
  return {
    title: article.title + ' | Miami Brasileira',
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: 'article',
      publishedTime: article.publishedAt,
      locale: 'pt_BR',
    },
  }
}

export default function ArtigoPage(props) {
  const article = getArticleBySlug(props.params.slug)
  if (!article) notFound()

  const allArticles = getAllArticles()
  const relacionados = allArticles.filter(function(a) {
    return a.category === article.category && a.id !== article.id
  }).slice(0, 3)
  const catColor = CAT_COLORS[article.category] || '#F4622A'
  const catSlug = (article.category || '').toLowerCase().replace(/ e /g, '-e-').replace(/\s+/g, '-')

  return (
    <div>
      <div className="article-page">
        <div className="article-page-grid">
          <article className="article-body">
            {article.image && (
              <div style={{ width: '100%', height: 480, overflow: 'hidden', borderRadius: '0 0 8px 8px' }}>
                <img src={article.image} alt={article.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              </div>
            )}
            <div className="article-inner">
              <div className="article-breadcrumb" style={{ marginBottom: 12 }}>
                <Link href="/" style={{ color: '#9CA3AF' }}>Inicio</Link>
                <span style={{ color: '#6B7280', margin: '0 6px' }}>›</span>
                <Link href={'/categoria/' + catSlug} style={{ color: '#9CA3AF' }}>{article.category}</Link>
              </div>
              <div style={{ marginBottom: 10 }}>
                <span style={{ background: catColor, color: 'white', fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 3, textTransform: 'uppercase', letterSpacing: '.5px' }}>
                  {article.category}
                </span>
              </div>
              <h1 className="article-title" style={{ fontFamily: 'Georgia, serif', fontSize: 34, lineHeight: 1.25, color: '#F9FAFB', marginBottom: 16, borderBottom: '3px solid ' + catColor, paddingBottom: 14 }}>{article.title}</h1>
              <div className="article-meta-bar" style={{ display: 'flex', gap: 18, fontSize: 13, color: '#9CA3AF', marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
                <span>📅 {formatDate(article.publishedAt)}</span>
                <span>✍️ {article.source || 'Miami Brasileira'}</span>
                <span>⏱ {readingTime(article.content)}</span>
              </div>
              {article.excerpt && (
                <p className="article-excerpt" style={{ fontSize: 18, fontStyle: 'italic', color: '#9CA3AF', borderLeft: '4px solid ' + catColor, paddingLeft: 16, marginBottom: 28, lineHeight: 1.7 }}>{article.excerpt}</p>
              )}
              <ArticleContent content={article.content} />
              <ShareButtons title={article.title} />
            </div>
          </article>
          <Sidebar articles={allArticles} />
        </div>
        {relacionados.length > 0 && (
          <div style={{ marginTop: 48 }}>
            <div className="section-header">
              <div className="section-bar" />
              <h2>Noticias Relacionadas</h2>
            </div>
            <div className="article-grid">
              {relacionados.map(function(art) {
                return (
                  <Link key={art.id} href={'/artigo/' + art.id} className="article-card">
                    <img src={art.image || 'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=400&q=70'} alt={art.title} />
                    <div className="card-body">
                      <div className="card-tag">{art.category}</div>
                      <h3>{art.title}</h3>
                      <div className="card-meta">
                        <span>{art.publishedAt && art.publishedAt.slice(0, 10)}</span>
                        <div className="dot" />
                        <span>{readingTime(art.content)}</span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
            }
