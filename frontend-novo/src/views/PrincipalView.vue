<template>
  <!-- ============ PARTÍCULAS DE FONDO ============ -->
  <div class="bg-particles" ref="particlesContainer" aria-hidden="true"></div>

  <!-- ============ NAVBAR ============ -->
  <nav class="navbar" :class="{ scrolled: isScrolled }" ref="navbar">
    <div class="navbar-inner">
      <a href="#" class="nav-logo" @click.prevent>
        <img src="@/assets/informatica-logo.png" alt="Logo" class="nav-logo-icon">
        <div class="nav-logo-text">
          Laboratorio Superior
          <span>de Informática</span>
        </div>
      </a>
      <ul class="nav-links" :class="{ open: menuOpen }" ref="navLinks">
        <li><a href="#inicio" @click="closeMenu">Inicio</a></li>
        <li><a href="#cursos" @click="closeMenu">Cursos</a></li>
        <li><a href="#nosotros" @click="closeMenu">Nosotros</a></li>
        <li><a href="#testimonios" @click="closeMenu">Testimonios</a></li>
        <li><a href="#contacto"  @click="closeMenu">Contacto</a></li>
       <li><router-link to="/registro-step1" class="btn-danger" @click="closeMenu">Registrate</router-link></li>
        <li><router-link to="/login" class="btn-primary" @click="closeMenu">Iniciar Sesión</router-link></li>
      </ul>
      <div class="hamburger" :class="{ active: menuOpen }" @click="toggleMenu" aria-label="Menú">
        <span></span><span></span><span></span>
      </div>
    </div>
  </nav>
  

  <!-- ============ HERO ============ -->
  <section class="hero" id="inicio">
    <div class="hero-bg-shape shape1"></div>
    <div class="hero-bg-shape shape2"></div>
    <div class="hero-bg-shape shape3"></div>
    <div class="hero-content">
      <div class="hero-text">
        <div class="hero-badge">
          <span class="dot"></span> Más de 15 años formando profesionales
        </div>
        <h1>
          Domina la <span class="highlight">informática</span> del futuro
        </h1>
        <br>
        <p>
          Cursos online y presenciales diseñados por expertos. Desde programación avanzada hasta inteligencia artificial, te llevamos al siguiente nivel con metodología práctica y certificación internacional.
        </p>
          <br>  
        <div class="hero-buttons">
          <a href="#cursos" class="btn btn-primary"> Ver Cursos</a>
          <a href="#contacto" class="btn btn-outline"> Solicitar Información</a>
        </div>
      </div>
      <div class="hero-visual">
  <img src="@/assets/fotosala.png" alt="Laboratorio">
</div>
    </div>
  </section>








  

  <!-- ============ CURSOS (TARJETAS MEJORADAS) ============ -->
<section class="section" id="cursos">
  <div class="section-inner">
    <div class="text-center">
      <span class="section-label">Nuestra Oferta Académica</span>
      <h2 class="section-title">Cursos Online & Presenciales</h2>
      <p class="section-subtitle mx-auto">Elige la modalidad que mejor se adapte a tu ritmo de vida. Todos nuestros programas incluyen mentoría personalizada y acceso a nuestra plataforma exclusiva.</p>
    </div>








    <div class="courses-grid">
      <!-- Tarjeta generada dinámicamente -->
      <div
        class="course-card"
          v-for="curso in cursosFiltrados"
          :key="curso.id"
          @click="verDetalle(curso)"
      >
        <!--<span
          class="tag"
          :class="curso.modalidad === 'Online' ? 'tag-online' : 'tag-offline'"
        >
          {{ curso.modalidad === 'Online' ? ' Online' : 'Presencial' }}
        </span>
        <div
          class="course-icon"
          :class="curso.modalidad === 'Online' ? 'online' : 'offline'"
        >
          {{ curso.icono }}
        </div>-->
        
        <h3>{{ curso.nombre }}</h3>
        <div class="course-meta">
          <span class="meta-sigla"><strong>Sigla:</strong> {{ curso.sigla }}</span>
          <span class="meta-fecha"><strong>Inicio:</strong> {{ curso.fecha_Inicio }}</span>
          <span class="meta-cupos"><strong>Cupos:</strong> {{ curso.cupos }}</span>
        </div>
        <div class="price">{{ curso.costo }} <small>Bs</small></div>
        <div class="course-actions">
          <button class="btn btn-outline btn-sm" @click="openModal(curso)"> Más detalles</button>
          
          <router-link to="/registro-step1" class="btn btn-primary btn-sm" @click="closeMenu">Pre-inscribirme</router-link>
        </div>
      </div>
    </div>
  </div>
