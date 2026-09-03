import api from './api'

export const usuariosService = {
  /**
   * Listar todos los usuarios (requiere rol superadmin)
   * @param {number} skip - Número de registros a saltar
   * @param {number} limit - Número de registros a retornar
   * @param {string} estado - Filtrar por estado (opcional: 'activo', 'pendiente', 'bloqueado')
   * @returns {Promise<Array>}
   */
  async listarUsuarios(skip = 0, limit = 100, estado = null) {
    const response = await api.get('/users', {
      params: {
        skip,
        limit,
        ...(estado && { estado })
      }
    })
    return response.data
  },
  crearAdmin(datos) {
    return api.post('/auth/users/admin', datos)
  },

  crearTeacher(datos) {
    return api.post('/auth/users/teacher', datos)
  },

  crearEstudiante(datos) {
    return api.post('/auth/register/student', datos)
  },

  // ────────────────────────────────────────────────────────────────
  // FLUJO DE REGISTRO EN DOS PASOS PARA DOCENTE (desde Superadmin)
  // ────────────────────────────────────────────────────────────────

  /**
   * Paso 1 del registro de docente: envía email con token
   * @param {string} nombre 
   * @param {string} ape_paterno 
   * @param {string} ape_materno 
   * @param {string} correo_electronico 
   * @returns {Promise<Object>} { mensaje, correo_electronico }
   */
  async preRegistroDocente(nombre, ape_paterno, ape_materno, correo_electronico) {
    const response = await api.post('/auth/register-teacher/step1', {
      nombre,
      ape_paterno,
      ape_materno,
      correo_electronico
    })
    return response.data
  },

  /**
   * Paso 2 del registro de docente: completar datos con token del email
   * @param {Object} datos - { token, ci, password, confirmar_password, celular, fecha_nacimiento, especialidad, grado_academico, anios_experiencia }
   * @returns {Promise<Object>} Datos del usuario creado
   */
  async completarRegistroDocente(datos) {
    const response = await api.post('/auth/register-teacher/step2', datos)
    return response.data
  },

  /**
   * Obtener detalles de un usuario por ID
   * @param {number} id_usuario
   * @returns {Promise<Object>}
   */
  async obtenerUsuario(id_usuario) {
    const response = await api.get(`/users/${id_usuario}`)
    return response.data
  },

  /**
   * Actualizar datos del usuario
   * @param {number} id_usuario
   * @param {Object} datos - Campos a actualizar
   * @returns {Promise<Object>}
   */
  async actualizarUsuario(id_usuario, datos) {
    const response = await api.put(`/users/${id_usuario}`, datos)
    return response.data
  },

  /**
   * Cambiar estado del usuario (activo, pendiente, bloqueado)
   * @param {number} id_usuario
   * @param {string} estado - Nuevo estado
   * @returns {Promise<Object>}
   */
  async cambiarEstado(id_usuario, estado) {
    const response = await api.patch(`/users/${id_usuario}/estado`, { estado })
    return response.data
  },

  /**
   * Bloquear usuario
   * @param {number} id_usuario
   * @returns {Promise<Object>}
   */
  async bloquearUsuario(id_usuario) {
    const response = await api.post(`/users/${id_usuario}/bloquear`)
    return response.data
  },

  /**
   * Activar usuario
   * @param {number} id_usuario
   * @returns {Promise<Object>}
   */
  async activarUsuario(id_usuario) {
    const response = await api.post(`/users/${id_usuario}/activar`)
    return response.data
  },

  /**
   * Listar roles disponibles en el sistema
   * @returns {Promise<Array>}
   */
  async listarRoles() {
    const response = await api.get('/users/roles/disponibles')
    return response.data
  },

  /**
   * Obtener roles asignados a un usuario
   * @param {number} id_usuario
   * @returns {Promise<Array>}
   */
  async obtenerRolesUsuario(id_usuario) {
    const response = await api.get(`/users/${id_usuario}/roles`)
    return response.data
  },

  /**
   * Asignar un rol a un usuario
   * @param {number} id_usuario
   * @param {string} nombre_rol - Nombre del rol (ej: 'ESTUDIANTE', 'DOCENTE', 'ADMIN')
   * @returns {Promise<Object>}
   */
  async asignarRol(id_usuario, nombre_rol) {
    const response = await api.post(`/users/${id_usuario}/roles`, { nombre_rol })
    return response.data
  },

  /**
   * Revocar un rol de un usuario
   * @param {number} id_usuario
   * @param {string} nombre_rol - Nombre del rol a revocar
   * @returns {Promise<Object>}
   */
  async revocarRol(id_usuario, nombre_rol) {
    const response = await api.delete(`/users/${id_usuario}/roles/${nombre_rol}`)
    return response.data
  },

   async resetearPassword(id_usuario, nueva_password) {
    const response = await api.post(`/users/${id_usuario}/reset-password`, { 
      nueva_password 
    })
    return response.data
  },

  // Cambiar contraseña del usuario autenticado (estudiante, docente, etc.)
  async cambiarPasswordPropia(current_password, new_password) {
    const response = await api.put('/auth/change-password', {
      current_password,
      new_password
    })
    return response.data
  }
}


export default usuariosService
