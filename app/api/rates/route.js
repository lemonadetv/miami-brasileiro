// app/api/rates/route.js
// Exchange rates via Frankfurter (ECB data, free, no key required)
export const revalidate = 3600

export async function GET() {
  // Primary: Frankfurter (ECB)
  try {
    const r = await fetch('https://api.frankfurter.app/latest?from=USD&to=BRL,EUR', {
      next: { revalidate: 3600 }, headers: { 'Accept': 'application/json' }
    })
    if (!r.ok) throw new Error('Frankfurter HTTP ' + r.status)
    const d = await r.json()
    const brlPerUsd = d.rates?.BRL
    const eurPerUsd = d.rates?.EUR
    if (!brlPerUsd || !eurPerUsd) throw new Error('Missing rates')
    const brlPerEur = brlPerUsd / eurPerUsd
    return Response.json({
      usd: brlPerUsd.toFixed(2), eur: brlPerEur.toFixed(2),
      usdChange: null, eurChange: null,
      timestamp: new Date().toISOString(), source: 'frankfurter'
    }, { headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200' } })
  } catch(e) { console.error('[rates] Frankfurter failed:', e.message) }

  // Fallback: open.er-api.com
  try {
    const r = await fetch('https://open.er-api.com/v6/latest/USD', {
      next: { revalidate: 3600 }, headers: { 'Accept': 'application/json' }
    })
    if (!r.ok) throw new Error('er-api HTTP ' + r.status)
    const d = await r.json()
    if (d.result !== 'success') throw new Error('er-api: ' + d.result)
    const brlPerUsd = d.rates?.BRL, eurPerUsd = d.rates?.EUR
    if (!brlPerUsd || !eurPerUsd) throw new Error('Missing rates')
    return Response.json({
      usd: brlPerUsd.toFixed(2), eur: (brlPerUsd/eurPerUsd).toFixed(2),
      usdChange: null, eurChange: null,
      timestamp: new Date().toISOString(), source: 'open.er-api'
    }, { headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200' } })
  } catch(e2) { console.error('[rates] open.er-api failed:', e2.message) }

  // Last resort: AwesomeAPI
  try {
    const r = await fetch('https://economia.awesomeapi.com.br/last/USD-BRL,EUR-BRL')
    const d = await r.json()
    return Response.json({
      usd: d.USDBRL ? parseFloat(d.USDBRL.bid).toFixed(2) : null,
      eur: d.EURBRL ? parseFloat(d.EURBRL.bid).toFixed(2) : null,
      usdChange: null, eurChange: null,
      timestamp: new Date().toISOString(), source: 'awesomeapi'
    })
  } catch(e3) {
    return Response.json({ usd: null, eur: null, error: 'All APIs failed' })
  }
}