</section>
<!-- ============ MODAL DE DETALLES ============ -->
<Transition name="modal">
  <div v-if="cursoSeleccionado" class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <button class="modal-close" @click="closeModal">&times;</button>
      <div class="modal-header">
        <span class="tag" :class="cursoSeleccionado.modalidad === 'Online' ? 'tag-online' : 'tag-offline'">
          {{ cursoSeleccionado.modalidad === 'Online' ? ' Online' : 'Presencial' }}
        </span>
        <h2>{{ cursoSeleccionado.nombre }}</h2>
        <div class="modal-sigla">Sigla: {{ cursoSeleccionado.sigla }}</div>
      </div>
      <div class="modal-body">
        <div class="detail-grid">
          <div class="detail-item">
            <span class="detail-label">Nivel</span>
            <span class="detail-value">{{ cursoSeleccionado.nivel }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Fecha Inicio</span>
            <span class="detail-value">{{ cursoSeleccionado.fecha_Inicio }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Fecha Fin</span>
            <span class="detail-value">{{ cursoSeleccionado.fecha_Fin }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Duración</span>
            <span class="detail-value">{{ cursoSeleccionado.duracion }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Estado</span>
            <span class="detail-value" :class="{ 'estado-activo': cursoSeleccionado.estado === 'Inscripciones abiertas' }">
              {{ cursoSeleccionado.estado }}
            </span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Costo</span>
            <span class="detail-value">{{ cursoSeleccionado.costo }} USD</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Cupos Totales</span>
            <span class="detail-value">{{ cursoSeleccionado.cuposTotales }}</span>
          </div>
        </div>
        <div class="modal-description">
          <h4>Descripción</h4>
          <p>{{ cursoSeleccionado.descripcion }}</p>
        </div>
        <div class="modal-actions">
          <button class="btn btn-primary" @click="preInscribir(cursoSeleccionado); closeModal()">✍️ Pre-inscribirme ahora</button>
          <button class="btn btn-outline" @click="closeModal">Cerrar</button>
        </div>
      </div>
    </div>
  </div>
</Transition>
  <!-- ============ ESTADÍSTICAS ============ -->
  <div class="stats-section">
    <div class="section-inner">
      <div class="stats-grid">
        <div class="stat-item">
          <div class="stat-number" ref="stat15000">0</div>
          <div class="stat-label">Estudiantes Egresados</div>
        </div>
        <div class="stat-item">
          <div class="stat-number" ref="stat98">0</div>
          <div class="stat-label">% de Inserción Laboral</div>
        </div>
        <div class="stat-item">
          <div class="stat-number" ref="stat45">0</div>
          <div class="stat-label">Cursos Activos</div>
        </div>
        <div class="stat-item">
          <div class="stat-number" ref="stat22">0</div>
          <div class="stat-label">Países con Presencia</div>
        </div>
      </div>
    </div>
  </div>

  <!-- ============ NOSOTROS ============ -->
  <section class="section" id="nosotros">
    <div class="section-inner">
      <div class="text-center">
        <span class="section-label">Quiénes Somos</span>
        <h2 class="section-title">El Laboratorio Superior de Informática</h2>
        <p class="section-subtitle mx-auto">Somos una institución líder en educación tecnológica con más de 15 años de trayectoria, combinando la excelencia académica con la innovación constante para formar a los profesionales que el mundo digital necesita.</p>
      </div>
      <div class="about-grid">
        <div class="about-card">
          <div class="about-icon"></div>
          <h3>Misión</h3>
          <p>Brindar educación tecnológica de vanguardia, accesible y de calidad, formando profesionales íntegros capaces de transformar el mundo digital.</p>
        </div>
        <div class="about-card">
          <div class="about-icon"></div>
          <h3>Visión</h3>
          <p>Ser el referente global en educación informática, expandiendo nuestras fronteras y metodologías a cada rincón del planeta.</p>
        </div>
        <div class="about-card">
          <div class="about-icon"></div>
          <h3>Valores</h3>
          <p>Excelencia, innovación, inclusión, ética profesional y aprendizaje continuo como pilares de nuestra comunidad.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- ============ TESTIMONIOS ============ -->
  <section class="section testimonios-section" id="testimonios">
    <div class="section-inner">
      <div class="text-center">
        <span class="section-label">Testimonios</span>
        <h2 class="section-title">Lo que dicen nuestros estudiantes</h2>
      </div>
      <div class="testimonials-grid">
        <div class="testimonial-card">
          <div class="quote-icon">"</div>
          <p>"Gracias al curso de Data Science conseguí trabajo en una startup de Silicon Valley. La metodología práctica y los mentores son de primer nivel. ¡Totalmente recomendado!"</p>
          <div class="testimonial-author">
            <div class="testimonial-avatar">MG</div>
            <div><strong>María Gutiérrez</strong><span>Data Scientist en TechCorp</span></div>
          </div>
        </div>
        <div class="testimonial-card">
          <div class="quote-icon">"</div>
          <p>"El curso presencial de Ciberseguridad superó mis expectativas. Los laboratorios están equipados con tecnología de punta y los instructores son profesionales activos del sector."</p>
          <div class="testimonial-author">
            <div class="testimonial-avatar" style="background:linear-gradient(135deg,#d4a853,#c8963e);">RL</div>
            <div><strong>Roberto Linares</strong><span>Security Analyst en Banco Central</span></div>
          </div>
        </div>
        <div class="testimonial-card">
          <div class="quote-icon">"</div>
          <p>"Estudié Desarrollo Web Full Stack online y en 3 meses ya estaba trabajando como freelancer. La plataforma es intuitiva y el soporte de la comunidad es increíble."</p>
          <div class="testimonial-author">
            <div class="testimonial-avatar" style="background:linear-gradient(135deg,#22c55e,#16a34a);">CP</div>
            <div><strong>Carmen Paredes</strong><span>Full Stack Developer Freelance</span></div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ============ CTA ============ -->
  <div class="cta-section" id="contacto">
    <span class="section-label">Da el primer paso</span>
    <h2 class="section-title">¿Listo para transformar tu carrera?</h2>
    <p style="color:var(--gray-600); max-width:550px; margin:0 auto 2rem; font-size:1.05rem;">
      Solicita información sin compromiso. Nuestros asesores académicos te guiarán para encontrar el curso perfecto para ti.
    </p>
    <div style="display:flex; gap:1rem; justify-content:center; flex-wrap:wrap;">
      <a 
  href="https://wa.me/59177862862" 
  target="_blank"
  class="btn btn-primary" 
  style="font-size:1.05rem; padding:0.95rem 2.4rem;"
>
  Solicitar Información
</a>
    </div>
  </div>

  <!-- ============ FOOTER ============ -->
  <footer class="footer">
    <div class="footer-grid">
      <div class="footer-col">
        <h4>Laboratorio Superior de Informática</h4>
        <p style="font-size:0.9rem; line-height:1.7;">Formando a los líderes tecnológicos del mañana desde 2009. Cursos online y presenciales con los más altos estándares de calidad.</p>
      </div>
      <div class="footer-col">
        <h4>Enlaces Rápidos</h4>
        <ul>
          <li><a href="#inicio">Inicio</a></li>
          <li><a href="#cursos">Cursos Online</a></li>
          <li><a href="#cursos">Cursos Presenciales</a></li>
          <li><a href="#nosotros">Sobre Nosotros</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Modalidades</h4>
        <ul>
          <li><a href="#">Online en Vivo</a></li>
          <li><a href="#">Presencial</a></li>
          <li><a href="#">Híbrido</a></li>
          <li><a href="#">Para Empresas</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Contacto</h4>
        <ul>
          <li><a href="#">📧 lasinbolivia@gmail.com</a></li>
          <li><a href="https://wa.me/59177862862" >📞 +591 77862862</a></li>
          <li><a href="https://www.google.com/maps/place/Plaza+del+Bicentenario,+Av.+Villaz%C3%B3n,+La+Paz/@-16.5050962,-68.1310741,438m/data=!3m1!1e3!4m6!3m5!1s0x915f2064dbe8d2d7:0x279c365d06503d5f!8m2!3d-16.5051809!4d-68.1301462!16s%2Fg%2F11b8t9t8mc?entry=ttu&g_ep=EgoyMDI2MDUyNi4wIKXMDSoASAFQAw%3D%3D"
             target="_blank">📍 Av. Villazón N° 1995, Plaza del Bicentenario</a></li>
          <li><a href="https://wa.me/59177862862" target="_blank">💬 WhatsApp</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      &copy; 2026 Laboratorio Superior de Informática. Todos los derechos reservados. | Diseñado con ❤️ para la comunidad tech.
    </div>
  </footer>
</template>

<script setup>
  // --- Datos de los cursos ---
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import cursoService from '../services/cursoService'
const router = useRouter()
const busqueda = ref('')
const categoriaActiva = ref('Todos')
const cursoSeleccionado = ref(null)
const loading = ref(true)
const errorMsg = ref('')
const handleImage = (event) => {
  const file = event.target.files[0]

  if (file) {
    console.log(file)
  }
}
const categorias = ['Todos', 'Desarrollo Web', 'Data Science', 'Ciberseguridad', 'Cloud', 'IA', 'Ofimática']

const cursos = ref([
  { id: 1, nombre: 'Introducción a Python', 
  sigla: 'PY-101',
  descripcion: 'Aprende Python desde cero enfocado en análisis de datos y visualización.', 
  docente: 'Lic. Mamani', 
  fechaInicio: '01/03/2025',
  fecha_Inicio: '01/03/2025',
  fecha_Fin: '30/05/2025',
  duracion: '3 meses', 
  nivel: 'Básico',
  modalidad: 'Online',
  cupos: 8, 
  cuposTotales: 8,
  precio: 350, 
  costo: 350,
  categoria: 'Data Science', 
  estado: 'Inscripciones abiertas' },

])

const cursosFiltrados = computed(() => {
  const texto = busqueda.value.trim().toLowerCase()
  return cursos.value.filter(curso => {
    const categoria = (curso.categoria || '').toString()
    const nombre = (curso.nombre || '').toString().toLowerCase()
    const descripcion = (curso.descripcion || '').toString().toLowerCase()
    const coincideCategoria = categoriaActiva.value === 'Todos' || categoria === categoriaActiva.value
    const coincideBusqueda = !texto || nombre.includes(texto) || descripcion.includes(texto)
    return coincideCategoria && coincideBusqueda
  })
})
function mapearCursoFromAPI(curso) {
  const cupos = (curso.cupo_maximo || 0) - (curso.cupo_usado || 0)
  const estado = cupos <= 0 ? 'lleno' : curso.estado || 'disponible'

  return {
    id: curso.id_curso || curso.id,
    nombre: curso.nombre_curso || curso.nombre,
    sigla: curso.sigla || curso.codigo || '',
    descripcion: curso.descripcion || '',
    docente: curso.docente?.nombre || 'Docente',
    fechaInicio: curso.fecha_inicio ? new Date(curso.fecha_inicio).toLocaleDateString('es-BO') : 'Por confirmar',
    fecha_Inicio: curso.fecha_inicio ? new Date(curso.fecha_inicio).toLocaleDateString('es-BO') : 'Por confirmar',
    fecha_Fin: curso.fecha_fin ? new Date(curso.fecha_fin).toLocaleDateString('es-BO') : 'Por confirmar',
    duracion: curso.duracion ? `${curso.duracion} semanas` : 'N/A',
    nivel: curso.nivel || 'General',
    modalidad: curso.modalidad || 'Online',
    cupos: curso.cupo_maximo || curso.cupos_totales || 0,
    cuposTotales: curso.cupo_maximo || curso.cupos_totales || 0,
    precio: curso.costo || curso.precio || 0,
    costo: curso.costo || curso.precio || 0,
    especialidad: curso.especialidad || 'Otros',
    estado: estado,
  }
}
async function cargarCursos() {
  loading.value = true
  errorMsg.value = ''
  try {
    const response = await cursoService.listarPublico()
    const dataPayload = Array.isArray(response)
      ? response
      : response.data || response.data?.data || response.data?.results || response.data?.cursos || []
    const cursosAPI = Array.isArray(dataPayload) ? dataPayload : []
    cursos.value = cursosAPI.map(mapearCursoFromAPI)
  } catch (error) {
    console.error('[PrincipalView] Error al cargar cursos:', error)
    errorMsg.value = 'No se pudieron cargar los cursos. Intenta más tarde.'
  } finally {
    loading.value = false
  }
  
}
onMounted(() => {
  cargarCursos()
})
function verDetalle(curso) {
  preinscribirse(curso)
}
function preinscribirse(curso) {
  if (curso.estado === 'activo') return
  cursoSeleccionado.value = curso
}

const openModal = (curso) => {
  cursoSeleccionado.value = curso
}

const closeModal = () => {
  cursoSeleccionado.value = null
}

// Simulación de pre-inscripción
const preInscribir = (curso) => {
  alert(`Pre-inscripción realizada para el curso: ${curso.nombre} (${curso.sigla})`)
  // Aquí puedes redirigir a un formulario o hacer una petición HTTP
}


// --- Estado del menú y scroll ---
const menuOpen = ref(false)
const isScrolled = ref(false)
const navbar = ref(null)
const navLinks = ref(null)

// --- Referencias para partículas y estadísticas ---
const particlesContainer = ref(null)
const stat15000 = ref(null)
const stat98 = ref(null)
const stat45 = ref(null)
const stat22 = ref(null)

let particleInterval = null

// --- Métodos ---
const toggleMenu = () => {
  menuOpen.value = !menuOpen.value
}
const closeMenu = () => {
  menuOpen.value = false
}

// --- Scroll listener ---
const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
}

// --- Partículas animadas ---
const createParticle = () => {
  if (!particlesContainer.value) return
  const particle = document.createElement('div')
  particle.classList.add('particle')
  const size = Math.random() * 8 + 3
  const colors = [
    'rgba(79,110,247,0.25)',
    'rgba(123,147,255,0.2)',
    'rgba(212,168,83,0.18)',
    'rgba(108,92,231,0.2)',
    'rgba(34,197,94,0.15)'
  ]
  particle.style.width = size + 'px'
  particle.style.height = size + 'px'
  particle.style.left = Math.random() * 100 + '%'
  particle.style.background = colors[Math.floor(Math.random() * colors.length)]
  particle.style.animationDuration = (Math.random() * 14 + 8) + 's'
  particle.style.animationName = Math.random() > 0.5 ? 'floatUp' : 'floatUpAlt'
  particle.style.animationDelay = Math.random() * 10 + 's'
  particlesContainer.value.appendChild(particle)

  const duration = parseFloat(particle.style.animationDuration) + parseFloat(particle.style.animationDelay)
  setTimeout(() => {
    if (particle.parentNode) particle.parentNode.removeChild(particle)
  }, duration * 1000 + 500)
}

const startParticles = () => {
  // Crear partículas iniciales escalonadas
  for (let i = 0; i < 30; i++) {
    setTimeout(createParticle, i * 300)
  }
  // Reponer periódicamente
  particleInterval = setInterval(() => {
    if (particlesContainer.value && particlesContainer.value.children.length < 40) {
      createParticle()
    }
  }, 2000)
}

// --- Contador de estadísticas ---
const countUp = (el, target) => {
  const duration = 2000
  const step = target / (duration / 16)
  let current = 0
  let suffix = ''
  if (target === 15000) suffix = '+'
  else if (target === 98) suffix = '%'

  const update = () => {
    current += step
    if (current >= target) {
      el.textContent = target.toLocaleString() + suffix
      return
    }
    el.textContent = Math.floor(current).toLocaleString() + (target === 15000 ? '+' : target === 98 ? '%' : '')
    requestAnimationFrame(update)
  }
  update()
}

const setupStatsObserver = () => {
  const statElements = [
    { ref: stat15000, target: 15000 },
    { ref: stat98, target: 98 },
    { ref: stat45, target: 45 },
    { ref: stat22, target: 22 }
  ]

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target
        const stat = statElements.find(s => s.ref.value === el)
        if (stat && !el.dataset.counted) {
          el.dataset.counted = 'true'
          countUp(el, stat.target)
        }
        observer.unobserve(el)
      }
    })
  }, { threshold: 0.6 })

  nextTick(() => {
    statElements.forEach(s => {
      if (s.ref.value) observer.observe(s.ref.value)
    })
  })
}

