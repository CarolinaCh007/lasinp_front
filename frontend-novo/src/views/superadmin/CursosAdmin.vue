<template>
  <SuperadminLayout>
    <!-- Toolbar -->
    <div class="toolbar">
      <div class="filters-group">

        <div class="search-box">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input v-model="searchQuery" type="text" class="input-base" placeholder="Buscar por nombre o sigla..." />
        </div>

        <div class="search-box">
          <select v-model="filterEstado" class="select-base">
            <option value="">Todos los estados</option>
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
            <option value="pendiente">Pendiente</option>
          </select>
        </div>
        <div class="search-box">
          <select v-model="filterNivel" class="select-base">
            <option value="">Todos los niveles</option>
            <option value="Básico">Básico</option>
            <option value="Intermedio">Intermedio</option>
            <option value="Avanzado">Avanzado</option>
          </select>
        </div>
      </div>
      <button class="btn-primary" @click="abrirModalCrear">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        Nuevo curso
      </button>
    </div>

    <!-- Stats -->
    <div class="stats-row">
      <div class="stat-card">
        <span class="stat-num">{{ cursos.length }}</span>
        <span class="stat-label">Total cursos</span>
      </div>
      <div class="stat-card stat-green">
        <span class="stat-num">{{ cursos.filter(c => c.estado === 'activo').length }}</span>
        <span class="stat-label">Activos</span>
      </div>
      <div class="stat-card stat-yellow">
        <span class="stat-num">{{ cursos.filter(c => c.estado === 'pendiente').length }}</span>
        <span class="stat-label">Pendientes</span>
      </div>
      <div class="stat-card stat-red">
        <span class="stat-num">{{ cursos.filter(c => c.estado === 'inactivo').length }}</span>
        <span class="stat-label">Inactivos</span>
      </div>
    </div>

    <!-- Tabla -->
    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>Curso</th>
            <th>Sigla</th>
            <th>Nivel</th>
            <th>Costo</th>
            <th>Cupos</th>
            <th>Fechas</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="cargando">
            <td colspan="8" class="empty-message">
              <div class="loading-wrap">
                <div class="spinner"></div>
                Cargando cursos...
              </div>
            </td>
          </tr>
          <tr v-else-if="error">
            <td colspan="8" class="empty-message text-danger">⚠️ {{ error }}</td>
          </tr>
          <tr v-for="curso in cursosFiltrados" :key="curso.id_curso" class="fila-curso">
            <td>
              <div class="curso-info">
                <div class="curso-avatar">{{ curso.nombre.charAt(0).toUpperCase() }}</div>
                <div>
                  <p class="curso-nombre">{{ curso.nombre }}</p>
                  <p class="curso-esp">{{ curso.especialidad || '—' }}</p>
                </div>
              </div>
            </td>
            <td><span class="badge-sigla">{{ curso.sigla || '—' }}</span></td>
            <td>
              <span :class="['badge-nivel', `nivel-${(curso.nivel || '').toLowerCase()}`]">
                {{ curso.nivel || '—' }}
              </span>
            </td>
            <td class="td-mono">Bs. {{ curso.costo }}</td>
            <td class="td-mono">{{ curso.cupos_totales }}</td>
            <td class="td-fechas">
              <span v-if="curso.fecha_inicio">{{ formatFecha(curso.fecha_inicio) }}</span>
              <span v-if="curso.fecha_fin" class="fecha-sep"> → {{ formatFecha(curso.fecha_fin) }}</span>
              <span v-if="!curso.fecha_inicio" class="text-muted">—</span>
            </td>
            <td>
              <span :class="['badge', `badge-${curso.estado}`]">{{ curso.estado }}</span>
            </td>
            <td class="actions-cell">
              <!-- Botón 1: Ver preinscritos y comprobantes de este curso -->
              <button class="btn btn-info" @click="verPreinscritosCurso(curso)">
                📷 Preinscritos
              </button>

              <!-- Botón 2: Ir a la Pantalla Completa del Curso -->
              <button class="btn btn-primary" @click="administrarCurso(curso)">
                ➡️ Administrar Curso
              </button>
            </td>
          </tr>
          <tr v-if="!cargando && cursosFiltrados.length === 0 && !error">
            <td colspan="8" class="empty-message">No se encontraron cursos con esos filtros.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- ═══ MODAL CREAR CURSO — 2 PASOS ═══ -->
    <div v-if="modalForm" class="modal-overlay" @click.self="cerrarModal">
      <div class="modal modal--large">
        <button class="btn-close" @click="cerrarModal">✕</button>

        <!-- Indicador de pasos -->
        <div class="wizard-steps">
          <div :class="['wizard-step', pasoActual >= 1 ? 'active' : '']">
            <span class="step-num">1</span>
            <span class="step-label">Datos del Curso</span>
          </div>
          <div class="step-line"></div>
          <div :class="['wizard-step', pasoActual >= 2 ? 'active' : '']">
            <span class="step-num">2</span>
            <span class="step-label">Horario y Aula</span>
          </div>
        </div>

        <!-- ── PASO 1: Datos del Curso ── -->
        <div v-if="pasoActual === 1">
          <h2>📚 Datos del Curso</h2>
          <p class="text-muted mb-4">Completa la información académica del curso.</p>
          <div class="form-grid">
            <div class="form-field">
              <label class="field-label">Nombre del curso *</label>
              <input v-model="form.nombre" type="text" class="input-base" placeholder="Ej: Python Básico" />
            </div>
            <div class="form-field">
              <label class="field-label">Sigla *</label>
              <input v-model="form.sigla" type="text" class="input-base" placeholder="Ej: PY-01" />
            </div>
            <div class="form-field">
              <label class="field-label">Nivel *</label>
              <select v-model="form.nivel" class="input-base">
                <option value="">Seleccionar...</option>
                <option value="Básico">Básico</option>
                <option value="Intermedio">Intermedio</option>
                <option value="Avanzado">Avanzado</option>
              </select>
            </div>
            <div class="form-field">
              <label class="field-label">Especialidad</label>
              <input v-model="form.especialidad" type="text" class="input-base" placeholder="Ej: Programación" />
            </div>
            <div class="form-field">
              <label class="field-label">Costo (Bs.) *</label>
              <input v-model.number="form.costo" type="number" class="input-base" min="0" placeholder="Ej: 230" />
            </div>
            <div class="form-field">
              <label class="field-label">Cupos totales *</label>
              <input v-model.number="form.cupos_totales" type="number" class="input-base" min="1" placeholder="Ej: 25" />
            </div>
            <div class="form-field">
              <label class="field-label">Fecha de inicio</label>
              <input v-model="form.fecha_inicio" type="date" class="input-base" />
            </div>
            <div class="form-field">
              <label class="field-label">Fecha de fin</label>
              <input v-model="form.fecha_fin" type="date" class="input-base" />
            </div>
            <div class="form-field">
              <label class="field-label">Duración</label>
              <input v-model="form.duracion" type="text" class="input-base" placeholder="Ej: 4 semanas" />
            </div>
            <div class="form-field">
              <label class="field-label">Carga horaria (horas)</label>
              <input v-model.number="form.carga_horaria" type="number" class="input-base" min="1" />
            </div>
          </div>
          <div class="form-field mt-3">
            <label class="field-label">Descripción</label>
            <textarea v-model="form.descripcion" class="input-base" rows="2" placeholder="¿De qué trata el curso?"></textarea>
          </div>
          <div class="form-field mt-3">
            <label class="field-label">Objetivo</label>
            <textarea v-model="form.objetivo" class="input-base" rows="2" placeholder="¿Qué aprenderá el estudiante?"></textarea>
          </div>
          <div class="form-grid mt-3">
            <div class="form-field">
              <label class="field-label">Requisitos previos</label>
              <input v-model="form.requisitos_previos" type="text" class="input-base" placeholder="Ej: Conocimientos básicos de PC" />
            </div>
            <div class="form-field">
              <label class="field-label">Requisitos técnicos</label>
              <input v-model="form.requisitos_tecnicos" type="text" class="input-base" placeholder="Ej: Laptop con 8GB RAM" />
            </div>
            <div class="form-field">
              <label class="field-label">Link WhatsApp del grupo</label>
              <input v-model="form.link_whatsapp" type="text" class="input-base" placeholder="https://chat.whatsapp.com/..." />
            </div>
          </div>
          <div v-if="errorForm" class="form-error">⚠️ {{ errorForm }}</div>
          <div class="modal-actions">
            <button type="button" class="btn-secondary" @click="cerrarModal">Cancelar</button>
            <button type="button" class="btn-primary" @click="siguientePaso">
              Siguiente: Horario y Aula →
            </button>
          </div>
        </div>

        <!-- ── PASO 2: Horario y Aula ── -->
        <div v-if="pasoActual === 2">
          <h2>⏰ Horario y Aula</h2>
          <p class="text-muted mb-4">Asigna el docente, el aula y los días/horas de clase.</p>
          <div class="form-grid">
            <div class="form-field">
              <label class="field-label">Docente a cargo</label>
              <select v-model="formHorario.id_docente" class="input-base">
                <option :value="null">— Sin asignar por ahora —</option>
                <option v-for="d in docentes" :key="d.id_usuario" :value="d.id_usuario">
                  {{ d.nombre }} {{ d.ape_paterno }} {{ d.ape_materno || '' }}
                </option>
              </select>
            </div>
            <div class="form-field">
              <label class="field-label">Aula / Laboratorio</label>
              <select v-model="formHorario.id_aula" class="input-base">
                <option :value="null">— Sin asignar por ahora —</option>
                <option v-for="a in aulas" :key="a.id_aula" :value="a.id_aula">
                  {{ a.nombre }} {{ a.capacidad ? `(Cap. ${a.capacidad})` : '' }}
                </option>
              </select>
            </div>
            <div class="form-field">
              <label class="field-label">Grupo / Paralelo</label>
              <input v-model="formHorario.grupo" type="text" class="input-base" placeholder="Ej: Grupo A" />
            </div>
            <div class="form-field">
              <label class="field-label">Modalidad</label>
              <select v-model="formHorario.modalidad" class="input-base">
                <option value="presencial">Presencial</option>
                <option value="virtual">Virtual</option>
                <option value="hibrido">Híbrido</option>
              </select>
            </div>
            <div class="form-field">
              <label class="field-label">Días de clase *</label>
              <select v-model="formHorario.dia_semana" class="input-base">
                <option value="">— Seleccionar —</option>
                <option value="Lunes a Viernes">Lunes a Viernes</option>
                <option value="Lunes, Miércoles y Viernes">Lun, Mié y Vie</option>
                <option value="Martes y Jueves">Martes y Jueves</option>
                <option value="Sábados">Sábados</option>
                <option value="Sábados y Domingos">Sábados y Domingos</option>
              </select>
            </div>
            <div class="form-field">
              <label class="field-label">Cantidad de días total</label>
              <input v-model.number="formHorario.cantidad_dias" type="number" class="input-base" min="1" placeholder="Ej: 20" />
            </div>
            <div class="form-field">
              <label class="field-label">Hora de inicio *</label>
              <input v-model="formHorario.hora_inicio" type="time" class="input-base" />
            </div>
            <div class="form-field">
              <label class="field-label">Hora de fin *</label>
              <input v-model="formHorario.hora_fin" type="time" class="input-base" />
            </div>
            <div class="form-field" style="grid-column: 1 / -1;">
              <label class="field-label">Enlace de Teams (Reunión / Grabaciones del Curso)</label>
              <input v-model="formHorario.enlace_teams" type="text" class="input-base" placeholder="https://teams.microsoft.com/l/meetup-join/..." />
            </div>
          </div>
          <div v-if="aulas.length === 0" class="form-error" style="background:#fffbeb; border-color:#fbbf24; color:#92400e; margin-top:12px;">
            ⚠️ No hay aulas registradas todavía. Puedes continuar sin aula y asignarla después desde "Administrar Curso".
          </div>
          <div v-if="errorForm" class="form-error">⚠️ {{ errorForm }}</div>
          <div class="modal-actions">
            <button type="button" class="btn-secondary" @click="pasoActual = 1">← Anterior</button>
            <button type="button" class="btn-primary" @click="guardarCurso" :disabled="guardando">
              {{ guardando ? 'Creando...' : '✅ Crear Curso Oficial' }}
            </button>
          </div>
        </div>

      </div>
    </div>

    <!-- ═══ MODAL DETALLE (con pestañas) ═══ -->
    <CursoDetalleModal
      v-if="modalDetalle"
      :curso="cursoSeleccionado"
      @cerrar="modalDetalle = false"
    />

    <!-- ═══ MODAL HORARIOS ═══ -->
    <HorariosModal
      v-if="modalHorarios"
      :curso="cursoHorarios"
      @cerrar="modalHorarios = false"
    />

    <!-- Toast -->
    <div v-if="toast.visible" :class="['toast', `toast-${toast.tipo}`]">
      {{ toast.mensaje }}
    </div>

  </SuperadminLayout>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import SuperadminLayout    from '../../components/SuperadminLayout.vue'
