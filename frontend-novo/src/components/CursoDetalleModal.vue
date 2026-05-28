<template>
  <div class="modal-overlay" @click.self="$emit('cerrar')">
    <div class="modal modal--xl">
      <button class="btn-close" @click="$emit('cerrar')">✕</button>

      <!-- Header -->
      <div class="modal-header-info">
        <div class="curso-avatar">{{ curso.nombre.charAt(0) }}</div>
        <div>
          <h2>{{ curso.nombre }}</h2>
          <p class="text-muted">{{ curso.sigla }} · {{ curso.especialidad || 'Sin especialidad' }}</p>
        </div>
        <span :class="['badge', `badge-${curso.estado}`]" style="margin-left:auto">{{ curso.estado }}</span>
      </div>

      <!-- Pestañas -->
      <div class="tabs">
        <button v-for="tab in tabs" :key="tab.id"
          :class="['tab-btn', { active: tabActivo === tab.id }]"
          @click="tabActivo = tab.id">
          {{ tab.icon }} {{ tab.label }}
        </button>
      </div>

      <!-- TAB: INFO -->
      <div v-if="tabActivo === 'info'" class="tab-content">
        <div class="details-grid">
          <div class="detail-group">
            <h3>Información general</h3>
            <div class="detail-row"><span class="detail-label">Nombre:</span><span class="detail-value">{{ curso.nombre }}</span></div>
            <div class="detail-row"><span class="detail-label">Sigla:</span><span class="detail-value">{{ curso.sigla }}</span></div>
            <div class="detail-row"><span class="detail-label">Especialidad:</span><span class="detail-value">{{ curso.especialidad || '—' }}</span></div>
            <div class="detail-row"><span class="detail-label">Nivel:</span><span class="detail-value">{{ curso.nivel || '—' }}</span></div>
            <div class="detail-row"><span class="detail-label">Carga horaria:</span><span class="detail-value">{{ curso.carga_horaria }}h</span></div>
            <div class="detail-row"><span class="detail-label">Duración:</span><span class="detail-value">{{ curso.duracion || '—' }}</span></div>
            <div class="detail-row"><span class="detail-label">Costo:</span><span class="detail-value">Bs. {{ curso.costo }}</span></div>
            <div class="detail-row"><span class="detail-label">Cupos totales:</span><span class="detail-value">{{ curso.cupos_totales }}</span></div>
          </div>
          <div class="detail-group">
            <h3>Fechas y requisitos</h3>
            <div class="detail-row"><span class="detail-label">Fecha inicio:</span><span class="detail-value">{{ formatFecha(curso.fecha_inicio) || '—' }}</span></div>
            <div class="detail-row"><span class="detail-label">Fecha fin:</span><span class="detail-value">{{ formatFecha(curso.fecha_fin) || '—' }}</span></div>
            <div class="detail-row"><span class="detail-label">Req. previos:</span><span class="detail-value">{{ curso.requisitos_previos || '—' }}</span></div>
            <div class="detail-row"><span class="detail-label">Req. técnicos:</span><span class="detail-value">{{ curso.requisitos_tecnicos || '—' }}</span></div>
            <div class="detail-row"><span class="detail-label">WhatsApp:</span>
              <a v-if="curso.link_whatsapp" :href="curso.link_whatsapp" target="_blank" class="link-wa">Ver grupo</a>
              <span v-else class="detail-value">—</span>
            </div>
          </div>
          <div class="detail-group detail-full">
            <h3>Descripción y objetivo</h3>
            <div class="detail-row"><span class="detail-label">Descripción:</span><span class="detail-value">{{ curso.descripcion || '—' }}</span></div>
            <div class="detail-row"><span class="detail-label">Objetivo:</span><span class="detail-value">{{ curso.objetivo || '—' }}</span></div>
          </div>
        </div>
      </div>

      <!-- TAB: ESTUDIANTES -->
      <div v-if="tabActivo === 'estudiantes'" class="tab-content">
        <div class="tab-toolbar">
          <p class="tab-desc">Estudiantes inscritos en este curso</p>
          <span class="count-badge">{{ inscripciones.length }} inscritos</span>
        </div>
        <div v-if="cargandoInscripciones" class="loading-msg"><div class="spinner"></div> Cargando...</div>
        <div v-else-if="inscripciones.length === 0" class="empty-tab">No hay estudiantes inscritos aún.</div>
        <table v-else class="data-table">
          <thead><tr><th>#</th><th>Estudiante</th><th>Fecha inscripción</th><th>Estado</th></tr></thead>
          <tbody>
            <tr v-for="(ins, i) in inscripciones" :key="ins.id_inscripcion">
              <td class="td-num">{{ i + 1 }}</td>
              <td><strong>{{ ins.nombre_completo || `Estudiante #${ins.id_estudiante}` }}</strong></td>
              <td>{{ formatFecha(ins.fecha_inscripcion) }}</td>
              <td><span :class="['badge', `badge-${ins.estado}`]">{{ ins.estado }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- TAB: TEMAS -->
      <div v-if="tabActivo === 'temas'" class="tab-content">
        <div class="tab-toolbar">
          <p class="tab-desc">Temario del curso</p>
          <button class="btn-primary-sm" @click="mostrarFormTema = !mostrarFormTema">+ Agregar tema</button>
        </div>
        <div v-if="mostrarFormTema" class="form-inline">
          <div class="form-grid-3">
            <div class="form-field">
              <label class="field-label">N° Tema</label>
              <input v-model.number="formTema.numero_tema" type="number" class="input-base" min="1" />
            </div>
            <div class="form-field">
              <label class="field-label">Título *</label>
              <input v-model="formTema.titulo" type="text" class="input-base" placeholder="Ej: Introducción" />
            </div>
            <div class="form-field">
              <label class="field-label">Duración estimada</label>
              <input v-model="formTema.duracion_estimada" type="text" class="input-base" placeholder="Ej: 2 horas" />
            </div>
          </div>
          <div class="form-field mt-2">
            <label class="field-label">Descripción</label>
            <input v-model="formTema.descripcion" type="text" class="input-base" placeholder="Descripción breve..." />
          </div>
          <div v-if="errorTema" class="form-error">⚠️ {{ errorTema }}</div>
          <div class="form-footer-sm">
            <button class="btn-secondary-sm" @click="mostrarFormTema = false">Cancelar</button>
            <button class="btn-primary-sm" @click="agregarTema" :disabled="guardandoTema">
              {{ guardandoTema ? 'Guardando...' : 'Guardar tema' }}
            </button>
          </div>
        </div>
        <div v-if="cargandoTemas" class="loading-msg"><div class="spinner"></div> Cargando...</div>
        <div v-else-if="temas.length === 0" class="empty-tab">No hay temas registrados aún.</div>
        <table v-else class="data-table">
          <thead><tr><th>N°</th><th>Título</th><th>Descripción</th><th>Duración</th><th></th></tr></thead>
          <tbody>
            <tr v-for="tema in temasOrdenados" :key="tema.id_tema">
              <td><span class="num-circle">{{ tema.numero_tema }}</span></td>
              <td><strong>{{ tema.titulo }}</strong></td>
              <td class="text-muted">{{ tema.descripcion || '—' }}</td>
              <td>{{ tema.duracion_estimada || '—' }}</td>
              <td><button class="btn btn-danger" @click="eliminarTema(tema.id_tema)">Eliminar</button></td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- TAB: PAGOS -->
      <div v-if="tabActivo === 'pagos'" class="tab-content">
        <div class="tab-toolbar">
          <p class="tab-desc">Historial de pagos del curso</p>
          <div class="stats-mini">
            <span class="stat-mini-item">Total recaudado: <strong>Bs. {{ totalRecaudado }}</strong></span>
            <span class="stat-mini-item">Confirmados: <strong>{{ pagosConfirmados }}</strong></span>
          </div>
        </div>
        <div v-if="cargandoPagos" class="loading-msg"><div class="spinner"></div> Cargando...</div>
        <div v-else-if="pagos.length === 0" class="empty-tab">No hay pagos registrados aún.</div>
        <table v-else class="data-table">
          <thead><tr><th>ID</th><th>Monto</th><th>Método</th><th>Estado</th><th>Fecha</th></tr></thead>
          <tbody>
            <tr v-for="pago in pagos" :key="pago.id_pago">
              <td class="td-mono">#{{ pago.id_pago }}</td>
              <td class="td-mono"><strong>Bs. {{ pago.precio }}</strong></td>
              <td>{{ pago.metodo_pago || '—' }}</td>
              <td><span :class="['badge', getBadgePago(pago.estado)]">{{ pago.estado || '—' }}</span></td>
              <td>{{ formatFecha(pago.fecha_pago) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- TAB: REPORTE -->
      <div v-if="tabActivo === 'reporte'" class="tab-content">
        <div class="reporte-grid">
          <div class="reporte-card">
            <span class="rep-icon">👥</span>
            <span class="rep-num">{{ inscripciones.length }}</span>
            <span class="rep-label">Inscritos</span>
          </div>
          <div class="reporte-card reporte-green">
            <span class="rep-icon">✅</span>
            <span class="rep-num">{{ inscripciones.filter(i => i.estado === 'aprobado').length }}</span>
            <span class="rep-label">Aprobados</span>
          </div>
          <div class="reporte-card reporte-red">
            <span class="rep-icon">❌</span>
            <span class="rep-num">{{ inscripciones.filter(i => i.estado === 'reprobado').length }}</span>
            <span class="rep-label">Reprobados</span>
          </div>
          <div class="reporte-card reporte-blue">
            <span class="rep-icon">💰</span>
            <span class="rep-num">Bs. {{ totalRecaudado }}</span>
            <span class="rep-label">Recaudado</span>
          </div>
          <div class="reporte-card reporte-purple">
            <span class="rep-icon">📚</span>
            <span class="rep-num">{{ temas.length }}</span>
            <span class="rep-label">Temas</span>
          </div>
          <div class="reporte-card reporte-yellow">
            <span class="rep-icon">🪑</span>
            <span class="rep-num">{{ cuposLibres }}</span>
            <span class="rep-label">Cupos libres</span>
          </div>
        </div>
        <div class="reporte-info">
          <h3>Ocupación del curso</h3>
          <div class="detail-row">
            <span class="detail-label">Ocupación:</span>
            <div class="progress-wrap">
              <div class="progress-bar"><div class="progress-fill" :style="{ width: porcentajeOcupacion + '%' }"></div></div>
              <span class="progress-label">{{ porcentajeOcupacion }}%</span>
            </div>
          </div>
          <div class="detail-row"><span class="detail-label">Cupos totales:</span><span class="detail-value">{{ curso.cupos_totales }}</span></div>
          <div class="detail-row"><span class="detail-label">Inscritos:</span><span class="detail-value">{{ inscripciones.length }}</span></div>
          <div class="detail-row"><span class="detail-label">Disponibles:</span><span class="detail-value">{{ cuposLibres }}</span></div>
        </div>
        <div class="reporte-actions">
          <button class="btn-export" @click="exportarCSV">📥 Exportar lista de estudiantes (CSV)</button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '../services/api'
import cursoService from '../services/cursoService'

const props = defineProps({ curso: { type: Object, required: true } })
const emit  = defineEmits(['cerrar'])

const tabs = [
  { id: 'info',        label: 'Info general', icon: '📋' },
  { id: 'estudiantes', label: 'Estudiantes',  icon: '👥' },
  { id: 'temas',       label: 'Temas',        icon: '📚' },
  { id: 'pagos',       label: 'Pagos',        icon: '💰' },
  { id: 'reporte',     label: 'Reporte',      icon: '📊' },
]
const tabActivo = ref('info')

const inscripciones         = ref([])
const temas                 = ref([])
const pagos                 = ref([])
const cargandoInscripciones = ref(false)
const cargandoTemas         = ref(false)
const cargandoPagos         = ref(false)
const mostrarFormTema       = ref(false)
const guardandoTema         = ref(false)
const errorTema             = ref('')

const formTema = ref({ numero_tema: 1, titulo: '', descripcion: '', duracion_estimada: '' })

const temasOrdenados     = computed(() => [...temas.value].sort((a, b) => a.numero_tema - b.numero_tema))
const totalRecaudado     = computed(() => pagos.value.filter(p => p.estado === 'confirmado').reduce((s, p) => s + Number(p.precio || 0), 0))
const pagosConfirmados   = computed(() => pagos.value.filter(p => p.estado === 'confirmado').length)
const cuposLibres        = computed(() => Math.max(0, props.curso.cupos_totales - inscripciones.value.length))
const porcentajeOcupacion = computed(() => {
  if (!props.curso.cupos_totales) return 0
  return Math.round((inscripciones.value.length / props.curso.cupos_totales) * 100)
})

onMounted(async () => {
  cargandoInscripciones.value = true
  cargandoTemas.value = true
  cargandoPagos.value = true
  try {
    const [insRes, temasRes, pagosRes] = await Promise.all([
      api.get(`/enrollment/inscripciones/por-curso/${props.curso.id_curso}`),
      cursoService.listarTemas(props.curso.id_curso),
      api.get('/enrollment/pagos/', { params: { limit: 200 } })
    ])
    inscripciones.value = insRes.data
    temas.value         = temasRes.data
    const idsIns = insRes.data.map(i => i.id_inscripcion)
    pagos.value = pagosRes.data.filter(p => idsIns.includes(p.id_inscripcion))
  } catch (e) {
    console.error(e)
  } finally {
    cargandoInscripciones.value = false
    cargandoTemas.value = false
    cargandoPagos.value = false
  }
})

async function agregarTema() {
  errorTema.value = ''
  if (!formTema.value.titulo.trim()) { errorTema.value = 'El título es obligatorio.'; return }
  guardandoTema.value = true
  try {
    await cursoService.crearTema({ ...formTema.value, id_curso: props.curso.id_curso })
    const res = await cursoService.listarTemas(props.curso.id_curso)
    temas.value = res.data
    formTema.value = { numero_tema: temas.value.length + 1, titulo: '', descripcion: '', duracion_estimada: '' }
    mostrarFormTema.value = false
  } catch (e) {
    errorTema.value = e.response?.data?.detail || 'Error al guardar el tema.'
  } finally {
    guardandoTema.value = false
  }
}

async function eliminarTema(id) {
  try {
    await cursoService.eliminarTema(id)
    temas.value = temas.value.filter(t => t.id_tema !== id)
  } catch { alert('Error al eliminar el tema.') }
}

function getBadgePago(estado) {
  if (estado === 'confirmado') return 'badge-activo'
  if (estado === 'pendiente')  return 'badge-pendiente'
  return 'badge-inactivo'
}

function formatFecha(f) {
  if (!f) return null
  return new Date(f).toLocaleDateString('es-BO', { day: '2-digit', month: 'short', year: 'numeric' })
}

function exportarCSV() {
  const headers = ['N°', 'Estudiante', 'Fecha inscripción', 'Estado']
  const rows = inscripciones.value.map((ins, i) => [
    i + 1,
    ins.nombre_completo || `#${ins.id_estudiante}`,
    formatFecha(ins.fecha_inscripcion),
    ins.estado
  ])
  const csv  = [headers, ...rows].map(r => r.join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href = url; a.download = `estudiantes_${props.curso.sigla}.csv`; a.click()
  URL.revokeObjectURL(url)
}
</script>

<style scoped>
.modal-overlay { position: fixed; inset: 0; background: rgba(15,23,42,0.6); display: flex; align-items: center; justify-content: center; z-index: 200; backdrop-filter: blur(2px); overflow-y: auto; padding: 20px; }
.modal { background: white; border-radius: 16px; padding: 32px; width: 900px; max-width: 96%; box-shadow: 0 24px 48px rgba(0,0,0,0.15); position: relative; max-height: 90vh; overflow-y: auto; }
.modal--xl { width: 960px; }
.btn-close { position: absolute; top: 16px; right: 16px; background: transparent; border: none; font-size: 22px; cursor: pointer; color: #94a3b8; border-radius: 6px; padding: 4px 8px; }
.btn-close:hover { background: #f1f5f9; color: #1e293b; }

.modal-header-info { display: flex; align-items: center; gap: 14px; margin-bottom: 20px; }
.curso-avatar { width: 48px; height: 48px; border-radius: 12px; background: linear-gradient(135deg, #7700ff, #0077b6); color: white; font-weight: 700; font-size: 1.4rem; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.modal h2 { margin: 0 0 2px; font-size: 20px; font-weight: 700; color: #1e293b; }
.text-muted { color: #64748b; font-size: 13px; margin: 0; }

.badge { padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 700; text-transform: capitalize; display: inline-block; }
.badge-activo    { background: #d1fae5; color: #065f46; }
.badge-inactivo  { background: #fee2e2; color: #991b1b; }
.badge-pendiente { background: #fef3c7; color: #92400e; }
.badge-aprobado  { background: #d1fae5; color: #065f46; }
.badge-reprobado { background: #fee2e2; color: #991b1b; }

.tabs { display: flex; gap: 4px; border-bottom: 2px solid #f1f5f9; margin-bottom: 24px; overflow-x: auto; }
.tab-btn { padding: 10px 18px; background: transparent; border: none; font-size: 14px; font-weight: 600; color: #64748b; cursor: pointer; border-bottom: 2px solid transparent; margin-bottom: -2px; white-space: nowrap; transition: all 0.15s; border-radius: 6px 6px 0 0; }
.tab-btn:hover  { color: #7700ff; background: #faf5ff; }
.tab-btn.active { color: #7700ff; border-bottom-color: #7700ff; background: #faf5ff; }

.tab-content { min-height: 280px; }
.tab-toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.tab-desc    { color: #64748b; font-size: 14px; margin: 0; }
.count-badge { background: #ede9fe; color: #5b21b6; padding: 4px 12px; border-radius: 20px; font-size: 13px; font-weight: 600; }

.data-table { width: 100%; border-collapse: collapse; }
.data-table th, .data-table td { text-align: left; padding: 11px 14px; border-bottom: 1px solid #f1f5f9; font-size: 13px; }
.data-table th { background: #f8fafc; font-weight: 600; color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
.data-table tbody tr:hover { background: #fafbff; }
.td-num  { color: #94a3b8; font-size: 12px; width: 40px; }
.td-mono { font-family: monospace; }

.details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 28px; }
.detail-full  { grid-column: 1 / -1; }
.detail-group h3 { font-size: 13px; font-weight: 700; color: #7700ff; margin: 0 0 12px; padding-bottom: 8px; border-bottom: 2px solid #f1f5f9; text-transform: uppercase; letter-spacing: 0.5px; }
.detail-row { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #f8fafc; gap: 16px; }
.detail-label { font-weight: 600; color: #64748b; font-size: 13px; min-width: 120px; flex-shrink: 0; }
.detail-value { color: #1e293b; font-size: 13px; text-align: right; }
.link-wa { color: #25d366; font-weight: 600; font-size: 13px; text-decoration: none; }

.num-circle { display: inline-flex; align-items: center; justify-content: center; width: 26px; height: 26px; border-radius: 50%; background: #ede9fe; color: #5b21b6; font-weight: 700; font-size: 12px; }
.form-inline { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 18px; margin-bottom: 16px; }
.form-grid-3 { display: grid; grid-template-columns: 1fr 2fr 1fr; gap: 12px; }
.form-field  { display: flex; flex-direction: column; gap: 4px; }
.mt-2 { margin-top: 10px; }
.field-label { font-size: 12px; font-weight: 600; color: #374151; }
.input-base { padding: 8px 12px; background: white; border: 1px solid #d1d5db; border-radius: 7px; font-size: 13px; font-family: inherit; outline: none; }
.input-base:focus { border-color: #7700ff; box-shadow: 0 0 0 2px rgba(119,0,255,0.08); }
.form-error { margin-top: 10px; padding: 8px 12px; background: #fef2f2; border: 1px solid #fecaca; border-radius: 7px; color: #b91c1c; font-size: 13px; }
.form-footer-sm { display: flex; justify-content: flex-end; gap: 8px; margin-top: 12px; }

.btn-primary-sm   { padding: 7px 14px; background: #7700ff; color: white; border: none; border-radius: 7px; font-size: 13px; font-weight: 600; cursor: pointer; }
.btn-primary-sm:hover { background: #0077b6; }
.btn-primary-sm:disabled { opacity: 0.6; cursor: not-allowed; }
.btn-secondary-sm { padding: 7px 14px; background: white; color: #1e293b; border: 1px solid #e2e8f0; border-radius: 7px; font-size: 13px; font-weight: 600; cursor: pointer; }
.btn { padding: 5px 10px; border: none; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer; }
.btn-danger { background: #fee2e2; color: #991b1b; }
.btn-danger:hover { background: #fecaca; }

.stats-mini { display: flex; gap: 16px; }
.stat-mini-item { font-size: 13px; color: #64748b; }
.stat-mini-item strong { color: #1e293b; }

.reporte-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-bottom: 24px; }
.reporte-card { background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; display: flex; flex-direction: column; align-items: center; gap: 6px; border-top: 4px solid #7700ff; text-align: center; }
.reporte-card.reporte-green  { border-top-color: #10b981; }
.reporte-card.reporte-red    { border-top-color: #ef4444; }
.reporte-card.reporte-blue   { border-top-color: #0077b6; }
.reporte-card.reporte-purple { border-top-color: #8b5cf6; }
.reporte-card.reporte-yellow { border-top-color: #f59e0b; }
.rep-icon  { font-size: 1.6rem; }
.rep-num   { font-size: 1.5rem; font-weight: 700; color: #1e293b; }
.rep-label { font-size: 12px; color: #64748b; font-weight: 500; }

.reporte-info { background: #f8fafc; border-radius: 10px; padding: 20px; margin-bottom: 16px; }
.reporte-info h3 { font-size: 14px; font-weight: 700; color: #1e293b; margin: 0 0 14px; }
.progress-wrap  { display: flex; align-items: center; gap: 10px; flex: 1; justify-content: flex-end; }
.progress-bar   { flex: 1; max-width: 200px; height: 8px; background: #e2e8f0; border-radius: 10px; overflow: hidden; }
.progress-fill  { height: 100%; background: linear-gradient(90deg, #7700ff, #0077b6); border-radius: 10px; transition: width 0.4s; }
.progress-label { font-size: 13px; font-weight: 700; color: #1e293b; min-width: 36px; }

.reporte-actions { display: flex; gap: 10px; }
.btn-export { padding: 10px 18px; background: #f0fdf4; color: #166534; border: 1px solid #bbf7d0; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; }
.btn-export:hover { background: #dcfce7; }

.loading-msg { display: flex; align-items: center; gap: 10px; padding: 24px; color: #64748b; font-size: 14px; }
.spinner { width: 18px; height: 18px; border: 2px solid #e2e8f0; border-top-color: #7700ff; border-radius: 50%; animation: spin 0.7s linear infinite; flex-shrink: 0; }
@keyframes spin { to { transform: rotate(360deg); } }
.empty-tab { padding: 32px; text-align: center; color: #94a3b8; font-size: 14px; }
</style>