<template>
  <div class="forgot-container">
    <div class="forgot-card">
      <h1 class="forgot-title">¿Olvidaste tu Contraseña?</h1>
      <p class="forgot-subtitle">Ingresa tu correo para recibir un enlace de recuperación</p>

      <form @submit.prevent="handleSolicitar">
        <!-- Email -->
        <div class="form-group">
          <label for="correo" class="form-label">Correo Electrónico *</label>
          <input
            id="correo"
            v-model="formData.correo"
            type="email"
            class="form-input"
            placeholder="Ej: usuario@example.com"
            required
          />
          <span v-if="errors.correo" class="error-message">{{ errors.correo }}</span>
        </div>

        <!-- Mensaje de error -->
        <div v-if="errorGeneral" class="alert alert-error">
          {{ errorGeneral }}
        </div>

        <!-- Mensaje de éxito -->
        <div v-if="successMessage" class="alert alert-success">
          {{ successMessage }}
          <p class="text-small">Revisa tu correo en los próximos minutos.</p>
        </div>

        <!-- Botones -->
        <div class="form-actions">
          <button
            type="submit"
            class="btn btn-primary"
            :disabled="isLoading || !!successMessage"
          >
            {{ isLoading ? 'Enviando...' : 'Enviar Enlace de Recuperación' }}
          </button>
          <router-link to="/login" class="btn btn-link">
            ← Volver al Login
          </router-link>
        </div>
      </form>

      <!-- Info -->
      <div class="info-box">
        <p>📧 Se enviará un link de recuperación a tu correo.</p>
        <p>⏰ El enlace expirará en 24 horas por seguridad.</p>
      </div>
    </div>
  </div>
</template>

<script>
import { authService } from '@/services/auth'

export default {
  name: 'ForgotPasswordView',
  data() {
    return {
      formData: {
        correo: ''
      },
      errors: {},
      errorGeneral: '',
      successMessage: '',
      isLoading: false
    }
  },
  methods: {
    async handleSolicitar() {
      this.errors = {}
      this.errorGeneral = ''
      this.successMessage = ''

      if (!this.formData.correo.trim()) {
        this.errors.correo = 'El correo es requerido'
        return
      }

      if (!this.formData.correo.includes('@')) {
        this.errors.correo = 'Ingresa un correo válido'
        return
      }

      this.isLoading = true
      try {
        const response = await authService.solicitarRecuperacion(this.formData.correo)
        this.successMessage = response.mensaje || '✅ Enlace de recuperación enviado. Revisa tu correo.'
      } catch (error) {
        this.errorGeneral = error.response?.data?.detail || 'Error al solicitar recuperación. Intenta nuevamente.'
        console.error('Error:', error)
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>

<style scoped>
.forgot-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: var(--color-bg);
  padding: 20px;
  font-family: var(--font-main);
}

.forgot-card {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-soft);
  padding: 40px;
  max-width: 420px;
  width: 100%;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.45);
}

.forgot-title {
  font-size: 26px;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 6px;
  text-align: center;
}

.forgot-subtitle {
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

.text-small {
  font-size: 12px;
  margin-top: 8px;
  color: var(--text-muted);
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
  margin: 6px 0;
  font-size: 12px;
  color: var(--text-muted);
}

@media (max-width: 480px) {
  .forgot-card {
    padding: 25px;
  }

  .forgot-title {
    font-size: 22px;
  }

  .btn {
    font-size: 13px;
  }
}
</style>