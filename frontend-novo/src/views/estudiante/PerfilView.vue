<template>
  <EstudianteLayout>
    <div class="top-bar">
      <div>
        <h1>👤 Mi Perfil</h1>
        <p>Gestiona tu información personal y tus credenciales de acceso</p>
      </div>
      <div class="top-actions">
        <button class="btn-guardar" v-if="editando" @click="guardarCambios" :disabled="guardando">
          {{ guardando ? '⏳ Guardando...' : '✓ Guardar cambios' }}
        </button>
        <button class="btn-cancelar" v-if="editando" @click="cancelarEdicion">
          ✕ Cancelar
        </button>
        <button class="btn-editar" v-if="!editando" @click="editando = true">
          ✏️ Editar perfil
        </button>
      </div>
    </div>

    <!-- Alertas globales -->
    <div class="alerta-exito" v-if="guardado">✅ Perfil actualizado correctamente.</div>
    <div class="alerta-error" v-if="errorMsg">⚠️ {{ errorMsg }}</div>

    <div class="perfil-grid">

      <!-- ── Tarjeta Izquierda: Identidad y Stats ── -->
      <div class="card-perfil">
        <div class="perfil-banner"></div>
        <div class="perfil-avatar-wrap">
          <div class="perfil-avatar">{{ iniciales }}</div>
          <div class="perfil-badge">Estudiante LASIN</div>
        </div>
        <div class="perfil-nombre">
          <h2>{{ nombreCompleto }}</h2>
          <p>{{ perfil.correo_electronico }}</p>
        </div>

        <!-- Estadísticas reales de PostgreSQL -->
        <div class="perfil-stats">
          <div class="pstat">
            <span class="pstat-num">{{ statsLoading ? '…' : stats.activos }}</span>
            <span class="pstat-label">En Curso</span>
          </div>
          <div class="pstat-div"></div>
          <div class="pstat">
            <span class="pstat-num">{{ statsLoading ? '…' : stats.pendientes }}</span>
            <span class="pstat-label">Pendientes</span>
          </div>
          <div class="pstat-div"></div>
          <div class="pstat">
            <span class="pstat-num">{{ statsLoading ? '…' : stats.completados }}</span>
            <span class="pstat-label">Completados</span>
          </div>
        </div>

        <!-- Lista de cursos en curso -->
        <div class="rutas-section">
          <p class="rutas-title">Mis cursos activos</p>
          <div v-if="statsLoading" class="loading-mini">Cargando cursos...</div>
          <div v-else-if="cursosActivos.length === 0" class="empty-mini">Sin cursos activos actualmente</div>
          <div v-else class="ruta-item" v-for="c in cursosActivos" :key="c.id_inscripcion">
            <div class="ruta-info">
              <span>📚 {{ c.sigla || c.nombreCurso }}</span>
              <span class="badge-activo">Activo</span>
            </div>
            <p class="ruta-subtitle">{{ c.nombreCurso }}</p>
          </div>
        </div>
      </div>

      <!-- ── Tarjeta Derecha: Formulario y Contraseña ── -->
      <div class="card-datos">

        <!-- Formulario Datos Personales -->
        <h3>📋 Información personal</h3>
        <div class="form-grid">
          <div class="field">
            <label>Nombre(s)</label>
            <input v-model="perfil.nombre" :disabled="!editando" type="text" placeholder="Tu nombre"/>
          </div>
          <div class="field">
            <label>Apellido paterno</label>
            <input v-model="perfil.ape_paterno" :disabled="!editando" type="text" placeholder="Apellido paterno"/>
          </div>
          <div class="field">
            <label>Apellido materno</label>
            <input v-model="perfil.ape_materno" :disabled="!editando" type="text" placeholder="Apellido materno"/>
          </div>
          <div class="field">
            <label>Correo electrónico</label>
            <input v-model="perfil.correo_electronico" disabled type="email" title="El correo institucional no puede modificarse"/>
          </div>
          <div class="field">
            <label>Teléfono / Celular</label>
            <input v-model="perfil.telefono" :disabled="!editando" type="tel" placeholder="Ej: 78901234"/>
          </div>
          <div class="field">
            <label>Carnet de identidad (CI)</label>
            <input v-model="perfil.ci" :disabled="!editando" type="text" placeholder="Ej: 1234567"/>
          </div>
          <div class="field">
            <label>Fecha de nacimiento</label>
            <input v-model="perfil.fecha_nacimiento" :disabled="!editando" type="date"/>
          </div>
          <div class="field full">
            <label>Dirección</label>
            <input v-model="perfil.direccion" :disabled="!editando" type="text" placeholder="Ej: Av. Villazón Nro. 1995, Monoblock Central"/>
          </div>
        </div>

        <!-- Sección de Cambio de Contraseña -->
        <div class="password-section">
          <div class="password-header" @click="mostrarCambioPass = !mostrarCambioPass">
            <h3>🔐 Cambiar mi contraseña</h3>
            <span class="toggle-icon">{{ mostrarCambioPass ? '▲' : '▼' }}</span>
          </div>

          <div v-if="mostrarCambioPass" class="password-form">
            <div class="field">
              <label>Contraseña actual</label>
              <div class="input-pass-wrap">
                <input
                  :type="verActual ? 'text' : 'password'"
                  v-model="passActual"
                  placeholder="Escribe tu contraseña actual"
                />
                <button class="btn-ojo" @click="verActual = !verActual" type="button">
                  {{ verActual ? '🙈' : '👁️' }}
                </button>
              </div>
            </div>

            <div class="field">
              <label>Nueva contraseña</label>
              <div class="input-pass-wrap">
                <input
                  :type="verNueva ? 'text' : 'password'"
                  v-model="passNueva"
                  placeholder="Mínimo 6 caracteres"
                />
                <button class="btn-ojo" @click="verNueva = !verNueva" type="button">
                  {{ verNueva ? '🙈' : '👁️' }}
                </button>
              </div>
            </div>

            <div class="field">
              <label>Confirmar nueva contraseña</label>
              <div class="input-pass-wrap">
                <input
                  :type="verConfirm ? 'text' : 'password'"
                  v-model="passConfirm"
                  placeholder="Vuelve a escribir tu nueva contraseña"
                />
                <button class="btn-ojo" @click="verConfirm = !verConfirm" type="button">
                  {{ verConfirm ? '🙈' : '👁️' }}
                </button>
              </div>
            </div>

            <div class="alerta-error" v-if="errorPass">⚠️ {{ errorPass }}</div>
            <div class="alerta-exito" v-if="passGuardada">✅ Contraseña actualizada exitosamente.</div>

            <button class="btn-guardar" @click="cambiarContrasena" :disabled="cambiandoPass">
              {{ cambiandoPass ? '⏳ Actualizando...' : '🔐 Actualizar contraseña' }}
            </button>
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
import { usuariosService } from '../../services/usuarios'
import inscripcionService from '../../services/inscripcionService'
import horarioService from '../../services/horarioService'
import cursoService from '../../services/cursoService'

