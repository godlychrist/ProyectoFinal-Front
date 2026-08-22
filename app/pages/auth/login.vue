<script setup lang="ts">
// Meramente diseño visual - ¡Ahora te toca a ti conectar la lógica! 🚀
import { reactive, ref } from 'vue'

const { login, error, loading } = useAuth()

const form = reactive ({
    email: '',
    password: ''
})

const clientError = ref<string | null>(null)

const handleLogin = async() => {
    clientError.value = null

    const result = await login({
        email: form.email,
        password: form.password
    })

    if(result.ok) {

      const role = result.data?.data?.role

      if(role === "organizer")
        navigateTo('/managers') 
      else if (role === "admin") {
        navigateTo('/admins')
      } else {
        navigateTo('/users')
      }
    }
}
</script>

<template>
  <div class="login-page">
    <!-- Efecto de luz ambiental de fondo -->
    <div class="bg-glow"></div>

    <div class="container login-container">
      <div class="login-card">
        <!-- Encabezado de la tarjeta -->
        <div class="card-header">
          <div class="brand-badge">
            <span class="icon">⚡</span>
            <span>CommunityHub</span>
          </div>
          <h1 class="card-title">Bienvenido de vuelta</h1>
          <p class="card-subtitle">
            Ingresa tus credenciales para acceder a tus actividades y comunidad.
          </p>
        </div>

        <!-- Formulario meramente visual -->
        <form class="login-form" @submit.prevent="handleLogin">
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

          <!-- Contraseña -->
          <div class="form-group">
            <div class="label-with-link">
              <label class="form-label" for="password">Contraseña</label>
              <a href="#" class="forgot-link">¿Olvidaste tu contraseña?</a>
            </div>
            <div class="input-wrapper">
              <span class="input-icon">🔒</span>
              <input
                v-model="form.password"
                id="password"
                type="password"
                class="form-input"
                placeholder="••••••••"
                autocomplete="current-password"
              />
            </div>
          </div>

          <!-- Recordarme -->
          <div class="remember-group">
            <label class="checkbox-container">
              <input type="checkbox" />
              <span class="checkmark"></span>
              <span class="remember-text">Recordar mi sesión</span>
            </label>
          </div>

          <!-- Botón de Iniciar Sesión -->
          <button type="submit" class="btn-submit" :disabled="loading">
            <span v-if="loading">Iniciando Sesion...</span>
            <span v-else> Iniciar Sesion →</span>
          </button>
        </form>

        <div v-if="clientError || error" class="alert-error">
        ⚠️ {{ clientError || error }}
        </div>

        <!-- Pie de la tarjeta -->
        <div class="card-footer">
          <p>
            ¿Aún no tienes una cuenta?
            <NuxtLink to="/auth/register" class="register-link">
              Regístrate aquí
            </NuxtLink>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  position: relative;
  min-height: calc(100vh - 72px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem 1.5rem;
}

/* Luz difuminada de fondo */
.bg-glow {
  position: absolute;
  top: 20%;
  left: 50%;
  transform: translateX(-50%);
  width: 500px;
  height: 400px;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.18) 0%, rgba(168, 85, 247, 0.12) 40%, rgba(11, 15, 25, 0) 70%);
  filter: blur(60px);
  pointer-events: none;
  z-index: 0;
}

.login-container {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 460px;
}

.login-card {
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

/* Formulario */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.label-with-link {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #cbd5e1;
}

.forgot-link {
  font-size: 0.8rem;
  color: #818cf8;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.forgot-link:hover {
  text-decoration: underline;
  color: #a5b4fc;
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

/* Remember me */
.remember-group {
  display: flex;
  align-items: center;
}

.checkbox-container {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  cursor: pointer;
  user-select: none;
}

.checkbox-container input {
  accent-color: #6366f1;
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.remember-text {
  font-size: 0.85rem;
  color: #94a3b8;
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

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.arrow-icon {
  font-size: 1.1rem;
  transition: transform 0.2s ease;
}

.btn-submit:hover .arrow-icon {
  transform: translateX(3px);
}

/* Estilo para alertas de error */
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

/* Footer Card */
.card-footer {
  margin-top: 1.75rem;
  padding-top: 1.25rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  text-align: center;
  font-size: 0.9rem;
  color: #94a3b8;
}

.register-link {
  color: #818cf8;
  text-decoration: none;
  font-weight: 700;
  margin-left: 0.25rem;
}

.register-link:hover {
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
  .login-card {
    padding: 1.75rem 1.25rem;
  }
}
</style>