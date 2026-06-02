<template>
  <div class="reset-container">
    <div class="reset-card">
      <h1 class="reset-title">Restablecer Contraseña</h1>
      <p class="reset-subtitle">Ingresa tu nueva contraseña</p>

      <!-- Si el token es inválido -->
      <div v-if="tokenInvalid" class="alert alert-error">
        <p>❌ El enlace de recuperación es inválido o ha expirado.</p>
        <p class="mt-10">Solicita un nuevo enlace.</p>
        <router-link to="/forgot-password" class="btn btn-primary mt-10">
          Solicitar Nuevo Enlace
        </router-link>
      </div>

      <!-- Formulario -->
      <form v-else @submit.prevent="handleRestablecer">
        <!-- Nueva Contraseña -->
        <div class="form-group">
          <label for="nueva_password" class="form-label">Nueva Contraseña *</label>
          <input
            id="nueva_password"
            v-model="formData.nueva_password"
            :type="mostrarPassword ? 'text' : 'password'"
            class="form-input"
            placeholder="Mínimo 8 caracteres, incluir mayúscula y número"
            required
          />
          <button
            type="button"
            class="btn-toggle-pass"
            @click="mostrarPassword = !mostrarPassword"
          >
            {{ mostrarPassword ? '🙈 Ocultar' : '👁️ Mostrar' }}
          </button>
          <span v-if="errors.nueva_password" class="error-message">{{ errors.nueva_password }}</span>
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

        <!-- Mensaje de error -->
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
            {{ isLoading ? 'Guardando...' : 'Cambiar Contraseña' }}
          </button>
          <router-link to="/login" class="btn btn-link">
            ← Volver al Login
          </router-link>
        </div>
      </form>

      <!-- Requisitos -->
      <div v-if="!tokenInvalid" class="info-box">
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
  name: 'ResetPasswordView',
  data() {
    return {
      token: '',
      formData: {
        nueva_password: '',
        confirmar_password: ''
      },
      errors: {},
      errorGeneral: '',
      successMessage: '',
      isLoading: false,
      tokenInvalid: false,
      mostrarPassword: false
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

      // Validar nueva contraseña
      if (!this.formData.nueva_password) {
        this.errors.nueva_password = 'La contraseña es requerida'
      } else if (this.formData.nueva_password.length < 8) {
        this.errors.nueva_password = 'La contraseña debe tener al menos 8 caracteres'
      } else if (!/[A-Z]/.test(this.formData.nueva_password)) {
        this.errors.nueva_password = 'La contraseña debe incluir al menos una mayúscula'
      } else if (!/\d/.test(this.formData.nueva_password)) {
        this.errors.nueva_password = 'La contraseña debe incluir al menos un número'
      }

      // Validar confirmación
      if (!this.formData.confirmar_password) {
        this.errors.confirmar_password = 'Debes confirmar la contraseña'
      } else if (this.formData.confirmar_password !== this.formData.nueva_password) {
        this.errors.confirmar_password = 'Las contraseñas no coinciden'
      }

      return Object.keys(this.errors).length === 0
    },

    async handleRestablecer() {
      this.errorGeneral = ''
      this.successMessage = ''

      if (!this.validarFormulario()) {
        return
      }

      this.isLoading = true
      try {
        const response = await authService.restablecerContrasena(
          this.token,
          this.formData.nueva_password
        )

        this.successMessage = response.mensaje || '✅ ¡Contraseña restablecida exitosamente! Redirigiendo...'

        // Redirigir después de 2 segundos
        setTimeout(() => {
          this.$router.push('/login')
        }, 5000)
      } catch (error) {
        this.errorGeneral = error.response?.data?.detail || 'Error al restablecer contraseña. Intenta nuevamente.'
        console.error('Error:', error)
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>

<style scoped>
.reset-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: var(--color-bg);
  padding: 20px;
  font-family: var(--font-main);
}

.reset-card {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-soft);
  padding: 40px;
  max-width: 450px;
  width: 100%;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.45);
}

.reset-title {
  font-size: 26px;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 6px;
  text-align: center;
}

.reset-subtitle {
  font-size: 13px;
  color: var(--text-muted);
  text-align: center;
  margin-bottom: 28px;
}

.form-group {
  margin-bottom: 18px;
  position: relative;
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
  padding-right: 110px;
  border: 1px solid var(--border-soft);
  border-radius: 8px;
  font-size: 14px;
  background: rgba(255, 255, 255, 0.04);
  color: var(--text-primary);
  transition: var(--transition-normal);
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: var(--color-cyan);
  box-shadow: 0 0 0 2px rgba(0, 212, 255, 0.15);
}

.btn-toggle-pass {
  position: absolute;
  right: 10px;
  top: 36px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-soft);
  color: var(--text-muted);
  cursor: pointer;
  font-size: 11px;
  font-weight: 600;
  padding: 5px 10px;
  border-radius: 6px;
  transition: var(--transition-normal);
}

.btn-toggle-pass:hover {
  color: var(--color-cyan);
  border-color: var(--color-cyan);
  background: rgba(0, 212, 255, 0.08);
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
  border-radius: 8px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: var(--transition-normal);
  text-align: center;
  border: none;
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
  margin: 6px 0 0 0;
  font-size: 12px;
  color: var(--text-muted);
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
  .reset-card {
    padding: 25px;
  }

  .reset-title {
    font-size: 22px;
  }

  .form-input {
    padding-right: 95px;
  }

  .btn {
    font-size: 13px;
  }
}
</style>
