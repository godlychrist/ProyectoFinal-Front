<script setup lang="ts">
import { reactive, ref } from 'vue'

const { register, error, loading } = useAuth()

// Guardamos lo que escribe el usuario

const form = reactive ({
  name: '',
  lastname: '',
  email: '',
  role: 'user', 
  avatar: '',
  password: '',
  confirmPassword: ''
})

// Variables para errores locales
const clientError = ref<string | null>(null)

const handleAvatarChange = async (e: any) => {
  const file = e.target.files?.[0]
  if (file) {
    if (file.size > 50 * 1024 * 1024) {
      clientError.value = 'La foto de perfil no debe superar los 50MB'
      return
    }
    try {
      form.avatar = await compressImage(file, 600, 600, 0.88)
    } catch {
      const reader = new FileReader()
      reader.onload = () => {
        form.avatar = reader.result as string
      }
      reader.readAsDataURL(file)
    }
  }
}

const handleRegister = async () => {
    clientError.value = null

    if (form.password !== form.confirmPassword) {
        clientError.value = 'Las contrasenas no coinciden!'
        return
    }

    if (form.password.length < 6) {
        clientError.value = 'La contrasena debe tener al menos 6 caracteres'
        return
    }

    const result = await register({
        name: `${form.name} ${form.lastname}`.trim(),
        role: form.role,
        email: form.email,
        password: form.password,
        avatar: form.avatar
    })
    
    if(result.ok) {
        navigateTo('/auth/login')
    }
}
</script>

