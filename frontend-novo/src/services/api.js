import axios from 'axios';

// Creamos la conexión base apuntando a tu Docker/FastAPI
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/v1',

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


// Interceptor de respuesta para manejar 401 Unauthorized
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Limpiar credenciales si token expiró
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      localStorage.removeItem('rol');

      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);


export default api;