// --- Animación de tarjetas al hacer scroll ---
const setupCardsAnimation = () => {
  const cards = document.querySelectorAll('.course-card, .testimonial-card, .about-card')
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1'
        entry.target.style.transform = 'translateY(0)'
        observer.unobserve(entry.target)
      }
    })
  }, { threshold: 0.2, rootMargin: '0px 0px -40px 0px' })

  cards.forEach((card, index) => {
    card.style.opacity = '0'
    card.style.transform = 'translateY(30px)'
    card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
    card.style.transitionDelay = (index % 6) * 0.08 + 's'
    observer.observe(card)
  })
}

// --- Ciclo de vida ---
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  startParticles()
  setupStatsObserver()
  cargarCursos()
  nextTick(() => {
    setupCardsAnimation()
  })
  console.log('%c🚀 Laboratorio Superior de Informática %c| Página Principal Cargada',
    'font-weight:bold; font-size:1.1rem; color:#4f6ef7;',
    'color:#5a6080;')
  console.log('%c💡 Cursos Online & Presenciales · Diseño Profesional · Animaciones Fluidas',
    'color:#d4a853;')
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  if (particleInterval) clearInterval(particleInterval)
})
</script>

<style>
  /* ============ TARJETAS DE CURSOS (MEJORADAS) ============ */
