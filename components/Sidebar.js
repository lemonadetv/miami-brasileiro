'use client'
import { useState, useEffect } from 'react'

function weatherIcon(code) {
  if (!code && code !== 0) return '🌤️'
  if ([0].includes(code)) return '☀️'
  if ([1,2].includes(code)) return '⛅'
  if ([3].includes(code)) return '☁️'
  if ([45,48].includes(code)) return '🌫️'
  if ([51,53,55,61,63,65].includes(code)) return '🌧️'
  if ([71,73,75,77].includes(code)) return '❄️'
  if ([80,81,82].includes(code)) return '🌦️'
  if ([95,96,99].includes(code)) return '⛈️'
  return '🌤️'
}

function weatherDesc(code) {
  if (code === 0) return 'Céu limpo'
  if ([1,2].includes(code)) return 'Parcialmente nublado'
  if (code === 3) return 'Nublado'
  if ([45,48].includes(code)) return 'Névoa'
  if ([51,53,55,61,63,65].includes(code)) return 'Chuva'
  if ([71,73,75].includes(code)) return 'Neve'
  if ([80,81,82].includes(code)) return 'Pancadas de chuva'
  if ([95,96,99].includes(code)) return 'Trovoada'
  return 'Parcialmente nublado'
}

const FLAG = {
  BRA:'🇧🇷',ARG:'🇦🇷',URU:'🇺🇾',COL:'🇨🇴',
  CHI:'🇨🇱',PER:'🇵🇪',USA:'🇺🇸',MEX:'🇲🇽',
  CAN:'🇨🇦',ECU:'🇪🇨',PAR:'🇵🇾',VEN:'🇻🇪',
  BOL:'🇧🇴',PAN:'🇵🇦',CRC:'🇨🇷',HON:'🇭🇳',
  JAM:'🇯🇲',TRI:'🇹🇹',GER:'🇩🇪',FRA:'🇫🇷',
  ESP:'🇪🇸',POR:'🇵🇹',NED:'🇳🇱',BEL:'🇧🇪',
  ITA:'🇮🇹',CRO:'🇭🇷',SUI:'🇨🇭',AUT:'🇦🇹',
  DEN:'🇩🇰',POL:'🇵🇱',SER:'🇷🇸',NOR:'🇳🇴',
  SWE:'🇸🇪',SEN:'🇸🇳',GHA:'🇬🇭',CMR:'🇨🇲',
  MAR:'🇲🇦',TUN:'🇹🇳',EGY:'🇪🇬',NGA:'🇳🇬',
  CIV:'🇨🇮',MLI:'🇲🇱',ALG:'🇩🇿',IRQ:'🇮🇶',
  JPN:'🇯🇵',KOR:'🇰🇷',AUS:'🇦🇺',IRN:'🇮🇷',
  SAU:'🇸🇦',QAT:'🇶🇦',UAE:'🇦🇪',JOR:'🇯🇴',
  UZB:'🇺🇿',CHN:'🇨🇳',TUR:'🇹🇷',GRE:'🇬🇷',
}

function CopaWidget() {
  const [matches, setMatches] = useState(null)

  useEffect(() => {
    const load = () => {
      fetch('/api/copa')
        .then(r => r.json())
        .then(d => setMatches(d.events || []))
        .catch(() => setMatches([]))
    }
    load()
    const t = setInterval(load, 60000)
    return () => clearInterval(t)
  }, [])

  const f = (code) => FLAG[code] || '🏳️'

  const fmt = (dateStr) => {
    try {
      return new Date(dateStr).toLocaleTimeString('pt-BR', {
        hour:'2-digit', minute:'2-digit', timeZone:'America/New_York'
      })
    } catch { return '' }
  }

  const live = matches?.filter(m => m.isLive) || []
  const done = matches?.filter(m => m.isCompleted) || []
  const next = matches?.filter(m => m.isScheduled) || []
  const hasResults = live.length > 0 || done.length > 0

  const MatchRow = ({ m }) => (
    <div className="copa-match">
      <div className="copa-team">
        <span className="copa-team-flag">{f(m.homeCode)}</span>
        <span className="copa-team-name">{m.homeCode}</span>
      </div>
      <div className="copa-score">
        {(m.isLive || m.isCompleted) ? (
          <>
            <div className="copa-score-num">{m.homeScore} – {m.awayScore}</div>
            <span className={'copa-score-status' + (m.isLive ? ' live' : '')}>
              {m.isLive ? m.displayClock : 'FIM'}
            </span>
          </>
        ) : (
          <div style={{ fontSize:18, fontWeight:900, color:'var(--text-bright)' }}>{fmt(m.date)}</div>
        )}
        {m.group && <div className="copa-group-label">{m.group}</div>}
      </div>
      <div className="copa-team">
        <span className="copa-team-flag">{f(m.awayCode)}</span>
        <span className="copa-team-name">{m.awayCode}</span>
      </div>
    </div>
  )

  return (
    <div className="sidebar-widget">
      <div className="widget-header copa-header" style={{ display:'flex', alignItems:'center', gap:6 }}>
        <span>⚽</span> Copa 2026 – Ao Vivo
        {live.length > 0 && (
          <span style={{ marginLeft:'auto', fontSize:10, color:'#ff4444', fontWeight:700 }}>● AO VIVO</span>
        )}
      </div>
      <div className="widget-body" style={{ padding:'10px 14px' }}>
        {matches === null ? (
          <div style={{ textAlign:'center', color:'var(--text-muted)', fontSize:12, padding:'12px 0' }}>
            Carregando...
          </div>
        ) : matches.length === 0 ? (
          <div style={{ textAlign:'center', color:'var(--text-muted)', fontSize:12, padding:'12px 0' }}>
            Nenhum jogo hoje
          </div>
        ) : (
          <>
            {live.map(m => <MatchRow key={m.id} m={m} />)}
            {done.map(m => <MatchRow key={m.id} m={m} />)}
            {next.length > 0 && (
              <>
                {hasResults && (
                  <div style={{ fontSize:10, color:'var(--text-muted)', fontWeight:700, textTransform:'uppercase', letterSpacing:'.5px', padding:'8px 0 4px', borderTop:'1px solid var(--border)' }}>
                    Hoje mais tarde
                  </div>
                )}
                {next.slice(0, 3).map(m => <MatchRow key={m.id} m={m} />)}
              </>
            )}
          </>
        )}
        <a href="/copa-2026" className="copa-live-btn">Ver todos os jogos →</a>
      </div>
    </div>
  )
}