import CursoDetalleModal   from '../../components/CursoDetalleModal.vue'
import HorariosModal       from '../../components/HorariosModal.vue'
import cursoService        from '../../services/cursoService'
import horarioService      from '../../services/horarioService'

const router = useRouter()
const cursos            = ref([])
const cargando          = ref(true)
const error             = ref('')
const errorForm         = ref('')
const guardando         = ref(false)
const searchQuery       = ref('')
const filterEstado      = ref('')
const filterNivel       = ref('')
const modalForm         = ref(false)
const modalDetalle      = ref(false)
const modalHorarios     = ref(false)
const modoEdicion       = ref(false)
const cursoSeleccionado = ref(null)
const cursoHorarios     = ref(null)
const toast = ref({ visible: false, mensaje: '', tipo: 'exito' })

// ── Paso del wizard (1 = datos curso, 2 = horario) ──
const pasoActual = ref(1)

// ── Listas para selectores ──
const aulas    = ref([])
const docentes = ref([])

const formVacio = () => ({
  nombre: '', sigla: '', especialidad: '', descripcion: '', objetivo: '',
  fecha_inicio: '', fecha_fin: '', nivel: '', carga_horaria: null, costo: null,
  cupos_totales: null, imagen_url: '', duracion: '', estado: 'pendiente',
  link_whatsapp: '', requisitos_tecnicos: '', requisitos_previos: ''
})

