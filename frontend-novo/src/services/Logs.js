import api from './auth.js'

export const logsService = {
  getAll() {
    return api.get('/logs')
  }
}