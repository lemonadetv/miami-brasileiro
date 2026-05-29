'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const CATEGORIAS = [
  { label: 'Inicio',       href: '/' },
  { label: 'Comunidade',   href: '/categoria/comunidade' },
  { label: 'Imigracao',    href: '/categoria/imigracao' },
  { label: 'Negocios',     href: '/categoria/negocios' },
  { label: 'Saude',        href: '/categoria/saude' },
  { label: 'Esportes',     href: '/categoria/esportes' },
  { label: 'Contato',      href: '/contato' },
]

const TICKER_ITEMS = [
  'Novos requisitos para visto EB-5 entram em vigor em junho',
  'Miami bate recorde de turistas brasileiras no primeiro trimestre de 2026',
  'Copa do Mundo 2026: Brasil enfrenta Argentina em Miami - ingressos esgotados',
  'Prefeitura de Miami aprova novo programa de moradia para imigrantes',
  'Cambio: dolar fecha a R$ 5,68 em mais um dia de volatilidade',
  'USCIS abre novas vagas de entrevista para asilo no escritorio de Miami',
]

export default function Header() {
  const pathname = usePathname()

  const hoje = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  })
  const dataFormatada = hoje.charAt(0).toUpperCase() + hoje.slice(1)
  const tickerItems = [...TICKER_ITEMS, ...TICKER_ITEMS]

  return (
    <>
      <div className="topbar">
        <div className="topbar-inner">
          <span>Miami & Sul da Florida &nbsp;&middot;&nbsp; {dataFormatada}</span>
          <div className="topbar-social">
            <a href="https://facebook.com" target="_blank" rel="noreferrer">Facebook</a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer">YouTube</a>
          </div>
        </div>
      </div>

      <header>
        <div className="header-inner">
          <Link href="/" className="logo">
            <div className="logo-icon" style={{ background: 'linear-gradient(135deg, #009C3B 0%, #FFDF00 60%, #009C3B 100%)' }}>
              <span style={{ fontSize: 22 }}>🦩</span>
            </div>
            <div className="logo-text">
              <div className="name" style={{ color: '#009C3B' }}>Miami Brasileira</div>
              <div className="tagline">O portal da sua comunidade</div>
            </div>
          </Link>

          <nav>
            {CATEGORIAS.map(cat => (
              <Link
                key={cat.href}
                href={cat.href}
                className={pathname === cat.href ? 'active' : ''}
              >
                {cat.label}
              </Link>
            ))}
          </nav>

          <Link href="/contato" className="btn-anuncie">Anuncie</Link>
        </div>
      </header>

      <div className="weather-bar">
        <div className="weather-inner">
          <div className="weather-item">
            <span>Miami</span> <strong>34C</strong>
            <span className="weather-label">Parcialmente nublado</span>
          </div>
          <div className="weather-item">
            <span>Fort Lauderdale</span> <strong>33C</strong>
          </div>
          <div className="weather-item">
            <span>Umidade</span> <strong>72%</strong>
          </div>
          <div className="date-bar">USD/BRL: R$ 5,68 &nbsp;|&nbsp; EUR/BRL: R$ 6,12</div>
        </div>
      </div>

      <div className="ticker">
        <div className="ticker-label">AGORA</div>
        <div className="ticker-wrapper">
          <div className="ticker-track">
            {tickerItems.map((item, i) => (
              <span key={i}>{item}</span>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
