// app/artigo/[slug]/page.js
import { notFound } from 'next/navigation'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import Sidebar from '../../../components/Sidebar'
import ShareButtons from '../../../components/ShareButtons'
import Link from 'next/link'
import { getAllArticles, getArticleBySlug, formatDate, readingTime } from '../../../lib/articles'

// ---- Inline rendering ----
function parseInline(text) {
  const result = []
  const re = /(\*\*([^*]+)\*\*|\[([^\]]+)\]\((https?:\/\/[^\)]+)\))/g
  let last = 0, m, k = 0
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) result.push(text.slice(last, m.index))
    if (m[0].startsWith('**')) {
      result.push(<strong key={k++} style={{ fontWeight: 700, color: '#111827' }}>{m[2]}</strong>)
    } else {
      result.push(
        <a key={k++} href={m[4]} target="_blank" rel="noreferrer"
           style={{ color: '#00897B', textDecoration: 'underline', fontWeight: 600 }}>
          {m[3]}
        </a>
      )
    }
    last = re.lastIndex
  }
  if (last < text.length) result.push(text.slice(last))
  return result
}

// ---- Icon SVGs (no emoji - pure SVG) ----
function Icon({ type, color, size = 18 }) {
  const s = { width: size, height: size, flexShrink: 0 }
  const icons = {
    link: <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>,
    doc:  <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
    money:<svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><path d="M8 12h8"/></svg>,
    work: <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>,
    home: <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    health:<svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>,
    sport:<svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>,
    tip:  <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
    list: <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,
    chart:<svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></svg>,
    arrow:<svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  }
  return icons[type] || icons.list
}

function headingIcon(text, color) {
  const t = text.toLowerCase()
  if (/link|recurso|site|portal|acesso|util/.test(t)) return <Icon type="link" color={color} />
  if (/document|visto|passaporte|apostil|certidao/.test(t)) return <Icon type="doc" color={color} />
  if (/custo|taxa|valor|preco|dolar|reais|salario|pagamento|quanto|mensalidade/.test(t)) return <Icon type="money" color={color} />
  if (/saude|medico|hospital|plano|seguro|medicament/.test(t)) return <Icon type="health" color={color} />
  if (/trabalho|emprego|carreira|profiss|contrat|curricul/.test(t)) return <Icon type="work" color={color} />
  if (/moradia|aluguel|imovel|apartamento|casa|bairro/.test(t)) return <Icon type="home" color={color} />
  if (/esporte|futebol|inter miami|treino|jogo|partida|academia/.test(t)) return <Icon type="sport" color={color} />
  if (/dica|importante|atencao|cuidado|erro|evitar/.test(t)) return <Icon type="tip" color={color} />
  if (/passo|etapa|processo|como fazer/.test(t)) return <Icon type="list" color={color} />
  return <Icon type="list" color={color} />
}

// ---- Parse price from a list line ----
function extractPrice(line) {
  const m = line.match(/\$\s*([\d,]+(?:\.\d++?)/)
  return m ? parseFloat(m[1].replace(/,/g,'')) : null
}

function extractPercent(line) {
  const m = line.match(/([\d]+(?:\.\d+)?)\s*%/)
  return m ? parseFloat(m[1]) : null
}

function stripMarkdown(text) {
  return text.replace(/\*\*([^*]+)\*\*/g,'$1').replace(/\[([^\]]+)\]\([^\)]+\)/g,'$1')
}

