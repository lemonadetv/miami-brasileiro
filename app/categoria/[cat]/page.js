// app/categoria/[cat]/page.js

import Footer from '../../../components/Footer'
import Sidebar from '../../../components/Sidebar'
import Link from 'next/link'
import { getAllArticles, getArticlesByCategory, formatDateShort, readingTime } from '../../../lib/articles'
import { notFound } from 'next/navigation'

const CATS = {
  comunidade: { label: 'Comunidade', color: '#00897B', desc: 'Noticias e eventos da comunidade brasileira em Miami e Sul da Florida' },
  imigracao:  { label: 'Imigração',  color: '#F4622A', desc: 'Vistos, green card, USCIS, asilo e tudo sobre imigracao nos EUA' },
  negocios:   { label: 'Negócios',   color: '#7C3AED', desc: 'Empreendedorismo, financas e oportunidades de negocio na Florida' },
  saude:      { label: 'Saúde',      color: '#15803D', desc: 'Saude, planos medicos, seguros e bem-estar para brasileiros nos EUA' },
  esportes:       { label: 'Esportes',       color: '#DC2626', desc: 'Futebol, Copa do Mundo, MMA e esportes com a visao brasileira' },
  'cultura-e-lazer': { label: 'Cultura e Lazer', color: '#e91e8c', desc: 'Dicas de cultura, lazer, entretenimento e diversao para brasileiros em Miami' },
}

const CAT_MAP = {
  comunidade: 'Comunidade',
  imigracao:  'Imigração',
  negocios:   'Negócios',
  saude:      'Saúde',
  esportes:        'Esportes',
  'cultura-e-lazer': 'Cultura e Lazer',
}

const FALLBACK = {
  Imigracao:  'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&q=70',
  Comunidade: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=70',
  Saude:      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=70',
  Negocios:   'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=600&q=70',
  Esportes:   'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&q=70',
  _default:   'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=600&q=70',
}
function getImg(a) { return a.image || FALLBACK[a.category] || FALLBACK._default }

export async function generateStaticParams() {
  return Object.keys(CATS).map(function(cat) { return { cat: cat } })
}

export async function generateMetadata(props) {
  var params = props.params
  var info = CATS[params.cat]
  if (!info) return { title: 'Categoria' }
  return {
    title: info.label + ' | Miami Brasileiro',
    description: info.desc,
  }
}

export default function CategoriaPage(props) {
  var params = props.params
  var info = CATS[params.cat]
  if (!info) notFound()

  var catLabel = CAT_MAP[params.cat]
  var articles = getArticlesByCategory(catLabel)
  var allArticles = getAllArticles()

  return (
    <>

      <div className="cat-page">
        <div className="cat-page-header" style={{ borderLeft: '6px solid ' + info.color }}>
          <div className="cat-page-info">
            <h1 style={{ color: info.color }}>{info.label}</h1>
            <p>{info.desc}</p>
          </div>
        </div>

        <div className="cat-page-grid">
          <div>
            {articles.length === 0 ? (
              <div className="cat-empty">
                <h2>Nenhum artigo ainda</h2>
                <p>As noticias de {info.label} aparecerÃ£o aqui em breve.</p>
              </div>
            ) : (
              <>
                <div className="section-header">
                  <div className="section-bar" style={{ background: info.color }} />
                  <h2>{articles.length} materia{articles.length !== 1 ? 's' : ''} em {info.label}</h2>
                </div>
                <div className="article-grid">
                  {articles.map(function(a) {
                    return (
                      <Link key={(a.slug || a.id)} href={'/artigo/' + (a.slug || a.id)} className="article-card">
                        <img src={getImg(a)} alt={a.title} />
                        <div className="card-body">
                          <div className="card-tag">{a.category}</div>
                          <h3>{a.title}</h3>
                          {a.excerpt && (
                            <p style={{ fontSize: 12, color: '#6B7280', marginTop: 6, lineHeight: 1.4 }}>
                              {a.excerpt.slice(0, 90)}...
                            </p>
                          )}
                          <div className="card-meta" style={{ marginTop: 8 }}>
                            <span>{formatDateShort(a.publishedAt)}</span>
                            <div className="dot" />
                            <span>{readingTime(a.content)}</span>
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </>
            )}
          </div>
          <Sidebar articles={allArticles} />
        </div>
      </div>
      <Footer />
    </>
  )
}
