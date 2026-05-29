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
      setError(d.error || 'Erro ao fazer login')
      setLoading(false)
    }
  }

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div className="login-logo">
          <div className="ll-icon">🌴</div>
          <h1>Miami Brasileiro</h1>
          <p>Painel Administrativo</p>
        </div>
        {error && <div className="admin-alert alert-error">{error}</div>}
        <form onSubmit={handleLogin}>
          <div className="admin-form-group">
            <label>Senha de Acesso</label>
            <input
              type="password"
              value={pwd}
              onChange={e => setPwd(e.target.value)}
              placeholder="Digite sua senha"
              required
              autoFocus
            />
          </div>
          <button
            type="submit"
            className="admin-btn admin-btn-primary"
            disabled={loading}
            style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
          >
            {loading ? 'Entrando...' : 'Entrar no Painel'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 12, color: '#9CA3AF' }}>
          Configure a senha via variavel de ambiente <code>ADMIN_PASSWORD</code> no Vercel
        </p>
      </div>
    </div>
  )
}
