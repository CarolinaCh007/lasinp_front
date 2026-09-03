<template>
  <EstudianteLayout>
    <div class="top-bar">
      <div>
        <h1>📜 Historial Académico y Notas</h1>
        <p>Registro de cursos cursados, calificaciones y certificados obtenidos en el LASIN UMSA</p>
      </div>
      <button class="btn-exportar" @click="exportarHistorial" :disabled="cursosCompletados.length === 0 && cursosActivos.length === 0">
        📄 Exportar Historial (CSV)
      </button>
    </div>

    <!-- Resumen General -->
    <div class="resumen-grid">
      <div class="resumen-card">
        <span class="resumen-icono">🎓</span>
        <span class="resumen-num color-azul">{{ loading ? '…' : cursosCompletados.length }}</span>
        <span class="resumen-label">Cursos aprobados</span>
      </div>
      <div class="resumen-card">
        <span class="resumen-icono">📚</span>
        <span class="resumen-num color-turquesa">{{ loading ? '…' : cursosActivos.length }}</span>
        <span class="resumen-label">En curso</span>
      </div>
      <div class="resumen-card">
        <span class="resumen-icono">⏳</span>
        <span class="resumen-num color-amarillo">{{ loading ? '…' : cursosPendientes.length }}</span>
        <span class="resumen-label">En verificación</span>
      </div>
      <div class="resumen-card">
        <span class="resumen-icono">🏆</span>
        <span class="resumen-num color-verde">{{ loading ? '…' : cursosCompletados.length }}</span>
        <span class="resumen-label">Certificados emitibles</span>
      </div>
    </div>

    <!-- Pestañas -->
    <div class="tabs-wrap">
      <div class="tabs">
        <button
          class="tab"
          :class="{ active: tabActivo === 'completados' }"
          @click="tabActivo = 'completados'"
        >
          ✅ Completados / Aprobados ({{ cursosCompletados.length }})
        </button>
        <button
          class="tab"
          :class="{ active: tabActivo === 'activos' }"
          @click="tabActivo = 'activos'"
        >
          📚 En curso actualmente ({{ cursosActivos.length }})
        </button>
      </div>
    </div>

    <!-- Estado de Carga -->
    <div v-if="loading" class="panel sin-datos">
      <div class="spinner"></div>
      <p>Cargando tu trayectoria académica...</p>
    </div>

    <!-- TAB 1: CURSOS COMPLETADOS -->
    <div class="panel" v-else-if="tabActivo === 'completados'">
      <div v-if="cursosCompletados.length === 0" class="sin-datos">
        <span>🎓</span>
        <h3>Aún no tienes cursos completados</h3>
        <p>Una vez que concluyas un curso y el docente registre tu nota final, aparecerá aquí con tu certificado.</p>
        <router-link to="/estudiante/cursos" class="btn-ir-catalogo">Ver cursos disponibles →</router-link>
      </div>

      <div v-else class="table-responsive">
        <table class="tabla">
          <thead>
            <tr>
              <th>Curso / Sigla</th>
              <th>Docente</th>
              <th>Horario</th>
              <th>Aula</th>
              <th>Estado</th>
              <th class="th-center">Certificado</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="c in cursosCompletados" :key="c.id_inscripcion">
              <td>
                <div class="curso-cell">
                  <div class="curso-badge-icono">🎓</div>
                  <div>
                    <strong>{{ c.nombreCurso }}</strong>
                    <span>{{ c.sigla }} · {{ c.especialidad }}</span>
                  </div>
                </div>
              </td>
              <td>{{ c.nombreDocente }}</td>
              <td>{{ c.dias }} ({{ c.horaInicio }} - {{ c.horaFin }})</td>
              <td>{{ c.nombreAula }}</td>
              <td>
                <span class="badge badge-aprobado">Aprobado</span>
              </td>
              <td class="th-center">
                <button class="btn-cert" @click="abrirCertificado(c)">
                  🏆 Ver Certificado
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- TAB 2: CURSOS EN CURSO -->
    <div class="panel" v-else-if="tabActivo === 'activos'">
      <div v-if="cursosActivos.length === 0" class="sin-datos">
        <span>📚</span>
        <h3>No tienes cursos en desarrollo actualmente</h3>
        <p>Explora el catálogo y preinscríbete para iniciar nuevas clases.</p>
        <router-link to="/estudiante/cursos" class="btn-ir-catalogo">Explorar cursos →</router-link>
      </div>

      <div v-else class="table-responsive">
        <table class="tabla">
          <thead>
            <tr>
              <th>Curso / Sigla</th>
              <th>Docente</th>
              <th>Horario</th>
              <th>Aula</th>
              <th>Modalidad</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="c in cursosActivos" :key="c.id_inscripcion">
              <td>
                <div class="curso-cell">
                  <div class="curso-badge-icono azul">💻</div>
                  <div>
                    <strong>{{ c.nombreCurso }}</strong>
                    <span>{{ c.sigla }} · {{ c.especialidad }}</span>
                  </div>
                </div>
              </td>
              <td>{{ c.nombreDocente }}</td>
              <td>{{ c.dias }} ({{ c.horaInicio }} - {{ c.horaFin }})</td>
              <td>{{ c.nombreAula }}</td>
              <td style="text-transform: capitalize;">{{ c.modalidad }}</td>
              <td>
                <span class="badge badge-activo">En Curso</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ── MODAL CERTIFICADO DE APROBACIÓN ── -->
    <div class="modal-overlay" v-if="modalCert" @click.self="modalCert = false">
      <div class="modal-cert">
        <button class="btn-close" @click="modalCert = false">✕</button>
        <div class="cert-marco">
          <div class="cert-header">
            <h3>UNIVERSIDAD MAYOR DE SAN ANDRÉS</h3>
            <h4>FACULTAD DE CIENCIAS PURAS Y NATURALES</h4>
            <p>LABORATORIO DE SISTEMAS E INFORMÁTICA · LASIN</p>
          </div>

          <div class="cert-body">
            <span class="cert-pre">Otorga el presente</span>
            <h2>CERTIFICADO DE APROBACIÓN</h2>
            <span class="cert-a">a:</span>
            <h1 class="cert-estudiante">{{ nombreEstudiante }}</h1>
            <p class="cert-texto">
              Por haber aprobado satisfactoriamente el curso de formación académica continua:
            </p>
            <h2 class="cert-curso">{{ cursoCert?.nombreCurso }} ({{ cursoCert?.sigla }})</h2>
            <p class="cert-detalles">
              Carga horaria: <strong>{{ cursoCert?.cargaHoraria || 40 }} horas académicas</strong> · La Paz - Bolivia
            </p>
          </div>

          <div class="cert-footer">
            <div class="cert-firma">
              <div class="linea-firma"></div>
              <span>Coordinación Académica</span>
              <small>LASIN - UMSA</small>
            </div>
            <div class="cert-sello">
              <div class="sello-circulo">LASIN<br/>UMSA</div>
            </div>
            <div class="cert-firma">
              <div class="linea-firma"></div>
              <span>Docente Instructor</span>
              <small>{{ cursoCert?.nombreDocente }}</small>
            </div>
          </div>
        </div>

        <div class="cert-acciones">
          <button class="btn-imprimir" @click="imprimirCertificado">
            🖨️ Imprimir / Guardar en PDF
          </button>
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

