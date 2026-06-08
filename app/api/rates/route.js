// app/api/rates/route.js
// Server-side exchange rates - Frankfurter (ECB data, free, no key required)
export const revalidate = 3600 // cache 1 hour (ECB updates daily)

export async function GET() {
  // --- Primary: Frankfurter (ECB data, very reliable) ---
  try {
    const r = await fetch('https://api.frankfurter.app/latest?from=USD&to=BRL,EUR', {
      next: { revalidate: 3600 },
      headers: { 'Accept': 'application/json' }
    })
    if (!r.ok) throw new Error('Frankfurter HTTP ' + r.status)
    const d = await r.json()

    const brlPerUsd = d.rates?.BRL
    const eurPerUsd = d.rates?.EUR
    if (!brlPerUsd || !eurPerUsd) throw new Error('Missing rates in Frankfurter response')

    // 1 EUR = (BRL/USD) / (EUR/USD) BRL
    const brlPerEur = brlPerUsd / eurPerUsd

    return Response.json({
      usd: brlPerUsd.toFixed(2),
      eur: brlPerEur.toFixed(2),
      usdChange: null,
      eurChange: null,
      timestamp: new Date().toISOString(),
      source: 'frankfurter'
    }, {
      headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200' }
    })
  } catch(e) {
    console.error('[rates] Frankfurter failed:', e.message)
  }

  // --- Fallback: open.er-api.com ---
  try {
    const r = await fetch('https://open.er-api.com/v6/latest/USD', {
      next: { revalidate: 3600 },
      headers: { 'Accept': 'application/json' }
    })
    if (!r.ok) throw new Error('open.er-api HTTP ' + r.status)
    const d = await r.json()
    if (d.result !== 'success') throw new Error('open.er-api error: ' + d.result)

    const brlPerUsd = d.rates?.BRL
    const eurPerUsd = d.rates?.EUR
    if (!brlPerUsd || !eurPerUsd) throw new Error('Missing rates')

    const brlPerEur = brlPerUsd / eurPerUsd

    return Response.json({
      usd: brlPerUsd.toFixed(2),
      eur: brlPerEur.toFixed(2),
      usdChange: null,
      eurChange: null,
      timestamp: new Date().toISOString(),
      