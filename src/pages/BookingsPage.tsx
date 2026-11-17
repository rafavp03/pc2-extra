import { useState, useEffect } from 'react'
import api from '../api'

export default function BookingsPage() {
  const [bookings, setBookings] = useState<any[]>([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    async function cargar() {
      try {
        const me = (await api.get('/users/current')).data
        const key = `bookings:${me.email}`
        const ids: number[] = JSON.parse(localStorage.getItem(key) ?? '[]')

        const results = await Promise.allSettled(
          ids.map(id => api.get(`/flights/book/${id}`))
        )

        const ok = results
          .filter(r => r.status === 'fulfilled')
          .map(r => (r as PromiseFulfilledResult<any>).value.data)

        setBookings(ok)
      } catch {
        setBookings([])
      }
      setCargando(false)
    }
    cargar()
  }, [])

  if (cargando) return <p>Cargando...</p>

  return (
    <div>
      <h1>Mis reservas</h1>

      {bookings.length === 0 && <p>Aún no tienes reservas.</p>}

      {bookings.length > 0 && (
        <table border={1}>
          <thead>
            <tr>
              <th>Reserva</th>
              <th>Vuelo</th>
              <th>Aerolínea</th>
              <th>Salida</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(b => (
              <tr key={b.id}>
                <td>#{b.id}</td>
                <td>{b.flightNumber}</td>
                <td>{b.airlineName}</td>
                <td>{new Date(b.estDepartureTime).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
