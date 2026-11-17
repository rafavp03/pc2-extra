import { useState } from 'react'
import { Link } from 'react-router-dom'
import api, { errorMessage } from '../api'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!email.trim() || !password.trim()) {
      setError('Todos los campos deben estar completos.')
      return
    }

    try {
      const { data } = await api.post('/auth/login', { // post con datos de usuario
        email,
        password,
      });
      localStorage.setItem('token', data.token);
      window.location.href = '/search';
    } catch (err) {
      setError(errorMessage(err))
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Iniciar sesión</h1>

      <input
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />

      <input
        placeholder="Contraseña"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />

      <button type="submit">Iniciar sesión</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <p>¿No tienes cuenta? <Link to="/register">Regístrate</Link></p>
    </form>
  )
}