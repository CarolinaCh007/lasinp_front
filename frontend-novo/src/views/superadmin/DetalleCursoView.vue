<template>
  <div class="pantalla-curso">
    <!-- Encabezado superior -->
    <header class="header-curso">
      <button class="btn-volver" @click="$router.push('/superadmin/cursos')">
        ← Volver al Catálogo de Cursos
      </button>
      <div class="titulo-wrap">
        <h1>{{ curso?.nombre || 'Cargando curso...' }}</h1>
        <span class="sigla-badge">{{ curso?.sigla }}</span>
        <span :class="['badge-estado', curso?.estado]">{{ curso?.estado }}</span>
      </div>
    </header>

    <main class="contenido-curso" v-if="curso">
      <!-- SECCIÓN 1: Información General del Curso -->
      <section class="panel-seccion">
        <h2>📋 Información General del Curso</h2>

        <div class="form-grid">
          <div class="campo">
            <label>Nombre del Curso:</label>
            <input v-model="curso.nombre" type="text" class="input-base" />
          </div>
          <div class="campo">
            <label>Sigla:</label>
            <input v-model="curso.sigla" type="text" class="input-base" />
          </div>
          <div class="campo">
            <label>Especialidad:</label>
            <input v-model="curso.especialidad" type="text" class="input-base" />
          </div>
          <div class="campo">
            <label>Nivel:</label>
            <select v-model="curso.nivel" class="input-base">
              <option value="Básico">Básico</option>
              <option value="Intermedio">Intermedio</option>
              <option value="Avanzado">Avanzado</option>
            </select>
          </div>
          <div class="campo">
            <label>Carga Horaria (horas):</label>
            <input v-model.number="curso.carga_horaria" type="number" class="input-base" />
          </div>
          <div class="campo">
            <label>Duración:</label>
            <input v-model="curso.duracion" type="text" class="input-base" placeholder="Ej: 4 semanas" />
          </div>
          <div class="campo">
            <label>Costo (Bs.):</label>
            <input v-model.number="curso.costo" type="number" class="input-base" />
          </div>
          <div class="campo">
            <label>Cupos Totales:</label>
            <input v-model.number="curso.cupos_totales" type="number" class="input-base" />
          </div>
          <div class="campo">
            <label>Link Grupo WhatsApp:</label>
            <input v-model="curso.link_whatsapp" type="text" class="input-base" placeholder="https://chat.whatsapp.com/..." />
          </div>
          <div class="campo">
            <label>Fecha Inicio:</label>
            <input v-model="curso.fecha_inicio" type="date" class="input-base" />
          </div>
          <div class="campo">
            <label>Fecha Fin:</label>
            <input v-model="curso.fecha_fin" type="date" class="input-base" />
          </div>
          <div class="campo">
            <label>Estado:</label>
            <select v-model="curso.estado" class="input-base">
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
              <option value="pendiente">Pendiente</option>
            </select>
          </div>
        </div>

        <div class="campo" style="margin-top: 15px;">
          <label>Descripción del Curso:</label>
          <textarea v-model="curso.descripcion" class="input-base" rows="2"></textarea>
        </div>

        <div class="campo" style="margin-top: 15px;">
          <label>Objetivo:</label>
          <textarea v-model="curso.objetivo" class="input-base" rows="2"></textarea>
        </div>

        <div style="margin-top: 20px;">
          <button class="btn-guardar" @click="guardarCambios">💾 Guardar Cambios del Curso</button>
        </div>
      </section>

      <!-- SECCIÓN 2: Lista de Horarios / Grupos -->
      <section class="panel-seccion">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
          <h2 style="margin: 0;">⏰ Horarios y Grupos Disponibles ({{ horarios.length }})</h2>
          <button class="btn-nuevo-horario" @click="abrirModalNuevoHorario">
            ➕ Agregar Horario / Grupo
          </button>
        </div>
        
        <div class="grid-horarios" v-if="horarios.length > 0">
          <div v-for="h in horarios" :key="h.id_horario" class="card-horario">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <h3 style="margin: 0; color: #00d4ff;">{{ h.grupo || 'Grupo A' }}</h3>
              <span :class="['badge-estado', h.estado]">{{ h.estado }}</span>
            </div>
            
            <p style="margin: 10px 0 4px;"><strong>📅 Días:</strong> {{ h.dia_semana || 'No especificado' }}</p>
            <p style="margin: 4px 0;"><strong>⏰ Horas:</strong> {{ h.hora_inicio || '--:--' }} - {{ h.hora_fin || '--:--' }}</p>
            <p style="margin: 4px 0;"><strong>🏢 Aula / Lab:</strong> {{ obtenerNombreAula(h.id_aula) }}</p>
            <p style="margin: 4px 0;"><strong>👨‍🏫 Docente:</strong> {{ obtenerNombreDocente(h.id_docente) }}</p>
            <p style="margin: 4px 0;"><strong>🔄 Modalidad:</strong> <span style="text-transform: capitalize;">{{ h.modalidad || 'Presencial' }}</span></p>
            <p v-if="h.enlace_teams" style="margin: 4px 0; word-break: break-all;">
              <strong>🔗 Teams:</strong> <a :href="h.enlace_teams" target="_blank" style="color: #00d4ff;">Abrir enlace</a>
            </p>
            
            <!-- Acciones por horario -->
            <div class="acciones-horario">
              <button class="btn-sub" @click="verEstudianteHorario(h)">
                👥 Preinscritos
              </button>
              <button class="btn-sub" @click="verTemasHorario(h)">
                📚 Temas
              </button>
              <button class="btn-sub" @click="imprimirReporteHorario(h)">
                🖨️ Reporte
              </button>
            </div>
          </div>
        </div>
        <p v-else class="text-vacio">No hay horarios registrados aún para este curso.</p>
      </section>
    </main>

    <!-- Modal para Agregar Nuevo Horario -->
    <div v-if="modalHorario" class="modal-overlay" @click.self="modalHorario = false">
      <div class="modal-box">
        <h3>⏰ Agregar Nuevo Horario para {{ curso?.nombre }}</h3>
        <div class="form-grid" style="grid-template-columns: 1fr 1fr; margin-top: 15px;">
          <div class="campo">
            <label>Grupo / Paralelo:</label>
            <input v-model="nuevoHorario.grupo" type="text" class="input-base" placeholder="Ej: Grupo B" />
          </div>
          <div class="campo">
            <label>Modalidad:</label>
            <select v-model="nuevoHorario.modalidad" class="input-base">
              <option value="presencial">Presencial</option>
              <option value="virtual">Virtual</option>
              <option value="hibrido">Híbrido</option>
            </select>
          </div>
          <div class="campo">
            <label>Aula / Laboratorio:</label>
            <select v-model="nuevoHorario.id_aula" class="input-base">
              <option :value="null">— Sin asignar —</option>
              <option v-for="a in aulas" :key="a.id_aula" :value="a.id_aula">
                {{ a.nombre }} (Cap. {{ a.capacidad }})
              </option>
            </select>
          </div>
          <div class="campo">
            <label>Docente a cargo:</label>
            <select v-model="nuevoHorario.id_docente" class="input-base">
              <option :value="null">— Sin asignar —</option>
              <option v-for="d in docentes" :key="d.id_usuario" :value="d.id_usuario">
                {{ d.nombre }} {{ d.ape_paterno }}
              </option>
            </select>
          </div>
          <div class="campo">
            <label>Días de clase:</label>
            <input v-model="nuevoHorario.dia_semana" type="text" class="input-base" placeholder="Ej: Lunes a Viernes" />
          </div>
          <div class="campo">
            <label>Horas:</label>
            <div style="display: flex; gap: 6px;">
              <input v-model="nuevoHorario.hora_inicio" type="time" class="input-base" />
              <input v-model="nuevoHorario.hora_fin" type="time" class="input-base" />
            </div>
          </div>
          <div class="campo" style="grid-column: 1 / -1;">
            <label>Enlace de Teams:</label>
            <input v-model="nuevoHorario.enlace_teams" type="text" class="input-base" placeholder="https://teams.microsoft.com/..." />
          </div>
        </div>
        <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px;">
          <button class="btn-volver" @click="modalHorario = false">Cancelar</button>
          <button class="btn-guardar" @click="guardarNuevoHorario">✅ Crear Horario</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import cursoService from '../../services/cursoService'