const horarioVacio = () => ({
  id_aula: null,
  id_docente: null,
  grupo: 'Grupo A',
  dia_semana: '',
  hora_inicio: '',
  hora_fin: '',
  modalidad: 'presencial',
  cantidad_dias: null,
  enlace_teams: ''
})

const form         = ref(formVacio())
const formHorario  = ref(horarioVacio())

const cursosFiltrados = computed(() => {
  let lista = cursos.value
  if (filterEstado.value) lista = lista.filter(c => c.estado === filterEstado.value)
  if (filterNivel.value)  lista = lista.filter(c => c.nivel  === filterNivel.value)
  const q = searchQuery.value.toLowerCase().trim()
  if (q) lista = lista.filter(c =>
    c.nombre.toLowerCase().includes(q) || (c.sigla || '').toLowerCase().includes(q)
  )
  return lista
})

async function cargarCursos() {
  cargando.value = true; error.value = ''
  try {
    const res = await cursoService.listar({ limit: 100 })
    cursos.value = res.data
  } catch {
    error.value = 'No se pudieron cargar los cursos.'
  } finally {
    cargando.value = false
  }
}

async function cargarSelectores() {
  try {
    const [aulasRes, docentesRes] = await Promise.all([
      horarioService.listarAulas(),
      horarioService.listarDocentes()
    ])
    aulas.value    = aulasRes.data    || []
    docentes.value = docentesRes.data || []
  } catch (e) {
    console.warn('Error cargando aulas/docentes:', e)
  }
}

