import { Link } from 'react-router-dom'

export default function NavBar() {
  const token = localStorage.getItem('token')

  function handleLogout() {
    localStorage.removeItem('token')
    window.location.href = '/login'
  }

  return (
    <nav style={{ display: 'flex', gap: 12, padding: 8, borderBottom: '1px solid #ccc' }}>
      <Link to="/search">Buscar vuelos</Link>
      {token && <Link to="/bookings">Mis reservas</Link>}
      {!token && <Link to="/login">Login</Link>}
      {!token && <Link to="/register">Registro</Link>}
      {token && <button onClick={handleLogout}>Cerrar sesión</button>}
    </nav>
  )
}
