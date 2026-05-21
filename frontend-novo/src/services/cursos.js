import api from './auth.js'

export const cursosService = {
  getAll() {
    return api.get('/cursos')
  }
}
