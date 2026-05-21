import axios from 'axios';

// Creamos la conexión base apuntando a tu Docker/FastAPI
const api = axios.create({
  baseURL: 'http://localhost:8000', 
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Este interceptor asegura que si más adelante tu equipo le pone Login, 
// el token viaje automáticamente en todas tus peticiones sin que programes nada extra.
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

export default api;