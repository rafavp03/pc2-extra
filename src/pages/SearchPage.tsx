import { useState, useEffect } from 'react'
import api, { errorMessage } from '../api'

export default function SearchPage() {
  const token = localStorage.getItem('token')
  const [mensaje, setMensaje] = useState('')
  const [detalle, setDetalle] = useState<any>(null)
  const [ultimoId, setUltimoId] = useState<number | null>(null)

  const [me, setMe] = useState<any>(null)

  const [flightNumber, setFlightNumber] = useState('')
  const [airlineName, setAirlineName] = useState('')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')

  const [flights, setFlights] = useState<any[]>([])
  const [buscado, setBuscado] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function cargarUsuario() {
      try {
        const { data } = await api.get('/users/current')
        setMe(data)
      } catch {
      }
    }
    cargarUsuario()
  }, [])

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    try {
      const { data } = await api.get('/flights/search', {
        params: {
          flightNumber: flightNumber || undefined,
          airlineName: airlineName || undefined,
          estDepartureTimeFrom: from ? new Date(from).toISOString() : undefined,
          estDepartureTimeTo: to ? new Date(to).toISOString() : undefined,
        },
      })
      setFlights(data.items)
      setBuscado(true)
    } catch (err) {
      setError(errorMessage(err))
    }
  }

  async function handleBook(flight: any) {
    setMensaje('')
    setError('')
    setDetalle(null)
    try {
        const { data } = await api.post('/flights/book', { flightId: flight.id })
        setMensaje(`Reserva creada con ID ${data.id} para el vuelo ${flight.flightNumber}`)
        setUltimoId(data.id)
        const key = `bookings:${me.email}`
        const ids: number[] = JSON.parse(localStorage.getItem(key) ?? '[]')
        localStorage.setItem(key, JSON.stringify([...ids, data.id]))
    } catch (err) {
        setError(errorMessage(err))
    }
  }

  async function handleDetalle(bookingId: number) {
    try {
        const { data } = await api.get(`/flights/book/${bookingId}`)
        setDetalle(data)
    } catch (err) {
        setError(errorMessage(err))
    }
  }

  return (
    <div>
      {me && <p>Hola, {me.firstName} {me.lastName}</p>}
      <h1>Buscar vuelos</h1>

      <form onSubmit={handleSearch}>
        <input placeholder="Número de vuelo"
               value={flightNumber}
               onChange={e => setFlightNumber(e.target.value)} />

        <input placeholder="Aerolínea"
               value={airlineName}
               onChange={e => setAirlineName(e.target.value)} />

        <label>Desde: 
            <input type="datetime-local" 
                value={from}
                onChange={e => setFrom(e.target.value)} />
        </label>

        <label>Hasta: 
            <input type="datetime-local" 
                value={to}
                onChange={e => setTo(e.target.value)} />
        </label>

        <button type="submit">Buscar</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {buscado && flights.length === 0 && <p>No se encontraron vuelos...</p>}

      {flights.length > 0 && (
        <table border={1}>
          <thead>
            <tr>
              <th>Número</th>
              <th>Aerolínea</th>
              <th>Salida</th>
              <th>Llegada</th>
              <th>Asientos</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {flights.map(f => <tr key={f.id}>
                <td>{f.flightNumber}</td>
                <td>{f.airlineName}</td>
                <td>{new Date(f.estDepartureTime).toLocaleString()}</td>
                <td>{new Date(f.estArrivalTime).toLocaleString()}</td>
                <td>{f.availableSeats}</td>
                <td>{token && <button onClick={() => handleBook(f)}>Reservar</button>}</td>
            </tr>)}
          </tbody>
        </table>
      )}

      {mensaje && (
        <div style={{ color: 'green' }}>
          <p>{mensaje}</p>
          <button onClick={() => handleDetalle(ultimoId!)}>Ver detalle</button>
        </div>
      )}

      {detalle && (
        <div style={{ border: '1px solid #999', padding: 8 }}>
          <h3>Detalle de la reserva #{detalle.id}</h3>
          <p>Vuelo: {detalle.flightNumber}</p>
          <p>Aerolínea: {detalle.airlineName}</p>
          <p>Salida: {new Date(detalle.estDepartureTime).toLocaleString()}</p>
        </div>
      )}
      
    </div>
  )
}