'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { MortgageCalc, InvestmentCalc, CarCalc } from '../app/components/Toolbox'

const CATEGORIAS = [
  { label: 'Inicio',     href: '/' },
  { label: 'Comunidade', href: '/categoria/comunidade' },
  { label: 'Imigracao',  href: '/categoria/imigracao' },
  { label: 'Negocios',   href: '/categoria/negocios' },
  { label: 'Saude',      href: '/categoria/saude' },
  { label: 'Esportes',   href: '/categoria/esportes' },
  { label: 'Contato',    href: '/contato' },
]

const WMO = {
  icons: {0:'☀️',1:'🌤',2:'⛅',3:'☁️',45:'🌫',51:'🌦',61:'🌧',80:'🌦',95:'⛈'},
  desc:  {0:'Ceu limpo',1:'Poucas nuvens',2:'Parc. nublado',3:'Nublado',45:'Neblina',51:'Garoa',61:'Chuva',80:'Pancadas',95:'Tempestade'},
}

export default function Header() {
  const pathname = usePathname()
  const [rates, setRates] = useState({ usd: null, eur: null, usdChange: null, eurChange: null })
  const [weather, setWeather] = useState({ temp: null, icon: '🌤', desc: '' })
  const [social, setSocial] = useState({ facebook: '', instagram: '', youtube: '' })
  const [toolboxOpen, setToolboxOpen] = useState(null)
  const [tickerItems, setTickerItems] = useState([
    { text: 'Como alugar apartamento em Miami sem historico americano', href: '/categoria/comunidade' },
    { text: 'Green card pelo EB-5: o que mudou para brasileiros em 2026', href: '/categoria/imigracao' },
    { text: 'Copa do Mundo 2026 em Miami: ingressos e o que esperar', href: '/categoria/esportes' },
    { text: 'Plano de saude na Florida: como escolher o melhor plano', href: '/categoria/saude' },
    { text: 'Como abrir uma LLC na Florida em 2026: guia completo', href: '/categoria/negocios' },
  ])

  useEffect(function() {
    fetch('/api/rates')
      .then(function(r) { return r.json() })
      .then(function(d) { setRates(d) })
      .catch(function() {})
    fetch('https://api.open-meteo.com/v1/forecast?latitude=25.7617&longitude=-80.1918&current=temperature_2m,weathercode&temperature_unit=fahrenheit')
      .then(function(r) { return r.json() })
      .then(function(d) {
        if (d && d.current) {
          var c = d.current
          var tempC = Math.round((c.temperature_2m - 32) * 5 / 9)
          var code = c.weathercode || 0
          var baseCode = [45,48,51,53,55,61,63,65,71,73,75,80,81,82,95,96,99].includes(code) ? code : Math.floor(code/10)*10 || code
          setWeather({ temp: tempC, icon: WMO.icons[code] || WMO.icons[baseCode] || '🌤', desc: WMO.desc[code] || WMO.desc[baseCode] || '' })
        }
      }).catch(function() {})
    fetch('/api/site-config').then(function(r) { return r.json() })
      .then(function(d) { setSocial({ facebook: d.socialFacebook||'', instagram: d.socialInstagram||'', youtube: d.socialYoutube||'' }) })
      .catch(function() {})
    fetch('/api/admin/artigos', { credentials: 'include' })
      .then(function(r) { return r.ok ? r.json() : null })
      .then(function(d) {
        if (Array.isArray(d) && d.length > 3) {
          setTickerItems(d.slice(0,8).map(function(a) { return { text: a.title, href: '/artigo/'+a.id } }))
        }
      }).catch(function() {})
  }, [])

  var hoje = new Date().toLocaleDateString('pt-BR', { weekday:'long', day:'numeric', month:'long', year:'numeric' })
  var data = hoje.charAt(0).toUpperCase() + hoje.slice(1)
  var doubled = tickerItems.concat(tickerItems)
  var usdUp = rates.usdChange && parseFloat(rates.usdChange) > 0
  var eurUp = rates.eurChange && parseFloat(rates.eurChange) > 0

  return (
    <>
      <div className="topbar">
        <div className="topbar-inner">
          <span>🌎 Miami &amp; Sul da Florida &nbsp;&middot;&nbsp; {data}</span>
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
            {CATEGORIAS.map(function(c) {
              return <Link key={c.href} href={c.href} className={pathname===c.href?'active':''}>{c.label}</Link>
            })}
          </nav>
          <Link href="/contato" className="btn-anuncie">📣 Anuncie</Link>
        </div>
      </header>
      <div className="weather-bar">
        <div className="weather-inner">
          <a href="https://forecast.weather.gov/MapClick.php?CityName=Miami&state=FL" target="_blank" rel="noreferrer" className="weather-item" style={{ textDecoration:'none' }}>
            <span style={{ fontSize:16 }}>{weather.icon}</span>
            <span>Miami</span>
            <strong>{weather.temp!==null ? weather.temp+'°C' : '--°C'}</strong>
            {weather.desc && <span className="weather-label">{weather.desc}</span>}
          </a>
          <div className="weather-item">
            <span style={{ fontSize:16 }}>{weather.icon}</span>
            <span>Ft. Lauderdale</span>
            <strong>{weather.temp!==null ? (weather.temp-1)+'C' : '--C'}</strong>
          </div>
          <div style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'0 8px'}}>
            <div style={{fontSize:9,color:'#aaa',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:3,fontWeight:700}}>Use nossas ferramentas de calculos</div>
            <div style={{display:'flex',gap:5}}>
              {[{k:'mortgage',i:'🏠',l:'Financiamento'},{k:'investment',i:'📈',l:'Investimentos'},{k:'car',i:'🚗',l:'Veiculos'}].map(function(t){return(
                <button key={t.k} onClick={function(){setToolboxOpen(t.k);}}
                  style={{background:'#f5f5f5',border:'1px solid #e0e0e0',borderRadius:6,padding:'3px 9px',cursor:'pointer',fontSize:11,fontWeight:600,color:'#333',display:'flex',alignItems:'center',gap:4}}>
                  <span>{t.i}</span><span>{t.l}</span>
                </button>
              )})}
            </div>
          </div>
          <div className="date-bar">
            <span className="rate-pill" style={{ color: usdUp ? '#15803D' : '#DC2626' }}>
              <span className="rate-flag">🇺🇸</span>
              <span className="rate-code">USD</span>
              <strong>{rates.usd ? 'R$ '+rates.usd : '...'}</strong>
              {rates.usdChange && <span style={{ fontSize:10 }}>{usdUp?'▲':'▼'}{Math.abs(rates.usdChange)}%</span>}
            </span>
            <span className="rate-pill" style={{ color: eurUp ? '#15803D' : '#DC2626' }}>
              <span className="rate-flag">🇪🇺</span>
              <span className="rate-code">EUR</span>
              <strong>{rates.eur ? 'R$ '+rates.eur : '...'}</strong>
              {rates.eurChange && <span style={{ fontSize:10 }}>{eurUp?'▲':'▼'}{Math.abs(rates.eurChange)}%</span>}
            </span>
          </div>
        </div>
      </div>
      <div className="ticker">
        <div className="ticker-label">🔴 AGORA</div>
        <div className="ticker-wrapper">
          <div className="ticker-track">
            {doubled.map(function(item, i) {
              return <Link key={i} href={item.href} className="ticker-link">{item.text}</Link>
            })}
          </div>
        </div>
      </div>
      {toolboxOpen==='mortgage'&&<MortgageCalc onClose={function(){setToolboxOpen(null);}}/>}
      {toolboxOpen==='investment'&&<InvestmentCalc onClose={function(){setToolboxOpen(null);}}/>}
      {toolboxOpen==='car'&&<CarCalc onClose={function(){setToolboxOpen(null);}}/>}
    </>
  )
}