// ── Estados ──
const editando   = ref(false)
const guardando  = ref(false)
const guardado   = ref(false)
const errorMsg   = ref('')

// ── Contraseña ──
const mostrarCambioPass = ref(false)
const passActual   = ref('')
const passNueva    = ref('')
const passConfirm  = ref('')
const verActual    = ref(false)
const verNueva     = ref(false)
const verConfirm   = ref(false)
const cambiandoPass = ref(false)
const errorPass    = ref('')
const passGuardada = ref(false)

// ── Stats ──
const statsLoading  = ref(true)
const cursosActivos = ref([])
const stats = ref({ activos: 0, pendientes: 0, completados: 0 })

// ── Datos Perfil ──
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

let perfilSnapshot = {}

const nombreCompleto = computed(() => {
  const parts = [perfil.value.nombre, perfil.value.ape_paterno, perfil.value.ape_materno].filter(Boolean)
  return parts.length ? parts.join(' ') : 'Estudiante LASIN'
})

const iniciales = computed(() => {
  return [perfil.value.nombre, perfil.value.ape_paterno]
    .filter(Boolean)
    .map(s => s.trim().charAt(0).toUpperCase())
    .slice(0, 2).join('') || 'ES'
})

function setPerfilDesdeUsuario(u) {
  perfil.value.id_usuario         = u?.id_usuario ?? null
  perfil.value.nombre             = u?.nombre || ''
  perfil.value.ape_paterno        = u?.ape_paterno || ''
  perfil.value.ape_materno        = u?.ape_materno || ''
  perfil.value.correo_electronico = u?.correo_electronico || u?.email || ''
  perfil.value.telefono           = u?.celular || u?.telefono || ''
  perfil.value.direccion          = u?.direccion || ''
  perfil.value.ci                 = u?.ci || ''
  perfil.value.fecha_nacimiento   = u?.fecha_nacimiento || ''
}

async function cargarPerfil() {
  const local = authService.getUsuario()
  if (local) setPerfilDesdeUsuario(local)
  try {
    const fresco = await authService.refreshUsuario()
    setPerfilDesdeUsuario(fresco)
  } catch (e) {
    console.warn('[Perfil] No se pudo refrescar el usuario:', e)
  }
}

