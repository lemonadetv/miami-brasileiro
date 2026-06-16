'use client'
import { useState, useEffect } from 'react'

// ── Copa 2026 ──────────────────────────────────────────────────────────────
const COPA_DATA = {
  live: [],
  today: [
    { id:1, home:'🇧🇷', homeCode:'BRA', away:'🇺🇾', awayCode:'URU', homeScore:2, awayScore:1, status:"75'", group:'Grupo D' },
    { id:2, home:'🇦🇷', homeCode:'ARG', away:'🇵🇪', awayCode:'PER', homeScore:1, awayScore:0, status:'INTERVALO', group:'Grupo C' },
  ],
  upcoming: [
    { id:3, home:'🇲🇽', homeCode:'MEX', away:'🇨🇱', awayCode:'CHI', date:'18:00', group:'Grupo B' },
    { id:4, home:'🇺🇸', homeCode:'USA', away:'🇨🇦', awayCode:'CAN', date:'21:00', group:'Grupo A' },
  ]
}

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

function CopaWidget() {
  return (
    <div className="sidebar-widget">
      <div className="widget-header copa-header">
        <span>⚽</span> Copa 2026 – Ao Vivo
      </div>
      <div className="widget-body" style={{ padding: '10px 14px' }}>
        {COPA_DATA.today.map(m => (
          <div key={m.id} className="copa-match">
            <div className="copa-team">
              <span className="copa-team-flag">{m.home}</span>
              <span className="copa-team-name">{m.homeCode}</span>
            </div>
            <div className="copa-score">
              <div className="copa-score-num">{m.homeScore} – {m.awayScore}</div>
              <span className={"copa-score-status" + (m.status.includes("'") ? " live" : "")}>
                {m.status}
              </span>
              <div className="copa-group-label">{m.group}</div>
            </div>
            <div className="copa-team">
              <span className="copa-team-flag">{m.away}</span>
              <span className="copa-team-name">{m.awayCode}</span>
            </div>
          </div>
        ))}
        {COPA_DATA.upcoming.length > 0 && (
          <div>
            <div style={{ fontSize:10, color:'var(--text-muted)', fontWeight:700, textTransform:'uppercase', letterSpacing:'.5px', padding:'8px 0 4px', borderTop:'1px solid var(--border)' }}>
              Hoje mais tarde
            </div>
            {COPA_DATA.upcoming.map(m => (
              <div key={m.id} className="copa-match">
                <div className="copa-team">
                  <span className="copa-team-flag">{m.home}</span>
                  <span className="copa-team-name">{m.homeCode}</span>
                </div>
                <div className="copa-score">
                  <div style={{ fontSize:18, fontWeight:900, color:'var(--text-bright)' }}>{m.date}</div>
                  <div className="copa-group-label">{m.group}</div>
                </div>
                <div className="copa-team">
                  <span className="copa-team-flag">{m.away}</span>
                  <span className="copa-team-name">{m.awayCode}</span>
                </div>
              </div>
            ))}
          </div>
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
  const [rates, setRates] = useState({ usd: null, eur: null, btc: null })

  useEffect(() => {
    fetch('/api/rates')
      .then(r => r.json())
      .then(d => setRates(d))
      .catch(() => {})
  }, [])

  const items = [
    { flag: '🇺🇸', code: 'USD', name: 'Dólar Americano', val: rates.usd ? rates.usd.brl : null, chg: rates.usd ? rates.usd.change : null },
    { flag: '🇪🇺', code: 'EUR', name: 'Euro',             val: rates.eur ? rates.eur.brl : null, chg: rates.eur ? rates.eur.change : null },
    { flag: '🪙',  code: 'BTC', name: 'Bitcoin',          val: rates.btc ? rates.btc.brl : null, chg: rates.btc ? rates.btc.change : null, compact: true },
  ]

  const fmt = (v, compact) => {
    if (!v) return '–'
    if (compact) {
      const n = parseFloat(v)
      if (n > 1000000) return 'R$ ' + (n/1000000).toFixed(2) + 'M'
      if (n > 1000) return 'R$ ' + (n/1000).toFixed(1) + 'K'
    }
    return 'R$ ' + parseFloat(v).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
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
                <div className={"cot-chg " + (parseFloat(item.chg) >= 0 ? 'rate-up' : 'rate-dn')}>
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
          <a key={art.slug || i} href={"/artigo/" + art.slug} className="trending-item">
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
