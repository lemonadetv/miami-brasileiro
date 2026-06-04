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
  71:'❄️',80:'🌦',81:'🌦',82:'🌦',95:'⛈',96:'⛈',99:'⛈'
}
const WMO_DESC = {
  0:'Ceu limpo',1:'Poucas nuvens',2:'Parcialmente nublado',3:'Nublado',
  45:'Neblina',51:'Garoa',61:'Chuva',80:'Pancadas',95:'Tempestade'
}

export default function Header() {
  const pathname = usePathname()
  const [usdRate, setUsdRate] = useState(null)
  const [eurRate, setEurRate] = useState(null)
  const [weather, setWeather] = useState({ temp: null, icon: '🌤', desc: '' })
  const [social, setSocial] = useState({ facebook: '', instagram: '', youtube: '' })
  const [tickerItems, setTickerItems] = useState([
    { text: 'Renters Insurance na Florida: o seguro que todo brasileiro precisa ter', href: '/categoria/comunidade' },
    { text: 'Green card pelo EB-5: o que mudou em 2026 e como brasileiros podem aproveitar', href: '/categoria/imigracao' },
    { text: 'Como abrir uma LLC na Florida em 2026: guia passo a passo', href: '/categoria/negocios' },
    { text: 'Copa do Mundo 2026 em Miami: tudo que voce precisa saber', href: '/categoria/esportes' },
    { text: 'Plano de saude na Florida: como escolher o melhor para sua familia', href: '/categoria/saude' },
  ])

  useEffect(function() {
    // Exchange rates - Frankfurter API (ECB official, free, CORS enabled)
    Promise.all([
      fetch('https://api.frankfurter.app/latest?from=USD&to=BRL').then(function(r) { return r.json() }),
      fetch('https://api.frankfurter.app/latest?from=EUR&to=BRL').then(function(r) { return r.json() })
    ]).then(function(results) {
      var usdData = results[0]
      var eurData = results[1]
      if (usdData && useData.rates && usdData.rates.BRL) setUsdRate(usdData.rates.BRL.toFixed(2))
      if (eurData && eurData.rates && eurData.rates.BRL) setEurRate(eurData.rates.BRL.toFixed(2))
    }).catch(function(err) {
      console.log('Rates error:', err)
    })

    // Weather - OpenMeteo
    fetch('https://api.open-meteo.com/v1/forecast?latitude=25.7617&longitude=-80.1918&current=temperature_2m,weathercode&temperature_unit=fahrenheit')
      .then(function(r) { return r.json() })
      .then(function(d) {
        if (d && d.current) {
          var tempC = Math.round((d.current.temperature_2m - 32) * 5 / 9)
          var code = d.current.weathercode || 0
          setWeather({ temp: tempC, icon: WMO_ICONS[code] || '🌤', desc: WMO_DESC[code] || '' })
        }
      }).catch(function() {})

    // Social links
    fetch('/api/site-config').then(function(r) { return r.json() })
      .then(function(d) { setSocial({ facebook: d.socialFacebook || '', instagram: d.socialInstagram || '', youtube: d.socialYoutube || '' }) })
      .catch(function() {})

    // Real article headlines for ticker
    fetch('/api/admin/artigos', { credentials: 'include' })
      .then(function(r) { return r.ok ? r.json() : null })
      .then(function(d) {
        if (Array.isArray(d) && d.length > 3) {
          setTickerItems(d.slice(0, 8).map(function(a) { return { text: a.title, href: '/artigo/' + a.id } }))
        }
      }).catch(function() {})
  }, [])

  var hoje = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
  var dataFormatada = hoje.charAt(0).toUpperCase() + hoje.slice(1)
  var doubled = tickerItems.concat(tickerItems)

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
          <a href="https://forecast.weather.gov/MapClick.php?CityName=Miami&state=FL" target="_blank" rel="noreferrer" className="weather-item" style={{ textDecoration: 'none' }}>
            <span>{weather.icon || '🌤'}</span>
            <span>Miami</span>
            <strong>{weather.temp !== null ? weather.temp + '°C' : '--°C'}</strong>
            {weather.desc && <span className="weather-label">{weather.desc}</span>}
          </a>
          <div className="weather-item">
            <span>☁️</span>
            <span>Fort Lauderdale</span>
            <strong>{weather.temp !== null ? (weather.temp - 1) + '°C' : '--°C'}</strong>
          </div>
          <div className="date-bar">
            <span className="rate-item">
              <span className="rate-icon">$</span>
              <span className="rate-label">USD</span>
              <strong className="rate-val">{usdRate ? 'R$ ' + usdRate : 'R$ ...'}</strong>
            </span>
            <span className="rate-sep">|</span>
            <span className="rate-item">
              <span className="rate-icon">€</span>
              <span className="rate-label">EUR</span>
              <strong className="rate-val">{eurRate ? 'R$ ' + eurRate : 'R$ ...'}</strong>
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
                <Link key={i} href={item.href} className="ticker-link">
                  {item.text}
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}
