<template>
  <div class="dashboard">

    <!-- Barra superior para Móviles / Tablets -->
    <header class="mobile-header">
      <button class="hamburger-btn" @click="sidebarAbierto = !sidebarAbierto" aria-label="Abrir menú">
        <svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <line x1="3" y1="12" x2="21" y2="12"/>
          <line x1="3" y1="6" x2="21" y2="6"/>
          <line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
      </button>
      <div class="mobile-logo">
        <div class="logo-box-mini">L2</div>
        <strong>LASIN <span>Estudiante</span></strong>
      </div>
    </header>

    <!-- Fondo oscuro al abrir en celular -->
    <div 
      class="sidebar-overlay" 
      v-if="sidebarAbierto" 
      @click="sidebarAbierto = false"
    ></div>

    <!-- Sidebar Lateral Responsive -->
    <aside class="sidebar" :class="{ 'sidebar--open': sidebarAbierto }">
      <div class="sidebar-logo">
        <div class="logo-box">
          <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/>
            <path d="M2 17l10 5 10-5"/>
            <path d="M2 12l10 5 10-5"/>
          </svg>
        </div>
        <div>
          <strong>LASIN</strong>
          <span>Estudiante v2.0</span>
        </div>
      </div>

      <nav class="sidebar-nav">
        <router-link to="/estudiante/dashboard" class="nav-item" @click="sidebarAbierto = false">
          <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
          Dashboard
        </router-link>
        <router-link to="/estudiante/cursos" class="nav-item" @click="sidebarAbierto = false">
          <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
          Catálogo de Cursos
        </router-link>
        <router-link to="/estudiante/mis-cursos" class="nav-item" @click="sidebarAbierto = false">
          <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path d="M22 10L12 5 2 10l10 5 10-5z"/><path d="M6 12v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5"/></svg>
          Mis Cursos
        </router-link>
        <router-link to="/estudiante/historial" class="nav-item" @click="sidebarAbierto = false">
          <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
          Historial y Notas
        </router-link>
        <router-link to="/estudiante/perfil" class="nav-item" @click="sidebarAbierto = false">
          <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          Mi Perfil
        </router-link>
      </nav>

      <div class="sidebar-footer">
        <div class="user-info">
          <div class="user-avatar">{{ iniciales }}</div>
          <div>
            <strong>{{ nombreCompleto }}</strong>
            <span>Estudiante</span>
          </div>
        </div>
        <button class="btn-logout" @click="cerrarSesion">
          <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Salir
        </button>
      </div>
    </aside>

    <!-- Contenido de cada pantalla -->
    <main class="main">
      <slot />
    </main>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '../services/auth'

const router = useRouter()
const sidebarAbierto = ref(false)

const usuario = computed(() => authService.getUsuario())

const nombreCompleto = computed(() => {
  const u = usuario.value
  if (!u) return 'Estudiante'
  return [u.nombre, u.ape_paterno].filter(Boolean).join(' ')
})

const iniciales = computed(() => {
  const u = usuario.value
  if (!u) return 'ES'
  return [u.nombre, u.ape_paterno]
    .filter(Boolean)
    .map(s => s.charAt(0).toUpperCase())
    .slice(0, 2).join('')
})

function cerrarSesion() {
  authService.logout()
  router.push('/login')
}
</script>

<style scoped>
* { box-sizing: border-box; margin: 0; padding: 0; }

.dashboard {
  font-family: system-ui, -apple-system, 'Segoe UI', sans-serif;
  display: flex;
  min-height: 100vh;
  background: #f8fafc;
  color: #1e293b;
  position: relative;
  width: 100%;
}

/* ── Barra Móvil (Oculta en Desktop) ── */
.mobile-header {
  display: none;
}

/* ── Sidebar Desktop ── */
.sidebar {
  width: 260px;
  min-width: 260px;
  background: #ffffff;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  padding: 28px 20px;
  min-height: 100vh;
  z-index: 100;
  transition: transform 0.3s ease;
}

.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 36px;
  padding: 0 8px;
}

.logo-box {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #00b4d8, #0077b6);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.sidebar-logo strong {
  display: block;
  font-size: 15px;
  font-weight: 700;
  color: #1e293b;
}

.sidebar-logo span {
  font-size: 11px;
  color: #64748b;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 11px 14px;
  border-radius: 10px;
  color: #475569;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
}

.nav-item:hover {
  background: rgba(0, 180, 216, 0.08);
  color: #00b4d8;
}

.nav-item.router-link-active {
  background: rgba(0, 180, 216, 0.12);
  color: #00b4d8;
  font-weight: 600;
}

.sidebar-footer {
  border-top: 1px solid #e2e8f0;
  padding-top: 20px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #00b4d8, #0077b6);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  color: white;
  flex-shrink: 0;
}

.user-info strong {
  display: block;
  font-size: 13px;
  color: #0f172a;
}

.user-info span {
  font-size: 11px;
  color: #64748b;
}

.btn-logout {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 9px 14px;
  background: transparent;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  color: #1e293b;
  font-family: inherit;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-logout:hover {
  border-color: #ef4444;
  color: #ef4444;
  background: #fef2f2;
}

/* ── Main ── */
.main {
  flex: 1;
  padding: 36px 40px;
  overflow-y: auto;
  min-width: 0;
}

/* ── MÓVIL Y PANTALLAS PEQUEÑAS (<= 768px) ── */
@media (max-width: 768px) {
  .dashboard {
    flex-direction: column;
  }

  /* Barra superior móvil fija */
  .mobile-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 18px;
    background: #ffffff;
    border-bottom: 1px solid #e2e8f0;
    position: sticky;
    top: 0;
    z-index: 150;
  }

  .hamburger-btn {
    background: #0077b6;
    color: white;
    border: none;
    border-radius: 8px;
    width: 38px;
    height: 38px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 2px 6px rgba(0, 119, 182, 0.25);
  }

  .mobile-logo {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .logo-box-mini {
    width: 28px;
    height: 28px;
    background: linear-gradient(135deg, #00b4d8, #0077b6);
    color: white;
    font-size: 12px;
    font-weight: 800;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .mobile-logo strong {
    font-size: 14px;
    color: #1e293b;
  }

  .mobile-logo span {
    font-size: 11px;
    color: #0077b6;
    font-weight: 500;
  }

  /* Sidebar en móvil: flotante lateral */
  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    z-index: 300;
    transform: translateX(-100%);
    box-shadow: 4px 0 20px rgba(0, 0, 0, 0.15);
  }

  .sidebar--open {
    transform: translateX(0);
  }

  .sidebar-overlay {
    position: fixed;
    inset: 0;
    background: rgba(15, 23, 42, 0.45);
    backdrop-filter: blur(2px);
    z-index: 250;
  }

  .main {
    padding: 20px 16px;
  }
}
</style>