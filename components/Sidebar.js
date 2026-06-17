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

// ESPN code → ESPN CDN slug overrides (when abbreviation differs from CDN slug)
const ESPN_SLUG = {
  ENG: 'england', SCO: 'scotland', WAL: 'wales', NIR: 'northern-ireland',
  COD: 'dr-congo', CIV: 'ivory-coast', BIH: 'bosnia-herzegovina',
  KOR: 'south-korea', PRK: 'north-korea', USA: 'usa', UAE: 'uae',
  TRI: 'trinidad-and-tobago', CRC: 'costa-rica', SLV: 'el-salvador',
}

function TeamLogo({ code }) {
  const [err, setErr] = useState(false)
  const slug = ESPN_SLUG[code] || code.toLowerCase()
  const src = `https://a.espncdn.com/i/teamlogos/countries/500/${slug}.png`
  if (err) {
    return (
      <div style={{
        width: 36, height: 36, borderRadius: 6, background: 'rgba(255,255,255,0.08)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 10, fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '.5px'
      }}>{code}</div>
    )
  }
  return (
    <img
      src={src}
      alt={code}
      width={36}
      height={36}
      style={{ borderRadius: 6, objectFit: 'contain', background: 'rgba(255,255,255,0.06)', display: 'block' }}
      onError={() => setErr(true)}
    />
  )
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

  const fmtTime = (dateStr) => {
    try {
      return new Date(dateStr).toLocaleTimeString('pt-BR', {
        hour: '2-digit', minute: '2-digit', timeZone: 'America/New_York'
      })
    } catch { return '' }
  }

  const hasLive = matches?.some(m => m.isLive)

  return (
    <div className="sidebar-widget">
      <div className="widget-header copa-header" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span>⚽</span>
        <span style={{ fontWeight: 800, letterSpacing: '.3px' }}>COPA 2026</span>
        {hasLive && (
          <span style={{
            marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5,
            fontSize: 10, color: '#ff4444', fontWeight: 800
          }}>
            <span style={{
              width: 7, height: 7, borderRadius: '50%', background: '#ff4444',
              display: 'inline-block', boxShadow: '0 0 0 2px rgba(255,68,68,.3)',
              animation: 'blink 1.2s ease-in-out infinite'
            }} />
            AO VIVO
          </span>
        )}
      </div>

      <div className="widget-body" style={{ padding: 0 }}>
        {matches === null ? (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 12, padding: '16px 0' }}>
            Carregando...
          </div>
        ) : matches.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 12, padding: '16px 0' }}>
            Nenhum jogo hoje
          </div>
        ) : (
          matches.map((m, i) => (
            <div key={m.id} style={{
              padding: '11px 14px',
              borderBottom: i < matches.length - 1 ? '1px solid var(--border)' : 'none',
              background: m.isLive ? 'rgba(255,68,68,.04)' : 'transparent',
            }}>
              {/* Group + Status */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{
                  fontSize: 9, fontWeight: 700, color: 'var(--text-muted)',
                  textTransform: 'uppercase', letterSpacing: '1px'
                }}>
                  {m.group || 'Copa 2026'}
                </span>
                {m.isLive ? (
                  <span style={{
                    fontSize: 9, fontWeight: 800, color: '#ff4444',
                    display: 'flex', alignItems: 'center', gap: 3
                  }}>
                    ● {m.displayClock}
                  </span>
                ) : m.isCompleted ? (
                  <span style={{
                    fontSize: 9, fontWeight: 700, color: 'var(--text-muted)',
                    background: 'rgba(255,255,255,0.08)', padding: '2px 6px',
                    borderRadius: 3, letterSpacing: '.5px'
                  }}>
                    ENCERRADO
                  </span>
                ) : (
                  <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--accent)', letterSpacing: '.3px' }}>
                    {fmtTime(m.date)} ET
                  </span>
                )}
              </div>

              {/* Teams + Score */}
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {/* Home */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                  <TeamLogo code={m.homeCode} />
                  <span style={{
                    fontSize: 10, fontWeight: 800, color: 'var(--text)',
                    textTransform: 'uppercase', letterSpacing: '.5px'
                  }}>{m.homeCode}</span>
                </div>

                {/* Score / VS */}
                <div style={{ flex: 0, minWidth: 70, textAlign: 'center' }}>
                  {(m.isLive || m.isCompleted) ? (
                    <div>
                      <span style={{
                        fontSize: 22, fontWeight: 900, color: 'var(--text-bright)',
                        letterSpacing: '-1px', lineHeight: 1
                      }}>
                        {m.homeScore}
                        <span style={{ color: 'var(--text-muted)', margin: '0 3px' }}>–</span>
                        {m.awayScore}
                      </span>
                    </div>
                  ) : (
                    <span style={{
                      fontSize: 12, fontWeight: 700, color: 'var(--text-muted)',
                      background: 'rgba(255,255,255,0.06)', padding: '4px 8px',
                      borderRadius: 4, letterSpacing: '1px'
                    }}>VS</span>
                  )}
                </div>

                {/* Away */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                  <TeamLogo code={m.awayCode} />
                  <span style={{
                    fontSize: 10, fontWeight: 800, color: 'var(--text)',
                    textTransform: 'uppercase', letterSpacing: '.5px'
                  }}>{m.awayCode}</span>
                </div>
              </div>
            </div>
          ))
        )}

        <div style={{ padding: '10px 14px' }}>
          <a href="/copa-2026" style={{
            display: 'block', textAlign: 'center', fontSize: 11, fontWeight: 700,
            color: 'var(--accent)', textDecoration: 'none', padding: '7px 0',
            border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6,
            letterSpacing: '.3px', transition: 'background .2s'
          }}>
            Ver todos os jogos →
          </a>
        </div>
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
  const [lastUpdate, setLastUpdate] = useState(null)

  useEffect(() => {
    const load = () => {
      fetch('/api/rates')
        .then(r => r.json())
        .then(d => { setRates(d); setLastUpdate(new Date()) })
        .catch(() => {})
    }
    load()
    const t = setInterval(load, 3600000)
    return () => clearInterval(t)
  }, [])

  const items = [
    { flag: '🇺🇸', code: 'USD', name: 'Dólar', val: rates.usd, chg: rates.usdChange },
    { flag: '🇪🇺', code: 'EUR', name: 'Euro', val: rates.eur, chg: rates.eurChange },
    { flag: '🪙', code: 'BTC', name: 'Bitcoin', val: rates.btc, chg: rates.btcChange, compact: true },
  ]

  const fmt = (v, compact) => {
    if (!v) return '–'
    const n = parseFloat(v)
    if (isNaN(n)) return '–'
    if (compact) {
      if (n >= 1000000) return 'R$ ' + (n/1000000).toFixed(2) + 'M'
      if (n >= 1000) return 'R$ ' + (n/1000).toFixed(1) + 'K'
    }
    return 'R$ ' + n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  const fmtTime = (d) => {
    if (!d) return ''
    return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="sidebar-widget">
      <div className="widget-header cot-header" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span>💹</span> Cotações
        {lastUpdate && (
          <span style={{ marginLeft: 'auto', fontSize: 9, color: 'var(--text-muted)', fontWeight: 400 }}>
            {fmtTime(lastUpdate)}
          </span>
        )}
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
