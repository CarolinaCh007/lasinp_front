<template>
  <div class="registro-container">
    <div class="registro-card">
      <h1 class="registro-title">Completar Registro</h1>
      <p class="registro-subtitle">Paso 2: Datos Personales y Contraseña</p>

      <!-- Si el token es inválido -->
      <div v-if="tokenInvalid" class="alert alert-error">
        <p>❌ El enlace de verificación es inválido o ha expirado.</p>
        <p class="mt-10">Solicita un nuevo enlace de verificación.</p>
        <router-link to="/registro-step1" class="btn btn-primary mt-10">
          Volver a Registrarse
        </router-link>
      </div>

      <!-- Formulario -->
      <form v-else @submit.prevent="handleRegistroStep2">
        <!-- CI -->
        <div class="form-group">
          <label for="ci" class="form-label">Cédula de Identidad (CI) *</label>
          <input
            id="ci"
            v-model="formData.ci"
            type="text"
            class="form-input"
            placeholder="Ej: 123456789012345"
            maxlength="15"
            required
          />
          <span v-if="errors.ci" class="error-message">{{ errors.ci }}</span>
        </div>

        <!-- Contraseña -->
        <div class="form-group">
          <label for="password" class="form-label">Contraseña *</label>
          <input
            id="password"
            v-model="formData.password"
            type="password"
            class="form-input"
            placeholder="Mínimo 8 caracteres, incluir mayúscula y número"
            required
          />
          <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
        </div>

        <!-- Confirmar Contraseña -->
        <div class="form-group">
          <label for="confirmar_password" class="form-label">Confirmar Contraseña *</label>
          <input
            id="confirmar_password"
            v-model="formData.confirmar_password"
            type="password"
            class="form-input"
            placeholder="Repite tu contraseña"
            required
          />
          <span v-if="errors.confirmar_password" class="error-message">{{ errors.confirmar_password }}</span>
        </div>

        <!-- Celular -->
        <div class="form-group">
          <label for="celular" class="form-label">Celular</label>
          <input
            id="celular"
            v-model="formData.celular"
            type="tel"
            class="form-input"
            placeholder="Ej: +591 76543210"
            maxlength="20"
          />
        </div>

        <!-- Fecha de Nacimiento -->
        <div class="form-group">
          <label for="fecha_nacimiento" class="form-label">Fecha de Nacimiento</label>
          <input
            id="fecha_nacimiento"
            v-model="formData.fecha_nacimiento"
            type="date"
            class="form-input"
          />
        </div>

        <!-- Dirección -->
        <div class="form-group">
          <label for="direccion" class="form-label">Dirección</label>
          <textarea
            id="direccion"
            v-model="formData.direccion"
            class="form-input"
            placeholder="Ingresa tu dirección completa"
            rows="3"
          />
        </div>

        <!-- Institución -->
        <div class="institution-note">
          <p>¡El LASIN es para todos! No necesitas ser estudiante de la universidad para ingresar tu institución.</p>
        </div>
        <div class="form-group">
          <label for="institucion" class="form-label">Institución de Procedencia *</label>
          <input
            id="institucion"
            v-model="formData.institucion"
            type="text"
            class="form-input"
            placeholder="Ej: Universidad Mayor de San Andrés"
            maxlength="255"
            required
          />
          <span v-if="errors.institucion" class="error-message">{{ errors.institucion }}</span>
        </div>

        <!-- Sexo -->
        <div class="form-group">
          <label for="sexo" class="form-label">Sexo</label>
          <select v-model="formData.sexo" class="form-input">
            <option value="">Selecciona...</option>
            <option value="M">Masculino</option>
            <option value="F">Femenino</option>
            <option value="Otro">Otro</option>
          </select>
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
            {{ isLoading ? 'Guardando...' : 'Completar Registro' }}
          </button>
          <router-link to="/login" class="btn btn-link">
            ¿Ya tienes cuenta? Inicia sesión
          </router-link>
        </div>
      </form>

      <!-- Requisitos de contraseña -->
      <div class="info-box">
        <p><strong>Requisitos de Contraseña:</strong></p>
        <ul>
          <li>✓ Mínimo 8 caracteres</li>
          <li>✓ Incluir al menos una mayúscula</li>
          <li>✓ Incluir al menos un número</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { authService } from '@/services/auth'

