'use client'
import { useState, useRef, useEffect } from 'react'

export default function AudioPlayer({ text, title }) {
  const [state, setState] = useState('idle') // idle | loading | playing | paused | error
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const audioRef = useRef(null)
  const audioUrlRef = useRef(null)

  useEffect(() => {
    return () => {
      if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current)
    }
  }, [])

  async function handlePlay() {
    if (state === 'playing') {
      audioRef.current?.pause()
      setState('paused')
      return
    }
    if (state === 'paused') {
      audioRef.current?.play()
      setState('playing')
      return
    }

    setState('loading')
    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      })
      if (!res.ok) throw new Error('Erro ao gerar áudio')

      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      audioUrlRef.current = url

      const audio = new Audio(url)
      audioRef.current = audio

      audio.addEventListener('timeupdate', () => {
        if (audio.duration) setProgress((audio.currentTime / audio.duration) * 100)
      })
      audio.addEventListener('loadedmetadata', () => setDuration(audio.duration))
      audio.addEventListener('ended', () => { setState('idle'); setProgress(0) })
      audio.addEventListener('error', () => setState('error'))

      await audio.play()
      setState('playing')
    } catch (e) {
      setState('error')
    }
  }

  function handleSeek(e) {
    if (!audioRef.current?.duration) return
    const pct = e.nativeEvent.offsetX / e.currentTarget.offsetWidth
    audioRef.current.currentTime = pct * audioRef.current.duration
  }

  function formatTime(s) {
    if (!s || isNaN(s)) return '0:00'
    return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`
  }

  const icons = {
    idle:    '🎙️',
    loading: '⏳',
    playing: '⏸️',
    paused:  '▶️',
    error:   '⚠️',
  }

  const labels = {
    idle:    'Ouvir resumo',
    loading: 'Gerando áudio…',
    playing: 'Pausar',
    paused:  'Continuar',
    error:   'Erro — tentar novamente',
  }

  return (
    <div style={{
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      border: '1px solid rgba(233,30,99,0.3)',
      borderRadius: '12px',
      padding: '16px 20px',
      margin: '20px 0',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          onClick={handlePlay}
          disabled={state === 'loading'}
          style={{
            background: state === 'loading' ? '#555' : 'linear-gradient(135deg, #e91e63, #c2185b)',
            border: 'none',
            borderRadius: '50px',
            padding: '10px 20px',
            color: '#fff',
            fontWeight: '700',
            fontSize: '14px',
            cursor: state === 'loading' ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s',
            whiteSpace: 'nowrap',
          }}
        >
          <span>{icons[state]}</span>
          <span>{labels[state]}</span>
        </button>
        {duration > 0 && (
          <span style={{ color: '#aaa', fontSize: '13px' }}>
            {formatTime(audioRef.current?.currentTime)} / {formatTime(duration)}
          </span>
        )}
        <span style={{ color: '#666', fontSize: '12px', marginLeft: 'auto' }}>
          🤖 Resumo em áudio
        </span>
      </div>
      {(state === 'playing' || state === 'paused') && (
        <div
          onClick={handleSeek}
          style={{
            height: '4px',
            background: '#333',
            borderRadius: '2px',
            cursor: 'pointer',
            position: 'relative',
          }}
        >
          <div style={{
            height: '100%',
            width: `${progress}%`,
            background: 'linear-gradient(90deg, #e91e63, #ff5722)',
            borderRadius: '2px',
            transition: 'width 0.1s',
          }} />
        </div>
      )}
    </div>
  )
}
