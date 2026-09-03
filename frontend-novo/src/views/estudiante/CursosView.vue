<template>
  <EstudianteLayout>
    <div class="top-bar">
      <div>
        <h1>📚 Catálogo de Cursos</h1>
        <p>Explora la oferta académica del LASIN UMSA y preinscríbete en línea</p>
      </div>
    </div>

    <!-- Barra de Filtros -->
    <div class="filtros">
      <div class="search-wrap">
        <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8"/>
          <path d="m21 21-4.35-4.35"/>
        </svg>
        <input v-model="busqueda" type="text" placeholder="Buscar por nombre o sigla..." />
      </div>

      <div class="filtro-tabs">
        <button
          v-for="cat in categorias" :key="cat"
          class="filtro-tab"
          :class="{ active: categoriaActiva === cat }"
          @click="categoriaActiva = cat"
        >
          {{ cat }}
        </button>
      </div>
    </div>

    <!-- Estados de Carga / Error / Vacío -->
    <div v-if="loading" class="sin-resultados">
      <div class="spinner"></div>
      <p>Cargando cursos disponibles...</p>
    </div>
    <div v-else-if="errorMsg" class="sin-resultados error">
      <span>⚠️</span>
      <p>{{ errorMsg }}</p>
      <button class="btn-reintentar" @click="cargarCursos">Reintentar</button>
    </div>
    <div v-else-if="cursosFiltrados.length === 0" class="sin-resultados">
      <span>🔍</span>
      <p>No se encontraron cursos con ese criterio.</p>
    </div>

    <!-- Grid de Cursos -->
    <div v-else class="cursos-grid">
      <div
        class="curso-card"
        v-for="curso in cursosFiltrados"
        :key="curso.id"
      >
        <div class="curso-header">
          <span class="curso-sigla">{{ curso.sigla || 'CURSO' }}</span>
          <span class="curso-categoria">{{ curso.especialidad || 'Académico' }}</span>
        </div>

        <div class="curso-body">
          <h3>{{ curso.nombre }}</h3>
          <p class="curso-desc">{{ curso.descripcion || 'Formación especializada en los laboratorios del LASIN.' }}</p>

          <div class="curso-detalles-grid">
            <div class="cd-item">
              <span class="cd-icon">📅</span>
              <span>Inicio: {{ curso.fechaInicio }}</span>
            </div>
            <div class="cd-item">
              <span class="cd-icon">⏱️</span>
              <span>{{ curso.carga_horaria ? `${curso.carga_horaria} hrs` : curso.duracion }}</span>
            </div>
            <div class="cd-item">
              <span class="cd-icon">👥</span>
              <span>{{ curso.cupos }} cupos totales</span>
            </div>
            <div class="cd-item">
              <span class="cd-icon">🏷️</span>
              <span>Nivel: {{ curso.nivel || 'General' }}</span>
            </div>
          </div>

          <div class="curso-footer">
            <div class="curso-precio">
              <span class="precio-label">Inversión:</span>
              <strong class="precio-monto">Bs. {{ curso.precio }}</strong>
            </div>
            <button
              class="btn-preinscribir"
              @click="abrirPreinscripcion(curso)"
            >
              Preinscribirme →
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ── MODAL DE PREINSCRIPCIÓN Y COMPROBANTE ── -->
    <div class="modal-overlay" v-if="modalVisible" @click.self="modalVisible = false">
      <div class="modal">
        <button class="btn-close" @click="modalVisible = false">✕</button>

        <div class="modal-header">
          <div class="modal-icon">📝</div>
          <div>
            <h2>Confirmar Preinscripción</h2>
            <p class="text-muted">Sube tu comprobante de depósito o transferencia</p>
          </div>
        </div>

        <!-- Info del curso seleccionado -->
        <div class="modal-curso-resumen">
          <div>
            <strong>{{ cursoSeleccionado?.nombre }}</strong>
            <span class="sigla-tag">{{ cursoSeleccionado?.sigla }}</span>
          </div>
          <div class="resumen-precio">Bs. {{ cursoSeleccionado?.precio }}</div>
        </div>

        <!-- Selector de Horario / Grupo -->
        <div class="campo-horario" v-if="horariosCurso.length > 0">
          <label>Selecciona tu Grupo / Horario:</label>
          <select v-model="idHorarioSeleccionado" class="select-horario">
            <option v-for="h in horariosCurso" :key="h.id_horario" :value="h.id_horario">
              Grupo {{ h.grupo || 'A' }} · {{ h.dia_semana }} ({{ formatearHora(h.hora_inicio) }} - {{ formatearHora(h.hora_fin) }}) · {{ h.modalidad || 'Presencial' }}
            </option>
          </select>
        </div>
        <div v-else class="alerta-sin-horario">
          ℹ️ Este curso no tiene horarios asignados todavía. Se asignará automáticamente el grupo principal.
        </div>

        <!-- QR LASIN Oficial -->
        <div class="qr-container">
          <p class="qr-titulo">📱 Escanea el QR para pagar por Banca Móvil:</p>
          <img src="@/assets/QR_LASIN.jpg" alt="QR LASIN" class="qr-imagen" />
          <p class="qr-sub">Cuenta oficial LASIN · Banco Unión</p>
        </div>

        <!-- Subida del Comprobante -->
        <div class="upload-container">
          <input type="file" id="foto-comprobante" accept="image/*" @change="handleImage" hidden />
          <label for="foto-comprobante" class="upload-box" :class="{ 'upload-box--cargado': comprobanteFile }">
            <div class="upload-content">
              <template v-if="!comprobanteFile">
                <span class="upload-icon">📷</span>
                <strong>Haz clic para subir tu comprobante</strong>
                <small>Formatos aceptados: PNG, JPG o JPEG</small>
              </template>
              <template v-else>
                <span class="upload-icon">✅</span>
                <strong style="color: #059669;">Comprobante seleccionado:</strong>
                <small style="color: #047857; font-weight: 600;">{{ comprobanteFile.name }}</small>
                <span class="btn-cambiar-foto">Cambiar foto</span>
              </template>
            </div>
          </label>
        </div>

        <p class="modal-aviso">
          📌 Tu comprobante será validado por la administración del LASIN para habilitarte el acceso a clases y grupos.
        </p>

        <!-- Botones Modal -->
        <div class="modal-btns">
          <button class="btn-cancelar" @click="modalVisible = false" :disabled="enviando">Cancelar</button>
          <button class="btn-confirmar" @click="confirmarPreinscripcion" :disabled="enviando">
            {{ enviando ? '⏳ Enviando comprobante...' : '✓ Enviar Preinscripción' }}
          </button>
        </div>
      </div>
    </div>
  </EstudianteLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import EstudianteLayout from '../../components/EstudianteLayout.vue'
