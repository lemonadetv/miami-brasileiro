export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // open.er-api.com - free, no key needed, works from Vercel
    const res = await fetch('https://open.er-api.com/v6/latest/USD', {
      next: { revalidate: 3600 }
    })
    const data = await res.json()

    if (data.result !== 'success') throw new Error('API error')

    // USD/BRL direto; EUR/BRL calculado
    const usdBRL = data.rates.BRL
    const eurUSD = data.rates.EUR
    const eurBRL = usdBRL / eurUSD

    const usd = usdBRL.toFixed(2)
    const eur = eurBRL.toFixed(2)

    // BTC via CoinGecko (free, sem chave)
    let btc = null
    let btcChange = null
    try {
      const btcRes = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=brl&include_24hr_change=true',
        { next: { revalidate: 3600 }, headers: { 'Accept': 'application/json' } }
      )
      const btcData = await btcRes.json()
      if (btcData?.bitcoin?.brl) {
        btc = btcData.bitcoin.brl.toFixed(0)
        const chg = btcData.bitcoin.brl_24h_change || 0
        btcChange = (chg >= 0 ? '+' : '') + chg.toFixed(2) + '%'
      }
    } catch {}

    return Response.json({ usd, eur, btc, usdChange: null, eurChange: null, btcChange })
  } catch (e) {
    return Response.json({ usd: null, eur: null, btc: null, usdChange: null, eurChange: null, btcChange: null })
  }
}
