<template>

  <SuperadminLayout>
    <template #header-actions>
      <button class="btn-secondary" @click="editando = !editando">
        {{ editando ? 'Cancelar' : 'Editar perfil' }}
      </button>
      <button class="btn-primary" v-if="editando" @click="guardarCambios">
        Guardar cambios
      </button>
    </template>

    <div class="profile-intro">
      <p>Revisa tus datos y edita tu información de acceso.</p>
    </div>

    <div class="profile-grid">
      <div class="profile-card">
        <div class="profile-banner"></div>
        <div class="profile-avatar-wrap">
          <div class="profile-avatar">{{ iniciales }}</div>
          <div class="profile-role">Super Admin</div>
        </div>
        <div class="profile-name">
          <h2>{{ perfil.nombre }} {{ perfil.ape_paterno }} {{ perfil.ape_materno }}</h2>
          <p>{{ perfil.email }}</p>
        </div>

        <div class="profile-meta">
          
          <div class="meta-item">
            <span>Estado</span>
            <strong>{{ perfil.estado }}</strong>
          </div>
          <div class="meta-item">
            <span>Registrado</span>
            <strong>{{ perfil.fecha_registro }}</strong>
          </div>
        </div>
      </div>

      <!-- Formulario de datos -->
        <div class="card-datos">
          <h3>Información personal</h3>

          <div class="form-grid">
            <div class="field">
              <label>Nombre</label>
              <input v-model="perfil.nombre" :disabled="!editando" type="text"/>
            </div>
            <div class="field">
              <label>Apellido paterno</label>
              <input v-model="perfil.ape_paterno" :disabled="!editando" type="text"/>
            </div>
            <div class="field">
              <label>Apellido materno</label>
              <input v-model="perfil.ape_materno" :disabled="!editando" type="text"/>
            </div>
            <div class="field">
              <label>Correo institucional</label>
              <input v-model="perfil.correo_electronico" disabled type="email"/>
            </div>
            <div class="field">
              <label>Teléfono</label>
              <input v-model="perfil.telefono" :disabled="!editando" type="tel"/>
            </div>
            <div class="field full">
              <label>Dirección</label>
              <input v-model="perfil.direccion" :disabled="!editando" type="text"/>
            </div>
            <div class="field">
              <label>Carnet de identidad</label>
              <input v-model="perfil.ci" :disabled="!editando" type="text"/>
            </div>
            <div class="field">
              <label>Fecha de nacimiento</label>
              <input v-model="perfil.fecha_nacimiento" :disabled="!editando" type="date"/>
            </div>
          </div>

          <!-- Cambiar contraseña -->
          <div class="password-section" v-if="editando">
            <h3>Cambiar contraseña</h3>
            <div class="form-grid">
              <div class="field">
                <label>Contraseña actual</label>
                <input type="password" placeholder="••••••••"/>
              </div>
              <div class="field">
                <label>Nueva contraseña</label>
                <input type="password" placeholder="••••••••"/>
              </div>
            </div>
          </div>

          <div class="success-msg" v-if="guardado">
            ✅ Perfil actualizado correctamente.
          </div>
          <div class="error-msg" v-if="errorMsg">
            ⚠️ {{ errorMsg }}
          </div>
        </div>
      
    </div>
  </SuperadminLayout>

</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { authService } from '../../services/auth'
import SuperadminLayout from '../../components/SuperadminLayout.vue'
import usuariosService from '../../services/usuarios'

const editando = ref(false)
const guardado = ref(false)
const errorMsg = ref('')
const loading = ref(true)

const perfil = ref({
  id_usuario: null,
  nombre: '',
  ape_paterno: '',
  ape_materno: '',
  correo_electronico: '',
  telefono: '',
  direccion: '',
  ci: '',
  fecha_nacimiento: '',
})

const nombreCompleto = computed(() => {
  const parts = [perfil.value.nombre, perfil.value.ape_paterno, perfil.value.ape_materno].filter(Boolean)
  return parts.length ? parts.join(' ') : 'Estudiante'
})

const iniciales = computed(() => {
  const parts = [perfil.value.nombre, perfil.value.ape_paterno, perfil.value.ape_materno]
    .filter(Boolean)
    .map(part => part.trim().charAt(0).toUpperCase())
  return parts.slice(0, 2).join('') || 'ES'
})
function setPerfilFromUsuario(usuario) {
  perfil.value.id_usuario = usuario?.id_usuario ?? usuario?.id ?? null
  perfil.value.nombre = usuario?.nombre || ''
  perfil.value.ape_paterno = usuario?.ape_paterno || ''
  perfil.value.ape_materno = usuario?.ape_materno || ''
  perfil.value.correo_electronico = usuario?.correo_electronico || usuario?.email || ''
  perfil.value.telefono = usuario?.celular || usuario?.telefono || ''
  perfil.value.direccion = usuario?.direccion || ''
  perfil.value.ci = usuario?.ci || ''
  perfil.value.fecha_nacimiento = usuario?.fecha_nacimiento || ''
}
async function cargarPerfil() {
  const usuarioLocal = authService.getUsuario()
  if (usuarioLocal) {
    setPerfilFromUsuario(usuarioLocal)
  }

  try {
    const usuario = await authService.refreshUsuario()
    setPerfilFromUsuario(usuario)
  } catch (error) {
    console.warn('[PerfilEstudiante] No se pudo refrescar el usuario', error)
  } finally {
    loading.value = false
  }
}