import cursoService from '../../services/cursoService'
import horarioService from '../../services/horarioService'
import { authService } from '../../services/auth'
import inscripcionService from '../../services/inscripcionService'

const busqueda = ref('')
const categoriaActiva = ref('Todos')
const modalVisible = ref(false)
const cursoSeleccionado = ref(null)
const loading = ref(true)
const errorMsg = ref('')
const comprobanteFile = ref(null)
const enviando = ref(false)

const horariosCurso = ref([])
const idHorarioSeleccionado = ref(null)

const categorias = ['Todos', 'Programación', 'Redes', 'Diseño', 'Ofimática', 'Ciencia de Datos']
const cursos = ref([])

const handleImage = (event) => {
  const file = event.target.files[0]
  if (file) {
    comprobanteFile.value = file
  }
}

const cursosFiltrados = computed(() => {
  return cursos.value.filter(c => {
    const texto = `${c.nombre} ${c.sigla}`.toLowerCase()
    const matchBusqueda = texto.includes((busqueda.value || '').toLowerCase())
    const matchCategoria = categoriaActiva.value === 'Todos' || (c.especialidad || '') === categoriaActiva.value
    return matchBusqueda && matchCategoria
  })
})

function mapearCursoFromAPI(c) {
  return {
    id: c.id_curso,
    nombre: c.nombre,
    sigla: c.sigla || 'LASIN',
    descripcion: c.descripcion || '',
    fechaInicio: c.fecha_inicio ? new Date(c.fecha_inicio).toLocaleDateString('es-BO') : 'Por definir',
    duracion: c.duracion || '4 semanas',
    carga_horaria: c.carga_horaria,
    cupos: c.cupos_totales || 30,
    precio: c.costo || 0,
    especialidad: c.especialidad || 'General',
    nivel: c.nivel || 'Básico - Intermedio'
  }
}

async function cargarCursos() {
  loading.value = true
  errorMsg.value = ''
  try {
    const response = await cursoService.listar({ limit: 100 })
    const lista = Array.isArray(response) ? response : response.data || []
    cursos.value = lista.map(mapearCursoFromAPI)
  } catch (error) {
    console.error('[CursosView] Error:', error)
    errorMsg.value = 'No se pudieron cargar los cursos disponibles. Verifica tu conexión.'
  } finally {
    loading.value = false
  }
}

async function abrirPreinscripcion(curso) {
  cursoSeleccionado.value = curso
  comprobanteFile.value = null
  horariosCurso.value = []
  idHorarioSeleccionado.value = null

  try {
    // Buscar horarios específicos del curso en la BD
    const resH = await horarioService.listar({ id_curso: curso.id })
    horariosCurso.value = resH.data || []
    if (horariosCurso.value.length > 0) {
      idHorarioSeleccionado.value = horariosCurso.value[0].id_horario
    }
  } catch (e) {
    console.warn('[CursosView] No se pudieron cargar horarios específicos:', e)
  }

  modalVisible.value = true
}

