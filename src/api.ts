import axios from 'axios';

// Cliente HTTP para toda la app
const api = axios.create({ baseURL: 'http://localhost:8080' });

// Antes de cada request: si hay token guardado, lo manda en el header Authorization
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Helper: saca el mensaje de error legible que manda el backend
export function errorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    return err.response?.data?.detail ?? 'Error de conexión con el servidor';
  }
  return 'Error inesperado';
}

export default api;
