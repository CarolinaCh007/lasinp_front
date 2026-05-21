<template>
  <div class="dashboard">
    <!-- Barra lateral -->
    <aside class="sidebar">
      <div class="sidebar-header">
        <h2>LASIN 2.0</h2>
      </div>
      <nav class="sidebar-nav">
        <a
          v-for="item in menuItems"
          :key="item.label"
          href="#"
          class="nav-item"
          :class="{ active: isActive(item.route) }"
          @click.prevent="navigate(item.route)"
>

          <span class="nav-icon" v-html="item.icon"></span>
          <span>{{ item.label }}</span>
          
        </a>
      </nav>
      <div class="sidebar-footer">
        <div class="footer-user-info">
          <div class="user-avatar">SA</div>
          <div class="footer-user-text">
            <strong>Super Admin</strong>
            <span>Control total</span>
          </div>
        </div>
        <button class="btn-logout" @click="$router.push('/login')">
          <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1-2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Salir
        </button>
      </div>
    </aside>

    <!-- Contenido principal -->
    <div class="main">
      <header class="topbar">
        <h1>{{ pageTitle }}</h1>
        <div class="user-info">
          <span>Super Admin</span>
        </div>
      </header>
      <section class="content">
        <!-- Aquí puedes colocar gráficos, tablas, etc. -->
        <p>Bienvenido Super Admin</p>
        
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const menuItems = [
  {
    label: 'Dasboard',
    route: '/superadmin/dashboard',
    icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>'
  },
  {
    label: 'Perfil',
    route: '/superadmin/Perfil',
    icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>'
  },
  
  {
    label: 'Gestion de Cursos',
    route: '/superadmin/cursos',
    icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>'
  },
  {
    label: 'Gestion de Docentes',
    route: '/superadmin/Docentes',
    icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>'
  },
  {
    label: 'Gestion de Estudiantes',
    route: '/superadmin/estudiantes',
    icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>'
  },
  {
    label: 'Reportes',
    route: '/superadmin/reportes',
    icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>'
  }
]

// Determina si el ítem está activo según la ruta actual
function isActive(itemRoute) {
  return route.path === itemRoute
}

// Navega programáticamente
function navigate(path) {
  if (route.path !== path) {
    router.push(path)
  }
}

// Título dinámico basado en el label del ítem activo
const pageTitle = computed(() => {
  const currentItem = menuItems.find(item => item.route === route.path)
  return currentItem ? `Panel — ${currentItem.label}` : 'Panel'
})
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