function WeatherWidget() {
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    fetch('https://api.open-meteo.com/v1/forecast?latitude=25.7617&longitude=-80.1918&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=America%2FNew_York')
      .then(r => r.json())
      .then(d => setWeather(d.current))
      .catch(() => {})
  }, [])

  const temp = weather ? Math.round(weather.temperature_2m) : '--'
  const humidity = weather ? weather.relative_humidity_2m : '--'
  const wind = weather ? Math.round(weather.wind_speed_10m) : '--'
  const code = weather ? weather.weather_code : null

  return (
    <div className="sidebar-widget">
      <div className="widget-header weather-header">
        <span>🌤️</span> Clima em Miami
      </div>
      <div className="widget-body">
        <div className="weather-main">
          <div className="weather-icon">{weatherIcon(code)}</div>
          <div>
            <span className="weather-temp">{temp}</span>
            <span className="weather-temp-unit">°F</span>
          </div>
          <div className="weather-desc">{weatherDesc(code)}</div>
        </div>
        <div className="weather-details">
          <div className="weather-detail">
            <span className="weather-detail-label">💧 Humidade</span>
            <span className="weather-detail-val">{humidity}%</span>
          </div>
          <div className="weather-detail">
            <span className="weather-detail-label">💨 Vento</span>
            <span className="weather-detail-val">{wind} mph</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function CotacoesWidget() {
  const [rates, setRates] = useState({})

  useEffect(() => {
    fetch('/api/rates')
      .then(r => r.json())
      .then(d => setRates(d))
      .catch(() => {})
  }, [])

  const items = [
    { flag: '🇺🇸', code: 'USD', name: 'Dólar',  val: rates.usd,  chg: rates.usdChange },
    { flag: '🇪🇺', code: 'EUR', name: 'Euro',    val: rates.eur,  chg: rates.eurChange },
    { flag: '🪙',  code: 'BTC', name: 'Bitcoin', val: rates.btc,  chg: rates.btcChange, compact: true },
  ]

  const fmt = (v, compact) => {
    if (!v) return '–'
    const n = parseFloat(v)
    if (compact) {
      if (n > 1000000) return 'R$ ' + (n/1000000).toFixed(2) + 'M'
      if (n > 1000) return 'R$ ' + (n/1000).toFixed(1) + 'K'
    }
    return 'R$ ' + n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  return (
    <div className="sidebar-widget">
      <div className="widget-header cot-header">
        <span>💹</span> Cotações
      </div>
      <div className="widget-body">
        {items.map(item => (
          <div key={item.code} className="cot-item">
            <div className="cot-left">
              <span className="cot-flag">{item.flag}</span>
              <div>
                <div className="cot-code">{item.code}</div>
                <div className="cot-name">{item.name}</div>
              </div>
            </div>
            <div className="cot-right">
              <div className="cot-val">{fmt(item.val, item.compact)}</div>
              {item.chg && (
                <div className={'cot-chg ' + (parseFloat(item.chg) >= 0 ? 'rate-up' : 'rate-dn')}>
                  {parseFloat(item.chg) >= 0 ? '▲' : '▼'} {Math.abs(parseFloat(item.chg)).toFixed(2)}%
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function TrendingWidget({ articles = [] }) {
  const top = articles.slice(0, 5)
  if (top.length === 0) return null
  return (
    <div className="sidebar-widget">
      <div className="widget-header trending-header">
        <span>🔥</span> Mais Lidas
      </div>
      <div className="widget-body">
        {top.map((art, i) => (
          <a key={art.slug || i} href={'/artigo/' + art.slug} className="trending-item">
            <span className="trending-num">{i + 1}</span>
            <span className="trending-title">{art.title}</span>
          </a>
        ))}
      </div>
    </div>
  )
}

export default function Sidebar({ articles = [] }) {
  return (
    <div className="msn-sidebar">
      <CopaWidget />
      <WeatherWidget />
      <CotacoesWidget />
      <TrendingWidget articles={articles} />
    </div>
  )
}
