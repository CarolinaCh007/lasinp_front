
import api from './api'

export const logsService = {
  getAll(params = {}) {
    return api.get('/users/logs', { params })
  }
}