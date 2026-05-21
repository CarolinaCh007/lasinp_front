<template>
  <div class="dashboard">
    <!-- Barra lateral (idéntica al DashboardView) -->
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
    </aside>

    <!-- Contenido principal -->
    <div class="main">
      <header class="topbar">
        <h1>Gestión de Docentes</h1>
        <div class="user-info">
          <span>Super Admin</span>
        </div>
      </header>

      <section class="content">
        <!-- Barra de herramientas -->
        <div class="toolbar">
          <div class="search-box">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              v-model="searchQuery"
              type="text"
              class="input-base"
              placeholder="Buscar docentes..."
            />
          </div>
          <button class="btn-primary" @click="openCreateModal">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Nuevo Docente
          </button>
        </div>

        <!-- Tabla de Docentes -->
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Nombre </th>
                <th>C.I.</th>
                <th>Correo electrónico</th>
                <th>Especialidad</th>
                <th>Grado Académico</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="loading">
                <td colspan="5" class="empty-message">Cargando docentes desde la base de datos...</td>
              </tr>
              <tr v-if="!loading && errorMessage">
                <td colspan="5" class="empty-message">{{ errorMessage }}</td>
              </tr>
              <tr v-for="docente in filteredDocentes" :key="docente.id_docente">
                <td>
                  {{ `${docente.usuario.nombre || ''} ${docente.usuario.ape_paterno || ''} ${docente.usuario.ape_materno || ''}`.trim() }}
                </td>
                <td>{{ docente.usuario.ci || '-' }}</td>
                <td>{{ docente.usuario.correo_electronico || '-' }}</td>
                <td>{{ docente.especialidad || '-' }}</td>
                <td>{{ docente.grado_academico || '-' }}</td>
                
                <td class="actions-cell">
                  <button class="btn-icon" title="Editar" @click="openEditModal(docente)">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </button>
                  <button class="btn-icon btn-icon--danger" title="Eliminar" @click="confirmDelete(docente)">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  </button>
                </td>
              </tr>
              <tr v-if="filteredDocentes.length === 0">
                <td colspan="5" class="empty-message">No se encontraron docentes.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>

    <!-- Modal para crear/editar docente -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <h2>{{ modalTitle }}</h2>
        <form @submit.prevent="saveDocente">
          <div class="form-field">
            <label class="field-label">Nombre completo</label>
            <input v-model="formData.nombre" type="text" class="input-base" required />
          </div>
          <div class="form-field">
            <label class="field-label">Carnet</label>
            <input v-model="formData.ci" type="text" class="input-base" required />
          </div>
          <div class="form-field">
            <label class="field-label">Correo electrónico</label>
            <input v-model="formData.correo" type="email" class="input-base" required />
          </div>
          <div class="form-field">
            <label class="field-label">Especialidad</label>
            <input v-model="formData.especialidad" type="text" class="input-base" required />
          </div>
          <div class="modal-actions">
            <button type="button" class="btn-secondary" @click="closeModal">Cancelar</button>
            <button type="submit" class="btn-primary">{{ isEditing ? 'Guardar cambios' : 'Crear docente' }}</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Confirmación de eliminación -->
    <div v-if="showDeleteConfirm" class="modal-overlay" @click.self="showDeleteConfirm = false">
      <div class="modal modal--small">
        <h2>Confirmar eliminación</h2>
        <p>¿Estás seguro de eliminar a <strong>{{ docenteToDelete?.nombre }}</strong>?</p>
        <div class="modal-actions">
          <button class="btn-secondary" @click="showDeleteConfirm = false">Cancelar</button>
          <button class="btn-danger" @click="deleteDocente">Eliminar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { docentesService } from '../../services/Docentes.js'

const router = useRouter()
const route = useRoute()

const docentes = ref([])
// Aquí llega la información real desde el backend.
// Si quieres cambiar cómo se muestra el nombre completo, edita la plantilla en el <td> correspondiente.
const searchQuery = ref('')
const loading = ref(true)
const errorMessage = ref('')
const showModal = ref(false)
const showDeleteConfirm = ref(false)
const isEditing = ref(false)
const currentEditId = ref(null)
const docenteToDelete = ref(null)

const formData = ref({
  nombre: '',
  ci: '',
  correo: '',
  especialidad: ''
})

