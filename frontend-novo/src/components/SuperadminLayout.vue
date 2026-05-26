<template>
  <div class="dashboard">
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
        <button class="btn-logout" @click="logout">
          <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1-2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Salir
        </button>
      </div>
    </aside>

    <div class="main">
      <header class="topbar">
        <div class="topbar-title">
          <h1>{{ pageTitle }}</h1>
          <p v-if="pageSubtitle" class="subtitle">{{ pageSubtitle }}</p>
        </div>
        <div class="header-actions">
          <slot name="header-actions" />
        </div>
      </header>

      <section class="content">
        <slot />
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
    label: 'Dashboard',
    route: '/superadmin/dashboard',
    icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>'
  },
  {
    label: 'Perfil',
    route: '/superadmin/Perfil',
    icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4z"/><path d="M6 20v-2a4 4 0 0 1 4-4h0a4 4 0 0 1 4 4v2"/></svg>'
  },
  {
    label: 'Cursos',
    route: '/superadmin/cursos',
    icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>'
  },
  {
    label: 'Usuarios',
    route: '/superadmin/usuarios',
    icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/></svg>'
  },
  {
    label: 'Reportes',
    route: '/superadmin/reportes',
    icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>'
  },
  {
    label: 'Auditoría',
    route: '/superadmin/Auditoria',
    icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12" y2="16"/></svg>'
  }
]

const pageSubtitle = ''

const isActive = (itemRoute) => route.path === itemRoute
const navigate = (path) => {
  if (route.path !== path) {
    router.push(path)
  }
}

const pageTitle = computed(() => {
  const currentItem = menuItems.find(item => item.route === route.path)
  return currentItem ? currentItem.label : 'Super Admin'
})

function logout() {
  router.push('/login')
}
</script>

<style scoped>
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

.dashboard {
  display: flex;
  min-height: 100vh;
  background: var(--color-bg);
  color: var(--color-text);
  font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
}

.sidebar {
  width: 260px;
  background: var(--color-sidebar-bg);
  border-right: 1px solid var(--color-border);
  padding: 24px 0;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  padding: 0 24px 24px;
  font-size: 18px;
  font-weight: 700;
  color: var(--color-primary);
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 0 16px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: var(--radius-md);
  color: var(--color-text-muted);
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: background 0.2s ease, color 0.2s ease;
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

.sidebar-footer {
  margin-top: auto;
  padding: 24px 20px 16px;
}

.footer-user-info {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  align-items: center;
}

.user-avatar {
  width: 42px;
  height: 42px;
  border-radius: 999px;
  background: var(--color-primary);
  color: white;
  display: grid;
  place-items: center;
  font-weight: 700;
}

.footer-user-text strong {
  display: block;
  font-size: 14px;
}

.footer-user-text span {
  font-size: 12px;
  color: var(--color-text-muted);
}

.btn-logout {
  width: 100%;
  border: none;
  background: transparent;
  color: var(--color-text);
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: background 0.2s ease;
}

.btn-logout:hover {
  background: var(--color-sidebar-hover);
}

.main {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 32px;
  background: var(--color-bg);
  border-bottom: 1px solid var(--color-border);
}

.topbar-title h1 {
  font-size: 22px;
  font-weight: 700;
  margin: 0;
}

.subtitle {
  margin-top: 4px;
  color: var(--color-text-muted);
  font-size: 14px;
}

.header-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.content {
  flex: 1;
  padding: 24px 32px;
}
</style>
