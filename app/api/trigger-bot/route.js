export const maxDuration = 10

export async function POST(request) {
  const secret = request.headers.get('x-cron-secret')
  if (secret !== 'miami2026' && secret !== process.env.CRON_SECRET) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const res = await fetch(
      'https://api.github.com/repos/' + (process.env.GITHUB_REPO || 'lemonadetv/miami-brasileiro') + '/actions/workflows/fetch-news.yml/dispatches',
      {
        method: 'POST',
        headers: {
          'Authorization': 'token ' + process.env.GITHUB_TOKEN,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ref: 'main' }),
      }
    )
    if (res.status === 204) {
      return Response.json({
        ok: true,
        added: 0,
        message: 'Bot iniciado via GitHub Actions! Novos artigos aparecerao em 2-3 minutos.',
      })
    }
    const body = await res.text()
    return Response.json({ ok: false, error: 'GitHub respondeu: ' + res.status + ' ' + body }, { status: 500 })
  } catch (e) {
    return Response.json({ ok: false, error: e.message }, { status: 500 })
  }
}