function formatearHora(h) {
  if (!h) return '--:--'
  return String(h).slice(0, 5)
}

async function confirmarPreinscripcion() {
  if (!comprobanteFile.value) {
    alert('⚠️ Por favor selecciona la foto de tu comprobante de pago.')
    return
  }

  const usuarioActual = authService.getUsuario()
  if (!usuarioActual || !usuarioActual.id_usuario) {
    alert('⚠️ No se encontró la sesión de usuario. Inicia sesión nuevamente.')
    return
  }

  enviando.value = true
  try {
    const idEstudiante = usuarioActual.id_usuario
    // Usar el horario seleccionado o fallback al primero
    const idHorario = idHorarioSeleccionado.value || 1

    // 1. Crear registro de inscripción
    const body = {
      inscripcion: {
        id_horario: idHorario,
        id_estudiante: idEstudiante
      },
      pago: {
        id_inscripcion: 0,
        precio: cursoSeleccionado.value?.precio || 0,
        metodo_pago: 'Transferencia QR',
        estado: 'pendiente'
      }
    }

    const res = await inscripcionService.crearInscripcionConPago(body)
    const idInscripcionCreada = res.data.inscripcion.id_inscripcion

    // 2. Subir comprobante físico
    const formData = new FormData()
    formData.append('id_inscripcion', idInscripcionCreada)
    formData.append('precio', cursoSeleccionado.value?.precio || 0)
    formData.append('metodo_pago', 'Transferencia QR')
    formData.append('comprobante', comprobanteFile.value)

    await inscripcionService.crearPagoConComprobante(formData)

    alert(`✅ ¡Preinscripción enviada exitosamente!\n\nTu comprobante fue registrado. El administrador verificará tu pago para habilitar tu cupo.`)
    modalVisible.value = false
    comprobanteFile.value = null

  } catch (error) {
    console.error('[Preinscripcion] Error:', error.response?.data || error)
    const detalle = error.response?.data?.detail || 'Ocurrió un problema al enviar la preinscripción.'
    alert(`❌ Error: ${detalle}`)
  } finally {
    enviando.value = false
  }
}

onMounted(cargarCursos)
</script>

