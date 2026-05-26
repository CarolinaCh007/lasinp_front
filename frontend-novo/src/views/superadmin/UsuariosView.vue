<template>
  <SuperadminLayout>
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
        <div class="search-box">  
        <select v-model="filterEstado" class="select-base">
          <option value="">Todos los estados</option>
          <option value="activo">Solo Activos</option>
          <option value="pendiente">Solo Pendientes</option>
          <option value="bloqueado">Solo Bloqueados</option>
          
        </select>
        </div>

        <div class="search-box">  
        <select v-model="filterRol" class="select-base">
          <option value="">Todos los roles</option>
          <option value="estudiante">Solo Estudiantes</option>
          <option value="docente">Solo Docentes</option>
          <option value="admin">Solo Administradores</option>
          
        </select>
>>>>>>> 3b05fd2 (gestion de usuarios terminada)
        </div>
      </div>

      <button class="btn-primary" @click="openCreateModal">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        Nuevo usuario
      </button>
    </div>

    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>Nombre completo</th>
            <th>C.I.</th>
            <th>Correo electrónico</th>
            <th>Rol(es)</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
            <td colspan="6" class="empty-message">Cargando usuarios del sistema...</td>
          </tr>
          <tr v-if="!loading && errorMessage">
            <td colspan="6" class="empty-message text-danger">⚠️ {{ errorMessage }}</td>
          </tr>
          <tr v-for="usuario in filteredUsuarios" :key="usuario.id_usuario">
            <td>
              <strong>{{ `${usuario.nombre || ''} ${usuario.ape_paterno || ''} ${usuario.ape_materno || ''}`.trim() }}</strong>
            </td>
            <td>{{ usuario.ci || '-' }}</td>
            <td>{{ usuario.correo_electronico || '-' }}</td>
            <td>
              <span v-if="usuario.instancias && usuario.instancias.length" class="roles-cell">
                <span v-for="inst in usuario.instancias" :key="inst.id_rol" class="badge-role">
                  {{ inst.rol?.nombre || 'Sin rol' }}
                </span>
              </span>
              <span v-else class="text-muted">Sin rol</span>
            </td>
            <td>
              <span :class="['badge', `badge-${usuario.estado}`]">
                {{ usuario.estado || 'inactivo' }}
              </span>
            </td>
            <td class="actions-cell">
              <!-- BOTÓN MÁS DETALLES -->
              <button 
                class="btn btn-primary"
                title="Ver detalles"
                @click="openDetailsModal(usuario)"
              >
                Más detalles
              </button>

              <!-- BOTÓN EDITAR -->
              <button 
                class="btn btn-success"
                title="Editar usuario"
                @click="openEditModal(usuario)"
              >
                Editar
              </button>

              <button 
                v-if="usuario.estado === 'activo'"
                class="btn btn-danger"
                title="Bloquear"
                @click="cambiarEstadoUsuario(usuario.id_usuario, 'inactivo')"
              >
                BLOQUEAR
              </button>

              <button 
                v-if="usuario.estado !== 'activo'"
                class="btn btn-success" 
                title="Activar"
                @click="cambiarEstadoUsuario(usuario.id_usuario, 'activo')"
              >
                ACTIVAR
              </button>
            </td>
          </tr>
          <tr v-if="!loading && filteredUsuarios.length === 0 && !errorMessage">
            <td colspan="6" class="empty-message">No se encontraron usuarios con esos filtros.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal de Detalles del Usuario -->
    <div v-if="showDetailsModal" class="modal-overlay" @click.self="closeDetailsModal">
      <div class="modal modal--large">
        <button class="btn-close" @click="closeDetailsModal">✕</button>
        <h2>Detalles del Usuario</h2>
        <div v-if="selectedUsuario" class="details-grid">
          <div class="detail-group">
            <h3>Información Personal</h3>
            <div class="detail-row">
              <span class="detail-label">ID:</span>
              <span class="detail-value">{{ selectedUsuario.id_usuario }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Nombre completo:</span>
              <span class="detail-value">{{ `${selectedUsuario.nombre} ${selectedUsuario.ape_paterno} ${selectedUsuario.ape_materno}`.trim() }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Carnet de Identidad:</span>
              <span class="detail-value">{{ selectedUsuario.ci || '-' }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Correo electrónico:</span>
              <span class="detail-value">{{ selectedUsuario.correo_electronico }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Celular:</span>
              <span class="detail-value">{{ selectedUsuario.celular || '-' }}</span>
            </div>
          </div>
          <div class="detail-group">
            <h3>Información del Sistema</h3>
            <div class="detail-row">
              <span class="detail-label">Estado:</span>
              <span :class="['badge', `badge-${selectedUsuario.estado}`]">{{ selectedUsuario.estado }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Rol(es) asignado(s):</span>
              <div class="roles-list">
                <span v-for="inst in (selectedUsuario.instancias || [])" :key="inst.id_rol" class="badge-role">
                  {{ inst.rol?.nombre || 'Sin rol' }}
                </span>
                <span v-if="!selectedUsuario.instancias || selectedUsuario.instancias.length === 0" class="text-muted">
                  Sin roles asignados
                </span>
              </div>
            </div>
            <div class="detail-row">
              <span class="detail-label">Fecha de registro:</span>
              <span class="detail-value">{{ formatDate(selectedUsuario.fecha_registro) }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Última actualización:</span>
              <span class="detail-value">{{ formatDate(selectedUsuario.updated_at) }}</span>
            </div>
          </div>
        </div>
        <div class="modal-actions">
          <button class="btn-secondary" @click="closeDetailsModal">Cerrar</button>
        </div>
      </div>
    </div>

    <!-- Modal de Crear/Editar Usuario -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <button class="btn-close" @click="closeModal">✕</button>
        <h2>{{ isEditing ? 'Editar Usuario' : 'Crear Nuevo Usuario' }}</h2>
        <p class="text-muted mb-4">
          {{ isEditing ? 'Modifica los datos del usuario.' : 'Ingresa los datos para registrar un nuevo usuario en el sistema.' }}
        </p>

        <form @submit.prevent="guardarUsuario">
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
            <input 
              v-model="formData.correo_electronico" 
              type="email" 
              class="input-base" 
              placeholder="usuario@umsa.bo" 
              required 
              :disabled="isEditing" 
            />
            <small v-if="isEditing" class="text-muted">El correo no se puede modificar por seguridad.</small>
          </div>

          <div class="form-grid mt-3">
            <div class="form-field" v-if="!isEditing">
              <label class="field-label">Contraseña temporal *</label>
              <input v-model="formData.password" type="password" class="input-base" required minlength="6" />
            </div>
            <div class="form-field">
              <label class="field-label">Celular</label>
              <input v-model="formData.celular" type="tel" class="input-base" />
            </div>
          </div>

          <div class="form-field mt-3" v-if="!isEditing">
            <label class="field-label">Rol inicial *</label>
            <select v-model="formData.rol" class="input-base" required>
              <option value="">Selecciona un rol...</option>
              <option v-for="rol in rolesDisponibles" :key="rol.id_rol" :value="rol.nombre">
                {{ rol.nombre }}
              </option>
            </select>
          </div>

            <div v-if="isEditing && selectedUsuario" class="form-field mt-3">
    <label class="field-label">Rol asignado</label>

            <div class="roles-selection">

              <div 
                v-for="rol in rolesDisponibles" 
                :key="rol.id_rol" 
                class="role-checkbox"
              >

                <input 
                  type="radio"
                  name="rolUsuario"
                  :id="`rol-${rol.id_rol}`"
                  :value="rol.nombre"
                  v-model="formData.rol"
                />

                <label :for="`rol-${rol.id_rol}`">
                  {{ rol.nombre }}
                </label>

              </div>

            </div>
          </div>
          <div v-if="errorForm" class="form-error">⚠️ {{ errorForm }}</div>

          <div class="modal-actions">
            <button type="button" class="btn-secondary" @click="closeModal" :disabled="isSaving">Cancelar</button>
            <button type="submit" class="btn-primary" :disabled="isSaving">
              <span v-if="isSaving">Guardando...</span>
              <span v-else>{{ isEditing ? 'Actualizar' : 'Crear Usuario' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </SuperadminLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import SuperadminLayout from '../../components/SuperadminLayout.vue'
import usuariosService from '../../services/usuarios'

// ─── ESTADO GLOBAL ───
const usuarios = ref([])
const rolesDisponibles = ref([])
const loading = ref(true)
const isSaving = ref(false)
const errorMessage = ref('')
const errorForm = ref('')

// ─── FILTROS ───
const searchQuery = ref('')
const filterEstado = ref('')
const filterRol = ref('')

// ─── CONTROL DE MODALES ───
const showModal = ref(false)
const showDetailsModal = ref(false)
const isEditing = ref(false)

const selectedUsuario = ref(null)
const rolesOriginales = ref([])

const formData = ref({
  nombre: '',
  ape_paterno: '',
  ape_materno: '',
  ci: '',
  correo_electronico: '',
  password: '',
  celular: '',
  rol: ''
})

// ─── LÓGICA DE API ───

async function cargarUsuarios() {
  loading.value = true
  errorMessage.value = ''
  try {
    usuarios.value = await usuariosService.listarUsuarios(0, 100)
  } catch (error) {
    console.error('Error cargando usuarios:', error)
    errorMessage.value = error.response?.data?.detail || 'No se pudieron cargar los usuarios.'
  } finally {
    loading.value = false
  }
}

async function cargarRoles() {
  try {
    rolesDisponibles.value = await usuariosService.listarRoles()
  } catch (error) {
    console.error('Error cargando roles:', error)
  }
}

onMounted(async () => {
  await cargarRoles()
  await cargarUsuarios()
})

async function guardarUsuario() {
  errorForm.value = ''
  isSaving.value = true
  
  try {
    if (isEditing.value) {
      // Actualizar datos del usuario
      await usuariosService.actualizarUsuario(selectedUsuario.value.id_usuario, {
        nombre: formData.value.nombre,
        ape_paterno: formData.value.ape_paterno,
        ape_materno: formData.value.ape_materno,
        ci: formData.value.ci,
        celular: formData.value.celular,
        rol: formData.value.rol
      })

      // Sincronizar roles
      const rolesActuales = selectedUsuario.value.instancias?.map(inst => inst.rol?.nombre) || []
      const rolesSeleccionados = rolesDisponibles.value.filter(r => {
        const checkbox = document.querySelector(`#rol-${r.id_rol}`)
        return checkbox && checkbox.checked
      }).map(r => r.nombre)

      // Revocar roles deseleccionados
      for (const rol of rolesActuales) {
        if (!rolesSeleccionados.includes(rol)) {
          try {
            await usuariosService.revocarRol(selectedUsuario.value.id_usuario, rol)
          } catch (e) {
            console.warn('No se pudo revocar rol:', rol)
          }
        }
      }
      
      // Asignar roles nuevos
      for (const rol of rolesSeleccionados) {
        if (!rolesActuales.includes(rol)) {
          try {
            await usuariosService.asignarRol(selectedUsuario.value.id_usuario, rol)
          } catch (e) {
            console.warn('No se pudo asignar rol:', rol)
          }
        }
      }

    } else {
      // Crear nuevo usuario - Fallback a endpoints de auth si es necesario
      const datosNuevoUsuario = {
        nombre: formData.value.nombre,
        ape_paterno: formData.value.ape_paterno,
        ape_materno: formData.value.ape_materno,
        ci: formData.value.ci,
        correo_electronico: formData.value.correo_electronico,
        password: formData.value.password,
        celular: formData.value.celular,
        rol: formData.value.rol
      }
      
      // Intentar mediante /users (si existe endpoint POST)
      let nuevoUsuario = null
      try {
        const response = await fetch('http://127.0.0.1:8000/api/v1/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(datosNuevoUsuario)
        })
        nuevoUsuario = response.ok ? await response.json() : null
      } catch (e) {
        console.warn('Endpoint POST /users no disponible')
      }

      // Si no existe, usar auth/register/student
      if (!nuevoUsuario) {
        try {
          const response = await fetch('http://127.0.0.1:8000/api/v1/auth/register/student', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datosNuevoUsuario)
          })
          nuevoUsuario = response.ok ? await response.json() : null
        } catch (e) {
          errorForm.value = 'No se pudo crear el usuario. Verifica los datos.'
          return
        }
      }

      // Asignar el rol seleccionado
      if (formData.value.rol && nuevoUsuario?.id_usuario) {
        try {
          await usuariosService.asignarRol(nuevoUsuario.id_usuario, formData.value.rol)
        } catch (e) {
          console.warn('No se pudo asignar rol inicial')
        }
      }
    }

    closeModal()
    await cargarUsuarios()

  } catch (error) {
    console.error('Error:', error)
    errorForm.value = error.response?.data?.detail || 'Error al guardar el usuario. Revisa los datos.'
  } finally {
    isSaving.value = false
  }
}

async function cambiarEstadoUsuario(id_usuario, nuevoEstado) {
  try {
    await usuariosService.cambiarEstado(id_usuario, nuevoEstado)
    await cargarUsuarios()
  } catch (error) {
    errorMessage.value = 'Error al cambiar el estado del usuario.'
  }
}

function usuarioTieneRol(nombreRol) {
  if (!selectedUsuario.value) return false
  return selectedUsuario.value.instancias?.some(inst => inst.rol?.nombre === nombreRol) || false
}

function toggleRolUsuario(event, nombreRol) {
  // La lógica se maneja en guardarUsuario
}

function formatDate(dateString) {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('es-BO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// ─── CONTROL DE INTERFAZ Y FILTROS ───

const filteredUsuarios = computed(() => {
  let result = usuarios.value

  // Filtro por Estado
  if (filterEstado.value) {
    result = result.filter(u => u.estado === filterEstado.value)
  }
  // Filtro por Rol
  if (filterRol.value) {
    result = result.filter(u => u.rol === filterRol.value)
  }

  // Filtro por Búsqueda (Texto)
  const query = searchQuery.value.toLowerCase().trim()
  if (query) {
    result = result.filter(u => {
      const nombreCompleto = `${u.nombre || ''} ${u.ape_paterno || ''} ${u.ape_materno || ''}`.trim().toLowerCase()
      const ci = (u.ci || '').toLowerCase()
      const correo = (u.correo_electronico || '').toLowerCase()
      return nombreCompleto.includes(query) || ci.includes(query) || correo.includes(query)
    })
  }
  return result
})

function openCreateModal() {
  isEditing.value = false
  selectedUsuario.value = null
  rolesOriginales.value = []
  formData.value = {
    nombre: '',
    ape_paterno: '',
    ape_materno: '',
    ci: '',
    correo_electronico: '',
    password: '',
    celular: '',
    rol: ''
  }
  errorForm.value = ''
  showModal.value = true
}

function openEditModal(usuario) {
  isEditing.value = true
  selectedUsuario.value = usuario
  rolesOriginales.value = usuario.instancias?.map(inst => inst.rol?.nombre) || []
  
  formData.value = {
    nombre: usuario.nombre || '',
    ape_paterno: usuario.ape_paterno || '',
    ape_materno: usuario.ape_materno || '',
    ci: usuario.ci || '',
    correo_electronico: usuario.correo_electronico || '',
    password: '',
    celular: usuario.celular || '',
    rol: ''
  }
  errorForm.value = ''
  showModal.value = true
}

function openDetailsModal(usuario) {
  selectedUsuario.value = usuario
  showDetailsModal.value = true
}

function closeModal() {
  showModal.value = false
  selectedUsuario.value = null
}

function closeDetailsModal() {
  showDetailsModal.value = false
  selectedUsuario.value = null
}
</script>

<style scoped>
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  gap: 16px;
}

.filters-group {
  display: flex;
  gap: 16px;
  flex: 1;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  flex: 1;
  max-width: 400px;
}

.search-box:focus-within {
  border-color: #023e8a;
}

.search-box svg {
  color: #94a3b8;
  flex-shrink: 0;
}

.input-base {
  background: transparent;
  border: none;
  outline: none;
  font-size: 14px;
  color: #1e293b;
  width: 100%;
  font-family: inherit;
}

.select-base {
  padding: 8px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  color: #1e293b;
  font-size: 14px;
  outline: none;
  cursor: pointer;
}

.select-base:focus {
  border-color: #023e8a;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  background: #7700ff;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  white-space: nowrap;
}
.btn-primary:hover {
  background: #0077b6;
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-success {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  background: #03ea44;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  white-space: nowrap;
}
.btn-success:hover {
  background: #0bbb17;
}

.btn-success:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}


.btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  background: white;
  color: #1e293b;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

.btn-secondary:hover {
  background: #f8fafc;
}

.btn-secondary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.table-container {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th,
.data-table td {
  text-align: left;
  padding: 16px 20px;
  border-bottom: 1px solid #f1f5f9;
  font-size: 14px;
}

.data-table th {
  background: #f8fafc;
  font-weight: 600;
  color: #64748b;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.data-table tbody tr:hover {
  background: #f8fafc;
}

.empty-message {
  text-align: center;
  color: #64748b;
  padding: 32px;
  font-weight: 500;
}

.text-danger {
  color: #ef4444;
}

.text-muted {
  color: #64748b;
}

.text-info {
  color: #0284c7;
}

.actions-cell {
  display: flex;
  gap: 8px;
}

.btn-icon {
  background: transparent;
  border: none;
  font-size: 16px;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: transform 0.2s, background 0.2s;
}

.btn-icon:hover {
  transform: scale(1.15);
  background: #f1f5f9;
}

.text-primary {
  color: #023e8a;
}

.text-success {
  color: #10b981;
}

.text-warning {
  color: #f59e0b;
}

.badge {
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  display: inline-block;
}

.badge-activo {
  background-color: #d1fae5;
  color: #065f46;
}

.badge-pendiente {
  background-color: #fef3c7;
  color: #92400e;
}

.badge-bloqueado {
  background-color: #fee2e2;
  color: #991b1b;
}

.badge-inactivo {
  background-color: #fee2e2;
  color: #991b1b;
}

.badge-role {
  display: inline-block;
  padding: 4px 10px;
  background: #e0e7ff;
  color: #3730a3;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
  margin-right: 4px;
  margin-bottom: 4px;
}

.roles-cell {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.roles-list {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
  margin-top: 4px;
}

/* Modales */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  backdrop-filter: blur(2px);
  overflow-y: auto;
  padding: 20px;
}

.modal {
  background: white;
  border-radius: 12px;
  padding: 32px;
  width: 600px;
  max-width: 90%;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  position: relative;
}

.modal--large {
  width: 800px;
}

.btn-close {
  position: absolute;
  top: 16px;
  right: 16px;
  background: transparent;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #94a3b8;
}

.btn-close:hover {
  color: #1e293b;
}

.modal h2 {
  margin: 0 0 8px;
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
}

.mb-4 {
  margin-bottom: 16px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-field {
  margin-bottom: 16px;
}

.mt-3 {
  margin-top: 16px;
}

.field-label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 6px;
  color: #1e293b;
}

.form-field .input-base {
  width: 100%;
  padding: 10px 14px;
  background: white;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  box-sizing: border-box;
  font-size: 14px;
  font-family: inherit;
}

.form-field .input-base:focus {
  border-color: #023e8a;
  box-shadow: 0 0 0 3px rgba(2, 62, 138, 0.1);
  outline: none;
}

.form-field .input-base:disabled {
  background: #f1f5f9;
  color: #94a3b8;
  cursor: not-allowed;
}

.form-error {
  padding: 12px 16px;
  background: rgba(239, 68, 68, 0.08);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 8px;
  color: #fca5a5;
  font-size: 13px;
  margin-top: 16px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 32px;
}

.details-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  margin: 24px 0;
}

.detail-group h3 {
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 16px;
  border-bottom: 2px solid #e2e8f0;
  padding-bottom: 12px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 12px 0;
  border-bottom: 1px solid #f1f5f9;
  gap: 16px;
}

.detail-label {
  font-weight: 600;
  color: #64748b;
  min-width: 140px;
  flex-shrink: 0;
}

.detail-value {
  color: #1e293b;
  word-break: break-word;
  text-align: right;
  flex: 1;
}

.roles-selection {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-top: 8px;
}

.role-checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
}

.role-checkbox input[type="checkbox"] {
  cursor: pointer;
  accent-color: #023e8a;
  width: 16px;
  height: 16px;
}

.role-checkbox label {
  cursor: pointer;
  font-size: 14px;
  color: #1e293b;
}

@media (max-width: 768px) {
  .toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .filters-group {
    flex-direction: column;
  }

  .search-box {
    max-width: none;
  }

  .details-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .detail-row {
    flex-direction: column;
    align-items: flex-start;
  }

  .detail-value {
    text-align: left;
  }

  .modal {
    width: 100%;
    padding: 24px;
  }

  .modal--large {
    width: 100%;
  }
}
</style>