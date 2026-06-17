// app/api/copa/route.js
// Copa do Mundo 2026 - dados ao vivo via ESPN API
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const res = await fetch(
      'https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard',
      { next: { revalidate: 60 } }
    )
    const data = await res.json()

    const events = (data.events || []).map(e => {
      const comp = e.competitions?.[0]
      const home = comp?.competitors?.find(c => c.homeAway === 'home') || {}
      const away = comp?.competitors?.find(c => c.homeAway === 'away') || {}
      const status = comp?.status || {}
      const note = comp?.altGameNote || ''
      const gMatch = note.match(/Group\s+(.+)/i)
      const group = gMatch ? 'Grupo ' + gMatch[1] : ''

      return {
        id: e.id,
        homeCode: home.team?.abbreviation || '',
        homeScore: home.score || '0',
        awayCode: away.team?.abbreviation || '',
        awayScore: away.score || '0',
        displayClock: status.displayClock || '',
        statusText: status.type?.shortDetail || '',
        isLive: status.type?.state === 'in',
        isCompleted: status.type?.state === 'post',
        isScheduled: status.type?.state === 'pre',
        date: e.date || comp?.date || '',
        group,
      }
    })

    return Response.json(
      { events, updated: new Date().toISOString() },
      { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120' } }
    )
  } catch (e) {
    return Response.json({ events: [], error: e.message })
  }
}
