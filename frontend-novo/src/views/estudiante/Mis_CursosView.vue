<template>
  <EstudianteLayout>
    <div class="top-bar">
      <div>
        <h1>📚 Mis Cursos</h1>
        <p>Todos tus cursos inscritos en el LASIN UMSA</p>
      </div>
      <router-link to="/estudiante/cursos" class="btn-explorar">
        + Inscribirme en un Curso
      </router-link>
    </div>

    <!-- Filtros de estado -->
    <div class="filtros">
      <button
        v-for="f in filtros"
        :key="f.valor"
        :class="['btn-filtro', filtroActivo === f.valor ? 'activo' : '']"
        @click="filtroActivo = f.valor"
      >
        {{ f.etiqueta }}
        <span class="badge-count">{{ contarPorEstado(f.valor) }}</span>
      </button>
    </div>

    <!-- Loading -->
    <div v-if="cargando" class="mensaje-carga">
      <div class="spinner"></div>
      Cargando tus cursos...
    </div>

    <!-- Error -->
    <div v-else-if="error" class="mensaje-error">
      ⚠️ {{ error }}
    </div>

    <!-- Vacío -->
    <div v-else-if="cursosFiltrados.length === 0" class="mensaje-vacio">
      <p style="font-size: 48px; margin-bottom: 12px;">📭</p>
      <h3>{{ filtroActivo === 'todos' ? 'Aún no tienes cursos inscritos' : `No tienes cursos en estado "${filtroActivo}"` }}</h3>
      <p>Explora el catálogo y comienza tu aprendizaje en el LASIN.</p>
      <router-link to="/estudiante/cursos" class="btn-explorar" style="margin-top: 14px;">
        Explorar catálogo de cursos →
      </router-link>
    </div>

    <!-- Grid de tarjetas -->
    <div v-else class="cursos-grid">
      <div v-for="c in cursosFiltrados" :key="c.id_inscripcion" class="curso-card">

        <!-- Cabecera con sigla y estado -->
        <div class="curso-header">
          <span class="curso-sigla">{{ c.sigla || '📚' }}</span>
          <span :class="['badge-estado', c.estado]">{{ etiquetaEstado(c.estado) }}</span>
        </div>

        <!-- Cuerpo de la tarjeta -->
        <div class="curso-body">
          <h3>{{ c.nombreCurso }}</h3>
          <p class="curso-desc">{{ c.descripcion || 'Curso académico del LASIN' }}</p>

          <!-- Datos del horario -->
          <div class="info-grid">
            <div class="info-item">
              <span class="info-icon">👨‍🏫</span>
              <span>{{ c.nombreDocente }}</span>
            </div>
            <div class="info-item">
              <span class="info-icon">🏢</span>
              <span>{{ c.nombreAula }}</span>
            </div>
            <div class="info-item">
              <span class="info-icon">📅</span>
              <span>{{ c.dias }}</span>
            </div>
            <div class="info-item">
              <span class="info-icon">⏰</span>
              <span>{{ c.horaInicio }} - {{ c.horaFin }}</span>
            </div>
            <div class="info-item">
              <span class="info-icon">🔄</span>
              <span style="text-transform: capitalize;">{{ c.modalidad }}</span>
            </div>
            <div class="info-item">
              <span class="info-icon">💰</span>
              <span>Bs. {{ c.costo || '0.00' }}</span>
            </div>
          </div>

          <!-- Acciones según estado -->
          <div class="curso-acciones">
            <template v-if="c.estado === 'activo'">
              <a
                v-if="c.enlaceTeams"
                :href="c.enlaceTeams"
                target="_blank"
                class="btn-accion btn-teams"
              >
                🟣 Unirme a la Clase (Teams)
              </a>
              <span v-else class="texto-sin-teams">
                ⏳ Enlace de Teams pendiente de asignación
              </span>
              <a
                v-if="c.linkWhatsapp"
                :href="c.linkWhatsapp"
                target="_blank"
                class="btn-accion btn-whatsapp"
              >
                📱 Grupo WhatsApp
              </a>
            </template>

            <div v-else-if="c.estado === 'pendiente'" class="aviso-pendiente">
              🕐 Tu comprobante de pago está siendo verificado por el Administrador. Te notificaremos cuando sea aprobado.
            </div>
          </div>
        </div>
      </div>
    </div>
  </EstudianteLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import EstudianteLayout from '../../components/EstudianteLayout.vue'
