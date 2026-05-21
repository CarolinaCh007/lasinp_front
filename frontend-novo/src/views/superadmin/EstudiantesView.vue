<template>
  <div class="dashboard">
    <aside class="sidebar">
      <div class="sidebar-header">
        <h2>LASIN 2.0</h2>
      </div>
      <nav class="sidebar-nav">
        <a
          v-for="item in menuItems"
          :key="item.label"
          href="#"
          class="nav-item"
          :class="{ active: isActive(item.route) }"
          @click.prevent="navigate(item.route)"
        >
          <span class="nav-icon" v-html="item.icon"></span>
          <span>{{ item.label }}</span>
        </a>
      </nav>
      <div class="sidebar-footer">
        <div class="footer-user-info">
          <div class="user-avatar">SA</div>
          <div class="footer-user-text">
            <strong>Super Admin</strong>
            <span>Control total</span>
          </div>
        </div>
        <button class="btn-logout" @click="$router.push('/login')">
          <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1-2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Salir
        </button>
      </div>
    </aside>

    <div class="main">
      <header class="topbar">
        <h1>Gestión de Estudiantes</h1>
        <div class="user-info">
          <span>Super Admin</span>
        </div>
      </header>

      <section class="content">
        <div class="toolbar">
          <div class="filters-group">
            <div class="search-box">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                v-model="searchQuery"
                type="text"
                class="input-base"
                placeholder="Buscar por nombre, CI o correo..."
              />
            </div>
            
            <select v-model="filterEstado" class="select-base">
              <option value="todos">Todos los estados</option>
              <option value="activo">Solo Activos</option>
              <option value="pendiente">Solo Pendientes</option>
              <option value="bloqueado">Solo Bloqueados</option>
            </select>
          </div>

          <button class="btn-primary" @click="openCreateModal">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Nuevo estudiante
          </button>
        </div>

        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Nombre completo</th>
                <th>C.I.</th>
                <th>Correo electrónico</th>
                <th>Institución</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="loading">
                <td colspan="6" class="empty-message">Cargando base de datos del LASIN...</td>
              </tr>
              <tr v-if="!loading && errorMessage">
                <td colspan="6" class="empty-message text-danger">⚠️ {{ errorMessage }}</td>
              </tr>
              <tr v-for="estudiante in filteredEstudiantes" :key="estudiante.id_estudiante">
                <td>
                  <strong>{{ `${estudiante.usuario?.nombre || ''} ${estudiante.usuario?.ape_paterno || ''} ${estudiante.usuario?.ape_materno || ''}`.trim() }}</strong>
                </td>
                <td>{{ estudiante.usuario?.ci || '-' }}</td>
                <td>{{ estudiante.usuario?.correo_electronico || '-' }}</td>
                <td><span class="badge-outline">{{ estudiante.institucion || 'UMSA' }}</span></td>
                <td>
                  <span :class="['badge', `badge-${estudiante.usuario?.estado || 'inactivo'}`]">
                    {{ estudiante.usuario?.estado || 'inactivo' }}
                  </span>
                </td>
                <td class="actions-cell">
                  <button 
                    v-if="estudiante.usuario?.estado !== 'activo'"
                    class="btn-icon text-success" 
                    title="Aprobar / Activar"
                    @click="toggleEstado(estudiante)"
                  >✅</button>
                  <button 
                    v-if="estudiante.usuario?.estado === 'activo'"
                    class="btn-icon text-warning" 
                    title="Bloquear temporalmente"
                    @click="toggleEstado(estudiante)"
                  >🚫</button>

                  <button class="btn-icon text-primary" title="Editar datos" @click="openEditModal(estudiante)">
                    ✏️
                  </button>

                  <button class="btn-icon text-danger" title="Eliminar del sistema" @click="confirmDelete(estudiante)">
                    🗑️
                  </button>
                </td>
              </tr>
              <tr v-if="!loading && filteredEstudiantes.length === 0 && !errorMessage">
                <td colspan="6" class="empty-message">No se encontraron estudiantes con esos filtros.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>

    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <h2>{{ isEditing ? 'Editar Estudiante' : 'Registrar Estudiante' }}</h2>
        <p class="text-muted mb-4">
          {{ isEditing ? 'Modifica los datos del estudiante.' : 'Ingresa los datos para registrar un nuevo estudiante en el sistema.' }}
        </p>
        
        <form @submit.prevent="saveEstudiante">
          <div class="form-grid">
            <div class="form-field">
              <label class="field-label">Nombre(s) *</label>
              <input v-model="formData.nombre" type="text" class="input-base" required />
            </div>
            <div class="form-field">
              <label class="field-label">Apellido Paterno</label>
              <input v-model="formData.ape_paterno" type="text" class="input-base" />
            </div>
            <div class="form-field">
              <label class="field-label">Apellido Materno</label>
              <input v-model="formData.ape_materno" type="text" class="input-base" />
            </div>
            <div class="form-field">
              <label class="field-label">Carnet de Identidad</label>
              <input v-model="formData.ci" type="text" class="input-base" />
            </div>
          </div>

          <div class="form-field mt-3">
            <label class="field-label">Correo electrónico *</label>
            <input v-model="formData.correo" type="email" class="input-base" placeholder="ejemplo@est.umsa.bo" required :disabled="isEditing" />
            <small v-if="isEditing" class="text-muted">El correo no se puede modificar por seguridad.</small>
          </div>

          <div class="form-grid mt-3">
            <div class="form-field" v-if="!isEditing">
              <label class="field-label">Contraseña Temporal *</label>
              <input v-model="formData.password" type="password" class="input-base" required minlength="6" />
            </div>
            <div class="form-field">
              <label class="field-label">Institución / Facultad *</label>
              <input v-model="formData.institucion" type="text" class="input-base" required />
            </div>
          </div>

          <div class="modal-actions">
            <button type="button" class="btn-secondary" @click="closeModal" :disabled="isSaving">Cancelar</button>
            <button type="submit" class="btn-primary" :disabled="isSaving">
              <span v-if="isSaving">Guardando...</span>
              <span v-else>{{ isEditing ? 'Actualizar Datos' : 'Registrar Estudiante' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="showDeleteConfirm" class="modal-overlay" @click.self="showDeleteConfirm = false">
      <div class="modal modal--small">
        <h2>Confirmar eliminación</h2>
        <p>¿Estás seguro de eliminar permanentemente a <strong>{{ estudianteToDelete?.usuario?.nombre }}</strong>?</p>
        <div class="modal-actions">
          <button class="btn-secondary" @click="showDeleteConfirm = false">Cancelar</button>
          <button class="btn-danger" @click="deleteEstudiante">Sí, Eliminar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '../../services/api.js'

const router = useRouter()
const route = useRoute()

// ─── ESTADO GLOBAL ───
const estudiantes = ref([])
const loading = ref(true)
const isSaving = ref(false)
const errorMessage = ref('')

// ─── FILTROS ───
const searchQuery = ref('')
const filterEstado = ref('todos')

// ─── CONTROL DE MODALES ───
const showModal = ref(false)
const showDeleteConfirm = ref(false)
const isEditing = ref(false)

const currentEditIdEstudiante = ref(null)
const currentEditIdUsuario = ref(null)
const estudianteToDelete = ref(null)

const formData = ref({
  nombre: '',
  ape_paterno: '',
  ape_materno: '',
  ci: '',
  correo: '',
  password: '',
  institucion: 'UMSA'
})

// ─── LÓGICA DE API ───

async function cargarEstudiantes() {
  loading.value = true
  errorMessage.value = ''
  try {
    const response = await api.get('/estudiantes/con-usuario')
    estudiantes.value = response.data
  } catch (error) {
    console.error('Error cargando estudiantes:', error)
    errorMessage.value = 'No se pudo cargar la lista. Verifica la conexión con el servidor.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  cargarEstudiantes()
})

async function saveEstudiante() {
  isSaving.value = true
  try {
    if (isEditing.value) {
      // 1. Actualizar datos personales en la tabla Usuario
      await api.put(`/usuarios/${currentEditIdUsuario.value}`, {
        nombre: formData.value.nombre,
        ape_paterno: formData.value.ape_paterno,
        ape_materno: formData.value.ape_materno,
        ci: formData.value.ci
      })
      
      // 2. Actualizar datos académicos en la tabla Estudiante
      await api.put(`/estudiantes/${currentEditIdEstudiante.value}`, {
        institucion: formData.value.institucion
      })

    } else {
      // CREAR NUEVO
      const usuarioResponse = await api.post('/usuarios/', {
        nombre: formData.value.nombre,
        ape_paterno: formData.value.ape_paterno,
        ape_materno: formData.value.ape_materno,
        ci: formData.value.ci,
        correo_electronico: formData.value.correo,
        password: formData.value.password
      })

      const nuevoIdUsuario = usuarioResponse.data.id_usuario

      await api.post('/estudiantes/', {
        id_usuario: nuevoIdUsuario,
        institucion: formData.value.institucion
      })

      // Asignar rol (ID 1 asumiendo que es estudiante, verifica con Herland)
      await api.post(`/usuarios/${nuevoIdUsuario}/rol?id_rol=1`).catch(() => console.log('Rol asignado por defecto'))
      
      // Activar automáticamente
      await api.patch(`/usuarios/${nuevoIdUsuario}/estado?estado=activo`)
    }
    
    closeModal()
    await cargarEstudiantes()

  } catch (error) {
    console.error(error)
    alert(`Error al guardar: ${error.response?.data?.detail || 'Revisa los datos ingresados.'}`)
  } finally {
    isSaving.value = false
  }
}

async function deleteEstudiante() {
  try {
    // Según el contrato, borramos el estudiante (y el backend debería encargarse del usuario o viceversa)
    await api.delete(`/estudiantes/${estudianteToDelete.value.id_estudiante}`)
    showDeleteConfirm.value = false
    estudianteToDelete.value = null
    await cargarEstudiantes()
  } catch (error) {
    alert('No se pudo eliminar el estudiante.')
  }
}

async function toggleEstado(estudiante) {
  const nuevoEstado = estudiante.usuario.estado === 'activo' ? 'bloqueado' : 'activo'
  const idUsuario = estudiante.usuario.id_usuario
  try {
    await api.patch(`/usuarios/${idUsuario}/estado?estado=${nuevoEstado}`)
    await cargarEstudiantes()
  } catch (error) {
    alert('Error al cambiar el estado.')
  }
}

// ─── CONTROL DE INTERFAZ Y FILTROS ───

const filteredEstudiantes = computed(() => {
  let result = estudiantes.value

  // Filtro por Estado
  if (filterEstado.value !== 'todos') {
    result = result.filter(e => e.usuario?.estado === filterEstado.value)
  }

  // Filtro por Búsqueda (Texto)
  const query = searchQuery.value.toLowerCase().trim()
  if (query) {
    result = result.filter(e => {
      const nombreCompleto = `${e.usuario?.nombre || ''} ${e.usuario?.ape_paterno || ''} ${e.usuario?.ape_materno || ''}`.trim().toLowerCase()
      const ci = e.usuario?.ci?.toLowerCase() || ''
      const correo = e.usuario?.correo_electronico?.toLowerCase() || ''
      const institucion = e.institucion?.toLowerCase() || ''
      return nombreCompleto.includes(query) || ci.includes(query) || correo.includes(query) || institucion.includes(query)
    })
  }
  return result
})

function openCreateModal() {
  isEditing.value = false
  currentEditIdEstudiante.value = null
  currentEditIdUsuario.value = null
  formData.value = { nombre: '', ape_paterno: '', ape_materno: '', ci: '', correo: '', password: '', institucion: 'UMSA' }
  showModal.value = true
}

function openEditModal(estudiante) {
  isEditing.value = true
  currentEditIdEstudiante.value = estudiante.id_estudiante
  currentEditIdUsuario.value = estudiante.id_usuario
  
  formData.value = {
    nombre: estudiante.usuario?.nombre || '',
    ape_paterno: estudiante.usuario?.ape_paterno || '',
    ape_materno: estudiante.usuario?.ape_materno || '',
    ci: estudiante.usuario?.ci || '',
    correo: estudiante.usuario?.correo_electronico || '',
    password: '', // No se edita la contraseña aquí
    institucion: estudiante.institucion || 'UMSA'
  }
  showModal.value = true
}

function closeModal() {
  showModal.value = false
}

function confirmDelete(estudiante) {
  estudianteToDelete.value = estudiante
  showDeleteConfirm.value = true
}

// Navegación
const menuItems = [
  { label: 'Dasboard', route: '/superadmin/dashboard', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>' },
  { label: 'Perfil', route: '/superadmin/Perfil', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>' },
  { label: 'Gestion de Cursos', route: '/superadmin/cursos', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>' },
  { label: 'Gestion de Docentes', route: '/superadmin/Docentes', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>' },
  { label: 'Gestion de Estudiantes', route: '/superadmin/estudiantes', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>' },
  { label: 'Reportes', route: '/superadmin/reportes', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>' }
]

function isActive(itemRoute) { return route.path === itemRoute }
function navigate(path) { if (route.path !== path) router.push(path) }
</script>

<style>
:root {
  --color-bg: #ffffff;
  --color-surface: #f8f9fa;
  --color-primary: #023e8a;
  --color-primary-hover: #0077b6;
  --color-text: #1e293b;
  --color-text-muted: #64748b;
  --color-border: #e2e8f0;
  --color-sidebar-bg: #f8fafc;
  --color-sidebar-hover: #e2e8f0;
  --color-active-bg: rgba(2, 62, 138, 0.1);
  --color-danger: #ef4444;
  --color-danger-hover: #b91c1c;
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --radius-md: 8px;
  --radius-lg: 12px;
}
</style>

<style scoped>
/* ── Layout Principal ── */
.dashboard { display: flex; min-height: 100vh; background: var(--color-bg); color: var(--color-text); font-family: system-ui, -apple-system, sans-serif; }
.sidebar { width: 240px; background: var(--color-sidebar-bg); border-right: 1px solid var(--color-border); padding: 24px 0; display: flex; flex-direction: column; }
.sidebar-header { padding: 0 20px 24px; font-size: 18px; font-weight: 800; color: var(--color-primary); }
.sidebar-nav { display: flex; flex-direction: column; gap: 4px; padding: 0 12px; }
.nav-item { display: flex; align-items: center; gap: 12px; padding: 10px 16px; border-radius: var(--radius-md); color: var(--color-text-muted); text-decoration: none; font-size: 14px; font-weight: 500; transition: all 0.2s; }
.nav-item:hover { background: var(--color-sidebar-hover); color: var(--color-text); }
.nav-item.active { background: var(--color-active-bg); color: var(--color-primary); font-weight: 700; }
.nav-icon { display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.main { flex: 1; display: flex; flex-direction: column; }
.topbar { display: flex; justify-content: space-between; align-items: center; padding: 16px 32px; background: var(--color-bg); border-bottom: 1px solid var(--color-border); }
.topbar h1 { font-size: 22px; font-weight: 700; color: var(--color-text); margin: 0; }
.user-info { font-size: 14px; font-weight: 600; color: var(--color-text-muted); }
.content { flex: 1; padding: 32px; background: #f1f5f9; }

/* ── Toolbar & Filtros ── */
.toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
.filters-group { display: flex; gap: 16px; }
.search-box { display: flex; align-items: center; gap: 8px; padding: 8px 14px; background: white; border: 1px solid var(--color-border); border-radius: var(--radius-md); width: 320px; }
.search-box:focus-within { border-color: var(--color-primary); }
.input-base { background: transparent; border: none; outline: none; font-size: 14px; color: var(--color-text); width: 100%; font-family: inherit; }
.select-base { padding: 8px 14px; border: 1px solid var(--color-border); border-radius: var(--radius-md); background: white; color: var(--color-text); font-size: 14px; outline: none; cursor: pointer; }
.select-base:focus { border-color: var(--color-primary); }

/* ── Botones ── */
.btn-primary { display: inline-flex; align-items: center; gap: 8px; padding: 10px 18px; background: var(--color-primary); color: white; border: none; border-radius: var(--radius-md); font-size: 14px; font-weight: 600; cursor: pointer; transition: background 0.2s; }
.btn-primary:hover { background: var(--color-primary-hover); }
.btn-primary:disabled { opacity: 0.7; cursor: not-allowed; }
.btn-secondary { display: inline-flex; align-items: center; gap: 8px; padding: 10px 18px; background: white; color: var(--color-text); border: 1px solid var(--color-border); border-radius: var(--radius-md); font-size: 14px; font-weight: 600; cursor: pointer; }
.btn-secondary:hover { background: var(--color-sidebar-hover); }
.btn-danger { background: var(--color-danger); color: white; border: none; padding: 10px 18px; border-radius: var(--radius-md); font-weight: 600; cursor: pointer; }

/* ── Tabla ── */
.table-container { background: white; border: 1px solid var(--color-border); border-radius: var(--radius-lg); overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
.data-table { width: 100%; border-collapse: collapse; }
.data-table th, .data-table td { text-align: left; padding: 16px 20px; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
.data-table th { background: #f8fafc; font-weight: 600; color: var(--color-text-muted); font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; }
.data-table tbody tr:hover { background: #f8fafc; }
.empty-message { text-align: center; color: var(--color-text-muted); padding: 32px; font-weight: 500; }
.text-danger { color: var(--color-danger); }
.text-success { color: var(--color-success); }
.text-warning { color: var(--color-warning); }
.text-primary { color: var(--color-primary); }

/* ── Acciones y Badges ── */
.actions-cell { display: flex; gap: 8px; }
.btn-icon { background: transparent; border: none; font-size: 16px; cursor: pointer; padding: 4px; border-radius: 4px; transition: transform 0.2s, background 0.2s; }
.btn-icon:hover { transform: scale(1.15); background: #f1f5f9; }
.badge { padding: 4px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; }
.badge-activo { background-color: #d1fae5; color: #065f46; }
.badge-pendiente { background-color: #fef3c7; color: #92400e; }
.badge-bloqueado, .badge-inactivo { background-color: #fee2e2; color: #991b1b; }
.badge-outline { border: 1px solid #cbd5e1; padding: 4px 10px; border-radius: 4px; font-size: 0.8rem; color: #475569; font-weight: 600; }

/* ── Modales ── */
.modal-overlay { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.6); display: flex; align-items: center; justify-content: center; z-index: 100; backdrop-filter: blur(2px); }
.modal { background: white; border-radius: var(--radius-lg); padding: 32px; width: 600px; max-width: 90%; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); }
.modal--small { width: 400px; padding: 24px; }
.modal h2 { margin: 0 0 8px; font-size: 20px; font-weight: 700; color: var(--color-text); }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.form-field { margin-bottom: 16px; }
.field-label { display: block; font-size: 13px; font-weight: 600; margin-bottom: 6px; color: var(--color-text); }
.form-field .input-base { width: 100%; padding: 10px 14px; background: white; border: 1px solid #cbd5e1; border-radius: var(--radius-md); box-sizing: border-box; }
.form-field .input-base:focus { border-color: var(--color-primary); box-shadow: 0 0 0 3px rgba(2, 62, 138, 0.1); }
.form-field .input-base:disabled { background: #f1f5f9; color: #94a3b8; cursor: not-allowed; }
.modal-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 32px; }

/* ── Sidebar Footer ── */
.sidebar-footer { margin-top: auto; padding: 20px 20px 28px; border-top: 1px solid var(--color-border); }
.footer-user-info { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
.user-avatar { width: 44px; height: 44px; border-radius: 14px; display: grid; place-items: center; background: var(--color-primary); color: white; font-weight: 700; }
.footer-user-text { display: flex; flex-direction: column; gap: 4px; }
.footer-user-text strong { font-size: 14px; color: var(--color-primary); }
.footer-user-text span { font-size: 12px; color: var(--color-text-muted); }
.btn-logout { width: 100%; display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 12px 14px; border: 1px solid var(--color-border); border-radius: 12px; background: white; color: var(--color-text); font-weight: 600; cursor: pointer; transition: all 0.2s; }
.btn-logout:hover { background: #fef2f2; color: var(--color-danger); border-color: #fca5a5; }
</style>