async function guardarCambios() {
  errorMsg.value = ''
  guardado.value = false

  if (!perfil.value.id_usuario) {
    errorMsg.value = 'No se pudo identificar al usuario.'
    return
  }

  const datos = {
    nombre: perfil.value.nombre,
    ape_paterno: perfil.value.ape_paterno,
    ape_materno: perfil.value.ape_materno,
    telefono: perfil.value.telefono,
    direccion: perfil.value.direccion,
    semestre: perfil.value.semestre,
    fecha_nacimiento: perfil.value.fecha_nacimiento,
  }

  try {
    await usuariosService.actualizarUsuario(perfil.value.id_usuario, datos)
    editando.value = false
    guardado.value = true
    await authService.refreshUsuario()
    setPerfilFromUsuario(authService.getUsuario())
    setTimeout(() => (guardado.value = false), 3000)
  } catch (error) {
    console.error('[PerfilEstudiante] Error al guardar perfil:', error)
    errorMsg.value = error.response?.data?.detail || 'No se pudo guardar el perfil. Revisa tu conexión.'
  }
}
onMounted(cargarPerfil)
</script>

<style scoped>
.dashboard {
  display: flex;
  min-height: 100vh;
  background: #f4f6fb;
  color: #1f2937;
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.sidebar {
  width: 240px;
  background: #ffffff;
  border-right: 1px solid #e5e7eb;
  padding: 28px 20px;
}

.sidebar-header {
  font-size: 18px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 28px;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 12px;
  color: #4b5563;
  text-decoration: none;
  transition: background 0.2s ease;
}

.nav-item.active,
.nav-item:hover {
  background: #eff6ff;
  color: #1d4ed8;
}

.nav-icon {
  width: 20px;
  height: 20px;
}

.main {
  flex: 1;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 28px 32px 16px;
}

.topbar h1 {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 8px;
}

.topbar p {
  color: #6b7280;
}

.header-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.btn-primary,
.btn-secondary {
  border: none;
  border-radius: 12px;
  padding: 12px 18px;
  cursor: pointer;
  font-weight: 600;
}

.btn-primary {
  background: #2563eb;
  color: white;
}

.btn-secondary {
  background: #ffffff;
  color: #374151;
  border: 1px solid #d1d5db;
}

.content {
  padding: 0 32px 32px;
}

.profile-grid {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 24px;
}

.profile-card,
.profile-form-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 24px;
  padding: 24px;
}

.profile-banner {
  height: 90px;
  border-radius: 20px 20px 0 0;
  background: linear-gradient(135deg, #2563eb, #3b82f6);
  margin: -24px -24px 20px;
}

.profile-avatar-wrap {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 20px;
}

.profile-avatar {
  width: 72px;
  height: 72px;
  border-radius: 22px;
  background: #eff6ff;
  display: grid;
  place-items: center;
  color: #2563eb;
  font-size: 28px;
  font-weight: 700;
}

.profile-role {
  background: #eff6ff;
  color: #2563eb;
  border-radius: 999px;
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 700;
}

.profile-name h2 {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 6px;
}

.profile-name p {
  color: #6b7280;
}

.profile-meta {
  display: grid;
  gap: 12px;
  margin-top: 24px;
}

.meta-item {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 16px;
  background: #f8fafc;
  border-radius: 16px;
}

.meta-item span {
  color: #6b7280;
}

.meta-item strong {
  color: #111827;
}

.profile-form-card h2 {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 18px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field.full {
  grid-column: span 2;
}

label {
  color: #4b5563;
  font-size: 13px;
}

input {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid #d1d5db;
  border-radius: 14px;
  background: #f8fafc;
  color: #111827;
}

input:disabled {
  background: #f3f4f6;
  color: #6b7280;
}

.password-box {
  margin-top: 24px;
}

.password-box h3 {
  font-size: 15px;
  font-weight: 700;
  margin-bottom: 16px;
}

.alert.success {
  margin-top: 24px;
  padding: 14px 16px;
  border-radius: 16px;
  background: #ecfdf5;
  color: #0f766e;
}
</style>