import { authService } from '../../services/auth'
import inscripcionService from '../../services/inscripcionService'
import cursoService from '../../services/cursoService'
import horarioService from '../../services/horarioService'

const cargando = ref(true)
const error = ref(null)
const cursosInscritos = ref([])
const filtroActivo = ref('todos')

const filtros = [
  { valor: 'todos',     etiqueta: 'Todos'     },
  { valor: 'activo',    etiqueta: 'Activos'   },
  { valor: 'pendiente', etiqueta: 'Pendientes'},
  { valor: 'completado',etiqueta: 'Completados'}
]

const cursosFiltrados = computed(() => {
  if (filtroActivo.value === 'todos') return cursosInscritos.value
  return cursosInscritos.value.filter(c => c.estado === filtroActivo.value)
})

function contarPorEstado(estado) {
  if (estado === 'todos') return cursosInscritos.value.length
  return cursosInscritos.value.filter(c => c.estado === estado).length
}

function etiquetaEstado(estado) {
  const mapa = {
    activo: '✅ Activo',
    pendiente: '⏳ En verificación',
    completado: '🎓 Completado',
    inactivo: '❌ Inactivo'
  }
  return mapa[estado] || estado
}

async function cargarMisCursos() {
  cargando.value = true
  error.value = null
  try {
    const usuario = authService.getUsuario()
    const idEstudiante = usuario?.id_usuario
    if (!idEstudiante) {
      error.value = 'No se pudo identificar al estudiante. Por favor inicia sesión nuevamente.'
      return
    }

    const [resInsc, resCursos, resHorarios, resAulas, resDocentes] = await Promise.all([
      inscripcionService.listarPorEstudiante(idEstudiante).catch(() => ({ data: [] })),
      cursoService.listar({ limit: 100 }).catch(() => ({ data: [] })),
      horarioService.listar({ limit: 100 }).catch(() => ({ data: [] })),
      horarioService.listarAulas().catch(() => ({ data: [] })),
      horarioService.listarDocentes().catch(() => ({ data: [] }))
    ])

    const inscripciones   = resInsc.data     || []
    const todosLosCursos  = resCursos.data   || []
    const todosHorarios   = resHorarios.data || []
    const todasAulas      = resAulas.data    || []
    const todosDocentes   = resDocentes.data || []

    cursosInscritos.value = inscripciones.map(insc => {
      const horario = todosHorarios.find(h => h.id_horario === insc.id_horario) || {}
      const curso   = todosLosCursos.find(c => c.id_curso === horario.id_curso) || {}
      const aula    = todasAulas.find(a => a.id_aula === horario.id_aula) || {}
      const docente = todosDocentes.find(d => d.id_usuario === horario.id_docente) || {}

      return {
        id_inscripcion: insc.id_inscripcion,
        estado:         insc.estado,
        nombreCurso:    curso.nombre   || 'Curso LASIN',
        sigla:          curso.sigla    || '📚',
        descripcion:    curso.descripcion,
        costo:          curso.costo,
        linkWhatsapp:   curso.link_whatsapp,
        nombreAula:     aula.nombre   || 'Laboratorio asignado',
        nombreDocente:  docente.nombre
          ? `${docente.nombre} ${docente.ape_paterno || ''}`.trim()
          : 'Docente por asignar',
        dias:           horario.dia_semana  || 'Horario por confirmar',
        horaInicio:     horario.hora_inicio ? String(horario.hora_inicio).slice(0, 5) : '--:--',
        horaFin:        horario.hora_fin    ? String(horario.hora_fin).slice(0, 5)    : '--:--',
        modalidad:      horario.modalidad   || 'presencial',
        enlaceTeams:    horario.enlace_teams
      }
    })

  } catch (e) {
    console.error('[MisCursos] Error:', e)
    error.value = 'No se pudieron cargar tus cursos. Intenta recargar la página.'
  } finally {
    cargando.value = false
  }
}