async function cargarStats() {
  statsLoading.value = true
  try {
    const idEstudiante = perfil.value.id_usuario || authService.getUsuario()?.id_usuario
    if (!idEstudiante) return

    const [resInsc, resCursos, resHorarios] = await Promise.all([
      inscripcionService.listarPorEstudiante(idEstudiante).catch(() => ({ data: [] })),
      cursoService.listar({ limit: 100 }).catch(() => ({ data: [] })),
      horarioService.listar({ limit: 100 }).catch(() => ({ data: [] }))
    ])

    const inscripciones  = resInsc.data || []
    const todosLosCursos = resCursos.data || []
    const todosHorarios  = resHorarios.data || []

    stats.value.activos     = inscripciones.filter(i => i.estado === 'activo').length
    stats.value.pendientes  = inscripciones.filter(i => i.estado === 'pendiente').length
    stats.value.completados = inscripciones.filter(i => i.estado === 'completado').length

    cursosActivos.value = inscripciones
      .filter(i => i.estado === 'activo')
      .map(insc => {
        const horario = todosHorarios.find(h => h.id_horario === insc.id_horario) || {}
        const curso   = todosLosCursos.find(c => c.id_curso === horario.id_curso) || {}
        return {
          id_inscripcion: insc.id_inscripcion,
          nombreCurso: curso.nombre || 'Curso LASIN',
          sigla: curso.sigla || ''
        }
      })
  } catch (e) {
    console.error('[Perfil] Error al cargar stats:', e)
  } finally {
    statsLoading.value = false
  }
}

async function guardarCambios() {
  errorMsg.value = ''
  guardado.value = false
  guardando.value = true

  if (!perfil.value.id_usuario) {
    errorMsg.value = 'No se pudo identificar al usuario.'
    guardando.value = false
    return
  }

  try {
    await usuariosService.actualizarUsuario(perfil.value.id_usuario, {
      nombre:           perfil.value.nombre,
      ape_paterno:      perfil.value.ape_paterno,
      ape_materno:      perfil.value.ape_materno,
      telefono:         perfil.value.telefono,
      direccion:        perfil.value.direccion,
      fecha_nacimiento: perfil.value.fecha_nacimiento || null,
    })
    editando.value = false
    guardado.value = true
    await authService.refreshUsuario()
    setPerfilDesdeUsuario(authService.getUsuario())
    setTimeout(() => (guardado.value = false), 3500)
  } catch (e) {
    errorMsg.value = e.response?.data?.detail || 'No se pudo guardar el perfil.'
  } finally {
    guardando.value = false
  }
}

function cancelarEdicion() {
  setPerfilDesdeUsuario(perfilSnapshot)
  editando.value = false
  errorMsg.value = ''
}

async function cambiarContrasena() {
  errorPass.value = ''
  passGuardada.value = false

  if (!passActual.value || !passNueva.value || !passConfirm.value) {
    errorPass.value = 'Por favor completa todos los campos de contraseña.'
    return
  }
  if (passNueva.value.length < 6) {
    errorPass.value = 'La nueva contraseña debe tener al menos 6 caracteres.'
    return
  }
  if (passNueva.value !== passConfirm.value) {
    errorPass.value = 'Las contraseñas nuevas no coinciden.'
    return
  }

  cambiandoPass.value = true
  try {
    await usuariosService.cambiarPasswordPropia(passActual.value, passNueva.value)
    passGuardada.value = true
    passActual.value = ''
    passNueva.value = ''
    passConfirm.value = ''
    setTimeout(() => {
      passGuardada.value = false
      mostrarCambioPass.value = false
    }, 3500)
  } catch (e) {
    errorPass.value = e.response?.data?.detail || 'Contraseña actual incorrecta o error en el servidor.'
  } finally {
    cambiandoPass.value = false
  }
}

onMounted(async () => {
  await cargarPerfil()
  perfilSnapshot = { ...perfil.value }
  await cargarStats()
})
</script>