.course-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
  font-size: 0.85rem;
  color: var(--gray-600);
}

.course-meta span {
  background: var(--gray-100);
  padding: 0.25rem 0.7rem;
  border-radius: 20px;
  display: inline-flex;
  align-items: center;
  gap: 0.2rem;
}

.course-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1.2rem;
}

.btn-sm {
  padding: 0.5rem 1.1rem;
  font-size: 0.85rem;
}

/* ============ MODAL ============ */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(6px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  padding: 20px;
}

.modal-content {
  width: 100%;
  max-width: 900px;
  max-height: 95vh;
  overflow-y: auto;
  background: var(--white);
  border-radius: 14px;
  border: 1px solid var(--border-soft);
  box-shadow: 0 20px 60px rgba(0,0,0,0.6);
  padding: 30px;
  position: relative;
}

/* BOTÓN CERRAR */
.modal-close {
  position: absolute;
  top: 15px;
  right: 18px;
  font-size: 26px;
  background: transparent;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
}

.modal-close:hover {
  color: var(--color-cyan);
}

/* HEADER */
.modal-header {
  margin-bottom: 20px;
}

.modal-header h2 {
  font-size: 24px;
  font-weight: 800;
  color: var(--text-primary);
}

.modal-sigla {
  font-size: 13px;
  color: var(--text-muted);
}