const loading = ref(true)
const tabActivo = ref('completados')
const modalCert = ref(false)
const cursoCert = ref(null)

const inscripciones = ref([])
const cursosCompletados = ref([])
const cursosActivos = ref([])
const cursosPendientes = ref([])

const usuario = computed(() => authService.getUsuario())

const nombreEstudiante = computed(() => {
  const u = usuario.value
  if (!u) return 'ESTUDIANTE'
  return [u.nombre, u.ape_paterno, u.ape_materno].filter(Boolean).join(' ').toUpperCase()
})

async function cargarHistorial() {
  loading.value = true
  try {
    const idEstudiante = usuario.value?.id_usuario
    if (!idEstudiante) return

    const [resInsc, resCursos, resHorarios, resAulas, resDocentes] = await Promise.all([
      inscripcionService.listarPorEstudiante(idEstudiante).catch(() => ({ data: [] })),
      cursoService.listar({ limit: 100 }).catch(() => ({ data: [] })),
      horarioService.listar({ limit: 100 }).catch(() => ({ data: [] })),
      horarioService.listarAulas().catch(() => ({ data: [] })),
      horarioService.listarDocentes().catch(() => ({ data: [] }))
    ])

    const rawInsc = resInsc.data || []
    const todosCursos = resCursos.data || []
    const todosHorarios = resHorarios.data || []
    const todasAulas = resAulas.data || []
    const todosDocentes = resDocentes.data || []

    const procesados = rawInsc.map(insc => {
      const horario = todosHorarios.find(h => h.id_horario === insc.id_horario) || {}
      const curso = todosCursos.find(c => c.id_curso === horario.id_curso) || {}
      const aula = todasAulas.find(a => a.id_aula === horario.id_aula) || {}
      const docente = todosDocentes.find(d => d.id_usuario === horario.id_docente) || {}

      return {
        id_inscripcion: insc.id_inscripcion,
        estado: insc.estado,
        fechaInscripcion: insc.fecha_inscripcion ? new Date(insc.fecha_inscripcion).toLocaleDateString('es-BO') : '—',
        nombreCurso: curso.nombre || 'Curso LASIN',
        sigla: curso.sigla || 'LASIN',
        especialidad: curso.especialidad || 'General',
        cargaHoraria: curso.carga_horaria,
        nombreAula: aula.nombre || 'Laboratorio 1',
        nombreDocente: docente.nombre ? `${docente.nombre} ${docente.ape_paterno || ''}`.trim() : 'Docente Instructor',
        dias: horario.dia_semana || 'Lunes a Viernes',
        horaInicio: horario.hora_inicio ? String(horario.hora_inicio).slice(0, 5) : '--:--',
        horaFin: horario.hora_fin ? String(horario.hora_fin).slice(0, 5) : '--:--',
        modalidad: horario.modalidad || 'presencial'
      }
    })

    inscripciones.value = procesados
    cursosCompletados.value = procesados.filter(c => c.estado === 'completado')
    cursosActivos.value = procesados.filter(c => c.estado === 'activo')
    cursosPendientes.value = procesados.filter(c => c.estado === 'pendiente')

  } catch (error) {
    console.error('[HistorialView] Error cargando datos:', error)
  } finally {
    loading.value = false
  }
}

