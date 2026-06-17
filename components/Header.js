'use client'
import { useState, useEffect } from 'react'

const CATEGORIES = [
  { label: '🏠 Início', href: '/' },
  { label: '🏙️ Comunidade', href: '/categoria/comunidade' },
  { label: '✈️ Imigração', href: '/categoria/imigracao' },
  { label: '💼 Negócios', href: '/categoria/negocios' },
  { label: '🏥 Saúde', href: '/categoria/saude' },
  { label: '⚽ Esportes', href: '/categoria/esportes' },
  { label: '🎭 Cultura', href: '/categoria/cultura-e-lazer' },
  { label: '🏆 Copa 2026', href: '/copa-2026', isCopa: true },
]

function weatherIcon(code) {
  if (code === 0) return '☀️'
  if ([1,2,3].includes(code)) return '⛅'
  if ([45,48].includes(code)) return '🌫️'
  if (code < 70) return '🌧️'
  if (code < 80) return '❄️'
  if (code < 90) return '🌦️'
  return '⛈️'
}

function Logo() {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: '0.18em', lineHeight: 1 }}>
      <span style={{
        color: '#FF6EC7',
        fontWeight: 900,
        fontStyle: 'italic',
        fontSize: '1.15em',
        letterSpacing: '-0.5px',
        textShadow: '0 0 18px rgba(255,110,199,0.35)',
      }}>Miami</span>
      <span style={{
        fontWeight: 900,
        fontSize: '1.15em',
        letterSpacing: '-0.5px',
        background: 'linear-gradient(135deg, #009C3B 0%, #009C3B 22%, #FFDF00 38%, #FFDF00 62%, #009C3B 78%, #009C3B 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      }}>Brasileira</span>
    </span>
  )
}

export default function Header({ articles = [] }) {
  const [theme, setTheme] = useState('dark')
  const [weather, setWeather] = useState(null)
  const [rates, setRates] = useState({})
  const [activePath, setActivePath] = useState('/')

  useEffect(() => {
    const saved = localStorage.getItem('mb-theme') || 'dark'
    setTheme(saved)
    document.documentElement.setAttribute('data-theme', saved)
    setActivePath(window.location.pathname)
  }, [])

  useEffect(() => {
    fetch('https://api.open-meteo.com/v1/forecast?latitude=25.7617&longitude=-80.1918&current=temperature_2m,weather_code&temperature_unit=fahrenheit&timezone=America%2FNew_York')
      .then(r => r.json())
      .then(d => setWeather(d.current))
      .catch(() => {})
    fetch('/api/rates')
      .then(r => r.json())
      .then(d => setRates(d))
      .catch(() => {})
  }, [])

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    document.documentElement.setAttribute('data-theme', next)
    localStorage.setItem('mb-theme', next)
  }

  const fmtRate = (val) => {
    if (!val) return '–'
    return 'R$ ' + parseFloat(val).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  return (
    <header className="msn-header">
      <div className="msn-header-top">
        <a href="/" className="msn-logo" style={{ textDecoration: 'none' }}>
          <Logo />
        </a>

        <div className="msn-search">
          <span className="msn-search-icon">🔍</span>
          <input type="search" placeholder="Buscar notícias…" aria-label="Buscar" />
        </div>

        <div className="msn-header-right">
          {weather && (
            <div className="msn-weather">
              <span>{weatherIcon(weather.weather_code)}</span>
              <span className="temp">{Math.round(weather.temperature_2m)}°F</span>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Miami</span>
            </div>
          )}
          <div className="msn-rates">
            {rates.usd && (
              <div className="rate-pill">
                <span className="flag">🇺🇸</span>
                <span className="code">USD</span>
                <span className="val">{fmtRate(rates.usd)}</span>
                {rates.usdChange && (
                  <span className={'chg ' + (parseFloat(rates.usdChange) >= 0 ? 'rate-up' : 'rate-dn')}>
                    {parseFloat(rates.usdChange) >= 0 ? '▲' : '▼'} {Math.abs(parseFloat(rates.usdChange)).toFixed(2)}%
                  </span>
                )}
              </div>
            )}
            {rates.eur && (
              <div className="rate-pill">
                <span className="flag">🇪🇺</span>
                <span className="code">EUR</span>
                <span className="val">{fmtRate(rates.eur)}</span>
                {rates.eurChange && (
                  <span className={'chg ' + (parseFloat(rates.eurChange) >= 0 ? 'rate-up' : 'rate-dn')}>
                    {parseFloat(rates.eurChange) >= 0 ? '▲' : '▼'} {Math.abs(parseFloat(rates.eurChange)).toFixed(2)}%
                  </span>
                )}
              </div>
            )}
          </div>
          <button className="dark-toggle" onClick={toggleTheme} aria-label="Alternar tema" title={theme === 'dark' ? 'Modo claro' : 'Modo escuro'}>
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </div>

      <nav className="msn-nav" aria-label="Categorias">
        <div className="msn-nav-inner">
          {CATEGORIES.map(cat => (
            <a
              key={cat.href}
              href={cat.href}
              className={`msn-nav-link${cat.isCopa ? ' copa' : ''}${activePath === cat.href || (cat.href !== '/' && activePath.startsWith(cat.href)) ? ' active' : ''}`}
            >
              {cat.label}
            </a>
          ))}
        </div>
      </nav>

      {articles.length > 0 && (
        <div className="ticker" role="marquee" aria-label="Últimas notícias">
          <div className="ticker-label">Ao Vivo</div>
          <div className="ticker-wrapper">
            <div className="ticker-track">
              {[...articles.slice(0, 8), ...articles.slice(0, 8)].map((art, i) => (
                <a key={i} href={`/artigo/${art.slug}`} className="ticker-link">
                  {art.title}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
