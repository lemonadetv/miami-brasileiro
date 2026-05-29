// app/api/admin/config/route.js
import { NextResponse } from 'next/server'
import { saveConfigToGitHub } from '../../../../lib/github'
import { getSessionToken } from '../../../../lib/auth'
import { cookies } from 'next/headers'
import path from 'path'
import fs from 'fs'

function checkAuth() {
  const c = cookies().get('admin_session')
  return c?.value === getSessionToken()
}

function readConfig() {
  try {
    const p = path.join(process.cwd(), 'data', 'config.json')
    return JSON.parse(fs.readFileSync(p, 'utf-8'))
  } catch {
    return {}
  }
}

export async function GET() {
  if (!checkAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  return NextResponse.json(readConfig())
}

export async function PUT(request) {
  if (!checkAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await request.json()
  try {
    await saveConfigToGitHub(body)
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