function abrirCertificado(curso) {
  cursoCert.value = curso
  modalCert.value = true
}

function imprimirCertificado() {
  window.print()
}

function exportarHistorial() {
  const encabezados = ['Curso', 'Sigla', 'Especialidad', 'Docente', 'Aula', 'Horario', 'Estado']
  const filas = inscripciones.value.map(c => [
    `"${c.nombreCurso}"`,
    c.sigla,
    c.especialidad,
    `"${c.nombreDocente}"`,
    c.nombreAula,
    `"${c.dias} ${c.horaInicio}-${c.horaFin}"`,
    c.estado
  ])
  const csv = [encabezados.join(','), ...filas.map(f => f.join(','))].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `historial_academico_${usuario.value?.id_usuario || 'estudiante'}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

onMounted(cargarHistorial)
</script>

<style scoped>
.top-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 14px; }
.top-bar h1 { font-size: 24px; font-weight: 700; color: #0f172a; }
.top-bar p { font-size: 14px; color: #64748b; margin-top: 4px; }

.btn-exportar {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  background: white;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  color: #334155;
  cursor: pointer;
  transition: all 0.15s;
}
.btn-exportar:hover:not(:disabled) { border-color: #0077b6; color: #0077b6; background: #f0f9ff; }
.btn-exportar:disabled { opacity: 0.5; cursor: not-allowed; }

/* ── Resumen Grid ── */
.resumen-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
.resumen-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 18px 20px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04);
}
.resumen-icono { font-size: 24px; margin-bottom: 8px; }
.resumen-num { font-size: 26px; font-weight: 800; line-height: 1.1; }
.resumen-label { font-size: 12px; color: #64748b; font-weight: 600; margin-top: 4px; text-transform: uppercase; letter-spacing: 0.5px; }

.color-azul { color: #0077b6; }
.color-turquesa { color: #00b4d8; }
.color-amarillo { color: #d97706; }
.color-verde { color: #16a34a; }

/* ── Pestañas ── */
.tabs-wrap { border-bottom: 1px solid #e2e8f0; margin-bottom: 20px; overflow-x: auto; }
.tabs { display: flex; gap: 8px; min-width: max-content; }
.tab {
  padding: 12px 18px;
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  font-size: 14px;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  transition: all 0.15s;
}
.tab:hover { color: #0077b6; }
.tab.active { color: #0077b6; border-bottom-color: #0077b6; }

/* ── Panel y Tablas ── */
.panel {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04);
}

.table-responsive { width: 100%; overflow-x: auto; }
.tabla { width: 100%; border-collapse: collapse; min-width: 650px; }
.tabla th { background: #f8fafc; padding: 13px 16px; text-align: left; font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.6px; border-bottom: 1px solid #e2e8f0; }
.tabla td { padding: 14px 16px; font-size: 13px; border-bottom: 1px solid #f1f5f9; vertical-align: middle; color: #334155; }
.tabla tr:hover { background: #f8fafc; }
.th-center { text-align: center !important; }

.curso-cell { display: flex; align-items: center; gap: 12px; }
.curso-badge-icono {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: #f0fdf4;
  color: #16a34a;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
}
.curso-badge-icono.azul { background: #eff6ff; color: #0077b6; }
.curso-cell strong { display: block; font-size: 14px; color: #0f172a; margin-bottom: 2px; }
.curso-cell span { font-size: 12px; color: #64748b; }

.badge { padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; display: inline-block; white-space: nowrap; }
.badge-aprobado { background: #dcfce7; color: #166534; }
.badge-activo { background: #eff6ff; color: #0077b6; }

.btn-cert {
  padding: 7px 14px;
  background: #0077b6;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
}
.btn-cert:hover { background: #005f92; }

/* ── Sin Datos ── */
.sin-datos { text-align: center; padding: 60px 20px; color: #64748b; }
.sin-datos span { font-size: 42px; display: block; margin-bottom: 12px; }
.sin-datos h3 { font-size: 18px; color: #1e293b; margin-bottom: 6px; }
.sin-datos p { font-size: 13px; max-width: 460px; margin: 0 auto; line-height: 1.5; }
.btn-ir-catalogo {
  display: inline-block;
  margin-top: 18px;
  padding: 10px 18px;
  background: #0077b6;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
}
.spinner { width: 26px; height: 26px; border: 3px solid #e2e8f0; border-top-color: #0077b6; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 12px; }
@keyframes spin { to { transform: rotate(360deg); } }

/* ── MODAL CERTIFICADO ── */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.7);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 16px;
  overflow-y: auto;
}
.modal-cert {
  background: white;
  border-radius: 16px;
  padding: 32px;
  width: 100%;
  max-width: 780px;
  position: relative;
  box-shadow: 0 24px 48px rgba(0,0,0,0.25);
}
.btn-close {
  position: absolute;
  top: 16px;
  right: 16px;
  background: #f1f5f9;
  border: none;
  font-size: 16px;
  font-weight: 700;
  color: #64748b;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  cursor: pointer;
}
.btn-close:hover { background: #fee2e2; color: #dc2626; }

.cert-marco {
  border: 4px double #0077b6;
  padding: 36px 30px;
  border-radius: 8px;
  background: #ffffff;
  text-align: center;
  position: relative;
}
.cert-header h3 { font-size: 17px; font-weight: 800; color: #0f172a; margin: 0; letter-spacing: 0.5px; }
.cert-header h4 { font-size: 13px; font-weight: 700; color: #475569; margin: 4px 0 2px; }
.cert-header p { font-size: 11px; font-weight: 600; color: #0077b6; letter-spacing: 1px; margin: 0; }

.cert-body { margin: 28px 0; }
.cert-pre { font-size: 12px; font-style: italic; color: #64748b; }
.cert-body h2 { font-size: 20px; font-weight: 800; color: #0077b6; margin: 6px 0; letter-spacing: 1px; }
.cert-a { font-size: 12px; font-style: italic; color: #64748b; }
.cert-estudiante { font-size: 22px; font-weight: 800; color: #0f172a; border-bottom: 2px solid #e2e8f0; display: inline-block; padding: 4px 24px; margin: 8px 0 16px; }
.cert-texto { font-size: 13px; color: #475569; max-width: 500px; margin: 0 auto; line-height: 1.5; }
.cert-curso { font-size: 18px; font-weight: 700; color: #0077b6; margin: 8px 0 4px; }
.cert-detalles { font-size: 12px; color: #64748b; margin-top: 8px; }

.cert-footer { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 36px; padding: 0 20px; }
.cert-firma { text-align: center; width: 170px; }
.linea-firma { width: 100%; border-bottom: 1px solid #94a3b8; margin-bottom: 6px; }
.cert-firma span { font-size: 11px; font-weight: 700; color: #1e293b; display: block; }
.cert-firma small { font-size: 10px; color: #64748b; }
.cert-sello {
  width: 65px;
  height: 65px;
  border-radius: 50%;
  border: 2px dashed #0077b6;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0077b6;
  font-size: 10px;
  font-weight: 800;
  line-height: 1.2;
}

.cert-acciones { display: flex; justify-content: center; margin-top: 20px; }
.btn-imprimir {
  padding: 10px 22px;
  background: #0077b6;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
}
.btn-imprimir:hover { background: #005f92; }

@media (max-width: 768px) {
  .resumen-grid { grid-template-columns: repeat(2, 1fr); }
  .cert-footer { flex-direction: column; align-items: center; gap: 24px; }
}

@media (max-width: 480px) {
  .resumen-grid { grid-template-columns: 1fr; }
}
</style>