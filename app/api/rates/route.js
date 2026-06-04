// app/api/rates/route.js
// Server-side exchange rates from AwesomeAPI (Brazilian financial market data)
export const revalidate = 300 // cache 5 minutes

export async function GET() {
  try {
    const r = await fetch('https://economia.awesomeapi.com.br/last/USD-BRL,EUR-BRL', {
      next: { revalidate: 300 }
    })
    const d = await r.json()
    return Response.json({
      usd: d.USDBRL ? parseFloat(d.USDBRL.bid).toFixed(2) : null,
      eur: d.EURBRL ? parseFloat(d.EURBRL.bid).toFixed(2) : null,
      usdChange: d.USDBRL ? parseFloat(d.USDBRL.pctChange).toFixed(2) : null,
      eurChange: d.EURBRL ? parseFloat(d.EURBRL.pctChange).toFixed(2) : null,
      timestamp: new Date().toISOString()
    }, { headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' } })
  } catch(e) {
    return Response.json({ usd: null, eur: null, error: e.message })
  }
}
