<template>
  <div class="registro-container">
    <div class="registro-card">
      <h1 class="registro-title">Crear Cuenta</h1>
      <p class="registro-subtitle">Paso 1: Información Básica</p>
      
      <form @submit.prevent="handleRegistroStep1">
        <!-- Nombre -->
        <div class="form-group">
          <label for="nombre" class="form-label">Nombre(s) *</label>
          <input
            id="nombre"
            v-model="formData.nombre"
            type="text"
            class="form-input"
            placeholder="Ej: Juan"
            maxlength="50"
            required
          />
          <span v-if="errors.nombre" class="error-message">{{ errors.nombre }}</span>
        </div>

        <!-- Apellido Paterno -->
        <div class="form-group">
          <label for="ape_paterno" class="form-label">Apellido Paterno *</label>
          <input
            id="ape_paterno"
            v-model="formData.ape_paterno"
            type="text"
            class="form-input"
            placeholder="Ej: González"
            maxlength="50"
            required
          />
          <span v-if="errors.ape_paterno" class="error-message">{{ errors.ape_paterno }}</span>
        </div>

        <!-- Apellido Materno -->
        <div class="form-group">
          <label for="ape_materno" class="form-label">Apellido Materno *</label>
          <input
            id="ape_materno"
            v-model="formData.ape_materno"
            type="text"
            class="form-input"
            placeholder="Ej: López"
            maxlength="50"
            required
          />
          <span v-if="errors.ape_materno" class="error-message">{{ errors.ape_materno }}</span>
        </div>

        <!-- Email -->
        <div class="form-group">
          <label for="correo_electronico" class="form-label">Correo Electrónico *</label>
          <input
            id="correo_electronico"
            v-model="formData.correo_electronico"
            type="email"
            class="form-input"
            placeholder="Ej: usuario@example.com"
            required
          />
          <span v-if="errors.correo_electronico" class="error-message">{{ errors.correo_electronico }}</span>
        </div>

        <!-- Mensaje de error general -->
        <div v-if="errorGeneral" class="alert alert-error">
          {{ errorGeneral }}
        </div>

        <!-- Mensaje de éxito -->
        <div v-if="successMessage" class="alert alert-success">
          {{ successMessage }}
        </div>

        <!-- Botones -->
        <div class="form-actions">
          <button
            type="submit"
            class="btn btn-primary"
            :disabled="isLoading"
          >
            {{ isLoading ? 'Cargando...' : 'Continuar' }}
          </button>
          <router-link to="/login" class="btn btn-link">
            ¿Ya tienes cuenta? Inicia sesión
          </router-link>
        </div>
      </form>

      <!-- Info -->
      <div class="info-box">
        <p>📧 Se enviará un enlace de verificación a tu correo electrónico.</p>
        <p>⏰ El enlace expirará en 24 horas.</p>
      </div>
    </div>
  </div>
</template>

<script>
import { authService } from '@/services/auth'

export default {
  name: 'RegistroStep1View',
  data() {
    return {
      formData: {
        nombre: '',
        ape_paterno: '',
        ape_materno: '',
        correo_electronico: ''
      },
      errors: {},
      errorGeneral: '',
      successMessage: '',
      isLoading: false
    }
  },
  methods: {
    async handleRegistroStep1() {
      this.errors = {}
      this.errorGeneral = ''
      this.successMessage = ''

      const namePattern = /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

      // Validación básica
      if (!this.formData.nombre.trim()) {
        this.errors.nombre = 'El nombre es requerido'
      } else if (!namePattern.test(this.formData.nombre.trim())) {
        this.errors.nombre = 'El nombre solo puede contener letras y espacios'
      }

      if (!this.formData.ape_paterno.trim()) {
        this.errors.ape_paterno = 'El apellido paterno es requerido'
      } else if (!namePattern.test(this.formData.ape_paterno.trim())) {
        this.errors.ape_paterno = 'El apellido paterno solo puede contener letras y espacios'
      }

      if (!this.formData.ape_materno.trim()) {
        this.errors.ape_materno = 'El apellido materno es requerido'
      } else if (!namePattern.test(this.formData.ape_materno.trim())) {
        this.errors.ape_materno = 'El apellido materno solo puede contener letras y espacios'
      }

      if (!this.formData.correo_electronico.trim()) {
        this.errors.correo_electronico = 'El correo electrónico es requerido'
      } else if (!emailPattern.test(this.formData.correo_electronico.trim())) {
        this.errors.correo_electronico = 'Ingresa un correo válido'
      }

      if (Object.keys(this.errors).length > 0) {
        return
      }

      this.isLoading = true
      try {
        const response = await authService.registroStep1(
          this.formData.nombre,
          this.formData.ape_paterno,
          this.formData.ape_materno,
          this.formData.correo_electronico
        )

        this.successMessage = response.mensaje || '✅ Pre-registro completado. Revisa tu correo.'
        
        // Guardar el correo en localStorage para referencia
        localStorage.setItem('pre_registro_email', this.formData.correo_electronico)
        
        // Redirigir después de 2 segundos
        setTimeout(() => {  
          this.$router.push('/login')
        }, 5000)
      } catch (error) {
        this.errorGeneral = error.response?.data?.detail || 'Error al registrarse. Intenta nuevamente.'
        console.error('Error en Paso 1:', error)
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>

<style scoped>
.registro-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: var(--color-bg);
  padding: 20px;
  font-family: var(--font-main);
}

.registro-card {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-soft);
  padding: 40px;
  max-width: 420px;
  width: 100%;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
}

.registro-title {
  font-size: 26px;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 5px;
  text-align: center;
}

.registro-subtitle {
  font-size: 13px;
  color: var(--text-muted);
  text-align: center;
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 18px;
}

.form-label {
  display: block;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 6px;
  font-size: 13px;
}

.form-input {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid var(--border-soft);
  border-radius: 8px;
  font-size: 14px;
  background: rgba(255, 255, 255, 0.04);
  color: var(--text-primary);
  transition: var(--transition-normal);
}

.form-input:focus {
  outline: none;
  border-color: var(--color-cyan);
  box-shadow: 0 0 0 2px rgba(0, 212, 255, 0.15);
}

.error-message {
  display: block;
  color: #f87171;
  font-size: 12px;
  margin-top: 5px;
}

.alert {
  padding: 12px 14px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 13px;
}

.alert-error {
  background: rgba(239, 68, 68, 0.08);
  border: 1px solid rgba(239, 68, 68, 0.2);
  color: #fca5a5;
}

.alert-success {
  background: rgba(16, 185, 129, 0.08);
  border: 1px solid rgba(16, 185, 129, 0.2);
  color: #6ee7b7;
}

.form-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 25px 0;
}

.btn {
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: var(--transition-normal);
  text-align: center;
}

.btn-primary {
  background: var(--color-cyan);
  color: #000;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 5px 20px rgba(0, 212, 255, 0.3);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-link {
  background: transparent;
  color: var(--color-cyan);
  border: 1px solid var(--border-soft);
}

.btn-link:hover {
  background: rgba(0, 212, 255, 0.08);
  border-color: var(--color-cyan);
}

.info-box {
  background: rgba(255, 255, 255, 0.03);
  border-left: 3px solid var(--color-cyan);
  padding: 14px;
  border-radius: 6px;
  margin-top: 20px;
}

.info-box p {
  margin: 6px 0;
  font-size: 12px;
  color: var(--text-muted);
}

@media (max-width: 480px) {
  .registro-card {
    padding: 25px;
  }

  .registro-title {
    font-size: 22px;
  }

  .btn {
    font-size: 13px;
  }
}
</style>