/* TAGS */
.tag {
  display: inline-block;
  font-size: 11px;
  padding: 4px 10px;
  border-radius: 20px;
  margin-bottom: 10px;
  font-weight: 600;
}

.tag-online {
  background: rgba(0, 212, 255, 0.15);
  color: var(--color-cyan);
}

.tag-offline {
  background: rgba(255, 255, 255, 0.08);
  color: var(--text-muted);
}

/* GRID */
.detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 15px;
  margin-bottom: 25px;
}

.detail-item {
  background: rgb(255, 255, 255);
  border: 1px solid var(--border-soft);
  padding: 12px;
  border-radius: 8px;
}

.detail-label {
  display: block;
  font-size: 11px;
  color: var(--text-muted);
}

.detail-value {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

/* ESTADO */
.estado-activo {
  color: #3a9a5d;
}

/* DESCRIPCIÓN */
.modal-description {
  margin-bottom: 25px;
}

.modal-description h4 {
  margin-bottom: 8px;
  font-size: 16px;
}

.modal-description p {
  font-size: 13px;
  color: var(--text-muted);
}

/* BOTONES */
.modal-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.btn-outline {
  background: transparent;
  border: 1px solid var(--border-soft);
  color: var(--text-primary);
}

.btn-outline:hover {
  border-color: var(--color-cyan);
  color: var(--color-cyan);
}

.detail-item {
  background: var(--gray-100);
  padding: 0.8rem;
  border-radius: var(--radius-sm);
}
.modal-enter-active,
.modal-leave-active {
  transition: all 0.25s ease;
}

.modal-enter-from {
  opacity: 0;
  transform: scale(0.95);
}

.modal-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
.detail-label {
  display: block;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--gray-600);
  margin-bottom: 0.2rem;
  font-weight: 600;
}

.detail-value {
  font-weight: 600;
  color: var(--primary);
}

.estado-activo {
  color: #22c55e;
}

.modal-description {
  margin-bottom: 2rem;
}

.modal-description h4 {
  font-family: 'Space Grotesk', sans-serif;
  margin-bottom: 0.5rem;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

/* Transición del modal */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
/* ============ ESTILOS GLOBALES ============ */
:root {
  --primary: #0a0e27;
  --secondary: #1a1f4e;
  --accent: #4f6ef7;
  --accent-glow: #ffffff;
  --gold: #d4a853;
  --gold-light: #f0d78c;
  --white: #ffffff;
  --gray-100: #f7f8fc;
  --gray-200: #eef0f8;
  --gray-300: #d5d9e8;
  --gray-600: #5a6080;
  --gray-800: #1e2240;
  --radius-sm: 10px;
  --radius: 16px;
  --radius-lg: 24px;
  --radius-xl: 32px;
  --shadow-sm: 0 2px 12px rgba(10, 14, 39, 0.06);
  --shadow: 0 8px 40px rgba(10, 14, 39, 0.1);
  --shadow-lg: 0 20px 60px rgba(10, 14, 39, 0.15);
  --shadow-gold: 0 10px 40px rgba(212, 168, 83, 0.25);
  --transition: 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
  font-size: 16px;
}

body {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  background: var(--white);
  color: var(--primary);
  line-height: 1.6;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* ============ PARTÍCULAS DE FONDO ============ */
.bg-particles {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.particle {
  position: absolute;
  border-radius: 50%;
  animation: floatUp linear infinite;
  opacity: 0;
  filter: blur(1px);
}

@keyframes floatUp {
  0% { transform: translateY(105vh) scale(0); opacity: 0; }
  5% { opacity: 1; }
  40% { opacity: 0.7; }
  90% { opacity: 0.1; }
  100% { transform: translateY(-15vh) scale(1.4); opacity: 0; }
}

@keyframes floatUpAlt {
  0% { transform: translateY(105vh) translateX(0) scale(0); opacity: 0; }
  8% { opacity: 0.9; }
  50% { transform: translateY(40vh) translateX(60px) scale(1.1); opacity: 0.5; }
  100% { transform: translateY(-15vh) translateX(-30px) scale(0.3); opacity: 0; }
}

/* ============ HEADER / NAVBAR ============ */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  background: rgba(148, 243, 222, 0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(254, 247, 247, 0.869);
  transition: all var(--transition);
  padding: 0 2rem;
}

.navbar.scrolled {
  box-shadow: var(--shadow-sm);
  background: rgba(255, 255, 255, 0.95);
}

.navbar-inner {
  max-width: 1300px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 72px;
}

.nav-logo {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  text-decoration: none;
  color: var(--primary);
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  font-size: 1.25rem;
  letter-spacing: -0.02em;
  transition: var(--transition);
}

.nav-logo:hover {
  transform: scale(1.03);
}

.nav-logo-icon {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-sm);
  overflow: hidden;

  display: flex;
  align-items: center;
  justify-content: center;
}
.nav-logo-icon img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}



@keyframes logoPulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.7); }
  50% { box-shadow: 0 0 0 16px rgba(123, 147, 255, 0); }
}