<style scoped>
.top-bar { margin-bottom: 24px; }
.top-bar h1 { font-size: 24px; font-weight: 700; color: #0f172a; }
.top-bar p { font-size: 14px; color: #64748b; margin-top: 4px; }

/* ── Filtros ── */
.filtros { display: flex; gap: 14px; align-items: center; margin-bottom: 26px; flex-wrap: wrap; }
.search-wrap { position: relative; }
.search-wrap svg { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: #94a3b8; pointer-events: none; }
.search-wrap input { padding: 10px 14px 10px 38px; border: 1px solid #e2e8f0; border-radius: 10px; font-size: 13px; width: 260px; outline: none; transition: border-color 0.2s; background: white; }
.search-wrap input:focus { border-color: #0077b6; }

.filtro-tabs { display: flex; gap: 8px; flex-wrap: wrap; }
.filtro-tab { padding: 8px 14px; background: white; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 13px; font-weight: 500; color: #475569; cursor: pointer; transition: all 0.15s; }
.filtro-tab:hover { border-color: #0077b6; color: #0077b6; }
.filtro-tab.active { background: #0077b6; border-color: #0077b6; color: white; }

/* ── Estados ── */
.sin-resultados { text-align: center; padding: 60px 20px; color: #64748b; }
.sin-resultados span { font-size: 40px; display: block; margin-bottom: 10px; }
.spinner { width: 28px; height: 28px; border: 3px solid #e2e8f0; border-top-color: #0077b6; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 12px; }
@keyframes spin { to { transform: rotate(360deg); } }
.btn-reintentar { margin-top: 12px; padding: 8px 16px; background: #0077b6; color: white; border: none; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; }

/* ── Grid Cursos ── */
.cursos-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 24px; }

.curso-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04);
  transition: transform 0.2s, box-shadow 0.2s;
  display: flex;
  flex-direction: column;
}
.curso-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 119, 182, 0.12);
}

.curso-header {
  background: linear-gradient(135deg, #0077b6, #00b4d8);
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.curso-sigla { font-size: 18px; font-weight: 800; color: white; letter-spacing: 0.5px; }
.curso-categoria { background: rgba(255,255,255,0.25); color: white; padding: 3px 10px; border-radius: 100px; font-size: 11px; font-weight: 600; }

.curso-body { padding: 20px; display: flex; flex-direction: column; flex: 1; }
.curso-body h3 { font-size: 16px; font-weight: 700; color: #0f172a; margin-bottom: 6px; }
.curso-desc { font-size: 13px; color: #64748b; line-height: 1.5; margin-bottom: 16px; flex: 1; }

.curso-detalles-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 18px; padding-top: 12px; border-top: 1px solid #f1f5f9; }
.cd-item { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #475569; }
.cd-icon { font-size: 13px; }

.curso-footer { display: flex; justify-content: space-between; align-items: center; padding-top: 14px; border-top: 1px solid #f1f5f9; }
.precio-label { font-size: 11px; color: #64748b; display: block; }
.precio-monto { font-size: 18px; color: #0f172a; }

.btn-preinscribir {
  padding: 9px 18px;
  background: #0077b6;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
}
.btn-preinscribir:hover { background: #005f92; }

/* ── MODAL ── */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.65);
  backdrop-filter: blur(3px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 16px;
  overflow-y: auto;
}

.modal {
  background: white;
  border-radius: 16px;
  padding: 28px;
  width: 100%;
  max-width: 480px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.2);
  position: relative;
  max-height: 92vh;
  overflow-y: auto;
}

.btn-close { position: absolute; top: 18px; right: 18px; background: #f1f5f9; border: none; font-size: 16px; font-weight: 700; color: #64748b; border-radius: 50%; width: 32px; height: 32px; cursor: pointer; }
.btn-close:hover { background: #fee2e2; color: #dc2626; }

.modal-header { display: flex; align-items: center; gap: 12px; margin-bottom: 18px; padding-right: 32px; }
.modal-icon { font-size: 26px; }
.modal h2 { font-size: 18px; font-weight: 700; color: #0f172a; margin: 0; }
.text-muted { font-size: 12px; color: #64748b; margin: 2px 0 0; }

.modal-curso-resumen {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 12px 14px;
  margin-bottom: 16px;
}
.sigla-tag { display: inline-block; font-size: 11px; background: #e0f2fe; color: #0077b6; padding: 2px 6px; border-radius: 4px; font-weight: 700; margin-left: 6px; }
.resumen-precio { font-size: 16px; font-weight: 800; color: #16a34a; }

.campo-horario { margin-bottom: 16px; }
.campo-horario label { display: block; font-size: 12px; font-weight: 700; color: #475569; margin-bottom: 6px; }
.select-horario { width: 100%; padding: 9px 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 13px; outline: none; background: white; }
.select-horario:focus { border-color: #0077b6; }
.alerta-sin-horario { font-size: 12px; color: #64748b; background: #f1f5f9; padding: 8px 12px; border-radius: 8px; margin-bottom: 16px; }

.qr-container { text-align: center; margin-bottom: 18px; background: #f8fafc; padding: 14px; border-radius: 12px; border: 1px solid #e2e8f0; }
.qr-titulo { font-size: 12px; font-weight: 600; color: #1e293b; margin-bottom: 10px; }
.qr-imagen { width: 180px; max-width: 100%; border-radius: 8px; border: 1px solid #cbd5e1; display: block; margin: 0 auto; }
.qr-sub { font-size: 11px; color: #64748b; margin-top: 8px; }

/* Subida Comprobante */
.upload-container { margin-bottom: 16px; }
.upload-box {
  display: block;
  border: 2px dashed #cbd5e1;
  border-radius: 10px;
  padding: 16px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  background: white;
}
.upload-box:hover { border-color: #0077b6; background: #f0f9ff; }
.upload-box--cargado { border-color: #10b981; background: #ecfdf5; }
.upload-icon { font-size: 24px; display: block; margin-bottom: 4px; }
.upload-content strong { display: block; font-size: 13px; color: #1e293b; }
.upload-content small { display: block; font-size: 11px; color: #64748b; margin-top: 2px; }
.btn-cambiar-foto { display: inline-block; font-size: 11px; color: #059669; text-decoration: underline; margin-top: 6px; }

.modal-aviso { font-size: 11px; color: #64748b; line-height: 1.4; margin-bottom: 18px; }

.modal-btns { display: flex; gap: 10px; }
.btn-cancelar { flex: 1; padding: 10px; background: #f1f5f9; border: none; border-radius: 8px; color: #475569; font-size: 13px; font-weight: 600; cursor: pointer; }
.btn-cancelar:hover { background: #e2e8f0; }
.btn-confirmar { flex: 2; padding: 10px; background: #0077b6; border: none; border-radius: 8px; color: white; font-size: 13px; font-weight: 600; cursor: pointer; transition: background 0.15s; }
.btn-confirmar:hover:not(:disabled) { background: #005f92; }
.btn-confirmar:disabled { opacity: 0.6; cursor: not-allowed; }

@media (max-width: 640px) {
  .cursos-grid { grid-template-columns: 1fr; }
  .curso-detalles-grid { grid-template-columns: 1fr; }
}
</style>