onMounted(async () => {
  await cargarCursos()
  await cargarSelectores()
})

async function abrirModalCrear() {
  modoEdicion.value  = false
  form.value         = formVacio()
  formHorario.value  = horarioVacio()
  errorForm.value    = ''
  pasoActual.value   = 1
  modalForm.value    = true
  await cargarSelectores()
}

function siguientePaso() {
  if (!form.value.nombre || !form.value.sigla || !form.value.nivel) {
    errorForm.value = 'Completa los campos obligatorios: Nombre, Sigla y Nivel.'
    return
  }
  errorForm.value = ''
  pasoActual.value = 2
}

async function guardarCurso() {
  guardando.value = true
  errorForm.value = ''
  try {
    // 1. Limpiar datos del Curso (convertir strings vacíos a null y validar números > 0)
    const payloadCurso = {
      nombre: form.value.nombre.trim(),
      sigla: form.value.sigla ? form.value.sigla.trim() : null,
      nivel: form.value.nivel || null,
      especialidad: form.value.especialidad ? form.value.especialidad.trim() : null,
      costo: form.value.costo !== null && form.value.costo !== '' ? Number(form.value.costo) : 0,
      cupos_totales: Number(form.value.cupos_totales) > 0 ? Number(form.value.cupos_totales) : 30,
      carga_horaria: Number(form.value.carga_horaria) > 0 ? Number(form.value.carga_horaria) : null,
      fecha_inicio: form.value.fecha_inicio || null,
      fecha_fin: form.value.fecha_fin || null,
      duracion: form.value.duracion ? form.value.duracion.trim() : null,
      descripcion: form.value.descripcion ? form.value.descripcion.trim() : null,
      objetivo: form.value.objetivo ? form.value.objetivo.trim() : null,
      requisitos_previos: form.value.requisitos_previos ? form.value.requisitos_previos.trim() : null,
      requisitos_tecnicos: form.value.requisitos_tecnicos ? form.value.requisitos_tecnicos.trim() : null,
      link_whatsapp: form.value.link_whatsapp ? form.value.link_whatsapp.trim() : null,
      imagen_url: form.value.imagen_url ? form.value.imagen_url.trim() : null,
      estado: form.value.estado || 'activo'
    }

    const resCurso = await cursoService.crear(payloadCurso)
    const nuevoCurso = resCurso.data

    // 2. Crear el Horario vinculado al curso si se llenaron datos de horario
    if (formHorario.value.dia_semana || formHorario.value.hora_inicio || formHorario.value.id_aula || formHorario.value.id_docente) {
      await horarioService.crear({
        id_curso:      nuevoCurso.id_curso,
        id_aula:       formHorario.value.id_aula ? Number(formHorario.value.id_aula) : null,
        id_docente:    formHorario.value.id_docente ? Number(formHorario.value.id_docente) : null,
        grupo:         formHorario.value.grupo || 'Grupo A',
        dia_semana:    formHorario.value.dia_semana || null,
        hora_inicio:   formHorario.value.hora_inicio || null,
        hora_fin:      formHorario.value.hora_fin || null,
        modalidad:     formHorario.value.modalidad || 'presencial',
        cantidad_dias: Number(formHorario.value.cantidad_dias) > 0 ? Number(formHorario.value.cantidad_dias) : null,
        enlace_teams:  formHorario.value.enlace_teams ? formHorario.value.enlace_teams.trim() : null,
        estado: 'activo'
      })
    }

    mostrarToast('✅ Curso y horario creados exitosamente.', 'exito')
    cerrarModal()
    await cargarCursos()
  } catch (e) {
    console.error('Error al guardar curso:', e)
    const detail = e.response?.data?.detail
    if (Array.isArray(detail)) {
      errorForm.value = detail.map(err => `${err.loc?.slice(-1)[0]}: ${err.msg}`).join(' | ')
    } else {
      errorForm.value = detail || 'Error al guardar. Verifica los datos ingresados.'
    }
  } finally {
    guardando.value = false
  }
}

