<template>
  <div class="dashboard">

    <!-- Sidebar (ahora claro) -->
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

        <button class="btn-logout" @click="$router.push('/login')">
          <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Salir
        </button>
      </div>
    </aside>

    <!-- Contenido principal -->
    <main class="main">
      <div class="top-bar">
        <div>
          <h1>Catálogo de Cursos</h1>
          <p>Explora y preinscríbete en los cursos disponibles del LASIN</p>
        </div>
      </div>

      <!-- Filtros -->
      <div class="filtros">
        <div class="search-wrap">
          <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input v-model="busqueda" type="text" placeholder="Buscar curso..." />
        </div>
        <div class="filtro-tabs">
          <button
            v-for="cat in categorias" :key="cat"
            class="filtro-tab"
            :class="{ active: categoriaActiva === cat }"
            @click="categoriaActiva = cat"
          >{{ cat }}</button>
        </div>
      </div>

      <!-- Loading / Error / Sin resultados -->
      <div v-if="loading" class="sin-resultados">
        <span>⏳</span>
        <p>Cargando cursos...</p>
      </div>
      <div v-else-if="errorMsg" class="sin-resultados">
        <span>⚠️</span>
        <p>{{ errorMsg }}</p>
      </div>
      <div v-else-if="cursosFiltrados.length === 0" class="sin-resultados">
        <span>🔍</span>
        <p>No se encontraron cursos con ese criterio.</p>
      </div>

      <!-- Grid de cursos -->
      <div v-else class="cursos-grid">
        <div
          class="curso-card"
          v-for="curso in cursosFiltrados"
          :key="curso.id"
          @click="verDetalle(curso)"
        >
          <div class="curso-header" :style="{ background: curso.color }">
            <span class="curso-categoria">{{ curso.categoria }}</span>
          </div>
          <div class="curso-body">
            <h3>{{ curso.nombre }}</h3>
            <p>{{ curso.descripcion }}</p>
            <div class="curso-meta">
              <span>👨‍🏫 {{ curso.docente }}</span>
              <span>📅 {{ curso.fechaInicio }}</span>
            </div>
            <div class="curso-meta">
              <span>⏱️ {{ curso.duracion }}</span>
              <span>👥 {{ curso.cupos }} cupos</span>
            </div>
            <div class="curso-footer">
              <div class="curso-precio">Bs. {{ curso.precio }}</div>
            </div>
            <button
              class="btn-preinscribir"
              :disabled="curso.estado === 'activo'"
              @click.stop="preinscribirse(curso)"
            >
              {{ curso.estado === 'activo' ? 'Sin cupos' : 'Preinscribirse' }}
            </button>
          </div>
        </div>
      </div>
    </main>

    <!-- Modal de confirmación -->
    <div class="modal-overlay" v-if="modalVisible" @click="modalVisible = false">
      <div class="modal" @click.stop>
        <h2>Confirmar preinscripción</h2>
        <p>¿Deseas preinscribirte en:</p>
        <div class="modal-curso">
          <strong>{{ cursoSeleccionado?.nombre }}</strong>
          <span>Bs. {{ cursoSeleccionado?.precio }}</span>
        </div>
        <div class="modal-curso">
          <span>Inicio: {{ cursoSeleccionado?.fechaInicio }}</span>
        </div>
        <div>
          <img src="@/assets/QR_LASIN.jpg" style="width: 100%; border-radius: 5px; margin-top: 20px;" />
        </div>

        <div class="upload-container">
        <input type="file" id="foto" accept="image/*" @change="handleImage" hidden />
        <label for="foto" class="upload-box" :style="comprobanteFile ? 'border-color: #10b981; background: #ecfdf5;' : ''">
          <div class="upload-content">
            <!-- Si NO ha seleccionado archivo, muestra las instrucciones -->
            <template v-if="!comprobanteFile">
              <p>Haz clic para subir tu comprobante</p>
              <small>PNG, JPG o JPEG</small>
            </template>

            <!-- Si YA seleccionó la foto, muestra el nombre en verde con un check -->
            <template v-else>
              <p style="color: #059669; font-weight: 700;">✅ Archivo seleccionado:</p>
              <small style="color: #047857; font-size: 13px; font-weight: 600;">{{ comprobanteFile.name }}</small>
            </template>
          </div>
        </label>
      </div>

        <div>_____________________________________</div>
        <p class="modal-aviso">Tu comprobante de pago será verificado en menos de 1 hora.</p>
        <div class="modal-btns">
          <button class="btn-cancelar" @click="modalVisible = false">Cancelar</button>
          <button class="btn-confirmar" @click="confirmarPreinscripcion">Enviar</button>
        </div>
      </div>
    </div>

  </div>
