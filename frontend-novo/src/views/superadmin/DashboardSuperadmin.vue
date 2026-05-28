<template>
  <SuperadminLayout>
    <div class="toolbar">
      <div class="header-titles">
        <h1 class="page-title">Panel de Control LASIN</h1>
        <p class="page-subtitle">Resumen general del sistema académico</p>
      </div>
      
      <button class="btn-primary" @click="cargarDatos" :disabled="cargando">
        <svg v-if="!cargando" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 2v6h-6"></path>
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
        </svg>
        {{ cargando ? 'Actualizando...' : 'Actualizar Datos' }}
      </button>
    </div>

    <div v-if="cargando" class="empty-message" style="margin-top: 40px;">
      <p>Calculando estadísticas del servidor...</p>
    </div>

    <div v-else class="dashboard-content">
      
      <div class="kpi-grid">
        <div class="kpi-card">
          <div class="kpi-icon primary-light">👥</div>
          <div class="kpi-info">
            <span class="kpi-label">Total Usuarios</span>
            <span class="kpi-value">{{ stats.totalUsuarios }}</span>
          </div>
        </div>
        
        <div class="kpi-card">
          <div class="kpi-icon warning-light">👨‍🏫</div>
          <div class="kpi-info">
            <span class="kpi-label">Docentes</span>
            <span class="kpi-value">{{ stats.totalDocentes }}</span>
          </div>
        </div>
        
        <div class="kpi-card">
          <div class="kpi-icon info-light">📚</div>
          <div class="kpi-info">
            <span class="kpi-label">Cursos Registrados</span>
            <span class="kpi-value">{{ stats.totalCursos }}</span>
          </div>
        </div>
        
        <div class="kpi-card">
          <div class="kpi-icon success-light">💰</div>
          <div class="kpi-info">
            <span class="kpi-label">Ingresos (Bs)</span>
            <span class="kpi-value">{{ stats.ingresosTotales.toFixed(2) }}</span>
          </div>
        </div>
      </div>

      <div class="content-grid">
        
        <div class="chart-card">
          <h2 class="card-title">Estado de los Cursos</h2>
          <div class="progress-list">
            
            <div class="progress-item">
              <div class="progress-header">
                <span>Activos</span>
                <span>{{ stats.cursosActivos }}</span>
              </div>
              <div class="progress-track">
                <div class="progress-fill fill-success" :style="{ width: calcularPorcentaje(stats.cursosActivos, stats.totalCursos) + '%' }"></div>
              </div>
            </div>
            
            <div class="progress-item">
              <div class="progress-header">
                <span>Pendientes / En Pausa</span>
                <span>{{ stats.cursosPendientes }}</span>
              </div>
              <div class="progress-track">
                <div class="progress-fill fill-warning" :style="{ width: calcularPorcentaje(stats.cursosPendientes, stats.totalCursos) + '%' }"></div>
              </div>
            </div>
            
            <div class="progress-item">
              <div class="progress-header">
                <span>Inactivos / Cerrados</span>
                <span>{{ stats.cursosInactivos }}</span>
              </div>
              <div class="progress-track">
                <div class="progress-fill fill-danger" :style="{ width: calcularPorcentaje(stats.cursosInactivos, stats.totalCursos) + '%' }"></div>
              </div>
            </div>
            
          </div>
        </div>

        <div class="table-container">
          <div class="table-header">
            <h2 class="card-title" style="margin: 0; border: none; padding: 20px 16px 0;">Cursos Destacados (Por Costo)</h2>
          </div>
          <table class="data-table">
            <thead>
              <tr>
                <th>Sigla</th>
                <th>Curso</th>
                <th>Costo (Bs)</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="curso in cursosTop" :key="curso.id_curso">
                <td><span class="badge-sigla">{{ curso.sigla || '-' }}</span></td>
                <td>{{ curso.nombre || '-' }}</td>
                <td style="font-weight: 600;">{{ parseFloat(curso.costo || 0).toFixed(2) }}</td>
              </tr>
              <tr v-if="cursosTop.length === 0">
                <td colspan="3" class="empty-message">No hay cursos registrados.</td>
              </tr>
            </tbody>
          </table>
        </div>
        
      </div>
    </div>
  </SuperadminLayout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import SuperadminLayout from '../../components/SuperadminLayout.vue'
import api from '../../services/api' // Tu conexión a Axios

const cargando = ref(true)
const cursosData = ref([])

const stats = ref({
  totalUsuarios: 0,
  totalDocentes: 0,
  totalCursos: 0,
  cursosActivos: 0,
  cursosPendientes: 0,
  cursosInactivos: 0,
  ingresosTotales: 0
})

