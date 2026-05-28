import api from './api'
 
const horarioService = {
  listar(params = {}) {
    return api.get('/scheduling/horarios/', { params })
  },
 
  obtener(id) {
    return api.get(`/scheduling/horarios/${id}`)
  },
 
  crear(data) {
    return api.post('/scheduling/horarios/', data)
  },
 
  actualizar(id, data) {
    return api.put(`/scheduling/horarios/${id}`, data)
  },
 
  eliminar(id) {
    return api.delete(`/scheduling/horarios/${id}`)
  },
 
  listarAulas() {
    return api.get('/scheduling/aulas/')
  },
 
  listarDocentes() {
    return api.get('/academic/docentes/')
  }
}
 
export default horarioService