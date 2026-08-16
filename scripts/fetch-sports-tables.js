#!/usr/bin/env node
/**
 * fetch-sports-tables.js
 * Uses Claude to generate current sports standings/tables as JSON.
 * Runs daily via GitHub Actions and writes to data/sports-tables.json
 */
const Anthropic = require('@anthropic-ai/sdk')
const fs = require('fs')
const path = require('path')

const client = new Anthropic()
const DATA_PATH = path.join(__dirname, '../data/sports-tables.json')

const today = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })

async function generateTables() {
  console.log('Gerando tabelas esportivas atualizadas via Claude...')

  const prompt = `Hoje é ${today}. Gere um JSON com as classificações esportivas mais atuais e precisas que você conhece. Responda APENAS com JSON válido, sem markdown, sem explicações.

Estrutura exata:
{
  "updatedAt": "${new Date().toISOString()}",
  "updatedDate": "${today}",
  "brasileirao": [
    { "pos": 1, "team": "Nome do Time", "pts": 00, "pj": 00, "v": 00, "e": 00, "d": 00, "gf": 00, "ga": 00, "sg": 00 }
  ],
  "copaBrasil": { "oitavas": [["Time A","Time B"],["Time C","Time D"]], "status": "Oitavas de Final" },
  "mls_east": [
    { "pos": 1, "team": "Inter Miami CF", "pts": 00, "pj": 00, "v": 00, "e": 00, "d": 00, "gf": 00, "ga": 00 }
  ],
  "mls_west": [
    { "pos": 1, "team": "...", "pts": 00, "pj": 00, "v": 00, "e": 00, "d": 00, "gf": 00, "ga": 00 }
  ],
  "copa2026": {
    "status": "Encerrada",
    "campeao": "País",
    "vice": "País",
    "terceiro": "País",
    "artilheiro": { "nome": "Nome", "pais": "País", "gols": 0 }
  },
  "f1_drivers": [
    { "pos": 1, "driver": "Nome", "team": "Equipe", "country": "🏁", "pts": 000 }
  ],
  "f1_constructors": [
    { "pos": 1, "team": "Nome", "pts": 000 }
  ],
  "wsl_men": [
    { "pos": 1, "surfer": "Nome", "country": "🏳️", "pts": 00000 }
  ],
  "wsl_women": [
    { "pos": 1, "surfer": "Nome", "country": "🏳️", "pts": 00000 }
  ]
}

Forneça dados reais e atualizados para ${today}. Para brasileirao, inclua os top 20 times. Para MLS, top 8 de cada conferência. Para F1, top 10 pilotos e top 5 construtores. Para WSL top 10 de cada.`

  const message = await client.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 4096,
    messages: [{ role: 'user', content: prompt }]
  })

  const content = message.content[0].text.trim()

  // Extract JSON if wrapped in markdown
  const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, content]
  const jsonStr = jsonMatch[1].trim()

  const tables = JSON.parse(jsonStr)
  fs.writeFileSync(DATA_PATH, JSON.stringify(tables, null, 2))
  console.log(`✅ sports-tables.json atualizado: ${today}`)
  console.log(`   Brasileirão: ${tables.brasileirao?.length} times`)
  console.log(`   MLS East: ${tables.mls_east?.length} times`)
  console.log(`   F1 Pilotos: ${tables.f1_drivers?.length} pilotos`)
  return tables
}

generateTables().catch(err => {
  console.error('❌ Erro ao gerar tabelas:', err.message)
  process.exit(1)
})