<style scoped>
.top-bar { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; flex-wrap: wrap; gap: 14px; }
.top-bar h1 { font-size: 24px; font-weight: 700; color: #0f172a; }
.top-bar p { font-size: 14px; color: #64748b; margin-top: 3px; }

.top-actions { display: flex; gap: 10px; }
.btn-editar  { padding: 10px 20px; background: white; border: 1px solid #e2e8f0; border-radius: 8px; color: #0077b6; font-size: 13px; font-weight: 600; cursor: pointer; transition: all .2s; }
.btn-editar:hover { border-color: #00b4d8; color: #00b4d8; }
.btn-guardar { padding: 10px 20px; background: #0077b6; border: none; border-radius: 8px; color: white; font-size: 13px; font-weight: 600; cursor: pointer; transition: background .2s; }
.btn-guardar:hover:not(:disabled) { background: #005f92; }
.btn-guardar:disabled { opacity: .6; cursor: not-allowed; }
.btn-cancelar { padding: 10px 18px; background: white; border: 1px solid #fca5a5; border-radius: 8px; color: #dc2626; font-size: 13px; font-weight: 600; cursor: pointer; }
.btn-cancelar:hover { background: #fef2f2; }

.alerta-exito { padding: 12px 16px; background: #d1fae5; border: 1px solid #a7f3d0; color: #065f46; border-radius: 8px; font-size: 13px; margin-bottom: 16px; }
.alerta-error { padding: 12px 16px; background: #fef2f2; border: 1px solid #fecaca; color: #b91c1c; border-radius: 8px; font-size: 13px; margin-bottom: 16px; }

/* ── Grid Principal ── */
.perfil-grid { display: grid; grid-template-columns: 320px 1fr; gap: 24px; }

/* ── Card Izquierda ── */
.card-perfil { background: white; border: 1px solid #e2e8f0; border-radius: 14px; overflow: hidden; box-shadow: 0 1px 4px rgba(0,0,0,.04); }
.perfil-banner { height: 84px; background: linear-gradient(135deg, #0077b6, #00b4d8); }
.perfil-avatar-wrap { text-align: center; margin-top: -38px; position: relative; }
.perfil-avatar { width: 76px; height: 76px; border-radius: 50%; background: linear-gradient(135deg, #0077b6, #00b4d8); display: inline-flex; align-items: center; justify-content: center; font-size: 24px; font-weight: 800; color: white; border: 4px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
.perfil-badge { display: inline-block; background: #e0f2fe; border: 1px solid #bae6fd; border-radius: 100px; padding: 3px 12px; font-size: 10px; font-weight: 700; color: #0077b6; margin-top: 6px; text-transform: uppercase; letter-spacing: .5px; }
.perfil-nombre { text-align: center; padding: 10px 20px 16px; }
.perfil-nombre h2 { font-size: 18px; font-weight: 700; color: #0f172a; }
.perfil-nombre p { font-size: 12px; color: #64748b; margin-top: 2px; word-break: break-all; }

.perfil-stats { display: flex; border-top: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0; margin-bottom: 20px; }
.pstat { flex: 1; text-align: center; padding: 14px 6px; }
.pstat-num { display: block; font-size: 22px; font-weight: 800; color: #0077b6; }
.pstat-label { font-size: 10px; color: #64748b; text-transform: uppercase; letter-spacing: .5px; }
.pstat-div { width: 1px; background: #e2e8f0; align-self: center; height: 28px; }

.rutas-section { padding: 0 20px 20px; }
.rutas-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #475569; margin-bottom: 12px; }
.loading-mini, .empty-mini { font-size: 12px; color: #94a3b8; text-align: center; padding: 10px; }
.ruta-item { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px 12px; margin-bottom: 10px; }
.ruta-info { display: flex; justify-content: space-between; align-items: center; font-size: 13px; font-weight: 600; color: #1e293b; }
.ruta-subtitle { font-size: 11px; color: #64748b; margin-top: 3px; }
.badge-activo { background: #dcfce7; color: #166534; font-size: 11px; padding: 2px 8px; border-radius: 20px; font-weight: 700; }

/* ── Card Derecha ── */
.card-datos { background: white; border: 1px solid #e2e8f0; border-radius: 14px; padding: 28px; box-shadow: 0 1px 4px rgba(0,0,0,.04); }
.card-datos h3 { font-size: 15px; font-weight: 700; margin-bottom: 20px; color: #0f172a; }

.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 28px; }
.field.full { grid-column: 1 / -1; }
.field label { display: block; font-size: 11px; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: .8px; margin-bottom: 7px; }
.field input { width: 100%; padding: 11px 14px; background: white; border: 1px solid #e2e8f0; border-radius: 8px; color: #1e293b; font-size: 14px; outline: none; transition: all .2s; }
.field input:disabled { background: #f8fafc; color: #94a3b8; cursor: not-allowed; }
.field input:not(:disabled):focus { border-color: #00b4d8; box-shadow: 0 0 0 3px rgba(0,180,216,.1); }

/* ── Cambiar Contraseña ── */
.password-section { border-top: 1px solid #e2e8f0; padding-top: 22px; }
.password-header { display: flex; justify-content: space-between; align-items: center; cursor: pointer; user-select: none; }
.password-header:hover h3 { color: #0077b6; }
.toggle-icon { font-size: 12px; color: #94a3b8; }
.password-form { margin-top: 20px; display: flex; flex-direction: column; gap: 16px; }
.input-pass-wrap { position: relative; display: flex; }
.input-pass-wrap input { flex: 1; padding-right: 44px; }
.btn-ojo { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; font-size: 16px; padding: 0; line-height: 1; }

/* ── Responsive ── */
@media (max-width: 900px) {
  .perfil-grid { grid-template-columns: 1fr; }
  .form-grid { grid-template-columns: 1fr; }
}
</style>