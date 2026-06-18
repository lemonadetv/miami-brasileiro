'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const [pwd, setPwd] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: pwd })
    })
    if (res.ok) {
      router.push('/admin/dashboard')
    } else {
      const d = await res.json()
      setError(d.error || 'Senha incorreta')
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #111 50%, #0f1a10 100%)'
    }}>
      <div style={{
        width: '100%', maxWidth: 380, background: '#111', borderRadius: 12,
        border: '1px solid #1e1e1e', padding: '40px 32px', boxShadow: '0 20px 60px rgba(0,0,0,.5)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>🌴</div>
          <h1 style={{ fontSize: 20, fontWeight: 900, color: '#fff', margin: 0 }}>Miami Brasileiro</h1>
          <p style={{ fontSize: 12, color: '#555', marginTop: 4 }}>Painel Administrativo</p>
        </div>

        {error && (
          <div style={{
            padding: '10px 14px', borderRadius: 6, marginBottom: 16, fontSize: 13,
            background: '#2e0d0d', color: '#f87171', border: '1px solid #991b1b'
          }}>{error}</div>
        )}

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#888', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.5px' }}>
              Senha de Acesso
            </label>
            <input
              type="password"
              value={pwd}
              onChange={e => setPwd(e.target.value)}
              placeholder="••••••••••••"
              required
              autoFocus
              style={{
                width: '100%', padding: '12px 14px', background: '#1a1a1a',
                border: '1.5px solid #2a2a2a', borderRadius: 8, color: '#fff',
                fontSize: 15, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
                transition: 'border-color .2s'
              }}
              onFocus={e => e.target.style.borderColor = '#F4622A'}
              onBlur={e => e.target.style.borderColor = '#2a2a2a'}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '13px', background: loading ? '#333' : '#F4622A',
              color: '#fff', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer', transition: 'background .2s', fontFamily: 'inherit'
            }}
          >
            {loading ? '⏳ Entrando...' : 'Entrar no Painel →'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 11, color: '#333' }}>
          Configure via <code style={{ color: '#555' }}>ADMIN_PASSWORD</code> no Vercel
        </p>
      </div>
    </div>
  )
}