.nav-logo-text span {
  display: block;
  font-size: 0.65rem;
  font-weight: 400;
  color: var(--gray-600);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.nav-links {
  display: flex;
  list-style: none;
  gap: 2.2rem;
  align-items: center;
}

.nav-links a {
  text-decoration: none;
  color: var(--gray-800);
  font-weight: 500;
  font-size: 0.95rem;
  position: relative;
  transition: color var(--transition);
  letter-spacing: -0.01em;
}

.nav-links a::after {
  content: '';
  position: absolute;
  bottom: -6px;
  left: 0;
  width: 0;
  height: 2.5px;
  background: var(--accent);
  border-radius: 4px;
  transition: width var(--transition);
}


.nav-links a:hover::after {
  width: 100%;
}

.btn-nav {
  background: var(--primary);

  padding: 0.6rem 1.5rem;
  border-radius: 50px;
  font-weight: 600 !important;
  transition: all var(--transition) !important;
  letter-spacing: -0.01em;
  box-shadow: 0 4px 18px rgba(10, 14, 39, 0.25);
  white-space: nowrap;
}

.btn-nav::after {
  display: none !important;
}

/* Hamburguesa móvil */
.hamburger {
  display: none;
  flex-direction: column;
  gap: 6px;
  cursor: pointer;
  z-index: 1001;
  padding: 8px;
}

.hamburger span {
  width: 28px;
  height: 2.5px;
  background: var(--primary);
  border-radius: 4px;
  transition: all var(--transition);
}

.hamburger.active span:nth-child(1) {
  transform: rotate(45deg) translate(6px, 6px);
}

.hamburger.active span:nth-child(2) {
  opacity: 0;
}

.hamburger.active span:nth-child(3) {
  transform: rotate(-45deg) translate(6px, -6px);
}

/* ============ HERO ============ */
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: right;
  justify-content: right;
  padding: 7rem 5rem 9rem;
  overflow: hidden;
  background: linear-gradient(170deg, #f8faff 0%, #eef2ff 30%, #f7f8fc 70%, #ffffff 100%);
  
}

.hero-bg-shape {
  position: absolute;
  border-radius: 50%;
  filter: blur(120px);
  opacity: 0.5;
  pointer-events: none;
  animation: heroShapeFloat 8s ease-in-out infinite;
}

.hero-bg-shape.shape1 {
  width: 600px; height: 600px;
  background: rgba(79, 110, 247, 0.12);
  top: -15%; right: -10%;
}

.hero-bg-shape.shape2 {
  width: 450px; height: 450px;
  background: rgba(212, 168, 83, 0.1);
  bottom: -10%; left: -8%;
  animation-delay: -4s; animation-duration: 10s;
}

.hero-bg-shape.shape3 {
  width: 300px; height: 300px;
  background: rgba(123, 147, 255, 0.15);
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  animation-delay: -2s; animation-duration: 12s;
}

@keyframes heroShapeFloat {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(40px, -30px) scale(1.08); }
  66% { transform: translate(-25px, 20px) scale(0.94); }
}

.hero-content {
  position: relative;
  z-index: 2;
  max-width: 1400px;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.hero-text {
  animation: fadeInUp 0.9s ease-out;
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(79, 110, 247, 0.08);
  border: 1px solid rgba(79, 110, 247, 0.2);
  padding: 0.5rem 1.1rem;
  border-radius: 50px;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--accent);
  margin-bottom: 1.5rem;
  letter-spacing: 0.02em;
}

.hero-badge .dot {
  width: 8px;
  height: 8px;
  background: var(--accent);
  border-radius: 50%;
  animation: dotBlink 1.8s ease-in-out infinite;
}

@keyframes dotBlink {
  0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7); }
  50% { opacity: 0.4; box-shadow: 0 0 0 10px rgba(79, 110, 247, 0); }
}

.hero h1 {
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(2.6rem, 5.5vw, 4.2rem);
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.03em;
  color: var(--primary);
  margin-bottom: 1.2rem;
}

.hero h1 .highlight {
  background: linear-gradient(135deg, var(--accent), #030303);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero p {
  font-size: 1.2rem;
  color: var(--gray-600);
  max-width: 500px;
  margin-bottom: 2.2rem;
  line-height: 1.7;
}

.hero-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.85rem 2rem;
  border-radius: 50px;
  font-weight: 600;
  font-size: 1rem;
  text-decoration: none;
  cursor: pointer;
  border: none;
  transition: all var(--transition);
  letter-spacing: -0.01em;
  white-space: nowrap;
}

.btn-primary {
  background: var(--primary);
  color: var(--white);
}

.btn-primary:hover {

  transform: translateY(-3px);
}

.btn-outline {
  background: transparent;
  color: var(--primary);
  border: 2px solid var(--gray-300);
}

.btn-outline:hover {
  border-color: var(--primary);
  background: rgba(10, 14, 39, 0.03);
  transform: translateY(-3px);
}

.btn-gold {
  background: linear-gradient(135deg, var(--gold), #c8963e);

  box-shadow: var(--shadow-gold);
}

.btn-gold:hover {
  box-shadow: 0 16px 45px rgba(212, 168, 83, 0.45);
  transform: translateY(-3px);
}

/* Hero visual */
.hero-visual {
  position: relative;
  animation: fadeInUp 0.9s ease-out 0.2s both;
  display: flex;
  align-items: right;
  justify-content: right;
  min-height: 420px;
}

.hero-orb {
  width: 320px;
  height: 320px;
  background: radial-gradient(circle, rgba(79, 110, 247, 0.2) 0%, rgba(123, 147, 255, 0.05) 50%, transparent 70%);
  border-radius: 50%;
  position: absolute;
  animation: orbPulse 4s ease-in-out infinite;
}

@keyframes orbPulse {
  0%, 100% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.2); opacity: 1; }
}

