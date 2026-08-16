import { NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'

export async function GET() {
  try {
    const filePath = join(process.cwd(), 'data', 'sports-tables.json')
    const data = JSON.parse(readFileSync(filePath, 'utf8'))
    return NextResponse.json(data, {
      headers: { 'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400' }
    })
  } catch {
    return NextResponse.json({ error: 'not available' }, { status: 404 })
  }
}