</template>


<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import cursoService from '../../services/cursoService'
//importaciones para el formdata de los comprobantes de pago 
import { authService } from '../../services/auth'
import inscripcionService from '../../services/inscripcionService'

const router = useRouter()
const busqueda = ref('')
const categoriaActiva = ref('Todos')
const modalVisible = ref(false)
const cursoSeleccionado = ref(null)
const loading = ref(true)
const errorMsg = ref('')
const comprobanteFile = ref(null)
const enviando = ref(false)

// Guardar el archivo en la variable reactiva cuando el usuario lo elige
const handleImage = (event) => {
  const file = event.target.files[0]
  if (file) {
    comprobanteFile.value = file
    console.log('📷 Comprobante cargado:', file.name)
  }
}


const categorias = ['Todos', 'Desarrollo Web', 'Data Science', 'Ciberseguridad', 'Cloud', 'IA', 'Ofimática']

const cursos = ref([
  { id: 1, nombre: '', 
  descripcion: 'Aprende Python desde cero enfocado en análisis de datos y visualización.', docente: 'Lic. Mamani', fechaInicio: '01/03/2025', duracion: '3 meses', cupos: 8, precio: 350, categoria: 'Data Science', icono: '🐍', color: 'linear-gradient(135deg,#1d6fc4,#0ea5e9)', estado: 'disponible' },

])

const cursosFiltrados = computed(() => {
  return cursos.value.filter(c => {
    const nombre = (c.nombre || '').toString().toLowerCase()
    const matchBusqueda = nombre.includes((busqueda.value || '').toLowerCase())
    const matchCategoria = categoriaActiva.value === 'Todos' || (c.categoria || '') === categoriaActiva.value
    return matchBusqueda && matchCategoria
  })
})

function mapearCursoFromAPI(curso) {
  const cupos = (curso.cupo_maximo || 0) - (curso.cupo_usado || 0)
  const estado = cupos <= 0 ? 'lleno' : curso.estado || 'disponible'

  return {
    id: curso.id_curso || curso.id,
    nombre: curso.nombre_curso || curso.nombre,
    descripcion: curso.descripcion || '',
    docente: curso.docente?.nombre || 'Docente',
    fechaInicio: curso.fecha_inicio ? new Date(curso.fecha_inicio).toLocaleDateString('es-BO') : 'Por confirmar',
    duracion: curso.duracion ? `${curso.duracion} semanas` : 'N/A',
    cupos: curso.cupos_totales || 0,
    precio: curso.costo || 0,
    especialidad: curso.especialidad || 'Otros',
    estado: estado,
  }
}

async function cargarCursos() {
  loading.value = true
  errorMsg.value = ''
  try {
    const response = await cursoService.listar()
    const cursosAPI = Array.isArray(response) ? response : response.data || []
    cursos.value = cursosAPI.map(mapearCursoFromAPI)
  } catch (error) {
    console.error('[CursosView] Error al cargar cursos:', error)
    errorMsg.value = 'No se pudieron cargar los cursos. Intenta más tarde.'
  } finally {
    loading.value = false
  }
}

function preinscribirse(curso) {
  if (curso.estado === 'Activo') return
  cursoSeleccionado.value = curso
  modalVisible.value = true
}

