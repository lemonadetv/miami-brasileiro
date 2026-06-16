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
    .replace(/**([^*]+)**/g, '<strong>$1</strong>')
    .replace(/*([^*]+)*/g, '<em>$1</em>')
    .replace(/[([^]]+)]((https?://[^)]+))/g, '<a href="$2" target="_blank" rel="noreferrer" style="color:#00897B;text-decoration:underline;font-weight:600">$1</a>')
}

function ArticleContent({ content }) {
  if (!content) return null

  const blocks = content.split(/

+/).filter(function(b) { return b.trim().length > 0 })

  return (
    <div className="article-content" style={{ fontFamily: 'Georgia, serif' }}>
      {blocks.map(function(block, i) {
        const b = block.trim()

        // Imagem inline: ![alt](url)
        const imgMatch = b.match(/^![([^]]*)]((https?://[^)]+))$/)
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
          return (
            <h2 key={i} style={{ fontFamily: 'Georgia, serif', fontSize: 24, fontWeight: 700, margin: '40px 0 16px', color: '#111827', borderBottom: '3px solid #F4622A', paddingBottom: 8, lineHeight: 1.3 }}>
              {b.slice(3)}
            </h2>
          )
        }

        // H3: ### Titulo
        if (b.startsWith('### ')) {
          return (
            <h3 key={i} style={{ fontFamily: 'Georgia, serif', fontSize: 20, fontWeight: 700, margin: '32px 0 12px', color: '#1F2937' }}>
              {b.slice(4)}
            </h3>
          )
        }

        // Linha separadora: ---
        if (b === '---') {
          return <hr key={i} style={{ border: 'none', borderTop: '2px solid #F3F4F6', margin: '32px 0' }} />
        }

        // Blockquote: > texto
        if (b.startsWith('> ')) {
          return (
            <blockquote key={i} style={{ borderLeft: '5px solid #F4622A', margin: '28px 0', padding: '16px 24px', background: 'rgba(244,98,42,.06)', borderRadius: '0 8px 8px 0', fontStyle: 'italic', fontSize: 19, color: '#374151', lineHeight: 1.7 }}>
              <span dangerouslySetInnerHTML={{ __html: toHtml(b.slice(2)) }} />
            </blockquote>
          )
        }

        // Lista numerada: 1. item
        if (/^d+.s/.test(b)) {
          const lines = b.split('
').filter(Boolean)
          return (
            <ol key={i} style={{ margin: '20px 0 24px 28px', lineHeight: 1.9, fontSize: 17, color: '#1F2937' }}>
              {lines.map(function(line, j) {
                const txt = line.replace(/^d+.s*/, '')
                return <li key={j} style={{ marginBottom: 8 }} dangerouslySetInnerHTML={{ __html: toHtml(txt) }} />
              })}
            </ol>
          )
        }

        // Lista com bullets: - item ou * item
        if (/^[-*]s/.test(b)) {
          const lines = b.split('
').filter(Boolean)
          return (
            <ul key={i} style={{ margin: '20px 0 24px 28px', lineHeight: 1.9, fontSize: 17, color: '#1F2937' }}>
              {lines.map(function(line, j) {
                const txt = line.replace(/^[-*]s*/, '')
                return <li key={j} style={{ marginBottom: 8 }} dangerouslySetInnerHTML={{ __html: toHtml(txt) }} />
              })}
            </ul>
          )
        }

        // Tabela simples: | col | col |
        if (b.startsWith('|')) {
          const rows = b.split('
').filter(function(r) { return r.trim() && !r.match(/^|[-| ]+|$/) })
          if (rows.length > 0) {
            const header = rows[0].split('|').filter(Boolean).map(function(c) { return c.trim() })
            const body = rows.slice(1)
            return (
              <div key={i} style={{ overflowX: 'auto', margin: '28px 0' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 15, fontFamily: 'sans-serif' }}>
                  <thead>
                    <tr style={{ background: '#1F2937' }}>
                      {header.map(function(h, j) {
                        return <th key={j} style={{ padding: '12px 16px', color: 'white', fontWeight: 700, textAlign: 'left' }} dangerouslySetInnerHTML={{ __html: toHtml(h) }} />
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {body.map(function(row, j) {
                      const cells = row.split('|').filter(Boolean).map(function(c) { return c.trim() })
                      return (
                        <tr key={j} style={{ background: j % 2 === 0 ? 'white' : '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                          {cells.map(function(cell, k) {
                            return <td key={k} style={{ padding: '10px 16px', color: '#374151' }} dangerouslySetInnerHTML={{ __html: toHtml(cell) }} />
                          })}
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )
          }
        }

        // Box de dica/destaque: **Dica:** texto ou **Importante:** texto
        if (/^**(Dica|Importante|Atencao|Nota|Lembre)/.test(b)) {
          return (
            <div key={i} style={{ background: 'linear-gradient(135deg, #FFF7ED, #FFF3E0)', border: '1px solid #FED7AA', borderRadius: 10, padding: '16px 20px', margin: '24px 0', fontFamily: 'sans-serif' }}>
              <p style={{ margin: 0, fontSize: 16, color: '#92400E', lineHeight: 1.7 }} dangerouslySetInnerHTML={{ __html: toHtml(b) }} />
            </div>
          )
        }

        // Paragrafo normal
        if (!b.trim()) return null
        return (
          <p key={i} style={{ marginBottom: 24, fontSize: 18, lineHeight: 1.9, color: '#1F2937' }} dangerouslySetInnerHTML={{ __html: toHtml(b) }} />
        )
      })}
    </div>
  )
}

const CAT_COLORS = {
  Imigracao: '#F4622A', Comunidade: '#00897B',
  Saude: '#15803D', Negocios: '#7C3AED', Esportes: '#DC2626',
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
      images: article.image ? [{ url: article.image }] : [],
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
  const relacionados = allArticles
    .filter(function(a) { return a.category === article.category && a.id !== article.id })
    .slice(0, 3)
  const catColor = CAT_COLORS[article.category] || '#00897B'
  const catSlug = (article.category || '').toLowerCase().replace(/ e /g, '-e-').replace(/ /g, '-')

  return (
    <>
      <div className="article-page">
        <div className="article-page-grid">
          <article className="article-body">
            {/* Hero image */}
            {article.image && (
              <div style={{ width: '100%', maxHeight: 480, overflow: 'hidden', borderRadius: '0 0 12px 12px' }}>
                <img
                  src={article.image}
                  alt={article.title}
                  style={{ width: '100%', height: 480, objectFit: 'cover', display: 'block' }}
                />
              </div>
            )}

            <div className="article-inner" style={{ padding: '32px 40px' }}>
              {/* Breadcrumb */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, fontSize: 13, fontFamily: 'sans-serif' }}>
                <Link href="/" style={{ color: '#6B7280', textDecoration: 'none' }}>Inicio</Link>
                <span style={{ color: '#D1D5DB' }}>›</span>
                <Link href={'/categoria/' + catSlug} style={{ color: catColor, textDecoration: 'none', fontWeight: 600 }}>{article.category}</Link>
              </div>

              {/* Tag categoria */}
              <div style={{ marginBottom: 16 }}>
                <span style={{ background: catColor, color: 'white', fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 4, textTransform: 'uppercase', letterSpacing: '.6px', fontFamily: 'sans-serif' }}>
                  {article.category}
                </span>
              </div>

              {/* Titulo */}
              <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 34, fontWeight: 700, lineHeight: 1.25, color: '#111827', marginBottom: 20, borderBottom: '3px solid ' + catColor, paddingBottom: 20 }}>
                {article.title}
              </h1>

              {/* Meta bar */}
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 16, marginBottom: 24, fontSize: 13, color: '#6B7280', fontFamily: 'sans-serif' }}>
                <span>📅 {formatDate(article.publishedAt)}</span>
                <span>✍️ {article.source || 'Miami Brasileira'}</span>
                <span>⏱️ {readingTime(article.content)}</span>
              </div>

              {/* Excerpt / lide */}
              {article.excerpt && (
                <p style={{ fontSize: 20, lineHeight: 1.7, color: '#374151', fontStyle: 'italic', borderLeft: '4px solid ' + catColor, paddingLeft: 20, marginBottom: 36, fontFamily: 'Georgia, serif' }}>
                  {article.excerpt}
                </p>
              )}

              {/* Conteudo do artigo */}
              <ArticleContent content={article.content} />

              {/* Share */}
              <div style={{ marginTop: 40, paddingTop: 24, borderTop: '2px solid #F3F4F6' }}>
                <ShareButtons title={article.title} />
              </div>
            </div>
          </article>

          <Sidebar articles={allArticles} />
        </div>

        {/* Artigos relacionados */}
        {relacionados.length > 0 && (
          <div style={{ marginTop: 48, padding: '0 20px' }}>
            <div className="section-header">
              <div className="section-bar" style={{ background: catColor }} />
              <h2>Noticias Relacionadas</h2>
            </div>
            <div className="article-grid">
              {relacionados.map(function(art) {
                const img = art.image || 'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=400&q=70'
                return (
                  <Link key={art.id} href={'/artigo/' + art.id} className="article-card">
                    <img src={img} alt={art.title} />
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
    </>
  )
}
