import { Routes, Route, Navigate } from 'react-router-dom'
import NavBar from './components/NavBar.tsx'
import ProtectedRoute from './components/ProtectedRoute.tsx'
import RegisterPage from './pages/RegisterPage.tsx'
import LoginPage from './pages/LoginPage.tsx'
import SearchPage from './pages/SearchPage.tsx'
import BookingsPage from './pages/BookingsPage.tsx'

export default function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/search" element={<ProtectedRoute><SearchPage /></ProtectedRoute>} />
        <Route path="/bookings" element={<ProtectedRoute><BookingsPage /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </>
  )
}
