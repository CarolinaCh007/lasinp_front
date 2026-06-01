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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.forgot-card {
  background: white;
  border-radius: 10px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  padding: 40px;
  max-width: 400px;
  width: 100%;
}

.forgot-title {
  font-size: 28px;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
  text-align: center;
}

.forgot-subtitle {
  font-size: 14px;
  color: #666;
  text-align: center;
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
  font-size: 14px;
}

.form-input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
  transition: border-color 0.3s;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.error-message {
  display: block;
  color: #e74c3c;
  font-size: 12px;
  margin-top: 5px;
}

.alert {
  padding: 12px;
  border-radius: 5px;
  margin-bottom: 20px;
  font-size: 14px;
}

.alert-error {
  background-color: #ffe6e6;
  color: #c0392b;
  border: 1px solid #e74c3c;
}

.alert-success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #28a745;
}

.text-small {
  font-size: 12px;
  margin-top: 8px;
}

.form-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 25px 0;
}

.btn {
  padding: 12px 20px;
  border: none;
  border-radius: 5px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  text-decoration: none;
  text-align: center;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-link {
  background: transparent;
  color: #667eea;
  text-decoration: none;
  border: 1px solid #667eea;
}

.btn-link:hover {
  background: #f0f5ff;
}

.info-box {
  background: #f8f9fa;
  border-left: 4px solid #667eea;
  padding: 15px;
  border-radius: 5px;
  margin-top: 20px;
}

.info-box p {
  margin: 8px 0;
  font-size: 13px;
  color: #555;
}

@media (max-width: 480px) {
  .forgot-card {
    padding: 25px;
  }

  .forgot-title {
    font-size: 24px;
  }

  .btn {
    padding: 10px 15px;
    font-size: 13px;
  }
}
</style>
