// app/api/rates/route.js
// Server-side exchange rates from open.er-api.com (free, no key required)
export const revalidate = 600 // cache 10 minutes

export async function GET() {
  try {
    // Fetch USD base rates (free API, no key, updated daily)
    const r = await fetch('https://open.er-api.com/v6/latest/USD', {
      next: { revalidate: 600 },
      headers: { 'Accept': 'application/json' }
    })
    if (!r.ok) throw new Error('API HTTP ' + r.status)
    const d = await r.json()

    if (d.result !== 'success') throw new Error('API error: ' + d.result)

    const brlPerUsd = d.rates['BRL']
    const eurPerUsd = d.rates['EUR']

    if (!brlPerUsd || !eurPerUsd) throw new Error('Missing BRL or EUR rate')

    // 1 EUR = (BRL/USD) / (EUR/USD) BRL
    const brlPerEur = brlPerUsd / eurPerUsd

    return Response.json({
      usd: brlPerUsd.toFixed(2),
      eur: brlPerEur.toFixed(2),
      usdChange: null,
      eurChange: null,
      timestamp: new Date().toISOString(),
      source: 'open.er-api.com'
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=1200'
      }
    })
  } catch(e) {
    console.error('[rates] Error:', e.message)
    // Fallback: try AwesomeAPI as backup
    try {
      const r2 = await fetch('https://economia.awesomeapi.com.br/last/USD-BRL,EUR-BRL')
      const d2 = await r2.json()
      return Response.json({
        usd: d2.USDBRL ? parseFloat(d2.USDBRL.bid).toFixed(2) : null,
        eur: d2.EURBRL ? parseFloat(d2.EURBRL.bid).toFixed(2) : null,
        usdChange: d2.USDBRL ? parseFloat(d2.USDBRL.pctChange).toFixed(2) : null,
        eurChange: d2.EURBRL ? parseFloat(d2.EURBRL.pctChange).toFixed(2) : null,
        timestamp: new Date().toISOString(),
        source: 'awesomeapi-fallback'
      })
    } catch(e2) {
      return Response.json({ usd: null, eur: null, error: e.message + ' | fallback: ' + e2.message })
    }
  }
}
