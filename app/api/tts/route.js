// ElevenLabs TTS with Claude AI summarization — voice: Bella (EXAVITQu4vr4xnSDxMaL)
import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    const { text } = await req.json()
    if (!text) return NextResponse.json({ error: 'No text provided' }, { status: 400 })

    const apiKey = process.env.ELEVENLABS_API_KEY
    if (!apiKey) return NextResponse.json({ error: 'TTS not configured' }, { status: 503 })

    // Step 1: AI summarization via Claude Haiku
    let ttsText = text
    const anthropicKey = process.env.ANTHROPIC_API_KEY
    if (anthropicKey && text.length > 200) {
      try {
        const summaryRes = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'x-api-key': anthropicKey,
            'anthropic-version': '2023-06-01',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'claude-haiku-4-5-20251001',
            max_tokens: 150,
            messages: [{
              role: 'user',
              content: `Resuma este artigo em 2 frases curtas em português, adequado para leitura em voz alta. Foque nos destaques mais importantes. Sem listas, apenas texto corrido.\n\n${text.substring(0, 3000)}`
            }]
          })
        })
        if (summaryRes.ok) {
          const data = await summaryRes.json()
          const summary = data.content?.[0]?.text?.trim()
          if (summary) ttsText = summary
        }
      } catch (_) {
        // fallback to original text
      }
    }

    // Step 2: ElevenLabs TTS
    const response = await fetch(
      'https://api.elevenlabs.io/v1/text-to-speech/EXAVITQu4vr4xnSDxMaL',
      {
        method: 'POST',
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: ttsText.substring(0, 2000),
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
            style: 0.2,
            use_speaker_boost: true,
          },
        }),
      }
    )

    if (!response.ok) {
      const err = await response.text()
      return NextResponse.json({ error: err }, { status: response.status })
    }

    const audioBuffer = await response.arrayBuffer()
    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'no-store',
      },
    })
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