<template>
  <div class="register-page">
    <!-- Efecto de luz ambiental de fondo -->
    <div class="bg-glow"></div>

    <div class="container register-container">
      <div class="register-card">
        <!-- Encabezado de la tarjeta -->
        <div class="card-header">
          <div class="brand-badge">
            <span class="icon">⚡</span>
            <span>CommunityHub</span>
          </div>
          <h1 class="card-title">Crea tu cuenta</h1>
          <p class="card-subtitle">
            Únete a la comunidad para descubrir, inscribirte y organizar actividades locales.
          </p>
        </div>

        <!-- Formulario meramente visual -->
        <form class="register-form" @submit.prevent="handleRegister">
          <!-- Nombre Completo -->
          <div class="form-group">
            <label class="form-label" for="name">Nombre completo</label>
            <div class="input-wrapper">
              <span class="input-icon">👤</span>
              <input
                v-model="form.name"
                id="name"
                type="text"
                class="form-input"
                placeholder="Ej. Carlos"
                autocomplete="name"
              />
            </div>
          </div>

        <div class="form-group">
            <label class="form-label" for="name">Apellido</label>
            <div class="input-wrapper">
              <span class="input-icon">👤</span>
              <input
                v-model="form.lastname"
                id="lastname"
                type="text"
                class="form-input"
                placeholder="Ej. Mendoza"
                autocomplete="name"
              />
            </div>
          </div>

          <!-- Correo Electrónico -->
          <div class="form-group">
            <label class="form-label" for="email">Correo electrónico</label>
            <div class="input-wrapper">
              <span class="input-icon">✉️</span>
              <input
                v-model="form.email"
                id="email"
                type="email"
                class="form-input"
                placeholder="tu@correo.com"
                autocomplete="email"
              />
            </div>
          </div>

          <!-- Rol en la plataforma -->
          <div class="form-group">
            <label class="form-label">Tipo de cuenta / Rol</label>
            <div class="role-selector">
              <label class="role-option">
                <input type="radio" name="role" value="user" v-model="form.role"/>
                <div class="role-card">
                  <span class="role-icon">🙋‍♂️</span>
                  <div class="role-text">
                    <strong>Participante</strong>
                    <small>Inscribirme y asistir a eventos</small>
                  </div>
                </div>
              </label>

              <label class="role-option">
                <input type="radio" name="role" value="organizer" v-model="form.role"/>
                <div class="role-card">
                  <span class="role-icon">🎯</span>
                  <div class="role-text">
                    <strong>Organizador</strong>
                    <small>Crear y gestionar actividades</small>
                  </div>
                </div>
              </label>
            </div>
          </div>

          <!-- Foto de Perfil Opcional -->
          <div class="form-group">
            <label class="form-label" for="avatar">Foto de perfil (Opcional)</label>
            <div style="display: flex; align-items: center; gap: 1rem; margin-top: 0.5rem;">
              <div style="width: 54px; height: 54px; border-radius: 50%; background: #1e293b; border: 2px solid #38bdf8; display: flex; align-items: center; justify-content: center; overflow: hidden; flex-shrink: 0;">
                <img v-if="form.avatar" :src="form.avatar" alt="Avatar Preview" style="width: 100%; height: 100%; object-fit: cover;" />
                <span v-else style="font-size: 1.5rem;">👤</span>
              </div>
              <div style="flex: 1;">
                <input 
                  type="file" 
                  accept="image/*" 
                  id="avatar" 
                  class="form-input" 
                  style="padding: 0.4rem; font-size: 0.85rem;" 
                  @change="handleAvatarChange" 
                />
                <small style="color: #94a3b8; font-size: 0.75rem; display: block; margin-top: 0.25rem;">
                  Sube tu foto en formato PNG, JPG o WebP
                </small>
              </div>
            </div>
          </div>

          <!-- Contraseña -->
          <div class="form-group">
            <label class="form-label" for="password">Contraseña</label>
            <div class="input-wrapper">
              <span class="input-icon">🔒</span>
              <input
                v-model="form.password"
                id="password"
                type="password"
                class="form-input"
                placeholder="Mínimo 8 caracteres"
                autocomplete="new-password"
              />
            </div>
          </div>

          <!-- Confirmar Contraseña -->
          <div class="form-group">
            <label class="form-label" for="confirm-password">Confirmar contraseña</label>
            <div class="input-wrapper">
              <span class="input-icon">🛡️</span>
              <input
                v-model="form.confirmPassword"
                id="confirm-password"
                type="password"
                class="form-input"
                placeholder="Repite tu contraseña"
                autocomplete="new-password"
              />
            </div>
          </div>

          <!-- Términos y condiciones -->
          <div class="terms-group">
            <label class="checkbox-container">
              <input type="checkbox"/>
              <span class="checkmark"></span>
              <span class="terms-text">
                Acepto los <a href="#" class="terms-link">Términos de servicio</a> y la <a href="#" class="terms-link">Política de privacidad</a>.
              </span>
            </label>
          </div>

          <!-- Botón de Registro -->
          <button type="submit" class="btn-submit" :disabled="loading">
            <span v-if="loading">Creando Cuenta</span>
            <span v-else> Crear Cuenta →</span>
          </button>
        </form>

        <div v-if="clientError || error" class="alert-error">
  ⚠️ {{ clientError || error }}
        </div>

        <!-- Pie de la tarjeta -->
        <div class="card-footer">
          <p>
            ¿Ya tienes una cuenta?
            <NuxtLink to="/auth/login" class="login-link">
              Inicia sesión aquí
            </NuxtLink>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.register-page {
  position: relative;
  min-height: calc(100vh - 72px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem 1.5rem;
}

/* Efecto de luz difuminada */
.bg-glow {
  position: absolute;
  top: 15%;
  left: 50%;
  transform: translateX(-50%);
  width: 550px;
  height: 450px;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.18) 0%, rgba(168, 85, 247, 0.12) 40%, rgba(11, 15, 25, 0) 70%);
  filter: blur(60px);
  pointer-events: none;
  z-index: 0;
}

.register-container {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 520px;
}

.register-card {
  background: rgba(22, 30, 49, 0.85);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 2.5rem;
  box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.6);
}

/* Header */
.card-header {
  text-align: center;
  margin-bottom: 2rem;
}

