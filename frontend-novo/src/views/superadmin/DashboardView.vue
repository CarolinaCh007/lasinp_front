<template>

  <SuperadminLayout>
    <p>Bienvenido Super Admin</p>
  </SuperadminLayout>
</template>

<script setup>
import SuperadminLayout from '../../components/SuperadminLayout.vue'

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