// ---- Price comparison chart ----
function PriceChart({ lines, catColor }) {
  const items = lines.map(line => {
    const clean = line.replace(/^[-*]\s*/,'')
    const price = extractPrice(clean)
    const name = stripMarkdown(clean.split(':')[0]).replace(/\*\*/g,'').trim().slice(0,28)
    const desc = stripMarkdown(clean).slice(0,60)
    return { name, price, desc }
  }).filter(i => i.price !== null && i.price > 0)
  if (items.length < 2) return null
  const maxP = Math.max(...items.map(i => i.price))
  return (
    <div style={{ margin:'20px 0', padding:'20px 24px', background:'#F8FAFC', borderRadius:12, border:'1px solid #E5E7EB' }}>
      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:16 }}>
        <Icon type="chart" color={catColor} size={16} />
        <span style={{ fontSize:12, fontWeight:700, color:'#6B7280', textTransform:'uppercase', letterSpacing:'0.6px' }}>Comparativo de Precos</span>
      </div>
      {items.map(function(item, i) {
        const pct = Math.max(8, Math.round(item.price / maxP * 100))
        return (
          <div key={i} style={{ marginBottom:14 }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5, alignItems:'center' }}>
              <span style={{ fontSize:14, fontWeight:600, color:'#111827' }}>{item.name}</span>
              <span style={{ fontSize:15, fontWeight:800, color:catColor }}>${item.price.toLocaleString()}</span>
            </div>
            <div style={{ background:'#E5E7EB', borderRadius:6, height:10, overflow:'hidden' }}>
              <div style={{ background:catColor, height:'100%', borderRadius:6, width:pct+'%', transition:'width 0.6s ease', opacity: i===0 ? 1 : 0.65 }} />
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ---- Percent chart ----
function PercentChart({ lines, catColor }) {
  const items = lines.map(line => {
    const clean = line.replace(/^[-*]\s*/,'')
    const pct = extractPercent(clean)
    const name = stripMarkdown(clean.split(':')[0]).trim().slice(0,40)
    return { name, pct }
  }).filter(i => i.pct !== null)
  if (items.length < 2) return null
  return (
    <div style={{ margin:'20px 0', padding:'20px 24px', background:'#F8FAFC', borderRadius:12, border:'1px solid #E5E7EB' }}>
      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:16 }}>
        <Icon type="chart" color={catColor} size={16} />
        <span style={{ fontSize:12, fontWeight:700, color:'#6B7280', textTransform:'uppercase', letterSpacing:'0.6px' }}>Dados em Porcentagem</span>
      </div>
      {items.map(function(item, i) {
        return (
          <div key={i} style={{ marginBottom:14 }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
              <span style={{ fontSize:14, fontWeight:600, color:'#111827' }}>{item.name}</span>
              <span style={{ fontSize:15, fontWeight:800, color:catColor }}>{item.pct}%</span>
            </div>
            <div style={{ background:'#E5E7EB', borderRadius:6, height:10, overflow:'hidden' }}>
              <div style={{ background:catColor, height:'100%', borderRadius:6, width:Math.max(4,item.pct)+'%', opacity: i===0 ? 1 : 0.7 }} />
            </div>
          </div>
        )
      })}
    </div>
  )
}

function hasStat(text) {
  return /\$[\d,]+|R\$[\d,]+|\d+%|\d+ anos|\d+ meses|\d+ dias/.test(text)
}

// ---- Main renderer ----
function ArticleContent({ content, category }) {
  if (!content) return null

  const catAccent = {
    Imigracao:'#F4622A', Comunidade:'#00897B',
    Saude:'#15803D', Negocios:'#7C3AED', Esportes:'#DC2626',
  }[category] || '#00897B'

  const normalized = content
    .replace(/\n(#{2,3} )/g, '\n\n$1')
    .replace(/\n(\[[^\]]+\]\(https?:)/g, '\n\n$1')
    .replace(/—/g, ' - ')

  const blocks = normalized.split('\n\n').filter(b => b.trim().length > 0)

  return (
    <div className="article-content">
      {blocks.map(function(block, i) {
        const b = block.trim()

        // Inline image
        const imgM = b.match(/^!\[([^\]]*)\]\((https?:\/\/[^\)]+)\)$/)
        if (imgM) return (
          <figure key={i} style={{ margin:'28px 0', borderRadius:10, overflow:'hidden', boxShadow:'0 2px 12px rgba(0,0,0,.08)' }}>
            <img src={imgM[2]} alt={imgM[1]} style={{ width:'100%', maxHeight:400, objectFit:'cover', display:'block' }} />
            {imgM[1] && <figcaption style={{ fontSize:12, color:'#9CA3AF', padding:'8px 12px', textAlign:'center', fontStyle:'italic', background:'#F9FAFB' }}>{imgM[1]}</figcaption>}
          </figure>
        )

        // H2
        if (b.startsWith('## ')) {
          const title = b.split('\n')[0].slice(3)
          return (
            <h2 key={i} style={{ fontFamily:'Georgia, serif', fontSize:22, fontWeight:700, margin:'36px 0 16px', color:'#111827', borderLeft:'4px solid '+catAccent, paddingLeft:14 }}>
              {title}
            </h2>
          )
        }

        // H3 with SVG icon
        if (b.startsWith('### ')) {
          const title = b.split('\n')[0].slice(4)
          return (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:10, margin:'28px 0 12px', padding:'10px 16px', background:'#F8FAFC', borderRadius:8, borderLeft:'3px solid '+catAccent }}>
              {headingIcon(title, catAccent)}
              <h3 style={{ margin:0, fontSize:17, fontWeight:700, color:'#111827' }}>{title}</h3>
            </div>
          )
        }

        // Bold-only heading
        if (b.startsWith('**') && b.endsWith('**') && b.length > 4 && !b.slice(2,-2).includes('**')) {
          const inner = b.slice(2,-2)
          return (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:10, margin:'24px 0 10px', padding:'8px 14px', background:'#F8FAFC', borderRadius:8, borderLeft:'3px solid '+catAccent }}>
              <Icon type="list" color={catAccent} />
              <h3 style={{ margin:0, fontSize:17, fontWeight:700, color:'#111827' }}>{inner}</h3>
            </div>
          )
        }

        // Numbered list
        if (/^\d+\./.test(b)) {
          const lines = b.split('\n').filter(Boolean)
          return (
            <ol key={i} style={{ margin:'0 0 22px 0', padding:0, listStyle:'none' }}>
              {lines.map(function(line, j) {
                const text = line.replace(/^\d+\.\s*/,'')
                return (
                  <li key={j} style={{ display:'flex', gap:12, marginBottom:10, lineHeight:1.8, alignItems:'flex-start' }}>
                    <span style={{ minWidth:26, height:26, background:catAccent, color:'white', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700, flexShrink:0, marginTop:2 }}>{j+1}</span>
                    <span style={{ color:'#1F2937', fontSize:16 }}>{parseInline(text)}</span>
                  </li>
                )
              })}
            </ol>
          )
        }

        // Bullet list — check if has prices or percentages first
        if (b.startsWith('- ') || b.startsWith('* ')) {
          const lines = b.split('\n').filter(Boolean)
          const priceCount = lines.filter(l => extractPrice(l) !== null).length
          const pctCount = lines.filter(l => extractPercent(l) !== null).length

          // Price chart if 2+ items have prices
          if (priceCount >= 2 && lines.length >= 2) {
            const chart = PriceChart({ lines, catColor: catAccent })
            if (chart) {
              // Also show remaining text as list below chart
              const noPrice = lines.filter(l => extractPrice(l) === null)
              return (
                <div key={i}>
                  {chart}
                  {noPrice.length > 0 && (
                    <ul style={{ margin:'8px 0 22px 0', padding:0, listStyle:'none' }}>
                      {noPrice.map((line, j) => (
                        <li key={j} style={{ display:'flex', gap:10, marginBottom:8, lineHeight:1.8, alignItems:'flex-start' }}>
                          <span style={{ width:8, height:8, borderRadius:'50%', background:catAccent, flexShrink:0, marginTop:7 }} />
                          <span style={{ color:'#1F2937', fontSize:16 }}>{parseInline(line.replace(/^[-*]\s*/,''))}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )
            }
          }

          // Percent chart if 2+ items have percentages
          if (pctCount >= 2 && lines.length >= 2) {
            const chart = PercentChart({ lines, catColor: catAccent })
            if (chart) return <div key={i}>{chart}</div>
          }

          // Regular bullet list
          return (
            <ul key={i} style={{ margin:'0 0 22px 0', padding:0, listStyle:'none' }}>
              {lines.map(function(line, j) {
                const text = line.replace(/^[-*]\s*/,'')
                return (
                  <li key={j} style={{ display:'flex', gap:10, marginBottom:8, lineHeight:1.8, alignItems:'flex-start' }}>
                    <span style={{ width:8, height:8, borderRadius:'50%', background:catAccent, flexShrink:0, marginTop:8 }} />
                    <span style={{ color:'#1F2937', fontSize:16 }}>{parseInline(text)}</span>
                  </li>
                )
              })}
            </ul>
          )
        }

        // Blockquote
        if (b.startsWith('> ')) return (
          <div key={i} style={{ margin:'24px 0', padding:'16px 20px', background:'linear-gradient(135deg,rgba(244,98,42,.06),rgba(0,137,123,.06))', borderLeft:'4px solid '+catAccent, borderRadius:'0 10px 10px 0', display:'flex', gap:12, alignItems:'flex-start' }}>
            <Icon type="tip" color={catAccent} size={20} />
            <p style={{ margin:0, fontStyle:'italic', fontSize:17, color:'#374151', lineHeight:1.8 }}>{parseInline(b.slice(2))}</p>
          </div>
        )

        // Standalone link card
        const lm = b.match(/^\[([^\]]+)\]\((https?:\/\/[^\)]+)\)(.*)$/)
        if (lm) {
          const desc = lm[3].replace(/^[\s\-:]+/,'').trim()
          return (
            <a key={i} href={lm[2]} target="_blank" rel="noreferrer"
               style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 16px', margin:'8px 0', background:'#F0FDF4', border:'1px solid #D1FAE5', borderRadius:8, textDecoration:'none' }}
               onMouseOver={function(e){ e.currentTarget.style.background='#DCFCE7' }}
               onMouseOut={function(e){ e.currentTarget.style.background='#F0FDF4' }}>
              <Icon type="link" color="#065F46" size={20} />
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:700, color:'#065F46', fontSize:15 }}>{lm[1]}</div>
                {desc && <div style={{ fontSize:13, color:'#6B7280', marginTop:2 }}>{desc}</div>}
              </div>
              <Icon type="arrow" color="#9CA3AF" size={16} />
            </a>
          )
        }

        // Stat highlight box (short paragraph with numbers)
        if (hasStat(b) && b.length < 220) {
          return (
            <div key={i} style={{ margin:'18px 0', padding:'16px 20px', background:'linear-gradient(135deg,#FFF7ED,#FFFBEB)', border:'1px solid #FED7AA', borderRadius:10, display:'flex', gap:12, alignItems:'flex-start' }}>
              <Icon type="chart" color="#D97706" size={22} />
              <p style={{ margin:0, fontSize:16, lineHeight:1.8, color:'#1F2937' }}>{parseInline(b)}</p>
            </div>
          )
        }

        // Regular paragraph
        const inline = parseInline(b)
        if (!inline.length) return null
        return <p key={i} style={{ marginBottom:22, fontSize:17, lineHeight:1.9, color:'#1F2937' }}>{inline}</p>
      })}
    </div>
  )
}