function cerrarModal() {
  modalForm.value   = false
  pasoActual.value  = 1
  form.value        = formVacio()
  formHorario.value = horarioVacio()
  errorForm.value   = ''
}

function verPreinscritosCurso(curso) {
  const id = curso.id_curso || curso.id
  router.push({ path: '/superadmin/preinscritos', query: { cursoId: id } })
}

function administrarCurso(curso) {
  router.push(`/superadmin/cursos/${curso.id_curso}`)
}

function formatFecha(f) {
  if (!f) return '—'
  return new Date(f + 'T00:00:00').toLocaleDateString('es-BO', { day:'2-digit', month:'short', year:'numeric' })
}

function mostrarToast(msg, tipo = 'exito') {
  toast.value = { visible: true, mensaje: msg, tipo }
  setTimeout(() => { toast.value.visible = false }, 3500)
}
</script>







<style scoped>
.toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; gap: 16px; }
.filters-group { display: flex; gap: 12px; flex: 1; }
.search-box { display: flex; align-items: center; gap: 8px; padding: 8px 14px; background: white; border: 1px solid #e2e8f0; border-radius: 8px; flex: 1; max-width: 360px; }
.search-box:focus-within { border-color: #7700ff; }
.search-box svg { color: #94a3b8; flex-shrink: 0; }
.input-base { background: transparent; border: none; outline: none; font-size: 14px; color: #1e293b; width: 100%; font-family: inherit; }
.select-base { background: transparent; border: none; outline: none; font-size: 14px; color: #1e293b; width: 100%; font-family: inherit; cursor: pointer; }

.stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 20px; }
.stat-card { background: white; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px 20px; display: flex; flex-direction: column; gap: 4px; border-left: 4px solid #7700ff; }
.stat-card.stat-green  { border-left-color: #10b981; }
.stat-card.stat-yellow { border-left-color: #f59e0b; }
.stat-card.stat-red    { border-left-color: #ef4444; }
.stat-num   { font-size: 1.8rem; font-weight: 700; color: #1e293b; }
.stat-label { font-size: 0.8rem; color: #64748b; font-weight: 500; }

.table-container { background: white; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
.data-table { width: 100%; border-collapse: collapse; }
.data-table th, .data-table td { text-align: left; padding: 14px 18px; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
.data-table th { background: #f8fafc; font-weight: 600; color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
.data-table tbody tr:hover { background: #fafbff; }
.fila-curso { transition: background 0.15s; }

.curso-info { display: flex; align-items: center; gap: 12px; }
.curso-avatar { width: 38px; height: 38px; border-radius: 10px; background: linear-gradient(135deg, #7700ff, #0077b6); color: white; font-weight: 700; font-size: 1rem; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.curso-nombre { font-weight: 600; color: #1e293b; margin: 0; font-size: 14px; }
.curso-esp    { font-size: 12px; color: #94a3b8; margin: 2px 0 0; }

.badge-sigla { background: #ede9fe; color: #5b21b6; padding: 3px 10px; border-radius: 6px; font-size: 12px; font-weight: 700; font-family: monospace; }
.badge-nivel { padding: 3px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; }
.nivel-básico     { background: #dcfce7; color: #166534; }
.nivel-intermedio { background: #fef9c3; color: #854d0e; }
.nivel-avanzado   { background: #fee2e2; color: #991b1b; }

.badge { padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 700; text-transform: capitalize; display: inline-block; }
.badge-activo    { background: #d1fae5; color: #065f46; }
.badge-inactivo  { background: #fee2e2; color: #991b1b; }
.badge-pendiente { background: #fef3c7; color: #92400e; }

.td-mono   { font-family: monospace; font-size: 13px; color: #1e293b; }
.td-fechas { font-size: 12px; color: #475569; }
.fecha-sep { color: #94a3b8; }
.text-muted  { color: #94a3b8; }
.text-danger { color: #ef4444; }


.empty-message { text-align: center; color: #64748b; padding: 40px; font-weight: 500; }
.loading-wrap  { display: flex; align-items: center; justify-content: center; gap: 12px; }
.spinner { width: 22px; height: 22px; border: 3px solid #e2e8f0; border-top-color: #7700ff; border-radius: 50%; animation: spin 0.7s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }


.actions-cell { display: flex; gap: 6px; flex-wrap: wrap; }
.btn { padding: 6px 12px; border: none; border-radius: 7px; font-size: 13px; font-weight: 600; cursor: pointer; transition: opacity 0.15s; }
.btn:hover    { opacity: 0.82; }
.btn-info     { background: #e0f2fe; color: #0369a1; }
.btn-horario  { background: #fef9c3; color: #854d0e; }
.btn-success  { background: #dcfce7; color: #166534; }
.btn-danger   { background: #fee2e2; color: #991b1b; }
.btn-activate { background: #ede9fe; color: #5b21b6; }


.btn-primary { display: inline-flex; align-items: center; gap: 8px; padding: 10px 18px; background: #7700ff; color: white; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; white-space: nowrap; transition: background 0.2s; }
.btn-primary:hover    { background: #0077b6; }
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
.btn-secondary { display: inline-flex; align-items: center; gap: 8px; padding: 10px 18px; background: white; color: #1e293b; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; transition: background 0.15s; }
.btn-secondary:hover    { background: #f8fafc; }
.btn-secondary:disabled { opacity: 0.6; cursor: not-allowed; }


.modal-overlay { position: fixed; inset: 0; background: rgba(15,23,42,0.55); display: flex; align-items: center; justify-content: center; z-index: 100; backdrop-filter: blur(2px); overflow-y: auto; padding: 20px; }
.modal { background: white; border-radius: 14px; padding: 32px; width: 620px; max-width: 95%; box-shadow: 0 20px 40px rgba(0,0,0,0.12); position: relative; }
.modal--large { width: 820px; }
.modal h2 { margin: 0 0 6px; font-size: 20px; font-weight: 700; color: #1e293b; }
.mb-4 { margin-bottom: 14px; }
.btn-close { position: absolute; top: 16px; right: 16px; background: transparent; border: none; font-size: 22px; cursor: pointer; color: #94a3b8; border-radius: 6px; padding: 4px 8px; }
.btn-close:hover { background: #f1f5f9; color: #1e293b; }


.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.form-field { margin-bottom: 4px; }
.mt-3 { margin-top: 14px; }
.field-label { display: block; font-size: 13px; font-weight: 600; margin-bottom: 5px; color: #374151; }
.form-field .input-base { width: 100%; padding: 9px 13px; background: white; border: 1px solid #d1d5db; border-radius: 8px; box-sizing: border-box; font-size: 14px; font-family: inherit; transition: border-color 0.15s; }
.form-field .input-base:focus { border-color: #7700ff; outline: none; box-shadow: 0 0 0 3px rgba(119,0,255,0.08); }
.form-field textarea.input-base { resize: vertical; }
.form-error { margin-top: 14px; padding: 12px 16px; background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; color: #b91c1c; font-size: 13px; }
.modal-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 28px; }


.toast { position: fixed; bottom: 2rem; right: 2rem; padding: 12px 20px; border-radius: 10px; font-size: 14px; font-weight: 600; z-index: 9999; animation: slideIn 0.3s ease; box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
.toast-exito { background: #10b981; color: white; }
.toast-error { background: #ef4444; color: white; }
@keyframes slideIn { from { transform: translateX(80px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }

/* ═══ WIZARD DE PASOS ═══ */
.wizard-steps {
  display: flex;
  align-items: center;
  gap: 0;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e2e8f0;
}

.wizard-step {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #94a3b8;
  font-weight: 600;
  font-size: 14px;
  transition: color 0.2s;
}

.wizard-step.active {
  color: #2563eb;
}

.step-num {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #e2e8f0;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 700;
  transition: all 0.2s;
}

.wizard-step.active .step-num {
  background: #2563eb;
  color: white;
}

.step-line {
  flex: 1;
  height: 2px;
  background: #e2e8f0;
  margin: 0 12px;
}
</style>



