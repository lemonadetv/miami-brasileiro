export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const res = await fetch('https://economia.awesomeapi.com.br/json/last/USD-BRL,EUR-BRL', {
      next: { revalidate: 600 }
    })
    const data = await res.json()
    const usd = parseFloat(data.USDBRL.bid).toFixed(2)
    const eur = parseFloat(data.EURBRL.bid).toFixed(2)
    const usdChange = parseFloat(data.USDBRL.pctChange).toFixed(2)
    const eurChange = parseFloat(data.EURBRL.pctChange).toFixed(2)
    return Response.json({
      usd,
      eur,
      usdChange: (usdChange > 0 ? '+' : '') + usdChange + '%',
      eurChange: (eurChange > 0 ? '+' : '') + eurChange + '%'
    })
  } catch (e) {
    return Response.json({ usd: null, eur: null, usdChange: null, eurChange: null })
  }
}