async function cargarDocentes() {
  loading.value = true
  errorMessage.value = ''
  try {
    const response = await docentesService.getAll()
    docentes.value = response.data
  } catch (error) {
    console.error('Error cargando docentes:', error)
    if (error.response) {
      if (error.response.status === 401) {
        errorMessage.value = 'No autorizado. Inicia sesión de nuevo como superadmin.'
      } else if (error.response.status === 403) {
        errorMessage.value = 'No tienes permiso para ver esta lista.'
      } else {
        errorMessage.value = `Error servidor (${error.response.status}) al cargar docentes.`
      }
    } else {
      errorMessage.value = 'No se pudo conectar con el servidor de la API.'
    }
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  cargarDocentes()
})

// Elementos del menú lateral
const menuItems = [
  {
    label: 'Dasboard',
    route: '/superadmin/dashboard',
    icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>'
  },
  {
    label: 'Perfil',
    route: '/superadmin/Perfil',
    icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>'
  },
  
  {
    label: 'Gestion de Cursos',
    route: '/superadmin/cursos',
    icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>'
  },
  {
    label: 'Gestion de Docentes',
    route: '/superadmin/Docentes',
    icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>'
  },
  {
    label: 'Gestion de Estudiantes',
    route: '/superadmin/estudiantes',
    icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>'
  },
  {
    label: 'Reportes',
    route: '/superadmin/reportes',
    icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>'
  }
]

// Filtrado de docentes
const filteredDocentes = computed(() => {
  const query = searchQuery.value.toLowerCase().trim()
  if (!query) return docentes.value
  return docentes.value.filter(d => {
    const nombreCompleto = `${d.usuario?.nombre || ''} ${d.usuario?.ape_paterno || ''} ${d.usuario?.ape_materno || ''}`.trim().toLowerCase()
    const ci = d.usuario?.ci?.toLowerCase() || ''
    const correo = d.usuario?.correo_electronico?.toLowerCase() || ''
    return (
      nombreCompleto.includes(query) ||
      ci.includes(query) ||
      correo.includes(query)
    )
  })
})

// Título del modal
const modalTitle = computed(() => isEditing.value ? 'Editar docente' : 'Nuevo docente')

// Navegación
function isActive(itemRoute) {
  return route.path === itemRoute
}
function navigate(path) {
  if (route.path !== path) router.push(path)
}

// CRUD
function openCreateModal() {
  isEditing.value = false
  currentEditId.value = null
  formData.value = { nombre: '', ci: '', correo: '', especialidad: '' }
  showModal.value = true
}

function openEditModal(docente) {
  isEditing.value = true
  currentEditId.value = docente.id
  formData.value = { ...docente }
  showModal.value = true
}

function closeModal() {
  showModal.value = false
}

function saveDocente() {
  if (isEditing.value) {
    const index = docentes.value.findIndex(d => d.id === currentEditId.value)
    if (index !== -1) {
      docentes.value[index] = { id: currentEditId.value, ...formData.value }
    }
  } else {
    const newId = Math.max(...docentes.value.map(d => d.id), 0) + 1
    docentes.value.push({ id: newId, ...formData.value })
  }
  closeModal()
}

function confirmDelete(docente) {
  docenteToDelete.value = docente
  showDeleteConfirm.value = true
}

function deleteDocente() {
  docentes.value = docentes.value.filter(d => d.id !== docenteToDelete.value.id)
  showDeleteConfirm.value = false
  docenteToDelete.value = null
}
</script>

<style>
/* Variables de color (mismas que en DashboardView) */
:root {
  --color-bg: #ffffff;
  --color-surface: #f8f9fa;
  --color-primary: #2563eb;
  --color-primary-hover: #1d4ed8;
  --color-text: #1e293b;
  --color-text-muted: #64748b;
  --color-border: #e2e8f0;
  --color-sidebar-bg: #f1f5f9;
  --color-sidebar-hover: #e2e8f0;
  --color-active-bg: rgba(37, 99, 235, 0.1);
  --color-danger: #dc2626;
  --color-danger-hover: #b91c1c;
  --radius-md: 8px;
  --radius-lg: 12px;
}
</style>

<style scoped>
/* =============================================
   LAYOUT PRINCIPAL
   ============================================= */
.dashboard {
  display: flex;
  min-height: 100vh;
  background: var(--color-bg);
  color: var(--color-text);
  font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
}

