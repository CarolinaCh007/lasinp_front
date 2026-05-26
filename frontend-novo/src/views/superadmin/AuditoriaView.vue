<template>

  <SuperadminLayout>
    <template #header-actions>
      <button class="btn-refresh" @click="cargarLogs" :disabled="cargando">
        {{ cargando ? 'Actualizando...' : 'Actualizar' }}
      </button>
    </template>

    <div class="audit-header">
      <h2>Auditoría</h2>
      <p class="subtitle">Historial de acciones del sistema registradas en el log de auditoría.</p>
    </div>

    <div v-if="error" class="alert-error">{{ error }}</div>
    <div v-if="cargando" class="loader">Cargando registros...</div>

    <div v-else>
      <table class="audit-table" v-if="logs.length">
        <thead>
          <tr>
            <th>ID</th>
            <th>Acción</th>
            <th>Tabla afectada</th>
            <th>Usuario</th>
            <th>IP</th>
            <th>Fecha / Hora</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="log in logs" :key="log.id_log">
            <td>{{ log.id_log }}</td>
            <td>{{ log.accion }}</td>
            <td>{{ log.tabla_afectada || 'N/A' }}</td>
            <td>
              <span v-if="log.nombre_usuario">{{ log.nombre_usuario }}</span>
              <span v-else class="text-muted">ID {{ log.id_usuario || 'N/A' }}</span>
            </td>
            <td>{{ log.direccion_ip || 'N/A' }}</td>
            <td>{{ formatDate(log.fecha) }} {{ formatTime(log.hora) }}</td>
          </tr>
        </tbody>
      </table>

      <div v-else class="empty-state">
        No hay registros de auditoría disponibles.
      </div>
    </div>
  </SuperadminLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import SuperadminLayout from '../../components/SuperadminLayout.vue'
import { logsService } from '../../services/Logs.js'

const logs = ref([])
const cargando = ref(false)
const error = ref('')

function formatDate(value) {
  return value ? new Date(value).toLocaleDateString('es-ES') : ''
}

function formatTime(value) {
  return value ? new Date(value).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : ''
}

async function cargarLogs() {
  error.value = ''
  cargando.value = true
  try {
    const response = await logsService.getAll({ limit: 100 })
    logs.value = response.data
  } catch (err) {
    console.error('Error cargando logs:', err)
    error.value = 'No se pudo cargar el historial de auditoría. Intenta de nuevo.'
  } finally {
    cargando.value = false
  }
}

onMounted(() => cargarLogs())
</script>

<style>
/* =============================================
   VARIABLES DE COLOR (Sistema Darwin)
   Modifícalas aquí para cambiar todo el tema.
   ============================================= */
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
  --radius-md: 8px;
}
</style>

<style scoped>

.audit-header {
  margin-bottom: 20px;
}

.audit-header h2 {
  margin: 0 0 6px;
  font-size: 24px;
}

.audit-header .subtitle {
  margin: 0;
  color: var(--text-muted, #64748b);
}

.btn-refresh {
  border: none;
  background: #0f172a;
  color: #ffffff;
  padding: 10px 16px;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.btn-refresh:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.audit-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  box-shadow: 0 4px 14px rgba(15, 23, 42, 0.08);
}

.audit-table th,
.audit-table td {
  padding: 14px 16px;
  border-bottom: 1px solid #e5e7eb;
  text-align: left;
  font-size: 14px;
}

.audit-table th {
  background: #f8fafc;
  color: #1f2937;
  font-weight: 700;
}

.audit-table tbody tr:hover {
  background: #f1f5f9;
}

.text-muted {
  color: #6b7280;
}

.alert-error {
  background: #fee2e2;
  color: #b91c1c;
  padding: 14px 16px;
  border-radius: 12px;
  margin-bottom: 16px;
}

.loader,
.empty-state {
  padding: 18px 16px;
  background: #f8fafc;
  border-radius: 12px;
  color: #475569;
}
</style>

<style>
/* =============================================
   VARIABLES DE COLOR (Sistema Darwin)
   Modifícalas aquí para cambiar todo el tema.
   ============================================= */
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
  --radius-md: 8px;
}
</style>

<style scoped>

/* =============================================
   LAYOUT PRINCIPAL
   ============================================= */
.dashboard {
  display: flex;
  min-height: 100vh;
  background: var(--color-bg);
  color: var(--color-text);
  font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
}

/* =============================================
   BARRA LATERAL
   ============================================= */
.sidebar {
  width: 240px;
  background: var(--color-sidebar-bg);
  border-right: 1px solid var(--color-border);
  padding: 24px 0;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  padding: 0 20px 24px;
  font-size: 18px;
  font-weight: 700;
  color: var(--color-primary);
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 0 12px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  border-radius: var(--radius-md);
  color: var(--color-text-muted);
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
}

.nav-item:hover {
  background: var(--color-sidebar-hover);
  color: var(--color-text);
}

.nav-item.active {
  background: var(--color-active-bg);
  color: var(--color-primary);
  font-weight: 600;
}

.nav-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

/* =============================================
   ÁREA PRINCIPAL
   ============================================= */
.main {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* Barra superior */
.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 32px;
  background: var(--color-bg);
  border-bottom: 1px solid var(--color-border);
}

.topbar h1 {
  font-size: 20px;
  font-weight: 600;
  color: var(--color-text);
}

.user-info {
  font-size: 14px;
  color: var(--color-text-muted);
}

/* Contenido */
.content {
  flex: 1;
  padding: 32px;
  background: var(--color-surface);
  color: var(--color-text);
}

.sidebar-footer {
  margin-top: auto;
  padding: 20px 20px 28px;
  border-top: 1px solid var(--color-border);
}

.footer-user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.user-avatar {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  background: var(--color-primary);
  color: white;
  font-weight: 700;
}

.footer-user-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.footer-user-text strong {
  font-size: 14px;
}

.footer-user-text span {
  font-size: 12px;
  color: var(--color-text-muted);
}

.btn-logout {
  width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 14px;
  border: none;
  border-radius: 12px;
  background: #09fffb;
  color: #111827;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, transform 0.2s;
}

.btn-logout:hover {
  background: #093cbc;
  transform: translateY(-1px);
}
</style>