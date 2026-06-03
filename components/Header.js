'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

const CATEGORIAS = [
  { label: 'Inicio',     href: '/' },
  { label: 'Comunidade', href: '/categoria/comunidade' },
  { label: 'Imigracao',  href: '/categoria/imigracao' },
  { label: 'Negocios',   href: '/categoria/negocios' },
  { label: 'Saude',      href: '/categoria/saude' },
  { label: 'Esportes',   href: '/categoria/esportes' },
  { label: 'Contato',    href: '/contato' },
]

const WMO_ICONS = {
  0:'☀️',1:'🌤',2:'⛅',3:'☁️',45:'🌫',48:'🌫',
  51:'🌦',53:'🌦',55:'🌧',61:'🌧',63:'🌧',65:'🌧',
  71:'❄️',73:'❄️',75:'❄️',80:'🌦',81:'🌦',82:'🌦',
  95:'⛈',96:'⛈',99:'⛈',
}
const WMO_DESC = {
  0:'Ceu limpo',1:'Poucas nuvens',2:'Parcialmente nublado',3:'Nublado',
  45:'Neblina',48:'Neblina',51:'Garoa leve',53:'Garoa',55:'Garoa forte',
  61:'Chuva fraca',63:'Chuva moderada',65:'Chuva forte',
  71:'Neve',73:'Neve',75:'Neve forte',80:'Pancadas',81:'Pancadas',82:'Pancadas fortes',
  95:'Tempestade',96:'Tempestade',99:'Tempestade',
}

