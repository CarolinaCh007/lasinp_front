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

      // Validación básica
      if (!this.formData.nombre.trim()) {
        this.errors.nombre = 'El nombre es requerido'
      }
      if (!this.formData.ape_paterno.trim()) {
        this.errors.ape_paterno = 'El apellido paterno es requerido'
      }
      if (!this.formData.ape_materno.trim()) {
        this.errors.ape_materno = 'El apellido materno es requerido'
      }
      if (!this.formData.correo_electronico.trim()) {
        this.errors.correo_electronico = 'El correo electrónico es requerido'
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
        }, 2000)
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
  background:  #0a244a;
  padding: 20px;
}

.registro-card {
  background: rgb(3, 161, 164);
  border-radius: 10px;
  box-shadow: 0 10px 40px rgba(255, 0, 0, 0.2);
  padding: 40px;
  max-width: 400px;
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
