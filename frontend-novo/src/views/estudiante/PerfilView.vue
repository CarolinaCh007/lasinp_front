<template>
  <div class="dashboard">

    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="sidebar-logo">
        <div class="logo-box">
          <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
        </div>
        <div><strong>LASIN</strong><span>Sistema v2.0</span></div>
      </div>
      <nav class="sidebar-nav">
        <router-link to="/estudiante/dashboard" class="nav-item">
          <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
          Dashboard
        </router-link>
        <router-link to="/estudiante/cursos" class="nav-item">
          <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
          Catálogo de Cursos
        </router-link>
        <router-link to="/estudiante/perfil" class="nav-item">
          <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          Mi Perfil
        </router-link>
        <router-link to="/estudiante/historial" class="nav-item">
          <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
          Historial y Notas
        </router-link>
        <router-link to="/estudiante/mis-cursos" class="nav-item">
          <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path d="M22 10L12 5 2 10l10 5 10-5z"/><path d="M6 12v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5"/></svg>
          Mis Cursos
        </router-link>
      </nav>
      <div class="sidebar-footer">
        <div class="user-info">
          <div class="user-avatar">{{ iniciales }}</div>
          <div><strong>{{ nombreCompleto }}</strong><span>Estudiante</span></div>
        </div>
        <button class="btn-logout" @click="$router.push('/login')">
          <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Salir
        </button>
      </div>
    </aside>

    <!-- Main -->
    <main class="main">

      <div class="top-bar">
        <div>
          <h1>Mi Perfil</h1>
          <p>Gestiona tu información personal y académica</p>
        </div>
        <button class="btn-guardar" v-if="editando" @click="guardarCambios">
          ✓ Guardar cambios
        </button>
        <button class="btn-editar" v-else @click="editando = true">
          ✏️ Editar perfil
        </button>
      </div>

      <div class="perfil-grid">

        <!-- Card principal -->
        <div class="card-perfil">
          <div class="perfil-banner"></div>
          <div class="perfil-avatar-wrap">
            <div class="perfil-avatar">{{ iniciales }}</div>
            <div class="perfil-badge">Estudiante</div>
          </div>
          <div class="perfil-nombre">
            <h2>{{ nombreCompleto }}</h2>
            <p>Carrera de Informática · UMSA</p>
          </div>

          <div class="perfil-stats">
            <div class="pstat">
              <span class="pstat-num">5</span>
              <span class="pstat-label">Completados</span>
            </div>
            <div class="pstat-div"></div>
            <div class="pstat">
              <span class="pstat-num">2</span>
              <span class="pstat-label">En curso</span>
            </div>
            <div class="pstat-div"></div>
            <div class="pstat">
              <span class="pstat-num">87%</span>
              <span class="pstat-label">Promedio</span>
            </div>
          </div>

          <!-- Rutas de aprendizaje -->
          <div class="rutas-section">
            <p class="rutas-title">Ruta en progreso</p>
            <div class="ruta-item" v-for="ruta in rutas" :key="ruta.nombre">
              <div class="ruta-info">
                <span>{{ ruta.icono }} {{ ruta.nombre }}</span>
                <span class="ruta-pct">{{ ruta.pct }}%</span>
              </div>
              <div class="ruta-bar">
                <div class="ruta-fill" :style="{ width: ruta.pct + '%', background: ruta.color }"></div>
              </div>
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
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { authService } from '../../services/auth'
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

const rutas = ref([
  { nombre: 'Data Science & ML', icono: '🤖', pct: 65, color: 'linear-gradient(90deg,#0077b6,#00d4ff)' },
  { nombre: 'Desarrollo Web Full Stack', icono: '💻', pct: 40, color: 'linear-gradient(90deg,#7c3aed,#a855f7)' },
])

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
/* Estilos base - Sin importaciones externas */
* { box-sizing: border-box; margin: 0; padding: 0; }

.dashboard { 
    font-family: system-ui, -apple-system, 'Segoe UI', 'Sora', sans-serif; 
    display: flex; 
    min-height: 100vh; 
    background: #f8fafc;
    color: #1e293b;
}

/* Sidebar - Fondo blanco, texto negro, acento turquesa */
.sidebar { 
    width: 260px; 
    flex-shrink: 0; 
    background: white;
    border-right: 1px solid #e2e8f0;
    display: flex; 
    flex-direction: column; 
    padding: 28px 20px; 
}