export default function Header() {
  const pathname = usePathname()
  const [rates, setRates] = useState({ usd: null, eur: null })
  const [weather, setWeather] = useState({ temp: null, icon: '🌤', desc: 'Carregando...' })
  const [social, setSocial] = useState({ facebook: '', instagram: '', youtube: '' })
  const [tickerArticles, setTickerArticles] = useState([])

  useEffect(function() {
    // Exchange rates (Frankfurter = ECB official rates, free)
    function fetchRates() {
      fetch('https://api.frankfurter.app/latest?from=USD&to=BRL')
        .then(function(r) { return r.json() })
        .then(function(d) {
          const usd = d.rates && d.rates.BRL ? d.rates.BRL.toFixed(2) : null
          fetch('https://api.frankfurter.app/latest?from=EUR&to=BRL')
            .then(function(r2) { return r2.json() })
            .then(function(d2) {
              const eur = d2.rates && d2.rates.BRL ? d2.rates.BRL.toFixed(2) : null
              setRates({ usd, eur })
            }).catch(function() {})
        }).catch(function() {})
    }
    fetchRates()
    const rateInterval = setInterval(fetchRates, 3600000)

    // Weather - OpenMeteo free API, no key needed
    fetch('https://api.open-meteo.com/v1/forecast?latitude=25.7617&longitude=-80.1918&current=temperature_2m,weathercode&temperature_unit=fahrenheit&forecast_days=1')
      .then(function(r) { return r.json() })
      .then(function(d) {
        if (d.current) {
          const c = d.current
          const tempF = Math.round(c.temperature_2m)
          const tempC = Math.round((tempF - 32) * 5 / 9)
          const code = c.weathercode || 0
          setWeather({
            temp: tempC,
            tempF: tempF,
            icon: WMO_ICONS[code] || '🌤',
            desc: WMO_DESC[code] || 'Tempo variavel',
            code
          })
        }
      }).catch(function() {})

    // Site config for social links
    fetch('/api/site-config')
      .then(function(r) { return r.json() })
      .then(function(d) {
        setSocial({ facebook: d.socialFacebook || '', instagram: d.socialInstagram || '', youtube: d.socialYoutube || '' })
      }).catch(function() {})

    // Fetch articles for ticker
    fetch('/api/admin/artigos', { credentials: 'include' })
      .then(function(r) { return r.ok ? r.json() : [] })
      .then(function(d) { if (Array.isArray(d) && d.length > 0) setTickerArticles(d.slice(0, 8)) })
      .catch(function() {})

    return function() { clearInterval(rateInterval) }
  }, [])

  const hoje = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
  const dataFormatada = hoje.charAt(0).toUpperCase() + hoje.slice(1)

  // Ticker items: real articles if available, else defaults
  const defaultTicker = [
    { text: 'Novos criterios do EB-5 abrem oportunidade historica para brasileiros', href: '/categoria/imigracao' },
    { text: 'Como abrir uma LLC na Florida: guia passo a passo para brasileiros', href: '/categoria/negocios' },
    { text: 'Copa do Mundo 2026 em Miami: tudo que voce precisa saber', href: '/categoria/esportes' },
    { text: 'Plano de saude na Florida: como escolher o melhor para sua familia', href: '/categoria/saude' },
    { text: 'Carteira de motorista na Florida: passo a passo para brasileiros', href: '/categoria/comunidade' },
  ]
  const tickerItems = tickerArticles.length > 0
    ? tickerArticles.map(function(a) { return { text: a.title, href: '/artigo/' + a.id } })
    : defaultTicker
  const doubled = [...tickerItems, ...tickerItems]

  return (
    <>
      <div className="topbar">
        <div className="topbar-inner">
          <span>🌎 Miami &amp; Sul da Florida &nbsp;&middot;&nbsp; {dataFormatada}</span>
          <div className="topbar-social">
            {social.facebook && <a href={social.facebook} target="_blank" rel="noreferrer">📘 Facebook</a>}
            {social.instagram && <a href={social.instagram} target="_blank" rel="noreferrer">📸 Instagram</a>}
            {social.youtube && <a href={social.youtube} target="_blank" rel="noreferrer">▶ YouTube</a>}
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
            {CATEGORIAS.map(function(cat) {
              return (
                <Link key={cat.href} href={cat.href} className={pathname === cat.href ? 'active' : ''}>
                  {cat.label}
                </Link>
              )
            })}
          </nav>

          <Link href="/contato" className="btn-anuncie">📣 Anuncie</Link>
        </div>
      </header>

      <div className="weather-bar">
        <div className="weather-inner">
          <a href="https://forecast.weather.gov/MapClick.php?CityName=Miami&state=FL" target="_blank" rel="noreferrer" className="weather-item" style={{ textDecoration: 'none', cursor: 'pointer' }}>
            <span style={{ fontSize: 16 }}>{weather.icon}</span>
            <span>Miami</span>
            <strong>{weather.temp !== null ? weather.temp + 'C' : '--C'}</strong>
            <span className="weather-label">{weather.desc}</span>
          </a>
          <a href="https://forecast.weather.gov/MapClick.php?CityName=Fort+Lauderdale&state=FL" target="_blank" rel="noreferrer" className="weather-item" style={{ textDecoration: 'none', cursor: 'pointer' }}>
            <span style={{ fontSize: 16 }}>🌤</span>
            <span>Fort Lauderdale</span>
            <strong>{weather.temp !== null ? (weather.temp - 1) + 'C' : '--C'}</strong>
          </a>
          <div className="weather-item">
            <span style={{ fontSize: 14 }}>💧</span>
            <span>Umidade</span>
            <strong>72%</strong>
          </div>
          <div className="date-bar" style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <span title="Dolar americano">
              <span style={{ fontSize: 13 }}>🇺🇸</span> USD/BRL: {rates.usd ? 'R$ ' + rates.usd : '...'}
            </span>
            <span title="Euro">
              <span style={{ fontSize: 13 }}>🇪🇺</span> EUR/BRL: {rates.eur ? 'R$ ' + rates.eur : '...'}
            </span>
          </div>
        </div>
      </div>

      <div className="ticker">
        <div className="ticker-label">🔴 AGORA</div>
        <div className="ticker-wrapper">
          <div className="ticker-track">
            {doubled.map(function(item, i) {
              return (
                <a key={i} href={item.href} style={{ padding: '0 36px', borderRight: '1px solid rgba(255,255,255,.3)', color: 'white', textDecoration: 'none', flexShrink: 0, display: 'inline-flex', alignItems: 'center' }}>
                  {item.text}
                </a>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}
