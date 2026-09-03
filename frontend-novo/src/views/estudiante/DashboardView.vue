<template>

  
  

    <!-- Sidebar Estudiante -->
  
    <!-- Contenido principal -->
    <EstudianteLayout>

      <!-- Header -->
      <div class="top-bar">
        <div>
          <h1>¡Hola, {{ usuario?.nombre || 'Estudiante' }}! 👋</h1>
          <p>Bienvenido a tu panel académico en el LASIN UMSA.</p>
        </div>
        <div class="top-date">{{ fechaHoy }}</div>
      </div>

      <!-- Tarjetas de resumen (100% REALES) -->
      <div class="cards-grid">
        <div class="card card-blue">
          <div class="card-icon">
            <svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
          </div>
          <div class="card-info">
            <span class="card-num">{{ stats.cursosActivos }}</span>
            <span class="card-label">Cursos activos</span>
          </div>
        </div>

        <div class="card card-yellow">
          <div class="card-icon">
            <svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </div>
          <div class="card-info">
            <span class="card-num">{{ stats.pendientes }}</span>
            <span class="card-label">En verificación</span>
          </div>
        </div>

        <div class="card card-green">
          <div class="card-icon">
            <svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          </div>
          <div class="card-info">
            <span class="card-num">{{ stats.completados }}</span>
            <span class="card-label">Cursos completados</span>
          </div>
        </div>

        <div class="card card-purple">
          <div class="card-icon">
            <svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
          </div>
          <div class="card-info">
            <span class="card-num">{{ stats.disponibles }}</span>
            <span class="card-label">Cursos en oferta</span>
          </div>
        </div>
      </div>

      <!-- Contenido en dos columnas -->
      <div class="two-col">

        <!-- Cursos Activos Reales -->
        <div class="panel">
          <div class="panel-header">
            <h2>🎓 Mis Cursos en Curso</h2>
            <router-link to="/estudiante/mis-cursos" class="ver-mas">Ver todos →</router-link>
          </div>

          <div v-if="loading" class="text-muted" style="padding: 20px 0; text-align: center;">
            ⏳ Cargando tus cursos...
          </div>

          <div v-else-if="misCursosDetallados.length === 0" style="padding: 30px 20px; text-align: center;">
            <p style="font-size: 24px; margin-bottom: 8px;">📚</p>
            <strong style="color: #1e293b;">No tienes cursos activos en este momento</strong>
            <p style="font-size: 13px; color: #64748b; margin-top: 4px;">Explora el catálogo de cursos e inscríbete para empezar.</p>
            <router-link to="/estudiante/cursos" class="btn-inscribir" style="display: inline-block; margin-top: 14px;">
              Explorar Catálogo de Cursos →
            </router-link>
          </div>

          <div v-else>
            <div class="curso-item" v-for="c in misCursosDetallados" :key="c.id_inscripcion">
              <div class="curso-color" style="background: #2563eb;"></div>
              <div class="curso-info">
                <strong>{{ c.nombreCurso }}</strong>
                <span>👨‍🏫 {{ c.nombreDocente }} • 🏢 {{ c.nombreAula }}</span>
                <span style="display: block; font-size: 11px; color: #0284c7; margin-top: 2px;">
                  ⏰ {{ c.dias }} ({{ c.horaInicio }} - {{ c.horaFin }})
                </span>
              </div>
              <div style="display: flex; gap: 6px; align-items: center;">
                <a v-if="c.enlaceTeams" :href="c.enlaceTeams" target="_blank" class="btn-inscribir" style="background: rgba(37,99,235,0.1); color: #2563eb;">
                  🟣 Teams
                </a>
                <a v-if="c.linkWhatsapp" :href="c.linkWhatsapp" target="_blank" class="btn-inscribir" style="background: rgba(34,197,94,0.1); color: #16a34a;">
                  📱 WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- Cursos Disponibles del Catálogo -->
        <div class="panel">
          <div class="panel-header">
            <h2>✨ Cursos Disponibles para Ti</h2>
            <router-link to="/estudiante/cursos" class="ver-mas">Ver catálogo →</router-link>
          </div>

          <div v-if="cursosDisponibles.length === 0" style="padding: 30px 20px; text-align: center; color: #64748b;">
            No hay cursos abiertos actualmente.
          </div>

          <div v-else>
            <div class="recomendacion" v-for="rec in cursosDisponibles.slice(0, 4)" :key="rec.id_curso">
              <div class="rec-icon" style="background: rgba(0, 180, 216, 0.15); color: #0077b6;">
                📚
              </div>
              <div class="rec-info">
                <strong>{{ rec.nombre }}</strong>
                <span>{{ rec.nivel || 'General' }} • <strong>Bs. {{ rec.costo || 0 }}</strong></span>
              </div>
              <router-link :to="'/estudiante/cursos'" class="btn-inscribir">
                Inscribirme
              </router-link>
            </div>
          </div>
        </div>

      </div>

      <!-- Avisos y Notificaciones Reales -->
      <div class="panel mt">
        <div class="panel-header">
          <h2>🔔 Avisos de tu Cuenta</h2>
        </div>
        <div class="notif success" v-if="stats.cursosActivos > 0">
          <div class="notif-dot"></div>
          <div class="notif-text">
            <strong>Inscripción Activa Oficial</strong>
            <span>Estás matriculado en {{ stats.cursosActivos }} curso(s) en el LASIN. Revisa tus horarios y aulas arriba.</span>
          </div>
          <span class="notif-time">Activo</span>
        </div>

        <div class="notif warning" v-if="stats.pendientes > 0">
          <div class="notif-dot"></div>
          <div class="notif-text">
            <strong>Preinscripción en Verificación</strong>
            <span>Tienes {{ stats.pendientes }} curso(s) pendiente(s) de validación de pago por el Administrador.</span>
          </div>
          <span class="notif-time">En espera</span>
        </div>

        <div class="notif info" v-if="stats.cursosActivos === 0 && stats.pendientes === 0">
          <div class="notif-dot"></div>
          <div class="notif-text">
            <strong>Bienvenido al Sistema LASIN 2.0</strong>
            <span>Aún no tienes cursos activos. Dirígete a la pestaña "Catálogo de Cursos" para preinscribirte.</span>
          </div>
          <span class="notif-time">Hoy</span>
        </div>
      </div>