onMounted(cargarMisCursos)
</script>

<style scoped>
.top-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 12px; }
.top-bar h1 { font-size: 22px; font-weight: 700; color: #0f172a; }
.top-bar p { color: #64748b; font-size: 14px; margin-top: 2px; }

.btn-explorar {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 18px;
  background: #0077b6;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  transition: background 0.15s;
}
.btn-explorar:hover { background: #005f92; }

/* ── Filtros ── */
.filtros { display: flex; gap: 8px; margin-bottom: 24px; overflow-x: auto; padding-bottom: 4px; }
.btn-filtro {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  color: #475569;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
}
.btn-filtro:hover { border-color: #0077b6; color: #0077b6; }
.btn-filtro.activo { background: #0077b6; border-color: #0077b6; color: white; }
.badge-count { background: rgba(255,255,255,0.25); padding: 1px 7px; border-radius: 10px; font-size: 11px; font-weight: 700; }
.btn-filtro.activo .badge-count { background: rgba(255,255,255,0.3); }
.btn-filtro:not(.activo) .badge-count { background: #e2e8f0; color: #475569; }

/* ── Estados ── */
.mensaje-carga { display: flex; align-items: center; gap: 12px; color: #64748b; padding: 60px 0; justify-content: center; font-size: 15px; }
.spinner { width: 22px; height: 22px; border: 3px solid #e2e8f0; border-top-color: #0077b6; border-radius: 50%; animation: spin 0.7s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.mensaje-error { padding: 20px; background: #fef2f2; border: 1px solid #fecaca; border-radius: 10px; color: #b91c1c; }
.mensaje-vacio { text-align: center; padding: 60px 20px; color: #64748b; }
.mensaje-vacio h3 { font-size: 18px; color: #1e293b; margin-bottom: 8px; }

/* ── Grid de tarjetas ── */
.cursos-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 24px; }

.curso-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04);
  transition: box-shadow 0.2s;
}
.curso-card:hover { box-shadow: 0 6px 20px rgba(0, 119, 182, 0.12); }

.curso-header {
  background: linear-gradient(135deg, #0077b6, #00b4d8);
  padding: 18px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.curso-sigla {
  font-size: 20px;
  font-weight: 800;
  color: white;
  letter-spacing: 0.5px;
}

.badge-estado {
  font-size: 11px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 20px;
  white-space: nowrap;
}
.badge-estado.activo    { background: #dcfce7; color: #166534; }
.badge-estado.pendiente { background: #fef3c7; color: #92400e; }
.badge-estado.completado{ background: #ede9fe; color: #5b21b6; }
.badge-estado.inactivo  { background: #f1f5f9; color: #64748b; }

.curso-body { padding: 20px; }
.curso-body h3 { font-size: 16px; font-weight: 700; color: #0f172a; margin-bottom: 6px; }
.curso-desc { font-size: 13px; color: #64748b; margin-bottom: 16px; line-height: 1.5; }

.info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 16px; }
.info-item { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #475569; }
.info-icon { font-size: 14px; flex-shrink: 0; }

/* ── Acciones ── */
.curso-acciones { display: flex; flex-direction: column; gap: 8px; }
.btn-accion {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.15s;
  text-align: center;
}
.btn-teams    { background: #eff6ff; color: #0077b6; border: 1px solid #bae6fd; }
.btn-teams:hover { background: #0077b6; color: white; }
.btn-whatsapp { background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; }
.btn-whatsapp:hover { background: #16a34a; color: white; }

.texto-sin-teams { font-size: 12px; color: #94a3b8; text-align: center; padding: 8px; background: #f8fafc; border-radius: 8px; border: 1px dashed #e2e8f0; }

.aviso-pendiente {
  font-size: 12px;
  color: #92400e;
  background: #fffbeb;
  border: 1px solid #fde68a;
  border-radius: 8px;
  padding: 10px 12px;
  line-height: 1.5;
}

@media (max-width: 640px) {
  .cursos-grid { grid-template-columns: 1fr; }
  .info-grid { grid-template-columns: 1fr; }
}
</style>