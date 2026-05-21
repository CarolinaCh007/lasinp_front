import api from './api'

export const estudiantesService = {
  obtenerTodos: async () => {
    const response = await api.get('/estudiantes/con-usuario')
    return response.data
  },

  crear: async (datos) => {
    const response = await api.post('/estudiantes/', datos)
    return response.data
  },

  // Nueva función para cambiar el estado del USUARIO asociado
  cambiarEstadoUsuario: async (id_usuario, nuevoEstado) => {
    const response = await api.patch(`/usuarios/${id_usuario}/estado?estado=${nuevoEstado}`)
    return response.data
  }
}