</EstudianteLayout>
   
</template>

<script setup>
import EstudianteLayout from '../../components/EstudianteLayout.vue'
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '../../services/auth'
import cursoService from '../../services/cursoService'
import horarioService from '../../services/horarioService'
import inscripcionService from '../../services/inscripcionService'

const router = useRouter()

const fechaHoy = computed(() => {
  return new Date().toLocaleDateString('es-BO', {
    weekday: 'long', year: 'numeric',
    month: 'long', day: 'numeric'
  })
})

const loading = ref(true)
const usuario = ref(null)
const misCursosDetallados = ref([])
const cursosDisponibles = ref([])

const stats = ref({
  cursosActivos: 0,
  pendientes: 0,
  completados: 0,
  disponibles: 0
})

async function cargarDatos() {
  loading.value = true
  try {
    usuario.value = authService.getUsuario()
    const idEstudiante = usuario.value?.id_usuario

    // 1. Cargar datos en paralelo desde PostgreSQL
    const [resInscripciones, resCursos, resHorarios, resAulas, resDocentes] = await Promise.all([
      idEstudiante ? inscripcionService.listarPorEstudiante(idEstudiante).catch(() => ({ data: [] })) : { data: [] },
      cursoService.listar({ limit: 100 }).catch(() => ({ data: [] })),
      horarioService.listar({ limit: 100 }).catch(() => ({ data: [] })),
      horarioService.listarAulas().catch(() => ({ data: [] })),
      horarioService.listarDocentes().catch(() => ({ data: [] }))
    ])

    const misInscripciones = resInscripciones.data || []
    const todosLosCursos = resCursos.data || []
    const todosLosHorarios = resHorarios.data || []
    const todasLasAulas = resAulas.data || []
    const todosLosDocentes = resDocentes.data || []

    // 2. Calcular KPIs reales
    const activas = misInscripciones.filter(i => i.estado === 'activo')
    const pendientes = misInscripciones.filter(i => i.estado === 'pendiente')
    const completadas = misInscripciones.filter(i => i.estado === 'completado')

    stats.value.cursosActivos = activas.length
    stats.value.pendientes = pendientes.length
    stats.value.completados = completadas.length
    stats.value.disponibles = todosLosCursos.length

    cursosDisponibles.value = todosLosCursos

    // 3. Cruzar datos de Mis Cursos Activos con Horario, Curso, Aula y Docente
    misCursosDetallados.value = activas.map(insc => {
      const horario = todosLosHorarios.find(h => h.id_horario === insc.id_horario) || {}
      const curso = todosLosCursos.find(c => c.id_curso === horario.id_curso) || {}
      const aula = todasLasAulas.find(a => a.id_aula === horario.id_aula) || {}
      const docente = todosLosDocentes.find(d => d.id_usuario === horario.id_docente) || {}

      return {
        id_inscripcion: insc.id_inscripcion,
        nombreCurso: curso.nombre || 'Curso Académico',
        sigla: curso.sigla || '',
        nombreDocente: docente.nombre ? `${docente.nombre} ${docente.ape_paterno || ''}` : 'Docente asignado',
        nombreAula: aula.nombre || 'Aula / Laboratorio',
        dias: horario.dia_semana || 'Lunes a Viernes',
        horaInicio: horario.hora_inicio ? String(horario.hora_inicio).slice(0, 5) : '--:--',
        horaFin: horario.hora_fin ? String(horario.hora_fin).slice(0, 5) : '--:--',
        enlaceTeams: horario.enlace_teams,
        linkWhatsapp: curso.link_whatsapp,
        modalidad: horario.modalidad || 'presencial'
      }
    })

  } catch (error) {
    console.error('[DashboardView Estudiante] Error cargando datos:', error)
  } finally {
    loading.value = false
  }
}