.floating-card {
  position: absolute;
  background: rgba(0,212,255,0.06);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(19, 45, 100, 0.6);
  border-radius: var(--radius);
  padding: 1.2rem 1.5rem;
  box-shadow: var(--shadow-lg);
  display: flex;
  align-items: center;
  gap: 0.8rem;
  animation: floatCard 6s ease-in-out infinite;
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--primary);
  white-space: nowrap;
}

.floating-card.card1 { top: 5%; right: 5%; animation-delay: 0s; }
.floating-card.card2 { bottom: 15%; left: 0%; animation-delay: -3s; }
.floating-card.card3 { top: 40%; left: 10%; animation-delay: -1.5s; animation-duration: 7s; }

.floating-card .fc-icon {
  width: 42px; height: 42px;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  flex-shrink: 0;
}

.fc-icon.blue { background: rgba(79, 110, 247, 0.12); }
.fc-icon.gold { background: rgba(212, 168, 83, 0.15); }
.fc-icon.green { background: rgba(34, 197, 94, 0.12); }

@keyframes floatCard {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  25% { transform: translateY(-18px) rotate(1deg); }
  50% { transform: translateY(-6px) rotate(-0.5deg); }
  75% { transform: translateY(-22px) rotate(0.5deg); }
}

/* ============ SECCIONES GENERALES ============ */
.section {
  position: relative;
  z-index: 1;
  padding: 6rem 2rem;
}

.section-inner {
  max-width: 1300px;
  margin: 0 auto;
}

.section-label {
  display: inline-block;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--accent);
  margin-bottom: 0.6rem;
}

.section-title {
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 700;
  letter-spacing: -0.03em;
  color: var(--primary);
  margin-bottom: 0.8rem;
  line-height: 1.15;
}

.section-subtitle {
  font-size: 1.1rem;
  color: var(--gray-600);
  max-width: 600px;
  margin-bottom: 3rem;
}

.text-center { text-align: center; }
.mx-auto { margin-left: auto; margin-right: auto; }

/* ============ TARJETAS DE CURSOS ============ */
.courses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: 1.8rem;
}

.course-card {
  background: rgb(202, 202, 202);
  border-radius: var(--radius-lg);
  padding: 2rem;
  border: 1px solid var(--gray-200);
  transition: all var(--transition);
  position: relative;
  overflow: hidden;
  cursor: pointer;
  box-shadow: var(--shadow-sm);
}

.course-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-lg);
  border-color: transparent;
}

.course-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 4px;
  background: linear-gradient(90deg, var(--accent), #6c5ce7);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform var(--transition);
}

.course-card:hover::before {
  transform: scaleX(1);
}

.course-card.gold-border::before {
  background: linear-gradient(90deg, var(--gold), var(--gold-light));
}

.course-icon {
  width: 56px; height: 56px;
  border-radius: var(--radius);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.6rem;
  margin-bottom: 1.2rem;
  transition: all var(--transition);
}

.course-card:hover .course-icon {
  transform: scale(1.1) rotate(-5deg);
}

.course-icon.online { background: rgba(79, 110, 247, 0.1); }
.course-icon.offline { background: rgba(212, 168, 83, 0.12); }

.course-card .tag {
  display: inline-block;
  padding: 0.3rem 0.9rem;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.8rem;
}

.tag-online { background: rgba(79, 110, 247, 0.1); color: var(--accent); }
.tag-offline { background: rgba(212, 168, 83, 0.15); color: #a07828; }

.course-card h3 {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  letter-spacing: -0.02em;
}

.course-card p {
  color: var(--gray-600);
  font-size: 0.95rem;
  margin-bottom: 1.2rem;
  line-height: 1.6;
}

.course-features {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  margin-bottom: 1.5rem;
}

.course-features li {
  font-size: 0.8rem;
  color: var(--gray-600);
  background: var(--gray-100);
  padding: 0.35rem 0.8rem;
  border-radius: 50px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.course-card .price {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--primary);
}

.course-card .price small {
  font-size: 0.9rem;
  font-weight: 400;
  color: var(--gray-600);
}

/* ============ ESTADÍSTICAS ============ */
.stats-section {
  background: var(--primary);
  color: #fff;
  padding: 4rem 2rem;
  position: relative;
  z-index: 1;
  overflow: hidden;
}

.stats-section::before {
  content: '';
  position: absolute;
  width: 500px; height: 500px;
  background: rgba(79, 110, 247, 0.15);
  border-radius: 50%;
  top: -30%; right: -10%;
  animation: orbPulse 8s ease-in-out infinite;
  pointer-events: none;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  text-align: center;
  position: relative;
  z-index: 2;
}

.stat-item .stat-number {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 3rem;
  font-weight: 700;
  letter-spacing: -0.03em;
}

.stat-item .stat-label {
  font-size: 0.9rem;
  opacity: 0.75;
  margin-top: 0.3rem;
}

/* ============ NOSOTROS ============ */
.about-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.about-card {
  background: #fff;
  padding: 2rem;
  border-radius: var(--radius-lg);
  border: 1px solid var(--gray-200);
  text-align: center;
  transition: all var(--transition);
  cursor: default;
}

.about-card:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadow-lg);
}

.about-icon {
  font-size: 3rem;
  margin-bottom: 0.8rem;
}

