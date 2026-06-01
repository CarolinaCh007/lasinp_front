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
            placeholder="Ej: 1234567"
            maxlength="20"
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
        sexo: ''
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
      }

      // Validar contraseña
      if (!this.formData.password) {
        this.errors.password = 'La contraseña es requerida'
      } else if (this.formData.password.length < 8) {
        this.errors.password = 'La contraseña debe tener al menos 8 caracteres'
      } else if (!/[A-Z]/.test(this.formData.password)) {
        this.errors.password = 'La contraseña debe incluir al menos una mayúscula'
      } else if (!/\d/.test(this.formData.password)) {
        this.errors.password = 'La contraseña debe incluir al menos un número'
      }

      // Validar confirmación de contraseña
      if (!this.formData.confirmar_password) {
        this.errors.confirmar_password = 'Debes confirmar la contraseña'
      } else if (this.formData.confirmar_password !== this.formData.password) {
        this.errors.confirmar_password = 'Las contraseñas no coinciden'
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
          this.formData.sexo
        )

        this.successMessage = '✅ ¡Registro completado exitosamente! Redirigiendo...'
        
        // Redirigir después de 2 segundos
        setTimeout(() => {
          this.$router.push('/login')
        }, 2000)
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
  background: #010730;
  padding: 20px;
}

.registro-card {
  background: white;
  border-radius: 10px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  padding: 40px;
  max-width: 500px;
  width: 100%;
}

.registro-title {
  font-size: 28px;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
  text-align: center;
}

.registro-subtitle {
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
  font-family: inherit;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

textarea.form-input {
  resize: vertical;
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
  .registro-card {
    padding: 25px;
  }

  .registro-title {
    font-size: 24px;
  }

  .btn {
    padding: 10px 15px;
    font-size: 13px;
  }
}
</style>
