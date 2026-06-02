<template>
  <div class="registro-container">
    <div class="registro-card">
      <h1 class="registro-title">Completar Registro de Docente</h1>
      <p class="registro-subtitle">Paso 2: Datos Personales y Datos Docentes</p>

      <form @submit.prevent="handleCompletarRegistroDocente">
        <!-- CI -->
        <div class="form-group">
          <label for="ci" class="form-label">Carnet de Identidad (CI) *</label>
          <input
            id="ci"
            v-model="formData.ci"
            type="text"
            class="form-input"
            placeholder="Ej: 12345678"
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
            placeholder="Mín. 8 caracteres, con mayúscula y número"
            required
            minlength="8"
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
            minlength="8"
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
            placeholder="Ej: +591 76123456"
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

        <!-- Especialidad -->
        <div class="form-group">
          <label for="especialidad" class="form-label">Especialidad *</label>
          <input
            id="especialidad"
            v-model="formData.especialidad"
            type="text"
            class="form-input"
            placeholder="Ej: Programación, Matemáticas, Física"
            required
          />
          <span v-if="errors.especialidad" class="error-message">{{ errors.especialidad }}</span>
        </div>

        <!-- Grado Académico -->
        <div class="form-group">
          <label for="grado_academico" class="form-label">Grado Académico *</label>
          <select v-model="formData.grado_academico" class="form-input" required>
            <option value="">Selecciona un grado...</option>
            <option value="Licenciatura">Licenciatura</option>
            <option value="Técnico Superior">Técnico Superior</option>
            <option value="Maestría">Maestría</option>
            <option value="Doctorado">Doctorado</option>
            <option value="Diplomado">Diplomado</option>
            <option value="Especialización">Especialización</option>
          </select>
          <span v-if="errors.grado_academico" class="error-message">{{ errors.grado_academico }}</span>
        </div>

        <!-- Años de Experiencia -->
        <div class="form-group">
          <label for="anios_experiencia" class="form-label">Años de Experiencia *</label>
          <input
            id="anios_experiencia"
            v-model.number="formData.anios_experiencia"
            type="number"
            class="form-input"
            min="0"
            max="80"
            placeholder="Ej: 5"
            required
          />
          <span v-if="errors.anios_experiencia" class="error-message">{{ errors.anios_experiencia }}</span>
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
            {{ isLoading ? 'Completando...' : 'Completar Registro' }}
          </button>
        </div>
      </form>

      <!-- Info -->
      <div class="info-box">
        <p>🔒 Tu contraseña debe tener al menos 8 caracteres, incluir una mayúscula y un número.</p>
        <p>📚 Completa todos los campos para activar tu cuenta como docente.</p>
      </div>
    </div>
  </div>
</template>

<script>
import { authService } from '@/services/auth'
import usuariosService from '@/services/usuarios'
import { useRoute, useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'

export default {
  name: 'CompletarRegistroDocenteView',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const token = ref(route.query.token || '')

    const formData = ref({
      ci: '',
      password: '',
      confirmar_password: '',
      celular: '',
      fecha_nacimiento: '',
      especialidad: '',
      grado_academico: '',
      anios_experiencia: 0
    })

    const errors = ref({})
    const errorGeneral = ref('')
    const successMessage = ref('')
    const isLoading = ref(false)

    onMounted(() => {
      if (!token.value) {
        errorGeneral.value = '⚠️ Token inválido. Por favor, usa el enlace del correo.'
        setTimeout(() => {
          router.push('/login')
        }, 3000)
      }
    })

    const handleCompletarRegistroDocente = async () => {
      errors.value = {}
      errorGeneral.value = ''
      successMessage.value = ''

      // Validación básica
      if (!formData.value.ci.trim()) {
        errors.value.ci = 'La CI es requerida'
      } else if (!formData.value.ci.match(/^\d{5,}$/)) {
        errors.value.ci = 'La CI debe ser numérica'
      }

      if (!formData.value.password.trim()) {
        errors.value.password = 'La contraseña es requerida'
      } else if (formData.value.password.length < 8) {
        errors.value.password = 'Mínimo 8 caracteres'
      } else if (!formData.value.password.match(/[A-Z]/) || !formData.value.password.match(/\d/)) {
        errors.value.password = 'Debe incluir mayúscula y número'
      }

      if (formData.value.password !== formData.value.confirmar_password) {
        errors.value.confirmar_password = 'Las contraseñas no coinciden'
      }

      if (!formData.value.especialidad.trim()) {
        errors.value.especialidad = 'La especialidad es requerida'
      }

      if (!formData.value.grado_academico) {
        errors.value.grado_academico = 'Selecciona un grado académico'
      }

      if (formData.value.anios_experiencia < 0) {
        errors.value.anios_experiencia = 'Los años deben ser positivos'
      }

      if (Object.keys(errors.value).length > 0) {
        return
      }

      isLoading.value = true
      try {
        const response = await usuariosService.completarRegistroDocente({
          token: token.value,
          ci: formData.value.ci,
          password: formData.value.password,
          confirmar_password: formData.value.confirmar_password,
          celular: formData.value.celular || null,
          fecha_nacimiento: formData.value.fecha_nacimiento || null,
          especialidad: formData.value.especialidad,
          grado_academico: formData.value.grado_academico,
          anios_experiencia: formData.value.anios_experiencia
        })

        successMessage.value = '✅ ¡Registro completado! Tu cuenta está activa. Redirigiendo al login...'
        
        setTimeout(() => {
          router.push('/login')
        }, 2000)
      } catch (error) {
        console.error('Error:', error)
        errorGeneral.value = error.response?.data?.detail || 'Error al completar el registro. Intenta nuevamente.'
      } finally {
        isLoading.value = false
      }
    }

    return {
      formData,
      errors,
      errorGeneral,
      successMessage,
      isLoading,
      token,
      handleCompletarRegistroDocente
    }
  }
}
</script>

<style scoped>
.registro-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}

.registro-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  padding: 40px;
  max-width: 500px;
  width: 100%;
}

.registro-title {
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 8px 0;
}

.registro-subtitle {
  font-size: 14px;
  color: #64748b;
  margin: 0 0 30px 0;
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #334155;
  margin-bottom: 8px;
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  transition: all 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-input::placeholder {
  color: #cbd5e1;
}

.error-message {
  display: block;
  font-size: 12px;
  color: #ef4444;
  margin-top: 4px;
}

.alert {
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 14px;
}

.alert-error {
  background: #fee2e2;
  color: #991b1b;
  border: 1px solid #fecaca;
}

.alert-success {
  background: #dcfce7;
  color: #166534;
  border: 1px solid #bbf7d0;
}

.form-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 30px;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.info-box {
  background: #f8fafc;
  border-left: 4px solid #667eea;
  padding: 16px;
  border-radius: 8px;
  margin-top: 30px;
}

.info-box p {
  font-size: 13px;
  color: #475569;
  margin: 8px 0;
  line-height: 1.5;
}

.info-box p:first-child {
  margin-top: 0;
}

.info-box p:last-child {
  margin-bottom: 0;
}
</style>