//aqui esta la funcion confirmar la preinscripcion 
async function confirmarPreinscripcion() {
  if (!comprobanteFile.value) {
    alert('⚠️ Por favor selecciona la foto de tu comprobante de pago.')
    return
  }

  enviando.value = true
  try {
    const usuarioActual = authService.getUsuario()
    if (!usuarioActual || !usuarioActual.id_usuario) {
      alert('⚠️ No se encontró la sesión de usuario. Por favor vuelve a iniciar sesión.')
      return
    }

    // ── Usamos id_usuario directamente (Clave Primaria Compartida) ──
    const idEstudiante = usuarioActual.id_usuario

    // ── PASO 1: Crear inscripción con el id_estudiante (id_usuario) ──
    const bodyInscripcion = {
      inscripcion: {
        id_horario: 1,
        id_estudiante: idEstudiante
      },
      pago: {
        id_inscripcion: 0,
        precio: cursoSeleccionado.value?.precio || 230,
        metodo_pago: 'Transferencia QR',
        estado: 'pendiente'
      }
    }
    const resInscripcion = await inscripcionService.crearInscripcionConPago(bodyInscripcion)
    const idInscripcionCreada = resInscripcion.data.inscripcion.id_inscripcion

    // ── PASO 2: Subir comprobante con FormData ──
    const formData = new FormData()
    formData.append('id_inscripcion', idInscripcionCreada)
    formData.append('precio', cursoSeleccionado.value?.precio || 230)
    formData.append('metodo_pago', 'Transferencia QR')
    formData.append('comprobante', comprobanteFile.value)

    await inscripcionService.crearPagoConComprobante(formData)

    alert(`✅ ¡Preinscripción enviada con éxito!\n\nTu comprobante será verificado por el administrador del LASIN.`)
    modalVisible.value = false
    comprobanteFile.value = null

  } catch (error) {
    console.error('[Preinscripcion] Error:', error.response?.data || error)
    const detalleError = error.response?.data?.detail || error.message || 'Error desconocido'
    alert(`❌ Error al procesar la preinscripción:\n${detalleError}`)
  } finally {
    enviando.value = false
  }
}


function verDetalle(curso) {
  preinscribirse(curso)
}

onMounted(cargarCursos)
</script>

<style scoped>
/* ========== IMPORTACIÓN DE FUENTE ========== */
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap');

/* ========== RESET Y ESTILOS BASE ========== */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.dashboard {
  font-family: 'Sora', sans-serif;
  display: flex;
  min-height: 100vh;
  background: #f8fafc;
  color: #1e293b;
}

/* ========== SIDEBAR (FONDO CLARO, TEXTO OSCURO) ========== */
.sidebar {
  width: 260px;
  flex-shrink: 0;
  background: #ffffff;
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
  color: #000000;
}

.sidebar-logo span {
  font-size: 11px;
  color: #475569;
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
  color: #1e293b;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
}

.nav-item:hover {
  background: rgba(0, 180, 216, 0.08); /* turquesa claro */
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
  flex-shrink: 0;
  color: white;
}

.user-info strong {
  display: block;
  font-size: 13px;
  color: #000000;
}

