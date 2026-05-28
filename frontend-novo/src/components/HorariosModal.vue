<template>
  <div class="modal-overlay" @click.self="$emit('cerrar')">
    <div class="modal modal--large">
      <button class="btn-close" @click="$emit('cerrar')">✕</button>

      <div class="modal-header-info">
        <div class="curso-badge">{{ curso.sigla }}</div>
        <div>
          <h2>Horarios del Curso</h2>
          <p class="text-muted">{{ curso.nombre }}</p>
        </div>
      </div>

      <!-- Lista horarios -->
      <div class="horarios-list">
        <div v-if="cargando" class="estado-msg"><div class="spinner"></div> Cargando horarios...</div>
        <div v-else-if="horarios.length === 0" class="estado-msg text-muted">Este curso aún no tiene horarios asignados.</div>
        <table v-else class="data-table">
          <thead>
            <tr><th>Grupo</th><th>Docente</th><th>Aula</th><th>Día</th><th>Horario</th><th>Modalidad</th><th>Estado</th><th></th></tr>
          </thead>
          <tbody>
            <tr v-for="h in horarios" :key="h.id_horario">
              <td><strong>{{ h.grupo || '—' }}</strong></td>
              <td>{{ nombreDocente(h.id_docente) }}</td>
              <td>{{ nombreAula(h.id_aula) }}</td>
              <td>{{ h.dia_semana || '—' }}</td>
              <td class="td-mono">{{ h.hora_inicio }} – {{ h.hora_fin }}</td>
              <td><span :class="['badge-modalidad', `mod-${(h.modalidad||'').toLowerCase()}`]">{{ h.modalidad || '—' }}</span></td>
              <td><span :class="['badge', `badge-${h.estado}`]">{{ h.estado }}</span></td>
              <td><button class="btn btn-danger" @click="confirmarEliminar(h)">Eliminar</button></td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Formulario agregar -->
      <div class="form-agregar">
        <h3 class="form-titulo">+ Agregar nuevo horario</h3>
        <div class="form-grid">
          <div class="form-field">
            <label class="field-label">Docente *</label>
            <select v-model="form.id_docente" class="input-base" required>
              <option value="">Seleccionar docente...</option>
              <option v-for="d in docentes" :key="d.id_docente" :value="d.id_docente">
                {{ d.nombre }} {{ d.ape_paterno }}
              </option>
            </select>
          </div>
          <div class="form-field">
            <label class="field-label">Aula *</label>
            <select v-model="form.id_aula" class="input-base" required>
              <option value="">Seleccionar aula...</option>
              <option v-for="a in aulas" :key="a.id_aula" :value="a.id_aula">
                {{ a.nombre }} — {{ a.ubicacion }} (cap. {{ a.capacidad }})
              </option>
            </select>
          </div>
          <div class="form-field">
            <label class="field-label">Día *</label>
            <select v-model="form.dia_semana" class="input-base" required>
              <option value="">Seleccionar día...</option>
              <option value="Lunes">Lunes</option>
              <option value="Martes">Martes</option>
              <option value="Miércoles">Miércoles</option>
              <option value="Jueves">Jueves</option>
              <option value="Viernes">Viernes</option>
              <option value="Sábado">Sábado</option>
              <option value="Lunes y Miércoles">Lunes y Miércoles</option>
              <option value="Martes y Jueves">Martes y Jueves</option>
            </select>
          </div>
          <div class="form-field">
            <label class="field-label">Grupo</label>
            <input v-model="form.grupo" type="text" class="input-base" placeholder="Ej: Mañana, Tarde" />
          </div>
          <div class="form-field">
            <label class="field-label">Hora inicio *</label>
            <input v-model="form.hora_inicio" type="time" class="input-base" required />
          </div>
          <div class="form-field">
            <label class="field-label">Hora fin *</label>
            <input v-model="form.hora_fin" type="time" class="input-base" required />
          </div>
          <div class="form-field">
            <label class="field-label">Modalidad *</label>
            <select v-model="form.modalidad" class="input-base" required>
              <option value="">Seleccionar...</option>
              <option value="Presencial">Presencial</option>
              <option value="Online">Online</option>
              <option value="Híbrido">Híbrido</option>
            </select>
          </div>
          <div class="form-field">
            <label class="field-label">Cantidad de días</label>
            <input v-model.number="form.cantidad_dias" type="number" class="input-base" min="1" placeholder="Ej: 20" />
          </div>
        </div>
        <div v-if="errorForm" class="form-error">⚠️ {{ errorForm }}</div>
        <div class="form-footer">
          <button class="btn-primary" @click="agregarHorario" :disabled="guardando">
            {{ guardando ? 'Guardando...' : 'Agregar horario' }}
          </button>
        </div>
      </div>

      <!-- Confirmar eliminar -->
      <div v-if="modalEliminar" class="confirm-overlay" @click.self="modalEliminar = false">
        <div class="confirm-box">
          <p>¿Eliminar el horario <strong>{{ horarioAEliminar?.grupo || 'seleccionado' }}</strong>?</p>
          <div class="confirm-actions">
            <button class="btn-secondary" @click="modalEliminar = false">Cancelar</button>
            <button class="btn-danger-full" @click="eliminarHorario" :disabled="guardando">
              {{ guardando ? 'Eliminando...' : 'Sí, eliminar' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import horarioService from '../services/horarioService'

const props = defineProps({ curso: { type: Object, required: true } })
const emit  = defineEmits(['cerrar'])

const horarios         = ref([])
const docentes         = ref([])
const aulas            = ref([])
const cargando         = ref(false)
const guardando        = ref(false)
const errorForm        = ref('')
const modalEliminar    = ref(false)
const horarioAEliminar = ref(null)

const formVacio = () => ({
  id_curso: props.curso.id_curso, id_docente: '', id_aula: '',
  dia_semana: '', hora_inicio: '', hora_fin: '', grupo: '',
  modalidad: '', cantidad_dias: null, estado: 'activo'
})
const form = ref(formVacio())

onMounted(async () => {
  cargando.value = true
  try {
    const [hRes, dRes, aRes] = await Promise.all([
      horarioService.listar({ id_curso: props.curso.id_curso, limit: 100 }),
      horarioService.listarDocentes(),
      horarioService.listarAulas()
    ])
    horarios.value = hRes.data
    docentes.value = dRes.data
    aulas.value    = aRes.data
  } catch {
    errorForm.value = 'Error al cargar datos.'
  } finally {
    cargando.value = false
  }
})

function nombreDocente(id) {
  const d = docentes.value.find(d => d.id_docente === id)
  return d ? `${d.nombre} ${d.ape_paterno}` : '—'
}
function nombreAula(id) {
  const a = aulas.value.find(a => a.id_aula === id)
  return a ? a.nombre : '—'
}

async function agregarHorario() {
  errorForm.value = ''
  if (!form.value.id_docente || !form.value.id_aula || !form.value.dia_semana ||
      !form.value.hora_inicio || !form.value.hora_fin || !form.value.modalidad) {
    errorForm.value = 'Completa todos los campos obligatorios (*).'
    return
  }
  guardando.value = true
  try {
    await horarioService.crear(form.value)
    const res = await horarioService.listar({ id_curso: props.curso.id_curso, limit: 100 })
    horarios.value = res.data
    form.value = formVacio()
  } catch (e) {
    errorForm.value = e.response?.data?.detail || 'Error al crear el horario.'
  } finally {
    guardando.value = false
  }
}

function confirmarEliminar(h) { horarioAEliminar.value = h; modalEliminar.value = true }

async function eliminarHorario() {
  guardando.value = true
  try {
    await horarioService.eliminar(horarioAEliminar.value.id_horario)
    horarios.value = horarios.value.filter(h => h.id_horario !== horarioAEliminar.value.id_horario)
    modalEliminar.value = false
  } catch {
    errorForm.value = 'Error al eliminar el horario.'
  } finally {
    guardando.value = false
  }
}
</script>

<style scoped>
.modal-overlay { position: fixed; inset: 0; background: rgba(15,23,42,0.55); display: flex; align-items: center; justify-content: center; z-index: 200; backdrop-filter: blur(2px); overflow-y: auto; padding: 20px; }
.modal { background: white; border-radius: 14px; padding: 32px; width: 900px; max-width: 95%; box-shadow: 0 20px 40px rgba(0,0,0,0.12); position: relative; max-height: 90vh; overflow-y: auto; }
.modal--large { width: 900px; }
.btn-close { position: absolute; top: 16px; right: 16px; background: transparent; border: none; font-size: 22px; cursor: pointer; color: #94a3b8; border-radius: 6px; padding: 4px 8px; }
.btn-close:hover { background: #f1f5f9; color: #1e293b; }

.modal-header-info { display: flex; align-items: center; gap: 14px; margin-bottom: 24px; }
.curso-badge { background: linear-gradient(135deg, #7700ff, #0077b6); color: white; font-weight: 700; font-size: 0.9rem; padding: 8px 14px; border-radius: 10px; font-family: monospace; flex-shrink: 0; }
.modal h2 { margin: 0 0 2px; font-size: 20px; font-weight: 700; color: #1e293b; }
.text-muted { color: #64748b; font-size: 14px; margin: 0; }

.horarios-list { margin-bottom: 28px; }
.estado-msg { display: flex; align-items: center; gap: 10px; padding: 20px; color: #64748b; font-size: 14px; background: #f8fafc; border-radius: 10px; }
.spinner { width: 18px; height: 18px; border: 2px solid #e2e8f0; border-top-color: #7700ff; border-radius: 50%; animation: spin 0.7s linear infinite; flex-shrink: 0; }
@keyframes spin { to { transform: rotate(360deg); } }

.data-table { width: 100%; border-collapse: collapse; }
.data-table th, .data-table td { text-align: left; padding: 11px 14px; border-bottom: 1px solid #f1f5f9; font-size: 13px; }
.data-table th { background: #f8fafc; font-weight: 600; color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
.data-table tbody tr:hover { background: #fafbff; }
.td-mono { font-family: monospace; font-size: 13px; }

.badge { padding: 3px 9px; border-radius: 20px; font-size: 11px; font-weight: 700; text-transform: capitalize; }
.badge-activo    { background: #d1fae5; color: #065f46; }
.badge-inactivo  { background: #fee2e2; color: #991b1b; }
.badge-pendiente { background: #fef3c7; color: #92400e; }
.badge-modalidad { padding: 3px 9px; border-radius: 20px; font-size: 11px; font-weight: 600; }
.mod-presencial  { background: #dbeafe; color: #1e40af; }
.mod-online      { background: #f0fdf4; color: #166534; }
.mod-híbrido     { background: #faf5ff; color: #6b21a8; }

.form-agregar { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; }
.form-titulo  { display: flex; align-items: center; gap: 8px; font-size: 15px; font-weight: 700; color: #1e293b; margin: 0 0 18px; }
.form-grid    { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.form-field   { display: flex; flex-direction: column; gap: 5px; }
.field-label  { font-size: 13px; font-weight: 600; color: #374151; }
.input-base   { padding: 9px 13px; background: white; border: 1px solid #d1d5db; border-radius: 8px; font-size: 14px; font-family: inherit; outline: none; }
.input-base:focus { border-color: #7700ff; box-shadow: 0 0 0 3px rgba(119,0,255,0.08); }
.form-error   { margin-top: 12px; padding: 10px 14px; background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; color: #b91c1c; font-size: 13px; }
.form-footer  { display: flex; justify-content: flex-end; margin-top: 16px; }

.btn-primary { padding: 10px 20px; background: #7700ff; color: white; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; }
.btn-primary:hover    { background: #0077b6; }
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
.btn-secondary { padding: 8px 16px; background: white; color: #1e293b; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; }
.btn { padding: 5px 11px; border: none; border-radius: 7px; font-size: 12px; font-weight: 600; cursor: pointer; }
.btn-danger { background: #fee2e2; color: #991b1b; }
.btn-danger-full { padding: 8px 16px; background: #ef4444; color: white; border: none; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; }
.btn-danger-full:disabled { opacity: 0.6; cursor: not-allowed; }

.confirm-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 300; }
.confirm-box { background: white; border-radius: 12px; padding: 28px; width: 360px; box-shadow: 0 10px 30px rgba(0,0,0,0.15); }
.confirm-box p { font-size: 15px; color: #1e293b; margin: 0 0 20px; }
.confirm-actions { display: flex; gap: 10px; justify-content: flex-end; }
</style>