import horarioService from '../../services/horarioService'

const route = useRoute()
const router = useRouter()
const cursoId = Number(route.params.id)

const curso = ref(null)
const horarios = ref([])
const aulas = ref([])
const docentes = ref([])
const modalHorario = ref(false)

const nuevoHorario = ref({
  id_aula: null,
  id_docente: null,
  grupo: 'Grupo B',
  dia_semana: 'Lunes a Viernes',
  hora_inicio: '18:30',
  hora_fin: '20:30',
  modalidad: 'presencial',
  enlace_teams: ''
})

async function cargarTodo() {
  try {
    const [resCurso, resHorarios, resAulas, resDocentes] = await Promise.all([
      cursoService.obtener(cursoId),
      horarioService.listar({ id_curso: cursoId }),
      horarioService.listarAulas(),
      horarioService.listarDocentes()
    ])
    curso.value = resCurso.data
    horarios.value = resHorarios.data || []
    aulas.value = resAulas.data || []
    docentes.value = resDocentes.data || []
  } catch (error) {
    console.error('Error al cargar datos del curso:', error)
  }
}

onMounted(cargarTodo)

function obtenerNombreAula(id) {
  if (!id) return 'Sin aula física'
  const aula = aulas.value.find(a => a.id_aula === id)
  return aula ? `${aula.nombre} (${aula.capacidad} comp.)` : `Aula #${id}`
}

