export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const res = await fetch('https://economia.awesomeapi.com.br/json/last/USD-BRL,EUR-BRL,BTC-BRL', {
      next: { revalidate: 300 }
    })
    const data = await res.json()
    const usd = parseFloat(data.USDBRL.bid).toFixed(2)
    const eur = parseFloat(data.EURBRL.bid).toFixed(2)
    const btc = data.BTCBRL ? parseFloat(data.BTCBRL.bid).toFixed(0) : null
    const usdChange = parseFloat(data.USDBRL.pctChange).toFixed(2)
    const eurChange = parseFloat(data.EURBRL.pctChange).toFixed(2)
    const btcChange = data.BTCBRL ? parseFloat(data.BTCBRL.pctChange).toFixed(2) : null
    return Response.json({
      usd,
      eur,
      btc,
      usdChange: (usdChange > 0 ? '+' : '') + usdChange + '%',
      eurChange: (eurChange > 0 ? '+' : '') + eurChange + '%',
      btcChange: btcChange !== null ? (btcChange > 0 ? '+' : '') + btcChange + '%' : null,
    })
  } catch (e) {
    return Response.json({ usd: null, eur: null, btc: null, usdChange: null, eurChange: null, btcChange: null })
  }
}
