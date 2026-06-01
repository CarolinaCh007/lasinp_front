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
        }, 2000)
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.reset-card {
  background: white;
  border-radius: 10px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  padding: 40px;
  max-width: 450px;
  width: 100%;
}

.reset-title {
  font-size: 28px;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
  text-align: center;
}

.reset-subtitle {
  font-size: 14px;
  color: #666;
  text-align: center;
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 20px;
  position: relative;
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
  padding-right: 120px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
  transition: border-color 0.3s;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.btn-toggle-pass {
  position: absolute;
  right: 12px;
  top: 38px;
  background: transparent;
  border: none;
  color: #667eea;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 3px;
  transition: background 0.3s;
}

.btn-toggle-pass:hover {
  background: rgba(102, 126, 234, 0.1);
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
  margin: 8px 0 0 0;
  font-size: 13px;
  color: #555;
}

.info-box ul {
  margin: 10px 0 0 20px;
  font-size: 13px;
  color: #555;
}

.info-box li {
  margin: 5px 0;
}

.mt-10 {
  margin-top: 10px;
}

@media (max-width: 480px) {
  .reset-card {
    padding: 25px;
  }

  .reset-title {
    font-size: 24px;
  }

  .form-input {
    padding-right: 100px;
  }

  .btn {
    padding: 10px 15px;
    font-size: 13px;
  }
}
</style>
