'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const CATEGORIAS = [
  { label: 'Início',       href: '/' },
  { label: 'Comunidade',   href: '/categoria/comunidade' },
  { label: 'Imigração',    href: '/categoria/imigracao' },
  { label: 'Negócios',     href: '/categoria/negocios' },
  { label: 'Saúde',        href: '/categoria/saude' },
  { label: 'Esportes',     href: '/categoria/esportes' },
  { label: 'Contato',      href: '/contato' },
]

const TICKER_ITEMS = [
  'Novos requisitos para visto EB-5 entram em vigor em junho',
  'Miami bate recorde de turistas brasileiros no primeiro trimestre de 2026',
  'Copa do Mundo 2026: Brasil enfrenta Argentina em Miami - ingressos esgotados',
  'Prefeitura de Miami aprova novo programa de moradia para imigrantes',
  'USCIS abre novas vagas de entrevista para asilo no escritorio de Miami',
]

export default function Header() {
  const pathname = usePathname()
  const hoje = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
  const dataFormatada = hoje.charAt(0).toUpperCase() + hoje.slice(1)
  const tickerItems = [...TICKER_ITEMS, ...TICKER_ITEMS]

  return (
    <>
      <div className="topbar">
        <div className="topbar-inner">
          <span>🍍 Miami & Sul da Flórida · {dataFormatada}</span>
          <div className="topbar-social">
            <a href="https://facebook.com" target="_blank" rel="noreferrer">📘 Facebook</a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer">📸 Instagram</a>
            <a href="https://wa.me/1305000000" target="_blank" rel="noreferrer">💬 WhatsApp</a>
          </div>
        </div>
      </div>
      <header>
        <div className="header-inner">
          <Link href="/" className="logo">
            <div className="logo-icon">🌴</div>
            <div className="logo-text">
              <div className="name">Miami Brasileiro</div>
              <div className="tagline">O portal da sua comunidade</div>
            </div>
          </Link>
          <nav>
            {CATEGORIAS.map(cat => (
              <Link key={cat.href} href={cat.href} className={pathname === cat.href ? 'active' : ''}>{cat.label}</Link>
            ))}
          </nav>
          <Link href="/contato" className="btn-anuncie">📣 Anuncie</Link>
        </div>
      </header>
      <div className="weather-bar">
        <div className="weather-inner">
          <div className="weather-item">🌤 Miami <strong>34°C</strong></div>
          <div className="weather-item">💧 Umidade <strong>72%</strong></div>
          <div className="date-bar">USD/BRL: R$ 5,68 | EUR/BRL: R$ 6,12</div>
        </div>
      </div>
      <div className="ticker">
        <div className="ticker-label">🔴 AO VIVO</div>
        <div className="ticker-wrapper">
          <div className="ticker-track">
            {tickerItems.map((item, i) => (<span key={i}>{item}</span>))}
          </div>
        </div>
      </div>
    </>
  )
}
