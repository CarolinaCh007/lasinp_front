<template>
  <SuperadminLayout>
    <div class="top-bar">
      <div>
        <h1>Gestión de Preinscritos</h1>
        <p>Verifica pagos y confirma inscripciones oficiales de estudiantes</p>
      </div>
    </div>

    <!-- Filtros -->
    <div class="filtros">
      <div class="search-wrap">
        <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        <input v-model="busqueda" type="text" placeholder="Buscar estudiante..."/>
      </div>
      <div class="filtro-tabs">
        <button
          v-for="f in filtros" :key="f.value"
          class="filtro-tab"
          :class="{ active: filtroActivo === f.value }"
          @click="filtroActivo = f.value"
        >
          {{ f.label }}
          <span class="filtro-count">{{ contarPorEstado(f.value) }}</span>
        </button>
      </div>
      <div class="curso-select-wrap">
        <select v-model="cursoFiltro" class="select-input">
          <option value="todos">Todos los cursos</option>
          <option v-for="c in cursos" :key="c.id_curso || c.id" :value="c.id_curso || c.id">{{ c.nombre }}</option>
        </select>
      </div>
    </div>

    <!-- Tabla -->
    <div class="panel">
      <div v-if="loading" class="sin-resultados">
        <span>⏳</span>
        <p>Cargando preinscritos desde la base de datos...</p>
      </div>
      <table v-else class="tabla">
        <thead>
          <tr>
            <th>Estudiante</th>
            <th>Curso</th>
            <th>Fecha preinscripción</th>
            <th>Monto</th>
            <th>Estado</th>
            <th class="th-center">Acción</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in preinscritosFiltrados" :key="p.id">
            <td>
              <div class="est-cell">
                <div class="est-avatar">{{ iniciales(p.estudiante) }}</div>
                <div>
                  <strong>{{ p.estudiante }}</strong>
                  <span>{{ p.email }}</span>
                </div>
              </div>
            </td>
            <td>
              <div class="curso-cell">
                {{ p.curso }}
              </div>
            </td>
            <td class="text-gris">{{ p.fecha }}</td>
            <td class="text-monto">Bs. {{ p.monto }}</td>
            <td>
              <span class="badge-estado" :class="p.estado">
                {{ labelEstado(p.estado) }}
              </span>
            </td>
            <td class="th-center">
              <div class="acciones-btns" v-if="p.estado === 'pendiente'">
                <button class="btn-comprobante" @click="verComprobante(p)" title="Ver foto del recibo bancario">
                  📷 Ver Recibo
                </button>

                <button class="btn-confirmar" @click="confirmar(p)" title="Aprobar e Inscribir">
                  ✓ Aprobar
                </button>
                <button class="btn-rechazar" @click="rechazar(p)" title="Rechazar">
                  ✕
                </button>
              </div>
              <span class="ya-procesado" v-else>—</span>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="sin-resultados" v-if="!loading && preinscritosFiltrados.length === 0">
        <span>🔍</span>
        <p>No se encontraron preinscripciones con ese criterio.</p>
      </div>
    </div>

    <!-- Modal confirmación -->
    <div class="modal-overlay" v-if="modalVisible" @click="modalVisible = false">
      <div class="modal" @click.stop>
        <div class="modal-icon">{{ modalTipo === 'confirmar' ? '✅' : '⚠️' }}</div>
        <h2>{{ modalTipo === 'confirmar' ? 'Confirmar pago' : 'Rechazar preinscripción' }}</h2>
        <p v-if="modalTipo === 'confirmar'">
          ¿Confirmas que <strong>{{ seleccionado?.estudiante }}</strong> realizó el pago de
          <strong>Bs. {{ seleccionado?.monto }}</strong> para el curso
          <strong>{{ seleccionado?.curso }}</strong>?
        </p>
        <p v-else>
          ¿Estás seguro de rechazar la preinscripción de
          <strong>{{ seleccionado?.estudiante }}</strong> en <strong>{{ seleccionado?.curso }}</strong>?
        </p>
        <div class="modal-aviso" v-if="modalTipo === 'confirmar'">
          📌 Esta acción cambiará el estado del estudiante a <strong>Inscrito Oficialmente</strong>.
        </div>

        <div class="modal-btns">
          <button class="btn-cancelar" @click="modalVisible = false">Cancelar</button>
          <button
            class="btn-accion"
            :class="modalTipo"
            @click="ejecutarAccion"
          >
            {{ modalTipo === 'confirmar' ? '✓ Sí, confirmar pago' : '✕ Sí, rechazar' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Modal para inspeccionar la foto del comprobante -->
    <div class="modal-overlay" v-if="modalComprobanteVisible" @click="modalComprobanteVisible = false">
      <div class="modal" @click.stop style="width: 520px;">
        <h2>📷 Comprobante de Pago</h2>
        <p>Estudiante: <strong>{{ seleccionado?.estudiante }}</strong></p>
        <p>Curso: <strong>{{ seleccionado?.curso }}</strong></p>
        
        <div style="margin: 15px 0; text-align: center; background: #000; border-radius: 12px; padding: 12px;">
          <img 
            :src="seleccionado?.url_comprobante || 'http://127.0.0.1:8000/static/uploads/comprobantes/default.png'" 
            alt="Comprobante de pago" 
            style="max-width: 100%; max-height: 420px; object-fit: contain; border-radius: 8px;"
          />
        </div>

        <div class="modal-btns">
          <button class="btn-cancelar" @click="modalComprobanteVisible = false">Cerrar</button>
          <button class="btn-confirmar" @click="modalComprobanteVisible = false; confirmar(seleccionado)">
            ✓ Aprobar Pago
          </button>
        </div>
      </div>
    </div>

    <!-- Toast de éxito -->
    <div class="toast" :class="{ visible: toastVisible, error: toastError }">
      {{ toastMsg }}
    </div>
  </SuperadminLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import SuperadminLayout from '../../components/SuperadminLayout.vue'
import inscripcionService from '../../services/inscripcionService'
import cursoService from '../../services/cursoService'

const route = useRoute()

const busqueda = ref('')
const filtroActivo = ref('todos')
const cursoFiltro = ref('todos')
const modalVisible = ref(false)
const modalComprobanteVisible = ref(false)
const modalTipo = ref('confirmar')
const seleccionado = ref(null)
const toastVisible = ref(false)
const toastError = ref(false)
const toastMsg = ref('')

const preinscritos = ref([])
const cursos = ref([])
const loading = ref(true)

const filtros = [
  { value: 'todos',     label: 'Todos'     },
  { value: 'pendiente', label: 'Pendientes' },
  { value: 'activo',    label: 'Confirmados'},
  { value: 'rechazado', label: 'Rechazados' },
]

function verComprobante(p) {
  seleccionado.value = p
  modalComprobanteVisible.value = true
}

async function cargarPreinscritos() {
  loading.value = true
  try {
    const res = await inscripcionService.listarPreinscritos()
    preinscritos.value = res.data || []
  } catch (error) {
    console.error('[Preinscritos] Error al cargar lista:', error)
  } finally {
    loading.value = false
  }
}

async function cargarCursos() {
  try {
    const res = await cursoService.listar({ limit: 100 })
    cursos.value = res.data || []
  } catch (e) {
    console.error('Error al cargar cursos para filtro:', e)
  }
}

onMounted(async () => {
  await cargarCursos()
  if (route.query.cursoId) {
    cursoFiltro.value = Number(route.query.cursoId)
  }
  await cargarPreinscritos()
})

const preinscritosFiltrados = computed(() =>
  preinscritos.value.filter(p => {
    const matchBusqueda  = (p.estudiante || '').toLowerCase().includes(busqueda.value.toLowerCase())
    const matchEstado    = filtroActivo.value === 'todos' || p.estado === filtroActivo.value
    const matchCurso     = cursoFiltro.value === 'todos'  || Number(p.cursoId) === Number(cursoFiltro.value)
    return matchBusqueda && matchEstado && matchCurso
  })
)

function contarPorEstado(estado) {
  if (estado === 'todos') return preinscritos.value.length
  return preinscritos.value.filter(p => p.estado === estado).length
}

function iniciales(nombre) {
  if (!nombre) return 'ES'
  return nombre.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
}

function labelEstado(estado) {
  return { pendiente: '⏳ Pendiente', activo: '✅ Inscrito', rechazado: '✕ Rechazado' }[estado] || estado
}

function confirmar(p) {
  seleccionado.value = p
  modalTipo.value    = 'confirmar'
  modalVisible.value = true
}

function rechazar(p) {
  seleccionado.value = p
  modalTipo.value    = 'rechazar'
  modalVisible.value = true
}

async function ejecutarAccion() {
  const p = seleccionado.value
  if (!p) return

  try {
    const nuevoEstado = modalTipo.value === 'confirmar' ? 'activo' : 'rechazado'
    await inscripcionService.actualizarEstado(p.id, nuevoEstado)

    if (modalTipo.value === 'confirmar') {
      mostrarToast(`✅ ${p.estudiante} inscrito oficialmente en ${p.curso}`)
    } else {
      mostrarToast(`Preinscripción de ${p.estudiante} rechazada.`, true)
    }
    
    await cargarPreinscritos()
  } catch (error) {
    console.error('[Preinscritos] Error al cambiar estado:', error)
    mostrarToast('❌ Ocurrió un error al actualizar la inscripción.', true)
  } finally {
    modalVisible.value = false
  }
}

function mostrarToast(msg, error = false) {
  toastMsg.value     = msg
  toastError.value   = error
  toastVisible.value = true
  setTimeout(() => toastVisible.value = false, 3500)
}
</script>

<style scoped>
.top-bar { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; }
.top-bar h1 { font-size: 24px; font-weight: 700; color: #1e293b; margin-bottom: 4px; }
.top-bar p { font-size: 14px; color: #64748b; }

.filtros { display: flex; gap: 12px; align-items: center; margin-bottom: 20px; flex-wrap: wrap; }
.search-wrap { position: relative; }
.search-wrap svg { position: absolute; left: 13px; top: 50%; transform: translateY(-50%); color: #64748b; pointer-events: none; }
.search-wrap input { padding: 10px 16px 10px 38px; background: #fff; border: 1px solid #e2e8f0; border-radius: 10px; color: #1e293b; font-size: 13px; outline: none; width: 220px; }
.search-wrap input:focus { border-color: #7700ff; }
.filtro-tabs { display: flex; gap: 6px; }
.filtro-tab { display: flex; align-items: center; gap: 6px; padding: 8px 14px; background: #fff; border: 1px solid #e2e8f0; border-radius: 100px; color: #64748b; font-size: 12px; cursor: pointer; transition: all 0.2s; }
.filtro-tab:hover { color: #1e293b; border-color: #7700ff; }
.filtro-tab.active { background: #7700ff; border-color: #7700ff; color: #fff; }
.filtro-count { background: rgba(255,255,255,0.25); border-radius: 100px; padding: 1px 6px; font-size: 10px; }
.select-input { padding: 9px 14px; background: #fff; border: 1px solid #e2e8f0; border-radius: 10px; color: #1e293b; font-size: 13px; outline: none; }

.panel { background: #fff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
.tabla { width: 100%; border-collapse: collapse; }
.tabla thead tr { border-bottom: 1px solid #e2e8f0; }
.tabla th { padding: 13px 16px; text-align: left; font-size: 11px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.8px; background: #f8fafc; }
.th-center { text-align: center !important; }
.tabla tbody tr { border-bottom: 1px solid #f1f5f9; transition: background 0.15s; }
.tabla tbody tr:hover { background: #fafbff; }
.tabla td { padding: 13px 16px; font-size: 13px; vertical-align: middle; }
.text-gris { color: #64748b; font-size: 12px; }
.text-monto { font-weight: 700; color: #16a34a; }

.est-cell { display: flex; align-items: center; gap: 10px; }
.est-avatar { width: 34px; height: 34px; border-radius: 50%; background: linear-gradient(135deg, #7700ff, #0077b6); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; flex-shrink: 0; }
.est-cell strong { display: block; font-size: 13px; font-weight: 600; margin-bottom: 2px; color: #1e293b; }
.est-cell span { font-size: 11px; color: #64748b; }

.badge-estado { font-size: 11px; font-weight: 600; padding: 4px 10px; border-radius: 100px; }
.badge-estado.pendiente  { background: #fef3c7; color: #92400e; }
.badge-estado.activo     { background: #dcfce7; color: #166534; }
.badge-estado.rechazado  { background: #fee2e2; color: #991b1b; }

.acciones-btns { display: flex; gap: 6px; justify-content: center; }
.btn-comprobante { padding: 6px 12px; background: #e0f2fe; border: 1px solid #bae6fd; border-radius: 8px; color: #0369a1; font-size: 12px; font-weight: 600; cursor: pointer; }
.btn-confirmar { padding: 6px 12px; background: #16a34a; border: none; border-radius: 8px; color: white; font-size: 12px; font-weight: 600; cursor: pointer; }
.btn-rechazar { padding: 6px 10px; background: #fee2e2; border: 1px solid #fecaca; border-radius: 8px; color: #dc2626; font-size: 12px; cursor: pointer; }
.ya-procesado { color: #94a3b8; font-size: 13px; }

.sin-resultados { text-align: center; padding: 48px; color: #64748b; }
.sin-resultados span { font-size: 36px; display: block; margin-bottom: 12px; }

.modal-overlay { position: fixed; inset: 0; background: rgba(15,23,42,0.6); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 200; }
.modal { background: #fff; border-radius: 16px; padding: 28px; width: 440px; text-align: center; box-shadow: 0 20px 40px rgba(0,0,0,0.15); }
.modal-icon { font-size: 40px; margin-bottom: 12px; }
.modal h2 { font-size: 18px; font-weight: 700; margin-bottom: 10px; color: #1e293b; }
.modal p { font-size: 14px; color: #64748b; line-height: 1.6; margin-bottom: 16px; }
.modal-aviso { background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 10px; padding: 10px 14px; font-size: 12px; color: #0369a1; text-align: left; margin-bottom: 20px; }
.modal-btns { display: flex; gap: 10px; }
.btn-cancelar { flex: 1; padding: 10px; background: #f1f5f9; border: none; border-radius: 8px; color: #475569; font-size: 13px; cursor: pointer; font-weight: 600; }
.btn-accion { flex: 2; padding: 10px; border: none; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; }
.btn-accion.confirmar { background: #16a34a; color: white; }
.btn-accion.rechazar  { background: #dc2626; color: white; }

.toast { position: fixed; bottom: 28px; right: 28px; background: #1e293b; color: #fff; padding: 14px 22px; border-radius: 12px; font-size: 13px; font-weight: 500; transform: translateY(80px); opacity: 0; transition: all 0.3s; z-index: 300; }
.toast.visible { transform: translateY(0); opacity: 1; }
.toast.error { background: #dc2626; }
</style>