.user-info span {
  font-size: 11px;
  color: #475569;
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
  font-family: 'Sora', sans-serif;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-logout:hover {
  border-color: #ef4444;
  color: #ef4444;
}

/* ========== CONTENIDO PRINCIPAL ========== */
.main {
  flex: 1;
  padding: 36px 40px;
  overflow-y: auto;
  background: white;
}

.top-bar {
  margin-bottom: 28px;
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

/* ========== FILTROS ========== */
.filtros {
  display: flex;
  gap: 16px;
  align-items: center;
  margin-bottom: 28px;
  flex-wrap: wrap;
}

.search-wrap {
  position: relative;
}

.search-wrap svg {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #64748b;
  pointer-events: none;
}

.search-wrap input {
  padding: 10px 16px 10px 42px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  color: #1e293b;
  font-family: 'Sora', sans-serif;
  font-size: 14px;
  outline: none;
  width: 240px;
}

.search-wrap input::placeholder {
  color: #64748b;
}

.search-wrap input:focus {
  border-color: #00b4d8;
  box-shadow: 0 0 0 3px rgba(0, 180, 216, 0.1);
}

.filtro-tabs {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.filtro-tab {
  padding: 8px 16px;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 100px;
  color: #475569;
  font-family: 'Sora', sans-serif;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.filtro-tab.active {
  background: #00b4d8;
  border-color: #00b4d8;
  color: white;
}

/* ========== GRID DE CURSOS ========== */
.cursos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.curso-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.25s;
}

.curso-card:hover {
  transform: translateY(-4px);
  border-color: #00b4d8;
  box-shadow: 0 12px 30px rgba(0, 180, 216, 0.1);
}

.curso-header {
  padding: 24px;
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
  min-height: 90px;
}

.curso-categoria {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
  background: #e6f7f9;   /* fondo turquesa muy claro */
  padding: 4px 10px;
  border-radius: 100px;
  color: #0d9488;        /* turquesa oscuro */
}

.curso-body {
  padding: 20px;
}

.curso-body h3 {
  font-size: 15px;
  font-weight: 700;
  margin-bottom: 8px;
  color: #1e293b;
}

.curso-body p {
  font-size: 12px;
  color: #64748b;
  line-height: 1.6;
  margin-bottom: 14px;
}

.curso-meta {
  display: flex;
  gap: 16px;
  margin-bottom: 6px;
}

.curso-meta span {
  font-size: 11px;
  color: #94a3b8;
}

.curso-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 14px;
  margin-bottom: 14px;
}

.curso-precio {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
}

.btn-preinscribir {
  width: 100%;
  padding: 11px;
  background: #00b4d8;
  border: none;
  border-radius: 10px;
  color: white;
  font-family: 'Sora', sans-serif;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-preinscribir:hover:not(:disabled) {
  background: #0096b8;
  transform: translateY(-1px);
}

.btn-preinscribir:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* ========== MENSAJES SIN RESULTADOS ========== */
.sin-resultados {
  text-align: center;
  padding: 60px;
  color: #475569;
}

.sin-resultados span {
  font-size: 48px;
  display: block;
  margin-bottom: 16px;
}

/* ========== MODAL ========== */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal {
  background: white;
  border-radius: 20px;
  padding: 32px;
  width: 420px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.modal h2 {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 8px;
  color: #1e293b;
}

.modal p {
  font-size: 14px;
  color: #475569;
  margin-bottom: 16px;
}

.modal-curso {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-curso strong {
  font-size: 15px;
  color: #1e293b;
}

.modal-curso span {
  font-size: 18px;
  font-weight: 700;
  color: #00b4d8;
}

.modal-aviso {
  background: #fef3c7;
  border: 1px solid #fde68a;
  border-radius: 10px;
  padding: 12px 16px;
  font-size: 12px;
  color: #92400e !important;
  margin-bottom: 24px;
}

.modal-btns {
  display: flex;
  gap: 12px;
}

.btn-cancelar {
  flex: 1;
  padding: 12px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  color: #475569;
  font-family: 'Sora', sans-serif;
  font-size: 14px;
  cursor: pointer;
}

.btn-cancelar:hover {
  background: #f8fafc;
}

.btn-confirmar {
  flex: 1;
  padding: 12px;
  background: #00b4d8;
  border: none;
  border-radius: 10px;
  color: white;
  font-family: 'Sora', sans-serif;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

.btn-confirmar:hover {
  background: #0096b8;
}

/* ========== SUBIDA DE COMPROBANTE ========== */
.upload-container {
  width: 100%;
  display: flex;
  justify-content: center;
}

.upload-box {
  width: 100%;
  height: 100px;
  border: 2px dashed #00b4d8;
  border-radius: 16px;
  cursor: pointer;
  transition: 0.3s;
  background: #f0f9ff;    /* fondo azul muy claro */
}

.upload-box:hover {
  border-color: #0096b8;
  background: #e0f2fe;
}

.upload-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 8px;
}

.upload-content p {
  margin: 0;
  font-weight: 600;
  color: #00b4d8;
}

.upload-content small {
  color: #64748b;
}
</style>