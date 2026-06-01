import axios from 'axios'
import api from './api'
 
const publicApi = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})
 
const cursoService = {
  listar(params = {}) {
    return api.get('/courses/cursos/', { params })
  },
  obtener(id) {
    return api.get(`/courses/cursos/${id}`)
  },
 
  crear(data) {
    return api.post('/courses/cursos/', data)
  },
 
  actualizar(id, data) {
    return api.put(`/courses/cursos/${id}`, data)
  },
 
  eliminar(id) {
    return api.delete(`/courses/cursos/${id}`)
  },
 
  listarTemas(id_curso) {
    return api.get('/courses/temas/', { params: { id_curso } })
  },
 
  crearTema(data) {
    return api.post('/courses/temas/', data)
  },
 
  actualizarTema(id, data) {
    return api.put(`/courses/temas/${id}`, data)
  },
 
  eliminarTema(id) {
    return api.delete(`/courses/temas/${id}`)
  }
}
 
export default cursoService