.brand-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: rgba(99, 102, 241, 0.1);
  border: 1px solid rgba(99, 102, 241, 0.25);
  padding: 0.3rem 0.8rem;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 600;
  color: #a5b4fc;
  margin-bottom: 1rem;
}

.card-title {
  font-size: 1.85rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: #f8fafc;
  margin-bottom: 0.5rem;
}

.card-subtitle {
  color: #94a3b8;
  font-size: 0.92rem;
  line-height: 1.5;
}

/* Form */
.register-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #cbd5e1;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 1rem;
  font-size: 1rem;
  pointer-events: none;
  opacity: 0.7;
}

.form-input {
  width: 100%;
  background: rgba(11, 15, 25, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 0.75rem 1rem 0.75rem 2.75rem;
  color: #f8fafc;
  font-family: inherit;
  font-size: 0.95rem;
  outline: none;
  transition: all 0.2s ease;
}

.form-input:focus {
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
  background: rgba(11, 15, 25, 0.9);
}

.form-input::placeholder {
  color: #64748b;
  font-size: 0.9rem;
}

/* Selector de Rol */
.role-selector {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.role-option {
  cursor: pointer;
}

.role-option input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.role-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 0.9rem;
  background: rgba(11, 15, 25, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  transition: all 0.2s ease;
}

.role-card:hover {
  border-color: rgba(99, 102, 241, 0.35);
  background: rgba(11, 15, 25, 0.8);
}

.role-option input:checked + .role-card {
  border-color: #6366f1;
  background: rgba(99, 102, 241, 0.12);
  box-shadow: 0 0 0 1px #6366f1;
}

.role-icon {
  font-size: 1.35rem;
}

.role-text {
  display: flex;
  flex-direction: column;
}

.role-text strong {
  font-size: 0.85rem;
  color: #f8fafc;
}

.role-text small {
  font-size: 0.72rem;
  color: #94a3b8;
  line-height: 1.2;
}

/* Términos y Checkbox */
.terms-group {
  margin-top: 0.25rem;
}

.checkbox-container {
  display: flex;
  align-items: flex-start;
  gap: 0.65rem;
  cursor: pointer;
  user-select: none;
}

.checkbox-container input {
  margin-top: 0.25rem;
  accent-color: #6366f1;
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.terms-text {
  font-size: 0.825rem;
  color: #94a3b8;
  line-height: 1.4;
}

.terms-link {
  color: #818cf8;
  text-decoration: none;
  font-weight: 500;
}

.terms-link:hover {
  text-decoration: underline;
}

/* Botón de Enviar */
.btn-submit {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.85rem 1.5rem;
  margin-top: 0.5rem;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-family: inherit;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 8px 20px rgba(99, 102, 241, 0.35);
  transition: all 0.2s ease;
}

.btn-submit:hover {
  opacity: 0.95;
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(99, 102, 241, 0.45);
}

.arrow-icon {
  font-size: 1.1rem;
  transition: transform 0.2s ease;
}

.btn-submit:hover .arrow-icon {
  transform: translateX(3px);
}

/* Footer Card */
.card-footer {
  margin-top: 1.75rem;
  padding-top: 1.25rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  text-align: center;
  font-size: 0.9rem;
  color: #94a3b8;
}

.login-link {
  color: #818cf8;
  text-decoration: none;
  font-weight: 700;
  margin-left: 0.25rem;
}

.login-link:hover {
  text-decoration: underline;
  color: #a5b4fc;
}

.alert-error {
  background: rgba(239, 68, 68, 0.15);
  border: 1px solid rgba(239, 68, 68, 0.35);
  color: #fca5a5;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 500;
  margin-top: 1rem;
  text-align: center;
  backdrop-filter: blur(8px);
}


@media (max-width: 480px) {
  .register-card {
    padding: 1.75rem 1.25rem;
  }

  .role-selector {
    grid-template-columns: 1fr;
  }
}


</style>
