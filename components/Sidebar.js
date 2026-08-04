'use client'
import { useState, useEffect } from 'react'

function weatherIcon(code) {
if (!code && code !== 0) return 'ð¤ï¸'
if ([0].includes(code)) return 'âï¸'
if ([1,2].includes(code)) return 'â'
if ([3].includes(code)) return 'âï¸'
if ([45,48].includes(code)) return 'ð«ï¸'
if ([51,53,55,61,63,65].includes(code)) return 'ð§ï¸'
if ([71,73,75,77].includes(code)) return 'âï¸'
if ([80,81,82].includes(code)) return 'ð¦ï¸'
if ([95,96,99].includes(code)) return 'âï¸'
return 'ð¤ï¸'
}

function weatherDesc(code) {
if (code === 0) return 'CÃ©u limpo'
if ([1,2].includes(code)) return 'Parcialmente nublado'
if (code === 3) return 'Nublado'
if ([45,48].includes(code)) return 'NÃ©voa'
if ([51,53,55,61,63,65].includes(code)) return 'Chuva'
if ([71,73,75].includes(code)) return 'Neve'
if ([80,81,82].includes(code)) return 'Pancadas de chuva'
if ([95,96,99].includes(code)) return 'Trovoada'
return 'Parcialmente nublado'
}

// ESPN code â ESPN CDN slug overrides (when abbreviation differs from CDN slug)
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
        <span>ð¤ï¸</span> Clima em Miami
      </div>
      <div className="widget-body">
        <div className="weather-main">
          <div className="weather-icon">{weatherIcon(code)}</div>
          <div>
            <span className="weather-temp">{temp}</span>
            <span className="weather-temp-unit">Â°F</span>
          </div>
          <div className="weather-desc">{weatherDesc(code)}</div>
        </div>
        <div className="weather-details">
          <div className="weather-detail">
            <span className="weather-detail-label">ð§ Humidade</span>
            <span className="weather-detail-val">{humidity}%</span>
          </div>
          <div className="weather-detail">
            <span className="weather-detail-label">ð¨ Vento</span>
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
    { flag: 'ðºð¸', code: 'USD', name: 'DÃ³lar', val: rates.usd, chg: rates.usdChange },
    { flag: 'ðªðº', code: 'EUR', name: 'Euro', val: rates.eur, chg: rates.eurChange },
    { flag: 'ðª', code: 'BTC', name: 'Bitcoin', val: rates.btc, chg: rates.btcChange, compact: true },
  ]

  const fmt = (v, compact) => {
    if (!v) return 'â'
    const n = parseFloat(v)
    if (isNaN(n)) return 'â'
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
        <span>ð¹</span> CotaÃ§Ãµes
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
                  {parseFloat(item.chg) >= 0 ? 'â²' : 'â¼'} {Math.abs(parseFloat(item.chg)).toFixed(2)}%
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
        <span>ð¥</span> Mais Lidas
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
      <WeatherWidget />
      <CotacoesWidget />
      <TrendingWidget articles={articles} />
    </div>
  )
}
