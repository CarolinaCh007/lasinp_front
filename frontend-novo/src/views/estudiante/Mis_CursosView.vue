<template>
  <div class="dashboard">
    <!-- Sidebar (LASIN BLANCO) -->
    <aside class="sidebar">
      <div class="sidebar-logo">
        <div class="logo-box">L2</div>
        <div>
          <strong>LASIN</strong>
          <span>Sistema v2.0</span>
        </div>
      </div>
      <nav class="sidebar-nav">
        <router-link to="/estudiante/dashboard" class="nav-item">
          <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
            <rect x="3" y="3" width="7" height="7" rx="1"/>
            <rect x="14" y="3" width="7" height="7" rx="1"/>
            <rect x="3" y="14" width="7" height="7" rx="1"/>
            <rect x="14" y="14" width="7" height="7" rx="1"/>
          </svg>
          Dashboard
        </router-link>
        <router-link to="/estudiante/cursos" class="nav-item">
          <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
          </svg>
          Catálogo de Cursos
        </router-link>
        <router-link to="/estudiante/perfil" class="nav-item">
          <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
          Mi Perfil
        </router-link>
        <router-link to="/estudiante/historial" class="nav-item">
          <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
            <path d="M12 20h9"/>
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
          </svg>
          Historial y Notas
        </router-link>
        <router-link to="/estudiante/mis-cursos" class="nav-item">
          <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
            <path d="M22 10L12 5 2 10l10 5 10-5z"/>
            <path d="M6 12v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5"/>
          </svg>
          Mis Cursos
        </router-link>
      </nav>
      <div class="sidebar-footer">

        <button class="btn-logout" @click="cerrarSesion">
          <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Salir
        </button>
      </div>
    </aside>

    <!-- Contenido principal: Mis cursos inscritos -->
    <main class="main">
      <div class="top-bar">
        <div>
          <h1>Mis cursos inscritos</h1>
          <p>Continúa aprendiendo desde donde lo dejaste</p>
        </div>
      </div>

      <div v-if="cargando" class="mensaje-carga">
        <span>⏳</span> Cargando tus cursos...
      </div>

      <div v-else-if="error" class="mensaje-error">
        <span>⚠️</span> {{ error }}
      </div>

      <div v-else-if="cursosInscritos.length === 0" class="mensaje-vacio">
        <span>📚</span>
        <h3>Aún no estás inscrito en ningún curso</h3>
        <p>Explora el catálogo y comienza tu aprendizaje</p>
        <router-link to="/estudiante/cursos" class="btn-explorar">Explorar cursos</router-link>
      </div>

      <div v-else class="cursos-grid">
        <div v-for="curso in cursosInscritos" :key="curso.id" class="curso-card">
          <div class="curso-header" :style="{ background: curso.color || 'linear-gradient(135deg, #00b4d8, #0077b6)' }">
            <span class="curso-categoria">{{ curso.categoria }}</span>
          </div>
          <div class="curso-body">
            <h3>{{ curso.nombre }}</h3>
            <p>{{ curso.descripcion }}</p>
            <div class="curso-meta">
              <span>👨‍🏫 {{ curso.docente }}</span>
              <span>📅 Inicio: {{ curso.fechaInicio }}</span>
            </div>
            <div class="progreso-container">
              <div class="progreso-label">
                <span>Progreso</span>
                <span class="progreso-porcentaje">{{ curso.progreso }}%</span>
              </div>
              <div class="progreso-bar">
                <div class="progreso-fill" :style="{ width: curso.progreso + '%', background: '#00b4d8' }"></div>
              </div>
            </div>
            <button class="btn-continuar" @click="irAlCurso(curso.id)">
              {{ curso.progreso === 0 ? 'Comenzar' : 'Continuar' }}
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const cargando = ref(true)
const error = ref(null)
const cursosInscritos = ref([])

// Datos del usuario (ejemplo, conéctalo a tu store o API)
const usuario = ref({ nombre: 'Carolina Ch.' })

