import api from './api'

const inscripcionService = {
  // 1. Crea el registro de inscripción en la tabla 'inscripcion'
  crearInscripcion(datos) {
    return api.post('/enrollment/inscripciones/', datos)
  },
  obtenerPerfilEstudiante(id_usuario) {
    return api.get(`/academic/estudiantes/${id_usuario}`)
  },
  // Inscribirse + registrar pago inicial en 1 solo paso (JSON)
  crearInscripcionConPago(datos) {
    return api.post('/enrollment/inscripciones/con-pago', datos)
 },

  // 2. Envía el FormData con el comprobante local a FastAPI
  crearPagoConComprobante(formData) {
    return api.post('/enrollment/pagos/con-comprobante', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },
  
  // 1. Obtener la lista de todos los preinscritos con sus comprobantes de pago
  listarPreinscritos() {
    return api.get('/enrollment/inscripciones/preinscritos-todos')
  },
  // 2. Aprobar o rechazar la inscripción en PostgreSQL
  actualizarEstado(id_inscripcion, nuevoEstado) {
    return api.patch(`/enrollment/inscripciones/${id_inscripcion}/estado`, null, {
      params: { nuevo_estado: nuevoEstado }
    })
  }
  
}

export default inscripcionService