function cerrarSesion() {
  authService.logout()
  router.push('/login')
}

onMounted(cargarDatos)
</script>

<style scoped>


.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28px;
}

.top-bar h1 {
  font-size: 22px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 4px 0;
}

.top-bar p {
  color: #64748b;
  font-size: 14px;
  margin: 0;
}

.top-date {
  color: #64748b;
  font-size: 13px;
  font-weight: 500;
  text-transform: capitalize;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;
  margin-bottom: 28px;
}

.card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.card-icon {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-blue .card-icon   { background: #eff6ff; color: #2563eb; }
.card-yellow .card-icon { background: #fefce8; color: #ca8a04; }
.card-green .card-icon  { background: #f0fdf4; color: #16a34a; }
.card-purple .card-icon { background: #faf5ff; color: #9333ea; }

.card-info {
  display: flex;
  flex-direction: column;
}

.card-num {
  font-size: 24px;
  font-weight: 700;
  color: #0f172a;
  line-height: 1.1;
}

.card-label {
  font-size: 12px;
  color: #64748b;
  font-weight: 500;
  margin-top: 4px;
}

.two-col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.panel {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.panel.mt {
  margin-top: 24px;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
  padding-bottom: 14px;
  border-bottom: 1px solid #f1f5f9;
}

.panel-header h2 {
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.ver-mas {
  font-size: 13px;
  color: #2563eb;
  text-decoration: none;
  font-weight: 600;
}

.curso-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 0;
  border-bottom: 1px solid #f1f5f9;
}

.curso-item:last-child {
  border-bottom: none;
}

.curso-color {
  width: 10px;
  height: 44px;
  border-radius: 4px;
  flex-shrink: 0;
}

.curso-info {
  flex: 1;
}

.curso-info strong {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #0f172a;
}

.curso-info span {
  font-size: 12px;
  color: #64748b;
}

.recomendacion {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 0;
  border-bottom: 1px solid #f1f5f9;
}

.recomendacion:last-child {
  border-bottom: none;
}

.rec-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
}

.rec-info {
  flex: 1;
}

.rec-info strong {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #0f172a;
}

.rec-info span {
  font-size: 12px;
  color: #64748b;
}

.btn-inscribir {
  padding: 6px 12px;
  background: rgba(37, 99, 235, 0.08);
  border: 1px solid rgba(37, 99, 235, 0.2);
  border-radius: 6px;
  color: #2563eb;
  text-decoration: none;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
}

.btn-inscribir:hover {
  background: #2563eb;
  color: white;
}

.notif {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 14px 0;
  border-bottom: 1px solid #f1f5f9;
}

.notif:last-child {
  border-bottom: none;
}

.notif-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-top: 5px;
  flex-shrink: 0;
}

.notif.info .notif-dot    { background: #0284c7; }
.notif.success .notif-dot { background: #16a34a; }
.notif.warning .notif-dot { background: #ca8a04; }

.notif-text {
  flex: 1;
}

.notif-text strong {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 2px;
}

.notif-text span {
  font-size: 12px;
  color: #64748b;
}

.notif-time {
  font-size: 11px;
  color: #94a3b8;
  font-weight: 600;
}

@media (max-width: 1024px) {
  .cards-grid { grid-template-columns: repeat(2, 1fr); }
  .two-col { grid-template-columns: 1fr; }
}

@media (max-width: 768px) {
  .dashboard { flex-direction: column; }
  .sidebar { width: 100%; border-right: none; border-bottom: 1px solid #e2e8f0; }
  .main { padding: 20px; }
  .cards-grid { grid-template-columns: 1fr; }
}
</style>