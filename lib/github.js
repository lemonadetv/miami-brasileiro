// lib/github.js - GitHub API helper for saving files

const REPO = process.env.GITHUB_REPO || 'lemonadetv/miami-brasileiro'
const TOKEN = () => process.env.GITHUB_TOKEN

async function getFileSha(path) {
  const res = await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`, {
    headers: { Authorization: `Bearer ${TOKEN()}`, Accept: 'application/vnd.github.v3+json' }
  })
  if (!res.ok) return null
  const data = await res.json()
  return data.sha || null
}

export async function saveFileToGitHub(path, content, message) {
  const sha = await getFileSha(path)
  const encoded = Buffer.from(JSON.stringify(content, null, 2)).toString('base64')

  const body = { message, content: encoded }
  if (sha) body.sha = sha

  const res = await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${TOKEN()}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })

  if (!res.ok) {
    const err = await res.json()
    throw new Error(`GitHub save failed: ${JSON.stringify(err)}`)
  }
  return await res.json()
}

export async function saveConfigToGitHub(config) {
  const sha = await getFileSha('data/config.json')
  const encoded = Buffer.from(JSON.stringify(config, null, 2)).toString('base64')
  const body = { message: '[ADMIN] Atualiza configuracoes do site', content: encoded }
  if (sha) body.sha = sha

  const res = await fetch(`https://api.github.com/repos/${REPO}/contents/data/config.json`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${TOKEN()}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })
  if (!res.ok) throw new Error('Failed to save config')
  return true
}