const cargarDatos = async () => {
  cargando.value = true
  try {
    const [usuariosRes, docentesRes, cursosRes, pagosRes] = await Promise.all([
      api.get('/users/'),
      api.get('/academic/docentes/').catch(() => ({ data: [] })),
      api.get('/courses/cursos/'),
      api.get('/pagos/').catch(() => ({ data: [] }))
    ])

    const usuarios = usuariosRes.data || []
    const docentes = docentesRes.data || []
    const cursos = cursosRes.data || []
    const pagos = pagosRes.data || []

    cursosData.value = cursos

    stats.value.totalUsuarios = usuarios.length
    stats.value.totalDocentes = docentes.length
    stats.value.totalCursos = cursos.length
    
    stats.value.cursosActivos = cursos.filter(c => c.estado?.toLowerCase() === 'activo').length
    stats.value.cursosPendientes = cursos.filter(c => c.estado?.toLowerCase() === 'pendiente').length
    stats.value.cursosInactivos = cursos.filter(c => c.estado?.toLowerCase() === 'inactivo').length

    let sumaPagos = 0
    pagos.forEach(pago => {
      if (pago.estado?.toLowerCase() === 'completado' || pago.estado?.toLowerCase() === 'aprobado') {
        sumaPagos += parseFloat(pago.precio || 0)
      }
    })
    stats.value.ingresosTotales = sumaPagos

  } catch (error) {
    console.error("Error cargando el dashboard:", error)
  } finally {
    cargando.value = false
  }
}

const calcularPorcentaje = (valor, total) => {
  if (total === 0) return 0
  return Math.round((valor / total) * 100)
}

const cursosTop = computed(() => {
  return [...cursosData.value]
    .sort((a, b) => parseFloat(b.costo || 0) - parseFloat(a.costo || 0))
    .slice(0, 5) // Mostramos el top 5
})

onMounted(() => {
  cargarDatos()
})
</script>

<style>
/* Tus variables exactas para mantener la consistencia global */
:root {
  --color-bg: #ffffff;
  --color-surface: #f8f9fa;
  --color-primary: #2563eb;
  --color-primary-hover: #1d4ed8;
  --color-text: #1e293b;
  --color-text-muted: #64748b;
  --color-border: #e2e8f0;
  --color-sidebar-bg: #f1f5f9;
  --color-sidebar-hover: #e2e8f0;
  --color-active-bg: rgba(37, 99, 235, 0.1);
  --color-danger: #dc2626;
  --color-danger-hover: #b91c1c;
  --radius-md: 8px;
  --radius-lg: 12px;
}
</style>

<style scoped>
/* =============================================
   REUTILIZACIÓN EXACTA DE TUS CLASES
   ============================================= */
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}
.header-titles {
  display: flex;
  flex-direction: column;
}
.page-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--color-text);
  margin: 0;
}
.page-subtitle {
  color: var(--color-text-muted);
  font-size: 14px;
  margin: 4px 0 0 0;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  font-family: inherit;
}
.btn-primary:hover {
  background: var(--color-primary-hover);
}
.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.empty-message {
  text-align: center;
  color: var(--color-text-muted);
  padding: 24px;
}

.table-container {
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  height: fit-content;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}
.data-table th, .data-table td {
  text-align: left;
  padding: 12px 16px;
  border-bottom: 1px solid var(--color-border);
  font-size: 14px;
  color: var(--color-text);
}
.data-table th {
  background: var(--color-surface);
  font-weight: 600;
  color: var(--color-text-muted);
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.data-table tr:last-child td {
  border-bottom: none;
}
.data-table tbody tr:hover {
  background: var(--color-sidebar-hover);
}

/* =============================================
   CLASES ESPECÍFICAS DEL DASHBOARD
   ============================================= */
.dashboard-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding-bottom: 32px;
}

/* Grid de KPIs */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
}
.kpi-card {
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: box-shadow 0.2s;
}
.kpi-card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

.kpi-icon {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}
.primary-light { background: var(--color-active-bg); color: var(--color-primary); }
.warning-light { background: #fef3c7; color: #d97706; }
.info-light { background: #e0f2fe; color: #0284c7; }
.success-light { background: #dcfce3; color: #16a34a; }

.kpi-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.kpi-label {
  color: var(--color-text-muted);
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.kpi-value {
  color: var(--color-text);
  font-size: 24px;
  font-weight: 700;
  margin: 0;
}

/* Gráficos y Tablas Inferiores */
.content-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

@media (max-width: 900px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
}

.chart-card {
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 24px;
  height: fit-content;
}
.card-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text);
  margin: 0 0 20px 0;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--color-border);
}

/* Barras de Progreso (Adaptadas al Light Theme) */
.progress-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.progress-item {
  width: 100%;
}
.progress-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text);
}
.progress-track {
  width: 100%;
  height: 8px;
  background: var(--color-sidebar-bg);
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid var(--color-border);
}
.progress-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 1s ease-in-out;
}
.fill-success { background: #10b981; }
.fill-warning { background: #f59e0b; }
.fill-danger { background: var(--color-danger); }

/* Detalle especial para la tabla */
.badge-sigla {
  background: var(--color-active-bg);
  color: var(--color-primary);
  padding: 4px 8px;
  border-radius: var(--radius-md);
  font-size: 12px;
  font-weight: 600;
}
</style>