export default {
  name: 'RegistroStep2View',
  data() {
    return {
      formData: {
        ci: '',
        password: '',
        confirmar_password: '',
        celular: '',
        fecha_nacimiento: '',
        direccion: '',
        sexo: '',
        institucion: ''
      },
      errors: {},
      errorGeneral: '',
      successMessage: '',
      isLoading: false,
      tokenInvalid: false
    }
  },
  mounted() {
    // Obtener el token de la URL
    const token = this.$route.query.token
    if (!token) {
      this.tokenInvalid = true
      return
    }
    this.token = token
  },
  methods: {
    validarFormulario() {
      this.errors = {}

      // Validar CI
      if (!this.formData.ci.trim()) {
        this.errors.ci = 'La CI es requerida'
      } else if (!/^\d+$/.test(this.formData.ci)) {
        this.errors.ci = 'La CI solo debe contener números'
      } else if (this.formData.ci.length > 15) {
        this.errors.ci = 'La CI no puede tener más de 15 dígitos'
      }

      // Validar contraseña
      const passwordPattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/
      if (!this.formData.password) {
        this.errors.password = 'La contraseña es requerida'
      } else if (!passwordPattern.test(this.formData.password)) {
        this.errors.password = 'La contraseña debe tener al menos 8 caracteres, incluir mayúscula, minúscula, número y carácter especial'
      }

      // Validar confirmación de contraseña
      if (!this.formData.confirmar_password) {
        this.errors.confirmar_password = 'Debes confirmar la contraseña'
      } else if (this.formData.confirmar_password !== this.formData.password) {
        this.errors.confirmar_password = 'Las contraseñas no coinciden'
      }

      // Validar institución
      if (!this.formData.institucion.trim()) {
        this.errors.institucion = 'La institución es requerida'
      }

      return Object.keys(this.errors).length === 0
    },

    async handleRegistroStep2() {
      this.errorGeneral = ''
      this.successMessage = ''

      if (!this.validarFormulario()) {
        return
      }

      this.isLoading = true
      try {
        const response = await authService.registroStep2(
          this.token,
          this.formData.ci,
          this.formData.password,
          this.formData.confirmar_password,
          this.formData.celular,
          this.formData.fecha_nacimiento,
          this.formData.direccion,
          this.formData.sexo,
          this.formData.institucion
        )

        this.successMessage = '✅ ¡Registro completado exitosamente! Redirigiendo...'
        
        // Redirigir después de 2 segundos
        setTimeout(() => {
          this.$router.push('/login')
        }, 3000)
      } catch (error) {
        this.errorGeneral = error.response?.data?.detail || 'Error al completar el registro. Intenta nuevamente.'
        console.error('Error en Paso 2:', error)
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
  max-width: 500px;
  width: 100%;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.45);
}

.registro-title {
  font-size: 26px;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 6px;
  text-align: center;
}

.registro-subtitle {
  font-size: 13px;
  color: var(--text-muted);
  text-align: center;
  margin-bottom: 28px;
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
  font-family: var(--font-main);
}

.form-input:focus {
  outline: none;
  border-color: var(--color-cyan);
  box-shadow: 0 0 0 2px rgba(0, 212, 255, 0.15);
}

textarea.form-input {
  resize: vertical;
}

.institution-note {
  padding: 12px 14px;
  background: rgba(0, 159, 255, 0.08);
  border: 1px solid rgba(0, 159, 255, 0.16);
  border-radius: 10px;
  margin-bottom: 14px;
  color: var(--text-primary);
  font-size: 13px;
}

.institution-note p {
  margin: 0;
  line-height: 1.45;
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

.info-box ul {
  margin: 10px 0 0 18px;
  font-size: 12px;
  color: var(--text-muted);
}

.info-box li {
  margin: 4px 0;
}

.mt-10 {
  margin-top: 10px;
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