function obtenerNombreDocente(id) {
  if (!id) return 'Docente no asignado'
  const doc = docentes.value.find(d => d.id_usuario === id)
  return doc ? `${doc.nombre} ${doc.ape_paterno || ''}` : `Docente #${id}`
}

async function guardarCambios() {
  try {
    await cursoService.actualizar(cursoId, {
      ...curso.value,
      costo: Number(curso.value.costo || 0),
      cupos_totales: Number(curso.value.cupos_totales || 30),
      carga_horaria: Number(curso.value.carga_horaria || 0)
    })
    alert('✅ Datos del curso actualizados correctamente')
  } catch (error) {
    console.error(error)
    alert('❌ Error al actualizar el curso')
  }
}

function abrirModalNuevoHorario() {
  nuevoHorario.value.grupo = `Grupo ${String.fromCharCode(65 + horarios.value.length)}`
  modalHorario.value = true
}

async function guardarNuevoHorario() {
  try {
    await horarioService.crear({
      id_curso: cursoId,
      id_aula: nuevoHorario.value.id_aula ? Number(nuevoHorario.value.id_aula) : null,
      id_docente: nuevoHorario.value.id_docente ? Number(nuevoHorario.value.id_docente) : null,
      grupo: nuevoHorario.value.grupo,
      dia_semana: nuevoHorario.value.dia_semana,
      hora_inicio: nuevoHorario.value.hora_inicio || null,
      hora_fin: nuevoHorario.value.hora_fin || null,
      modalidad: nuevoHorario.value.modalidad,
      enlace_teams: nuevoHorario.value.enlace_teams || null,
      estado: 'activo'
    })
    modalHorario.value = false
    await cargarTodo()
    alert('✅ Horario creado con éxito')
  } catch (error) {
    console.error(error)
    alert('❌ Error al crear horario')
  }
}

function verEstudianteHorario(h) {
  router.push({ path: '/superadmin/preinscritos', query: { cursoId } })
}

function verTemasHorario(h) {
  alert(`Gestión de temas del curso #${cursoId}`)
}

function imprimirReporteHorario(h) {
  alert(`Generando reporte para el ${h.grupo}`)
}
</script>

<style scoped>
.pantalla-curso { padding: 30px; background: #0a1628; color: #fff; min-height: 100vh; font-family: sans-serif; }
.header-curso { display: flex; align-items: center; gap: 20px; margin-bottom: 30px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 20px; }
.btn-volver { padding: 8px 16px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); border-radius: 8px; color: #fff; cursor: pointer; }
.titulo-wrap { display: flex; align-items: center; gap: 12px; }
.sigla-badge { background: #00d4ff; color: #000; padding: 4px 10px; border-radius: 6px; font-weight: bold; }
.badge-estado { padding: 4px 10px; border-radius: 12px; font-size: 12px; text-transform: uppercase; }
.badge-estado.activo { background: #22c55e; color: #fff; }
.badge-estado.pendiente { background: #eab308; color: #000; }

.panel-seccion { background: #132238; border-radius: 12px; padding: 24px; margin-bottom: 24px; border: 1px solid rgba(0,212,255,0.1); }
.panel-seccion h2 { margin-bottom: 20px; font-size: 18px; color: #00d4ff; }
.form-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 20px; }
.campo { display: flex; flex-direction: column; gap: 6px; }
.campo label { font-size: 12px; color: #94a3b8; font-weight: 600; }
.input-base { padding: 10px; background: #0a1628; border: 1px solid rgba(255,255,255,0.15); border-radius: 8px; color: #fff; }

.btn-guardar { padding: 12px 24px; background: #22c55e; border: none; border-radius: 8px; color: #fff; font-weight: bold; cursor: pointer; }
.btn-nuevo-horario { padding: 8px 16px; background: #00d4ff; border: none; border-radius: 8px; color: #000; font-weight: 700; cursor: pointer; }

.grid-horarios { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
.card-horario { background: #0a1628; padding: 18px; border-radius: 10px; border: 1px solid rgba(0,212,255,0.2); }
.acciones-horario { display: flex; gap: 8px; margin-top: 15px; }
.btn-sub { flex: 1; padding: 8px; background: #0077b6; border: none; border-radius: 6px; color: #fff; font-size: 12px; cursor: pointer; font-weight: 600; }
.btn-sub:hover { background: #0096c7; }

.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 999; }
.modal-box { background: #132238; border: 1px solid #00d4ff; border-radius: 12px; padding: 24px; width: 600px; max-width: 90%; }
.text-vacio { color: #94a3b8; font-style: italic; }
</style>