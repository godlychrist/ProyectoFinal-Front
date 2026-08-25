<script setup lang="ts">
import { ref, computed } from 'vue'

const { token, logout, role } = useAuth()
const isMobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const dashboardLinkPath = computed(() => {
  if (role.value === 'admin') return '/admins/statistics'
  if (role.value === 'organizer') return '/managers'
  if (role.value === 'user') return '/users'
  return '/'
})
</script>

<template>
  <header class="navbar-wrapper">
    <nav class="navbar container">
      <!-- Logo -->
      <NuxtLink to="/" class="brand-logo">
        <div class="logo-icon">
          <span>⚡</span>
        </div>
        <span class="brand-name">Community<span class="brand-highlight">Hub</span></span>
      </NuxtLink>

      <!-- Desktop Nav Links -->
      <div class="nav-links">
        <NuxtLink to="/" class="nav-item" active-class="active">Inicio</NuxtLink>
        <NuxtLink to="/activities" class="nav-item" active-class="active">Explorar Actividades</NuxtLink>
        <NuxtLink v-if="token" class="nav-item" active-class="active" :to="dashboardLinkPath">Dashboard</NuxtLink>
      </div>

      <!-- Auth Actions -->
      <div class="nav-actions">
        <template v-if="token">
          <!-- Botón 'Mi Panel' exclusivamente para el Administrador -->
          <NuxtLink v-if="role === 'admin'" to="/admins" class="btn-dashboard-nav">
            ⚡ Mi Panel
          </NuxtLink>
          <button class="btn-ghost btn-logout-nav" @click="logout">
            🚪 Cerrar Sesión
          </button>
        </template>
        <template v-else>
          <NuxtLink to="/auth/login" class="btn-ghost">
            Iniciar Sesión
          </NuxtLink>
          <NuxtLink to="/auth/register" class="btn-primary">
            Registrarse
          </NuxtLink>
        </template>

        <!-- Mobile Hamburger Button -->
        <button class="mobile-toggle" @click="toggleMobileMenu" aria-label="Abrir menú">
          <span :class="{ 'open': isMobileMenuOpen }"></span>
          <span :class="{ 'open': isMobileMenuOpen }"></span>
          <span :class="{ 'open': isMobileMenuOpen }"></span>
        </button>
      </div>
    </nav>

    <!-- Mobile Dropdown -->
    <div v-if="isMobileMenuOpen" class="mobile-dropdown">
      <NuxtLink to="/" class="mobile-item" @click="isMobileMenuOpen = false">Inicio</NuxtLink>
      <NuxtLink to="/activities" class="mobile-item" @click="isMobileMenuOpen = false">Explorar Actividades</NuxtLink>
      <NuxtLink v-if="token" :to="dashboardLinkPath" class="mobile-item" @click="isMobileMenuOpen = false">📊 Dashboard</NuxtLink>
      <NuxtLink v-if="token && role === 'admin'" to="/admins" class="mobile-item" @click="isMobileMenuOpen = false">⚡ Mi Panel (Admin)</NuxtLink>
      <div class="mobile-auth">
        <template v-if="token">
          <button class="btn-ghost full" @click="logout(); isMobileMenuOpen = false">Cerrar Sesión</button>
        </template>
        <template v-else>
          <NuxtLink to="/auth/login" class="btn-ghost full" @click="isMobileMenuOpen = false">Iniciar Sesión</NuxtLink>
          <NuxtLink to="/auth/register" class="btn-primary full" @click="isMobileMenuOpen = false">Registrarse</NuxtLink>
        </template>
      </div>
    </div>
  </header>
</template>

<style scoped>
.navbar-wrapper {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(11, 15, 25, 0.85);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 72px;
  padding: 0 1.5rem;
  max-width: 1280px;
  margin: 0 auto;
}

/* Brand Logo */
.brand-logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  color: #f8fafc;
}

.logo-icon {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.35);
}