/* Barra lateral */
.sidebar {
  width: 240px;
  background: var(--color-sidebar-bg);
  border-right: 1px solid var(--color-border);
  padding: 24px 0;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  padding: 0 20px 24px;
  font-size: 18px;
  font-weight: 700;
  color: var(--color-primary);
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 0 12px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  border-radius: var(--radius-md);
  color: var(--color-text-muted);
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
}

.nav-item:hover {
  background: var(--color-sidebar-hover);
  color: var(--color-text);
}

.nav-item.active {
  background: var(--color-active-bg);
  color: var(--color-primary);
  font-weight: 600;
}

.nav-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

/* Área principal */
.main {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 32px;
  background: var(--color-bg);
  border-bottom: 1px solid var(--color-border);
}

.topbar h1 {
  font-size: 20px;
  font-weight: 600;
  color: var(--color-text);
}

.user-info {
  font-size: 14px;
  color: var(--color-text-muted);
}

/* Contenido */
.content {
  flex: 1;
  padding: 32px;
  background: var(--color-surface);
}

/* Barra de herramientas */
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text-muted);
  width: 300px;
}

.search-box:focus-within {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.input-base {
  background: transparent;
  border: none;
  outline: none;
  font-size: 14px;
  color: var(--color-text);
  width: 100%;
  font-family: inherit;
}

.input-base::placeholder {
  color: var(--color-text-muted);
  opacity: 0.7;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  font-family: inherit;
}

.btn-primary:hover {
  background: var(--color-primary-hover);
}

/* Tabla */
.table-container {
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th,
.data-table td {
  text-align: left;
  padding: 12px 16px;
  border-bottom: 1px solid var(--color-border);
  font-size: 14px;
}

.data-table th {
  background: var(--color-surface);
  font-weight: 600;
  color: var(--color-text-muted);
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.data-table tr:last-child td {
  border-bottom: none;
}

.data-table tbody tr:hover {
  background: var(--color-sidebar-hover);
}

.empty-message {
  text-align: center;
  color: var(--color-text-muted);
  padding: 24px;
}

/* Botones de acción */
.actions-cell {
  display: flex;
  gap: 8px;
}

.btn-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-bg);
  color: var(--color-text-muted);
  cursor: pointer;
  transition: all 0.2s;
}

.btn-icon:hover {
  background: var(--color-sidebar-hover);
  color: var(--color-primary);
  border-color: var(--color-primary);
}

.btn-icon--danger:hover {
  background: #fef2f2;
  color: var(--color-danger);
  border-color: var(--color-danger);
}

.btn-danger {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  background: var(--color-danger);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  font-family: inherit;
}

.btn-danger:hover {
  background: var(--color-danger-hover);
}

.btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  background: var(--color-bg);
  color: var(--color-text);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}

.btn-secondary:hover {
  background: var(--color-sidebar-hover);
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}

.modal {
  background: var(--color-bg);
  border-radius: var(--radius-lg);
  padding: 24px;
  width: 480px;
  max-width: 90%;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.modal--small {
  width: 400px;
}

.modal h2 {
  margin: 0 0 20px;
  font-size: 18px;
  font-weight: 600;
}

.modal p {
  color: var(--color-text-muted);
  margin-bottom: 20px;
}

.form-field {
  margin-bottom: 16px;
}

.field-label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 6px;
  color: var(--color-text);
}

.form-field .input-base {
  width: 100%;
  padding: 10px 14px;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  box-sizing: border-box;
}

.form-field .input-base:focus {
  border-color: var(--color-primary);
  outline: none;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 24px;
}
.sidebar-footer {
  margin-top: auto;
  padding: 20px 20px 28px;
  border-top: 1px solid var(--color-border);
}

.footer-user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.user-avatar {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  background: var(--color-primary);
  color: white;
  font-weight: 700;
}

.footer-user-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.footer-user-text strong {
  font-size: 14px;
}

.footer-user-text span {
  font-size: 12px;
  color: var(--color-text-muted);
}

.btn-logout {
  width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 14px;
  border: none;
  border-radius: 12px;
  background: #f8fafc;
  color: #111827;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, transform 0.2s;
}

.btn-logout:hover {
  background: #e2e8f0;
  transform: translateY(-1px);
}
</style>