.sidebar-logo { 
    display: flex; 
    align-items: center; 
    gap: 12px; 
    margin-bottom: 40px; 
    padding: 0 8px; 
}

.logo-box { 
    width: 40px; 
    height: 40px; 
    background: linear-gradient(135deg, #00b4d8, #0077b6); /* turquesa */
    border-radius: 10px; 
    display: flex; 
    align-items: center; 
    justify-content: center; 
    color: white; 
    flex-shrink: 0; 
}

.sidebar-logo strong { 
    display: block; 
    font-size: 15px; 
    font-weight: 700; 
    color: #1e293b;
}

.sidebar-logo span { 
    font-size: 11px; 
    color: #64748b;
}

.sidebar-nav { 
    display: flex; 
    flex-direction: column; 
    gap: 4px; 
    flex: 1; 
}

.nav-item { 
    display: flex; 
    align-items: center; 
    gap: 12px; 
    padding: 11px 14px; 
    border-radius: 10px; 
    color: #000000;
    text-decoration: none; 
    font-size: 14px; 
    font-weight: 500; 
    transition: all 0.2s; 
}

.nav-item:hover { 
    background: rgba(0, 180, 216, 0.08);
    color: #00b4d8;
}

.nav-item.router-link-active { 
    background: rgba(0, 180, 216, 0.12);
    color: #00b4d8;
}

.sidebar-footer { 
    border-top: 1px solid #e2e8f0;
    padding-top: 20px; 
}

.user-info { 
    display: flex; 
    align-items: center; 
    gap: 10px; 
    margin-bottom: 12px; 
}

.user-avatar { 
    width: 36px; 
    height: 36px; 
    border-radius: 50%; 
    background: linear-gradient(135deg, #00b4d8, #0077b6);
    display: flex; 
    align-items: center; 
    justify-content: center; 
    font-size: 12px; 
    font-weight: 700; 
    color: white;
    flex-shrink: 0; 
}

.user-info strong { 
    display: block; 
    font-size: 13px; 
    color: #000000;
}

.user-info span { 
    font-size: 11px; 
    color: #000000; 
}

.btn-logout { 
    width: 100%; 
    display: flex; 
    align-items: center; 
    gap: 8px; 
    padding: 9px 14px; 
    background: transparent; 
    border: 1px solid #e2e8f0; 
    border-radius: 8px; 
    color: #1e293b;
    font-family: inherit; 
    font-size: 13px; 
    cursor: pointer; 
    transition: all 0.2s; 
}

.btn-logout:hover { 
    border-color: #ef4444;
    color: #ef4444;
    background: #fef2f2;
}

/* Main */
.main { 
    flex: 1; 
    padding: 36px 40px; 
    overflow-y: auto; 
}

.top-bar { 
    display: flex; 
    justify-content: space-between; 
    align-items: flex-start; 
    margin-bottom: 32px; 
}

.top-bar h1 { 
    font-size: 26px; 
    font-weight: 700; 
    margin-bottom: 4px; 
    color: #1e293b;
}

.top-bar p { 
    font-size: 14px; 
    color: #475569;
}

/* Botones estilo LASIN BLANCO */
.btn-editar { 
    padding: 10px 22px; 
    background: white; 
    border: 1px solid #e2e8f0; 
    border-radius: 8px; 
    color: #0077b6;
    font-family: inherit; 
    font-size: 13px; 
    font-weight: 600; 
    cursor: pointer; 
    transition: all 0.2s; 
}

.btn-editar:hover { 
    background: #f8fafc; 
    border-color: #00b4d8;
    color: #00b4d8;
}

.btn-guardar { 
    padding: 10px 22px; 
    background: linear-gradient(135deg, #00b4d8, #0077b6);
    border: none; 
    border-radius: 8px; 
    color: white; 
    font-family: inherit; 
    font-size: 13px; 
    font-weight: 600; 
    cursor: pointer; 
    transition: opacity 0.2s; 
}

.btn-guardar:hover { 
    opacity: 0.9; 
}

/* Grid */
.perfil-grid { 
    display: grid; 
    grid-template-columns: 320px 1fr; 
    gap: 24px; 
}

/* Card perfil */
.card-perfil { 
    background: white; 
    border: 1px solid #e2e8f0; 
    border-radius: 12px; 
    overflow: hidden; 
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.perfil-banner { 
    height: 90px; 
    background: linear-gradient(135deg, #0077b6, #00b4d8);
    opacity: 0.9; 
}

.perfil-avatar { 
    width: 72px; 
    height: 72px; 
    border-radius: 50%; 
    background: linear-gradient(135deg, #0077b6, #00b4d8);
    display: flex; 
    align-items: center; 
    justify-content: center; 
    font-size: 22px; 
    font-weight: 700; 
    color: white;
    border: 3px solid white; 
}

.perfil-badge { 
    position: absolute; 
    bottom: 0; 
    right: calc(50% - 60px); 
    background: #e0f2fe;
    border: 1px solid #cbd5e1; 
    border-radius: 100px; 
    padding: 2px 10px; 
    font-size: 10px; 
    color: #0077b6;
    font-weight: 600; 
}

.perfil-nombre { 
    text-align: center; 
    padding: 0 24px 20px; 
}

.perfil-nombre h2 { 
    font-size: 18px; 
    font-weight: 700; 
    margin-bottom: 4px; 
    color: #1e293b;
}

.perfil-nombre p { 
    font-size: 12px; 
    color: #475569;
}

.perfil-stats { 
    display: flex; 
    justify-content: center; 
    gap: 0; 
    border-top: 1px solid #e2e8f0; 
    border-bottom: 1px solid #e2e8f0; 
    margin: 0 0 24px; 
}

.pstat { 
    flex: 1; 
    text-align: center; 
    padding: 16px 8px; 
}

.pstat-num { 
    display: block; 
    font-size: 22px; 
    font-weight: 700; 
    color: #0077b6;
}

.pstat-label { 
    font-size: 10px; 
    color: #64748b; 
    text-transform: uppercase; 
    letter-spacing: 0.5px; 
}

.pstat-div { 
    width: 1px; 
    background: #e2e8f0; 
    align-self: center; 
    height: 32px; 
}

.rutas-section { 
    padding: 0 24px 24px; 
}

.rutas-title { 
    font-size: 11px; 
    font-weight: 600; 
    text-transform: uppercase; 
    letter-spacing: 1px; 
    color: #475569;
    margin-bottom: 14px; 
}

.ruta-item { 
    margin-bottom: 14px; 
}

.ruta-info { 
    display: flex; 
    justify-content: space-between; 
    font-size: 12px; 
    margin-bottom: 6px; 
    color: #1e293b;
}

.ruta-pct { 
    color: #00b4d8;
    font-weight: 600; 
}

.ruta-bar { 
    height: 5px; 
    background: #f1f5f9; 
    border-radius: 4px; 
}

.ruta-fill { 
    height: 100%; 
    border-radius: 4px; 
    background: #00b4d8;
    transition: width 1s ease; 
}

/* Card datos */
.card-datos { 
    background: white; 
    border: 1px solid #e2e8f0; 
    border-radius: 12px; 
    padding: 28px; 
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.card-datos h3 { 
    font-size: 15px; 
    font-weight: 700; 
    margin-bottom: 22px; 
    color: #1e293b;
}

.form-grid { 
    display: grid; 
    grid-template-columns: 1fr 1fr; 
    gap: 16px; 
    margin-bottom: 28px; 
}

.field.full { 
    grid-column: 1 / -1; 
}

.field label { 
    display: block; 
    font-size: 11px; 
    font-weight: 700; 
    color: #475569;
    text-transform: uppercase; 
    letter-spacing: 0.8px; 
    margin-bottom: 8px; 
}

.field input { 
    width: 100%; 
    padding: 12px 16px; 
    background: white; 
    border: 1px solid #e2e8f0; 
    border-radius: 8px; 
    color: #1e293b;
    font-family: inherit; 
    font-size: 14px; 
    font-weight: normal;
    outline: none; 
    transition: all 0.2s; 
}

.field input:disabled { 
    opacity: 0.5; 
    cursor: not-allowed; 
    background: #f8fafc;
}

.field input:focus { 
    border-color: #00b4d8;
    box-shadow: 0 0 0 3px rgba(0, 180, 216, 0.1);
}

.password-section { 
    border-top: 1px solid #e2e8f0; 
    padding-top: 24px; 
}

.password-section h3 { 
    font-size: 15px; 
    font-weight: 700; 
    margin-bottom: 18px; 
    color: #1e293b;
}

.success-msg { 
    margin-top: 20px; 
    background: #d1fae5; 
    border: 1px solid #a7f3d0; 
    color: #065f46; 
    border-radius: 8px; 
    padding: 12px 16px; 
    font-size: 13px; 
}

/* Utilidades */
.text-muted { color: #64748b; }
.text-danger { color: #ef4444; }
</style>