.brand-name {
  font-size: 1.25rem;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.brand-highlight {
  background: linear-gradient(135deg, #818cf8 0%, #c084fc 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Nav Links */
.nav-links {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav-item {
  color: #94a3b8;
  text-decoration: none;
  font-size: 0.925rem;
  font-weight: 500;
  transition: all 0.2s ease;
  position: relative;
}

.nav-item:hover,
.nav-item.active {
  color: #f8fafc;
}

.nav-item.active::after {
  content: "";
  position: absolute;
  bottom: -6px;
  left: 0;
  right: 0;
  height: 2px;
  background: #6366f1;
  border-radius: 999px;
}

/* Actions */
.nav-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.btn-ghost {
  color: #e2e8f0;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 600;
  padding: 0.55rem 1rem;
  border-radius: 8px;
  transition: all 0.2s;
}

.btn-ghost:hover {
  color: #818cf8;
  background: rgba(255, 255, 255, 0.05);
}

.btn-primary {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 600;
  padding: 0.55rem 1.2rem;
  border-radius: 8px;
  box-shadow: 0 4px 14px rgba(99, 102, 241, 0.35);
  transition: all 0.2s ease;
}

.btn-primary:hover {
  opacity: 0.95;
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.45);
}

/* Mobile Toggle */
.mobile-toggle {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 4px;
}

.mobile-toggle span {
  width: 22px;
  height: 2px;
  background: #e2e8f0;
  border-radius: 2px;
  transition: all 0.2s;
}

/* Mobile Dropdown */
.mobile-dropdown {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1.25rem 1.5rem;
  background: #0f172a;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.mobile-item {
  color: #cbd5e1;
  text-decoration: none;
  font-size: 1rem;
  font-weight: 500;
  padding: 0.5rem 0;
}

.mobile-auth {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.full {
  text-align: center;
}

/* Badge WIP */
.badge-wip {
  display: inline-block;
  font-size: 0.65rem;
  font-weight: 800;
  text-transform: uppercase;
  background: rgba(234, 179, 8, 0.2);
  color: #facc15;
  border: 1px solid rgba(234, 179, 8, 0.4);
  padding: 0.1rem 0.4rem;
  border-radius: 6px;
  margin-left: 0.35rem;
  vertical-align: middle;
}

/* Botón Mi Panel en Navbar */
.btn-dashboard-nav {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.2) 0%, rgba(99, 102, 241, 0.2) 100%);
  border: 1px solid rgba(168, 85, 247, 0.4);
  color: #d8b4fe;
  font-weight: 700;
  font-size: 0.9rem;
  padding: 0.55rem 1.15rem;
  border-radius: 10px;
  text-decoration: none;
  transition: all 0.2s ease;
}

.btn-dashboard-nav:hover {
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.35) 0%, rgba(99, 102, 241, 0.35) 100%);
  color: #ffffff;
  border-color: #a855f7;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(168, 85, 247, 0.3);
}

/* Botón de Cerrar Sesión en Navbar */
.btn-logout-nav {
  background: rgba(239, 68, 68, 0.15) !important;
  color: #fca5a5 !important;
  border: 1px solid rgba(239, 68, 68, 0.4) !important;
  font-weight: 700 !important;
  font-size: 0.9rem !important;
  padding: 0.55rem 1.15rem !important;
  border-radius: 10px !important;
  cursor: pointer !important;
  transition: all 0.2s ease !important;
}

.btn-logout-nav:hover {
  background: rgba(239, 68, 68, 0.35) !important;
  color: #ffffff !important;
  border-color: #ef4444 !important;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.25);
}

@media (max-width: 868px) {
  .nav-links {
    display: none;
  }
  .mobile-toggle {
    display: flex;
  }
  .btn-ghost, .btn-primary, .btn-dashboard-nav {
    display: none;
  }
  .mobile-dropdown .btn-ghost,
  .mobile-dropdown .btn-primary {
    display: block;
  }
}
</style>