// Simulación de carga de datos (reemplazar con llamada a API real)
const cargarCursosInscritos = async () => {
  try {
    // Aquí iría tu petición a la API: const { data } = await api.get('/estudiante/mis-cursos')
    // Datos de ejemplo:
    setTimeout(() => {
      cursosInscritos.value = [
        {
          id: 1,
          nombre: 'Desarrollo Web Full Stack',
          descripcion: 'Aprende HTML, CSS, JavaScript, Vue y Node.js desde cero',
          docente: 'Ing. Carlos Pérez',
          categoria: 'Programación',
          fechaInicio: '15/03/2025',
          progreso: 45,
          color: 'linear-gradient(135deg, #0b5e7c, #0369a1)'
        },
        {
          id: 2,
          nombre: 'Marketing Digital Avanzado',
          descripcion: 'Estrategias SEO, SEM, redes sociales y analítica',
          docente: 'Mg. Ana Gómez',
          categoria: 'Marketing',
          fechaInicio: '01/04/2025',
          progreso: 80,
          color: 'linear-gradient(135deg, #0f766e, #0d9488)'
        },
        {
          id: 3,
          nombre: 'Diseño UI/UX con Figma',
          descripcion: 'Prototipado, sistemas de diseño y pruebas de usabilidad',
          docente: 'Diseñadora Laura Flores',
          categoria: 'Diseño',
          fechaInicio: '10/02/2025',
          progreso: 20,
          color: 'linear-gradient(135deg, #0891b2, #06b6d4)'
        }
      ]
      cargando.value = false
    }, 800)
  } catch (err) {
    error.value = 'No se pudieron cargar tus cursos. Intenta nuevamente.'
    cargando.value = false
  }
}

const irAlCurso = (cursoId) => {
  router.push(`/estudiante/curso/${cursoId}`)
}

const cerrarSesion = () => {
  // Lógica de cierre de sesión
  router.push('/login')
}

onMounted(() => {
  cargarCursosInscritos()
})
</script>

<style scoped>
/* ========== RESET Y ESTILOS BASE ========== */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.dashboard {
  font-family: system-ui, -apple-system, 'Segoe UI', sans-serif;
  display: flex;
  min-height: 100vh;
  background: #f8fafc;
  color: #1e293b;
}

/* ========== SIDEBAR (LASIN BLANCO) ========== */
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
  background: linear-gradient(135deg, #00b4d8, #0077b6);
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
  font-weight: 400;  /* Para que se vea menos grueso */
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
  font-weight: 500;
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

/* Mensajes */
.mensaje-carga, .mensaje-error, .mensaje-vacio {
  text-align: center;
  padding: 60px;
  color: #475569;
  background: white;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
}

.mensaje-carga span, .mensaje-error span, .mensaje-vacio span {
  font-size: 48px;
  display: block;
  margin-bottom: 16px;
}

.mensaje-vacio h3 {
  font-size: 18px;
  margin-bottom: 8px;
  color: #1e293b;
}

.mensaje-vacio p {
  margin-bottom: 20px;
}

.btn-explorar {
  display: inline-block;
  padding: 10px 22px;
  background: #00b4d8;
  color: white;
  border-radius: 10px;
  text-decoration: none;
  font-weight: 600;
  transition: background 0.2s;
}

.btn-explorar:hover {
  background: #0096b8;
}

/* Grid de cursos */
.cursos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

.curso-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.25s;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
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
  min-height: 100px;
}

.curso-categoria {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
  background: rgba(255,255,255,0.9);
  padding: 4px 10px;
  border-radius: 100px;
  color: #0b5e7c;
}

.curso-body {
  padding: 20px;
}

.curso-body h3 {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 8px;
  color: #1e293b;
}

.curso-body p {
  font-size: 12px;
  color: #64748b;
  line-height: 1.5;
  margin-bottom: 14px;
}

.curso-meta {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.curso-meta span {
  font-size: 11px;
  color: #94a3b8;
}

.progreso-container {
  margin: 16px 0;
}

.progreso-label {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  margin-bottom: 6px;
  color: #475569;
}

.progreso-porcentaje {
  font-weight: 600;
  color: #00b4d8;
}

.progreso-bar {
  height: 6px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
}

.progreso-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.5s ease;
}

.btn-continuar {
  width: 100%;
  padding: 10px;
  background: #00b4d8;
  border: none;
  border-radius: 10px;
  color: white;
  font-family: inherit;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-continuar:hover {
  background: #0096b8;
  transform: translateY(-1px);
}
</style>