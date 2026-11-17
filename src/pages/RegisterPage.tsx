import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api, { errorMessage } from '../api'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [password, setPassword] = useState('')

  const [error, setError] = useState('')
  const [ok, setOk] = useState('')

  const navigate = useNavigate()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setOk('')

    // valida campos vacíos
    if (!email.trim() || !firstName.trim() || !lastName.trim() || !password.trim()) {
      setError('Todos los campos deben estar completos.')
      return
    }

    // valida contraseña
    if (!/(?=.*[A-Z])(?=.*\d).{8,}/.test(password)) {
      setError('La contraseña debe tener al menos 8 caracteres, una mayúscula y un dígito.')
      return
    }

    try {
      await api.post('/users/register', { // post('/ruta', {body})
        email,
        firstName,
        lastName,
        password,
      })

      setOk('Cuenta creada. Redirigiendo al login...')
      setTimeout(() => navigate('/login'), 1500) // redirección
    } catch (err) {
      setError(errorMessage(err))
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Crear cuenta</h1>

      <input
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />

      <input
        placeholder="Nombre"
        value={firstName}
        onChange={e => setFirstName(e.target.value)}
      />

      <input
        placeholder="Apellido"
        value={lastName}
        onChange={e => setLastName(e.target.value)}
      />

      <input
        placeholder="Contraseña"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />

      <button type="submit">Registrarme</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {ok && <p style={{ color: 'green' }}>{ok}</p>}
      {/* si _ tiene contenido, pinta <_></_> */}

    </form>
  )
}