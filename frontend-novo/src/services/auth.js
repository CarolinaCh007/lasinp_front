
import axios from 'axios'
import api from './api'



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

    // FastAPI espera OAuth2 form-urlencoded (username & password)
    const params = new URLSearchParams()
    params.append('grant_type', 'password')
    params.append('username', email)
    params.append('password', password)

    const response = await api.post('/auth/login', params.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })

    const { access_token, token_type, usuario, rol_principal, mensaje } = response.data

    // Mapear rol del backend (p. ej. 'ESTUDIANTE') al rol del frontend ('estudiante')
    const rol = (this && this.toFrontendRole)
      ? this.toFrontendRole(rol_principal)
      : (ROLE_MAP[rol_principal] || (rol_principal || '').toLowerCase())


    localStorage.setItem('token', access_token)
    localStorage.setItem('usuario', JSON.stringify(usuario))
    localStorage.setItem('rol', rol)

    return {
      access_token,
      token_type,
      usuario,
      rol,
      mensaje

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
  },
  /**
   * 🔁 Convertir rol de backend → frontend (para mostrar en UI)
   * @param {string} rolBackend - Rol en mayúsculas
   * @returns {string} Rol en minúsculas para el frontend
   */
  toFrontendRole(rolBackend) {
    return ROLE_MAP[rolBackend] || rolBackend?.toLowerCase()
  },

  // =============================================================================
  // 🔹 FUNCIONES PARA FLUJO DE REGISTRO EN DOS PASOS
  // =============================================================================

  /**
   * 📝 Paso 1 del registro: pre-inscripción con datos básicos
   * @param {string} nombre - Nombre(s)
   * @param {string} ape_paterno - Apellido paterno
   * @param {string} ape_materno - Apellido materno
   * @param {string} correo_electronico - Correo electrónico
   * @returns {Promise<Object>} { mensaje, correo_electronico }
   */
  async registroStep1(nombre, ape_paterno, ape_materno, correo_electronico) {
    const response = await api.post('/auth/register/step1', {
      nombre,
      ape_paterno,
      ape_materno,
      correo_electronico
    })
    return response.data
  },

  /**
   * ✅ Paso 2 del registro: completar datos con verificación de email
   * @param {string} token - Token de verificación (del email)
   * @param {string} ci - Cédula de identidad
   * @param {string} password - Contraseña
   * @param {string} confirmar_password - Confirmación de contraseña
   * @param {string} celular - Número de celular
   * @param {string} fecha_nacimiento - Fecha de nacimiento (YYYY-MM-DD)
   * @param {string} direccion - Dirección
   * @param {string} sexo - Sexo (M, F, Otro)
   * @returns {Promise<Object>} Datos del usuario creado
   */
  async registroStep2(token, ci, password, confirmar_password, celular, fecha_nacimiento, direccion, sexo) {
    const response = await api.post('/auth/register/step2', {
      token,
      ci,
      password,
      confirmar_password,
      celular,
      fecha_nacimiento,
      direccion,
      sexo
    })
    return response.data
  },

  // =============================================================================
  // 🔹 FUNCIONES PARA RECUPERACIÓN DE CONTRASEÑA
  // =============================================================================

  /**
   * 🔐 Solicitar recuperación de contraseña
   * @param {string} correo_electronico - Correo del usuario
   * @returns {Promise<Object>} { mensaje }
   */
  async solicitarRecuperacion(correo_electronico) {
    const response = await api.post('/auth/forgot-password', {
      correo_electronico
    })
    return response.data
  },

  /**
   * 🔑 Restablecer contraseña con token
   * @param {string} token - Token de recuperación (del email)
   * @param {string} nueva_password - Nueva contraseña
   * @returns {Promise<Object>} { mensaje }
   */
  async restablecerContrasena(token, nueva_password) {
    const response = await api.post('/auth/reset-password', {
      token,
      nueva_password
    })
    return response.data
  }
}

export default api