.about-card h3 {
  font-family: 'Space Grotesk', sans-serif;
  margin-bottom: 0.5rem;
}

.about-card p {
  color: var(--gray-600);
  font-size: 0.95rem;
}

/* PARA LA IMAGEN PRINCIPAL */
.hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 100vh;
  overflow: hidden;
}

/* LADO DERECHO */
.hero-visual {
  position: absolute;
  top: 0;
  right: 0;
  width: 60%;
  height: 100vh;
  overflow: hidden;
}

/* IMAGEN */
.hero-visual img {
  width: 100%;
  height: 90%;
  object-fit: cover;

  mask-image: linear-gradient(
    to left,
    rgba(0,0,0,1) 60%,
    rgba(0,0,0,0.7) 55%,
    rgba(0,0,0,0.3) 50%,
    rgba(0,0,0,0)
  );

  -webkit-mask-image: linear-gradient(
    to left,
    rgba(0,0,0,1) 60%,
    rgba(0,0,0,0.7) 80%,
    rgba(0,0,0,0.3) 90%,
    rgba(0,0,0,0)
  );
}

/* ============ TESTIMONIOS ============ */
.testimonios-section {
  background: var(--gray-100);
}

.testimonials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.testimonial-card {
  background: #fff;
  border-radius: var(--radius-lg);
  padding: 2rem;
  border: 1px solid var(--gray-200);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition);
  position: relative;
}

.testimonial-card:hover {
  box-shadow: var(--shadow);
  transform: translateY(-4px);
}

.testimonial-card .quote-icon {
  font-size: 3rem;
  color: var(--accent);
  opacity: 0.2;
  position: absolute;
  top: 1rem; right: 1.5rem;
  font-family: serif;
  line-height: 1;
}

.testimonial-card p {
  color: var(--gray-800);
  font-style: italic;
  margin-bottom: 1.2rem;
  line-height: 1.7;
  position: relative;
  z-index: 1;
}

.testimonial-author {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.testimonial-avatar {
  width: 46px; height: 46px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--accent), #6c5ce7);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 700;
  font-size: 1.1rem;
  flex-shrink: 0;
}

.testimonial-author strong {
  display: block;
  font-size: 0.95rem;
  color: var(--primary);
}

.testimonial-author span {
  font-size: 0.8rem;
  color: var(--gray-600);
}

/* ============ CTA ============ */
.cta-section {
  background: linear-gradient(160deg, #f0f3ff 0%, #e8ecff 40%, #fdfdff 100%);
  border-radius: var(--radius-xl);
  margin: 2rem;
  padding: 4rem 3rem;
  text-align: center;
  position: relative;
  overflow: hidden;
  z-index: 1;
}

.cta-section::after {
  content: '';
  position: absolute;
  width: 350px; height: 350px;
  background: rgba(212, 168, 83, 0.08);
  border-radius: 50%;
  bottom: -20%; right: -10%;
  animation: orbPulse 6s ease-in-out infinite;
  pointer-events: none;
}

/* ============ FOOTER ============ */
.footer {
  background: var(--primary);
  color: #c5c9e0;
  padding: 5rem 2rem 2rem;
  position: relative;
  z-index: 1;
}

.footer-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 2.5rem;
  max-width: 1300px;
  margin: 0 auto 3rem;
}

.footer-col h4 {
  color: #fff;
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 600;
  margin-bottom: 1rem;
  font-size: 1rem;
  letter-spacing: -0.01em;
}

.footer-col ul {
  list-style: none;
}

.footer-col ul li {
  margin-bottom: 0.5rem;
}

.footer-col ul li a {
  color: #9ca0b8;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color var(--transition);
}

.footer-col ul li a:hover {
  color: #fff;
}

.footer-bottom {
  max-width: 1300px;
  margin: 0 auto;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 1.5rem;
  text-align: center;
  font-size: 0.85rem;
  color: #7a7f99;
}


/* ============ RESPONSIVE ============ */
@media (max-width: 968px) {
  .hero-content {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 2rem;
  }
  .hero p {
    margin-left: auto;
    margin-right: auto;
  }
  .hero-buttons {
    justify-content: center;
  }
  .hero-visual {
    min-height: 300px;
    order: -1;
  }
  .hero-orb {
    width: 220px;
    height: 220px;
  }
  .floating-card {
    font-size: 0.75rem;
    padding: 0.8rem 1rem;
  }
  .floating-card .fc-icon {
    width: 32px;
    height: 32px;
    font-size: 1rem;
  }
  .nav-links {
    position: fixed;
    top: 0;
    right: -100%;
    width: 280px;
    height: 100vh;
    background: #fff;
    flex-direction: column;
    padding: 6rem 2rem 2rem;
    gap: 1.5rem;
    transition: right var(--transition);
    box-shadow: -10px 0 40px rgba(0,0,0,0.1);
  }
  .nav-links.open {
    right: 0;
  }
  .hamburger {
    display: flex;
  }
  .cta-section {
    margin: 1rem;
    padding: 2.5rem 1.5rem;
    border-radius: var(--radius-lg);
  }
  .section {
    padding: 3.5rem 1.2rem;
  }
  .courses-grid {
    grid-template-columns: 1fr;
  }
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .hero h1 {
    font-size: 2rem;
  }
  .hero p {
    font-size: 1rem;
  }
  .btn {
    padding: 0.7rem 1.4rem;
    font-size: 0.9rem;
  }
  .stats-grid {
    grid-template-columns: 1fr 1fr;
    gap: 1.2rem;
  }
  .stat-item .stat-number {
    font-size: 2.2rem;
  }
  .floating-card.card2,
  .floating-card.card3 {
    display: none;
  }
}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999; /* 🔥 clave */
}
</style>