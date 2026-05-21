
import axios from 'axios'

const API_URL = 'http://127.0.0.1:8000'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      
      authService.logout()
      
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)


const ROLE_MAP = {
  'ESTUDIANTE': 'estudiante',
  'DOCENTE': 'docente',
  'ADMIN': 'admin',
  'SUPERADMIN': 'superadmin',
  'COORDINADOR': 'coordinador'
}


const ROLE_MAP_REVERSE = Object.fromEntries(
  Object.entries(ROLE_MAP).map(([k, v]) => [v, k])
)

export const authService = {
  /**
   * 🔐 Login con FastAPI — Envía JSON con correo_electronico
   * @param {string} email - Correo del usuario
   * @param {string} password - Contraseña
   * @param {string} rolFrontend - Rol seleccionado en frontend ('estudiante', 'docente', etc.)
   * @returns {Promise<Object>} { access_token, token_type, usuario, rol }
   */
  async login(email, password, rolFrontend = 'estudiante') {
    const response = await api.post('/auth/login', {
      correo_electronico: email,
      password: password
    })

    const { access_token, token_type, usuario, rol } = response.data

    localStorage.setItem('token', access_token)
    localStorage.setItem('usuario', JSON.stringify(usuario))
    localStorage.setItem('rol', rol)

    return {
      access_token,
      token_type,
      usuario,
      rol
    }
  },

  logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    localStorage.removeItem('rol')
  },

  getToken() {
    return localStorage.getItem('token')
  },

 
  getUsuario() {
    const u = localStorage.getItem('usuario')
    return u ? JSON.parse(u) : null
  },

  
  getRol() {
    return localStorage.getItem('rol')
  },

  estaAutenticado() {
    return !!localStorage.getItem('token')
  },

  tieneRol(rolRequerido) {
    const rol = this.getRol()
    return rol === rolRequerido
  },

  async refreshUsuario() {
    const response = await api.get('/auth/me')
    const usuario = response.data
    localStorage.setItem('usuario', JSON.stringify(usuario))
    return usuario
  },

  /**
   * 🎯 Obtener ruta de redirección según rol (compatible con tu rutasPorRol)
   * @param {string} rol - Rol en minúsculas (opcional, usa el guardado si no se pasa)
   * @returns {string} Ruta como '/estudiante/dashboard', etc.
   */
  getRedirectPath(rol = this.getRol()) {
    const rutas = {
      estudiante: '/estudiante/dashboard',
      docente: '/docente/dashboard',
      admin: '/admin/dashboard',
      superadmin: '/superadmin/dashboard',
      coordinador: '/coordinador/dashboard'
    }
    return rutas[rol] || '/dashboard'
  },

  /**
   * 🔁 Convertir rol de frontend → backend (para validaciones o peticiones)
   * @param {string} rolFrontend - Rol en minúsculas
   * @returns {string} Rol en mayúsculas para el backend
   */
  toBackendRole(rolFrontend) {
    return ROLE_MAP_REVERSE[rolFrontend] || rolFrontend?.toUpperCase()
  },

  /**
   * 🔁 Convertir rol de backend → frontend (para mostrar en UI)
   * @param {string} rolBackend - Rol en mayúsculas
   * @returns {string} Rol en minúsculas para el frontend
   */
  toFrontendRole(rolBackend) {
    return ROLE_MAP[rolBackend] || rolBackend?.toLowerCase()
  }
}

export default api