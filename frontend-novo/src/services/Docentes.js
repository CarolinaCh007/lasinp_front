import api from './auth.js'

export const docentesService = {
  getAll() {
    return api.get('/docentes')
  }
}