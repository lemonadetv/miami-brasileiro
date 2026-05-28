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

// Headlines para o ticker — na prática virão do banco de dados
const TICKER_ITEMS = [
  'Novos requisitos para visto EB-5 entram em vigor em junho',
  'Miami bate recorde de turistas brasileiros no primeiro trimestre de 2026',
  'Copa do Mundo 2026: Brasil enfrenta Argentina em Miami — ingressos esgotados',
  'Prefeitura de Miami aprova novo programa de moradia para imigrantes',
  'Câmbio: dólar fecha a R$ 5,68 em mais um dia de volatilidade',
  'USCIS abre novas vagas de entrevista para asilo no escritório de Miami',
]

export default function Header() {
  const pathname = usePathname()

  // Pega a data de hoje formatada em pt-BR
  const hoje = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  })

  // Capitaliza a primeira letra
  const dataFormatada = hoje.charAt(0).toUpperCase() + hoje.slice(1)

  // Repete os itens do ticker para criar loop perfeito
  const tickerItems = [...TICKER_ITEMS, ...TICKER_ITEMS]

  return (
    <>
      {/* TOP BAR */}
      <div className="topbar">
        <div className="topbar-inner">
          <span>📍 Miami & Sul da Flórida &nbsp;·&nbsp; {dataFormatada}</span>
          <div className="topbar-social">
            <a href="https://facebook.com" target="_blank" rel="noreferrer">📘 Facebook</a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer">📸 Instagram</a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer">▶ YouTube</a>
            <a href="https://wa.me/1305000000" target="_blank" rel="noreferrer">💬 WhatsApp</a>
          </div>
        </div>
      </div>

      {/* MAIN HEADER */}
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
              <Link
                key={cat.href}
                href={cat.href}
                className={pathname === cat.href ? 'active' : ''}
              >
                {cat.label}
              </Link>
            ))}
          </nav>

          <Link href="/contato" className="btn-anuncie">📣 Anuncie</Link>
        </div>
      </header>

      {/* WEATHER BAR */}
      <div className="weather-bar">
        <div className="weather-inner">
          <div className="weather-item">
            🌤 <span>Miami</span> <strong>34°C</strong>
            <span className="weather-label">Parcialmente nublado</span>
          </div>
          <div className="weather-item">
            🌡 <span>Fort Lauderdale</span> <strong>33°C</strong>
          </div>
          <div className="weather-item">
            💧 <span>Umidade</span> <strong>72%</strong>
          </div>
          <div className="date-bar">USD/BRL: R$ 5,68 &nbsp;|&nbsp; EUR/BRL: R$ 6,12</div>
        </div>
      </div>

      {/* TICKER */}
      <div className="ticker">
        <div className="ticker-label">🔴 AO VIVO</div>
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
