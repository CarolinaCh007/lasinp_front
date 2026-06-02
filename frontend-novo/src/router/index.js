import { createRouter, createWebHistory } from 'vue-router'
import { authService } from '../services/auth.js'
import LoginView from '../views/LoginView.vue'
import PrincipalView from '../views/PrincipalView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/Principal' },
    { path: '/Principal', name: 'principal', component: PrincipalView },
    { path: '/login',     name: 'login',     component: LoginView },
    { path: '/registro-step1', name: 'registro-step1', component: () => import('../views/auth/RegistroStep1View.vue')},
    { path: '/registro-step2',name: 'registro-step2',component: () => import('../views/auth/RegistroStep2View.vue')},
    { path: '/completar-registro-docente', name: 'completar-registro-docente', component: () => import('../views/auth/CompletarRegistroDocenteView.vue')},
    { path: '/verify-email', name: 'verify-email',component: () => import('../views/auth/RegistroStep2View.vue')},
    { path: '/forgot-password',name: 'forgot-password',component: () => import('../views/auth/ForgotPasswordView.vue')},
    { path: '/reset-password', name: 'reset-password', component: () => import('../views/auth/ResetPasswordView.vue') },

    // ── Estudiante ──────────────────────────────────────
    { path: '/estudiante/dashboard', component: () => import('../views/estudiante/DashboardView.vue'), meta: { requiresAuth: true, rol: 'estudiante' } },
    { path: '/estudiante/cursos',    component: () => import('../views/estudiante/CursosView.vue'),    meta: { requiresAuth: true, rol: 'estudiante' } },
    { path: '/estudiante/historial', component: () => import('../views/estudiante/HistorialView.vue'), meta: { requiresAuth: true, rol: 'estudiante' } },
    { path: '/estudiante/perfil',    component: () => import('../views/estudiante/PerfilView.vue'),    meta: { requiresAuth: true, rol: 'estudiante' } },
    { path: '/estudiante/mis-cursos', component: () => import('../views/estudiante/Mis_CursosView.vue'), meta: { requiresAuth: true, rol: 'estudiante' } },

    // ── Docente ─────────────────────────────────────────
    { path: '/docente/dashboard',      component: () => import('../views/docente/DashboardView.vue'),      meta: { requiresAuth: true, rol: 'docente' } },
    { path: '/docente/calificaciones', component: () => import('../views/docente/CalificacionesView.vue'), meta: { requiresAuth: true, rol: 'docente' } },
    { path: '/docente/comunicados',    component: () => import('../views/docente/ComunicadosView.vue'),    meta: { requiresAuth: true, rol: 'docente' } },

    // ── Admin ────────────────────────────────────────────
    { path: '/admin/dashboard',    component: () => import('../views/admin/DashboardView.vue'),      meta: { requiresAuth: true, rol: 'admin' } },
    { path: '/admin/preinscritos', component: () => import('../views/admin/PreinscritosView.vue'),   meta: { requiresAuth: true, rol: 'admin' } },
    { path: '/admin/reportes',     component: () => import('../views/admin/ReportesView.vue'),       meta: { requiresAuth: true, rol: 'admin' } },

    // ── Superadmin ───────────────────────────────────────
    { path: '/superadmin/dashboard', name: 'DashboardSuperadmin', component: () => import('../views/superadmin/DashboardSuperadmin.vue'), meta: { requiresAuth: true, rol: 'superadmin' } },
    { path: '/superadmin/usuarios',  component: () => import('../views/superadmin/UsuariosView.vue'),  meta: { requiresAuth: true, rol: 'superadmin' } },
    { path: '/superadmin/cursos',    component: () => import('../views/superadmin/CursosAdmin.vue'),   meta: { requiresAuth: true, rol: 'superadmin' } },
    { path: '/superadmin/reportes',  component: () => import('../views/superadmin/ReportesView.vue'),  meta: { requiresAuth: true, rol: 'superadmin' } },
    { path: '/superadmin/auditoria', component: () => import('../views/superadmin/AuditoriaView.vue'), meta: { requiresAuth: true, rol: 'superadmin' } },
    { path: '/superadmin/perfil',    component: () => import('../views/superadmin/PerfilView.vue'),    meta: { requiresAuth: true, rol: 'superadmin' } }
  ]
})

router.beforeEach((to, from) => {
  if (to.meta.requiresAuth && !authService.estaAutenticado()) {
    return '/login'
  }
})

export default router