const CAT_COLORS = {
  Imigracao:'#F4622A', Comunidade:'#00897B',
  Saude:'#15803D', Negocios:'#7C3AED', Esportes:'#DC2626',
}

export async function generateStaticParams() {
  return getAllArticles().map(a => ({ slug: a.id }))
}

export async function generateMetadata(props) {
  const article = getArticleBySlug(props.params.slug)
  if (!article) return { title: 'Artigo nao encontrado' }
  return {
    title: article.title + ' | Miami Brasileira',
    description: article.excerpt,
    openGraph: { title: article.title, description: article.excerpt, type: 'article', publishedTime: article.publishedAt, locale: 'pt_BR' },
  }
}

export default function ArtigoPage(props) {
  const article = getArticleBySlug(props.params.slug)
  if (!article) notFound()

  const allArticles = getAllArticles()
  const relacionados = allArticles.filter(a => a.category === article.category && a.id !== article.id).slice(0,3)
  const catColor = CAT_COLORS[article.category] || '#00897B'

  return (
    <div>
      <Header />
      <div className="article-page">
        <div className="article-page-grid">
          <article className="article-body">
            {article.image && <img src={article.image} alt={article.title} className="article-hero-img" />}
            <div className="article-inner">
              <div className="article-breadcrumb">
                <Link href="/">Inicio</Link> &rsaquo;&nbsp;
                <Link href={'/categoria/' + (article.category || '').toLowerCase()}>{article.category}</Link>
              </div>
              <div style={{ marginBottom:10 }}>
                <span style={{ background:catColor, color:'white', fontSize:11, fontWeight:700, padding:'3px 10px', borderRadius:3, textTransform:'uppercase', letterSpacing:'.5px' }}>
                  {article.category}
                </span>
              </div>
              <h1 className="article-title">{article.title}</h1>
              <div className="article-meta-bar">
                <span>{formatDate(article.publishedAt)}</span>
                <span>{article.source || 'Miami Brasileira'}</span>
                <span>{readingTime(article.content)}</span>
              </div>
              {article.excerpt && <p className="article-excerpt">{article.excerpt}</p>}
              <ArticleContent content={article.content} category={article.category} />
              {article.sourceUrl && article.sourceUrl !== '#' && (
                <div className="article-source-box">
                  <span>Baseado em <strong>{article.source}</strong></span>
                  <a href={article.sourceUrl} target="_blank" rel="noreferrer nofollow" className="article-source-link">Ver fonte &rarr;</a>
                </div>
              )}
              <ShareButtons title={article.title} />
            </div>
          </article>
          <Sidebar articles={allArticles} />
        </div>
        {relacionados.length > 0 && (
          <div style={{ marginTop:40 }}>
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
                        <span>{art.publishedAt && art.publishedAt.slice(0,10)}</span>
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
