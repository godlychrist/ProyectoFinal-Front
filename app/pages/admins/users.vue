<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

definePageMeta({
  middleware: 'auth'
})

const { getUsers, updateUserRole, deleteUser, loading, error } = useUsers()

const users = ref<any[]>([])
const searchQuery = ref('')
const selectedRoleFilter = ref('all')
const actionMessage = ref<string | null>(null)

const fetchUsers = async () => {
  const res = await getUsers()
  if (res.ok) {
    users.value = res.data
  }
}

onMounted(() => {
  fetchUsers()
})

// Métricas de usuarios
const totalUsers = computed(() => users.value.length)
const totalAdmins = computed(() => users.value.filter(u => u.role === 'admin').length)
const totalOrganizers = computed(() => users.value.filter(u => u.role === 'organizer').length)
const totalParticipants = computed(() => users.value.filter(u => u.role === 'user').length)

// Filtro reactivo de búsqueda y rol
const filteredUsers = computed(() => {
  let list = [...users.value]

  if (selectedRoleFilter.value !== 'all') {
    list = list.filter(u => u.role === selectedRoleFilter.value)
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase().trim()
    list = list.filter(u =>
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q)
    )
  }

  return list
})

// Cambiar rol de usuario
const handleRoleChange = async (user: any, newRole: string) => {
  if (user.role === newRole) return

  if (confirm(`¿Estás seguro de cambiar el rol de ${user.name} a "${newRole}"?`)) {
    const res = await updateUserRole(user._id, newRole)
    if (res.ok) {
      user.role = newRole
      actionMessage.value = `✓ Rol de ${user.name} actualizado a "${newRole}"`
      setTimeout(() => { actionMessage.value = null }, 3000)
    } else {
      alert('Error al actualizar el rol del usuario')
    }
  } else {
    // Revertir selección en el select
    await fetchUsers()
  }
}

// Desactivar usuario
const handleDeleteUser = async (user: any) => {
  if (confirm(`¿Estás seguro de desactivar la cuenta de "${user.name}"? El usuario no podrá iniciar sesión.`)) {
    const res = await deleteUser(user._id)
    if (res.ok) {
      actionMessage.value = `✓ Usuario "${user.name}" desactivado correctamente`
      await fetchUsers()
      setTimeout(() => { actionMessage.value = null }, 3000)
    } else {
      alert('Error al desactivar el usuario')
    }
  }
}

// Formatear fechas
const formatDate = (dateStr: string) => {
  if (!dateStr) return 'Sin fecha'
  return new Date(dateStr).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}
</script>

<template>
  <div class="admin-users-page">
    <div class="bg-glow"></div>

    <div class="container users-container">
      <!-- 1. Header / Navegación Superior -->
      <nav class="admin-nav">
        <NuxtLink to="/admins" class="btn-back">
          <span>←</span>
          <span>Volver al Panel General</span>
        </NuxtLink>

        <div class="admin-badge-top">
          <span class="shield-icon">🛡️</span>
          <span>Módulo de Control de Cuentas</span>
        </div>
      </nav>

      <!-- Mensaje de confirmación temporal -->
      <transition name="fade">
        <div v-if="actionMessage" class="toast-success">
          {{ actionMessage }}
        </div>
      </transition>

      <!-- 2. Header Hero de Usuarios -->
      <header class="users-hero">
        <div class="hero-left">
          <h1 class="page-title">Gestión Global de <span class="text-gradient">Usuarios</span></h1>
          <p class="page-subtitle">Supervisa, asigna permisos de Organizador/Admin y modera las cuentas registradas en la plataforma.</p>
        </div>

        <button class="btn-refresh" @click="fetchUsers" title="Recargar lista">
          <span>🔄</span>
          <span>Actualizar</span>
        </button>
      </header>

      <!-- 3. KPIs de Cuentas -->
      <section class="kpi-grid">
        <div class="kpi-card" @click="selectedRoleFilter = 'all'" :class="{ active: selectedRoleFilter === 'all' }">
          <div class="kpi-icon-wrap icon-indigo">👥</div>
          <div class="kpi-content">
            <span class="kpi-value">{{ totalUsers }}</span>
            <span class="kpi-label">Total Usuarios</span>
            <span class="kpi-sub">En base de datos</span>
          </div>
        </div>

        <div class="kpi-card" @click="selectedRoleFilter = 'organizer'" :class="{ active: selectedRoleFilter === 'organizer' }">
          <div class="kpi-icon-wrap icon-purple">🎯</div>
          <div class="kpi-content">
            <span class="kpi-value">{{ totalOrganizers }}</span>
            <span class="kpi-label">Organizadores</span>
            <span class="kpi-sub">Creadores de eventos</span>
          </div>
        </div>

        <div class="kpi-card" @click="selectedRoleFilter = 'user'" :class="{ active: selectedRoleFilter === 'user' }">
          <div class="kpi-icon-wrap icon-emerald">🙋‍♂️</div>
          <div class="kpi-content">
            <span class="kpi-value">{{ totalParticipants }}</span>
            <span class="kpi-label">Participantes</span>
            <span class="kpi-sub">Usuarios estándar</span>
          </div>
        </div>

        <div class="kpi-card" @click="selectedRoleFilter = 'admin'" :class="{ active: selectedRoleFilter === 'admin' }">
          <div class="kpi-icon-wrap icon-amber">👑</div>
          <div class="kpi-content">
            <span class="kpi-value">{{ totalAdmins }}</span>
            <span class="kpi-label">Administradores</span>
            <span class="kpi-sub">Acceso total</span>
          </div>
        </div>
      </section>

      <!-- 4. Barra de Búsqueda y Filtros -->
      <div class="toolbar-wrapper">
        <div class="search-box">
          <span class="search-icon">🔍</span>
          <input 
            v-model="searchQuery" 
            type="text" 
            class="search-input" 
            placeholder="Buscar por nombre o correo electrónico..."
          />
          <button v-if="searchQuery" class="clear-btn" @click="searchQuery = ''">✕</button>
        </div>

        <div class="filter-box">
          <select v-model="selectedRoleFilter" class="filter-select">
            <option value="all">👥 Todos los Roles</option>
            <option value="user">🙋‍♂️ Solo Participantes</option>
            <option value="organizer">🎯 Solo Organizadores</option>
            <option value="admin">👑 Solo Administradores</option>
          </select>
        </div>
      </div>

      <!-- 5. Tabla Principal de Usuarios -->
      <section class="table-card">
        <div class="table-card-header">
          <h2 class="table-title">Usuarios Registrados ({{ filteredUsers.length }})</h2>
          <span class="table-hint">Puedes cambiar el rol directamente desde el selector de cada fila.</span>
        </div>

        <!-- Estado de Carga -->
        <div v-if="loading && users.length === 0" class="loading-state">
          <span class="spinner">⏳</span>
          <p>Cargando lista de usuarios de MongoDB...</p>
        </div>

        <!-- Tabla -->
        <div v-else-if="filteredUsers.length > 0" class="table-wrapper">
          <table class="users-table">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Correo Electrónico</th>
                <th>Rol Asignado</th>
                <th>Fecha de Registro</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in filteredUsers" :key="user._id">
                <td class="col-user">
                  <div class="user-info-cell">
                    <div class="user-avatar" :class="`avatar-${user.role}`">
                      {{ (user.name || 'U').charAt(0).toUpperCase() }}
                    </div>
                    <div class="user-meta">
                      <strong class="user-name">{{ user.name }}</strong>
                      <span class="user-id">ID: {{ user._id?.substring(0, 8) }}...</span>
                    </div>
                  </div>
                </td>

                <td class="col-email">
                  <span class="email-text">{{ user.email }}</span>
                </td>

                <td class="col-role">
                  <div class="role-selector-wrap">
                    <select 
                      :value="user.role" 
                      @change="handleRoleChange(user, ($event.target as HTMLSelectElement).value)"
                      class="role-select"
                      :class="`select-${user.role}`"
                    >
                      <option value="user">🙋‍♂️ Participante</option>
                      <option value="organizer">🎯 Organizador</option>
                      <option value="admin">👑 Administrador</option>
                    </select>
                  </div>
                </td>

                <td class="col-date">
                  <span class="date-text">📅 {{ formatDate(user.createdAt) }}</span>
                </td>

                <td class="col-actions">
                  <button 
                    class="btn-action-delete"
                    title="Desactivar cuenta"
                    @click="handleDeleteUser(user)"
                  >
                    🗑️ Desactivar
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty State -->
        <div v-else class="empty-state">
          <span class="empty-icon">🔍</span>
          <h3>No se encontraron usuarios</h3>
          <p>No hay usuarios que coincidan con el filtro actual.</p>
          <button class="btn-clear-filters" @click="searchQuery = ''; selectedRoleFilter = 'all'">
            Restablecer Filtros
          </button>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.admin-users-page {
  min-height: 100vh;
  padding: 2.5rem 1rem 5rem;
  background-color: #0b0f19;
  color: #f8fafc;
  position: relative;
  overflow-x: hidden;
}

.bg-glow {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 1000px;
  height: 450px;
  background: radial-gradient(circle, rgba(239, 68, 68, 0.12) 0%, rgba(99, 102, 241, 0.08) 50%, transparent 70%);
  filter: blur(80px);
  pointer-events: none;
  z-index: 0;
}

.users-container {
  max-width: 1100px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

/* 1. Nav */
.admin-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.btn-back {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #94a3b8;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 600;
  padding: 0.5rem 1rem;
  background: rgba(22, 30, 49, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  transition: all 0.2s;
}

.btn-back:hover {
  color: #f8fafc;
  background: rgba(22, 30, 49, 0.9);
  border-color: rgba(99, 102, 241, 0.4);
  transform: translateX(-2px);
}

.admin-badge-top {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.9rem;
  background: rgba(239, 68, 68, 0.12);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 700;
  color: #fca5a5;
}

/* Toast */
.toast-success {
  background: rgba(52, 211, 153, 0.2);
  border: 1px solid rgba(52, 211, 153, 0.4);
  color: #34d399;
  padding: 0.75rem 1.25rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  font-weight: 600;
  backdrop-filter: blur(12px);
}

/* 2. Hero */
.users-hero {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.page-title {
  font-size: 2.25rem;
  font-weight: 800;
  line-height: 1.2;
  color: #f8fafc;
  margin-bottom: 0.5rem;
}

.text-gradient {
  background: linear-gradient(135deg, #f43f5e 0%, #a855f7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.page-subtitle {
  color: #94a3b8;
  font-size: 1rem;
  max-width: 650px;
}

.btn-refresh {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(22, 30, 49, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #cbd5e1;
  font-size: 0.875rem;
  font-weight: 600;
  padding: 0.6rem 1.1rem;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-refresh:hover {
  background: rgba(255, 255, 255, 0.12);
  color: white;
  transform: translateY(-1px);
}

/* 3. KPIs */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.25rem;
  margin-bottom: 2rem;
}

.kpi-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: rgba(22, 30, 49, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 1.25rem;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(12px);
}

.kpi-card:hover, .kpi-card.active {
  border-color: rgba(99, 102, 241, 0.4);
  background: rgba(22, 30, 49, 0.95);
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
}

.kpi-card.active {
  border-color: #6366f1;
  box-shadow: 0 0 20px rgba(99, 102, 241, 0.2);
}

.kpi-icon-wrap {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.35rem;
  flex-shrink: 0;
}

.icon-indigo { background: rgba(99, 102, 241, 0.15); color: #818cf8; }
.icon-purple { background: rgba(168, 85, 247, 0.15); color: #c084fc; }
.icon-emerald { background: rgba(52, 211, 153, 0.15); color: #34d399; }
.icon-amber { background: rgba(251, 191, 36, 0.15); color: #fbbf24; }

.kpi-content {
  display: flex;
  flex-direction: column;
}

.kpi-value {
  font-size: 1.6rem;
  font-weight: 800;
  color: #f8fafc;
  line-height: 1.1;
}

.kpi-label {
  font-size: 0.825rem;
  color: #94a3b8;
  font-weight: 600;
  margin-top: 0.2rem;
}

.kpi-sub {
  font-size: 0.725rem;
  color: #64748b;
  margin-top: 0.15rem;
}

/* 4. Toolbar */
.toolbar-wrapper {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.75rem;
  flex-wrap: wrap;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: rgba(22, 30, 49, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 0.65rem 1.25rem;
  flex: 1;
  min-width: 280px;
  transition: all 0.2s;
}

.search-box:focus-within {
  border-color: rgba(99, 102, 241, 0.5);
  box-shadow: 0 0 15px rgba(99, 102, 241, 0.2);
}

.search-icon {
  font-size: 1.1rem;
  color: #818cf8;
}

.search-input {
  background: transparent;
  border: none;
  color: #f8fafc;
  font-size: 0.95rem;
  width: 100%;
  outline: none;
}

.clear-btn {
  background: transparent;
  border: none;
  color: #94a3b8;
  font-size: 0.85rem;
  cursor: pointer;
}

.filter-select {
  background: rgba(22, 30, 49, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #cbd5e1;
  font-size: 0.875rem;
  padding: 0.65rem 1.25rem;
  border-radius: 12px;
  outline: none;
  cursor: pointer;
  height: 100%;
}

.filter-select option {
  background: #111827;
  color: #f8fafc;
}

/* 5. Tabla */
.table-card {
  background: rgba(22, 30, 49, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 1.75rem;
  backdrop-filter: blur(16px);
  box-shadow: 0 15px 35px -10px rgba(0, 0, 0, 0.5);
}

.table-card-header {
  margin-bottom: 1.5rem;
}

.table-title {
  font-size: 1.35rem;
  font-weight: 800;
  color: #f8fafc;
  margin-bottom: 0.25rem;
}

.table-hint {
  font-size: 0.85rem;
  color: #94a3b8;
}

.table-wrapper {
  overflow-x: auto;
}

.users-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.users-table th {
  padding: 0.85rem 1rem;
  background: rgba(11, 15, 25, 0.5);
  color: #94a3b8;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.users-table td {
  padding: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  font-size: 0.9rem;
}

.users-table tr:hover td {
  background: rgba(255, 255, 255, 0.02);
}

.user-info-cell {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-avatar {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  color: white;
  font-size: 0.95rem;
}

.avatar-user { background: linear-gradient(135deg, #10b981 0%, #059669 100%); }
.avatar-organizer { background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%); }
.avatar-admin { background: linear-gradient(135deg, #f43f5e 0%, #fbbf24 100%); }

.user-meta {
  display: flex;
  flex-direction: column;
}

.user-name {
  color: #f8fafc;
  font-weight: 700;
}

.user-id {
  font-size: 0.75rem;
  color: #64748b;
  font-family: monospace;
}

.email-text {
  color: #94a3b8;
  font-family: monospace;
  font-size: 0.85rem;
}

.role-select {
  background: rgba(11, 15, 25, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #cbd5e1;
  font-size: 0.825rem;
  font-weight: 700;
  padding: 0.4rem 0.8rem;
  border-radius: 8px;
  outline: none;
  cursor: pointer;
  transition: all 0.2s;
}

.select-user { border-color: rgba(16, 185, 129, 0.4); color: #34d399; }
.select-organizer { border-color: rgba(139, 92, 246, 0.4); color: #c084fc; }
.select-admin { border-color: rgba(244, 63, 94, 0.4); color: #fca5a5; }

.date-text {
  color: #94a3b8;
  font-size: 0.85rem;
}

.btn-action-delete {
  background: rgba(239, 68, 68, 0.12);
  border: 1px solid rgba(239, 68, 68, 0.25);
  color: #f87171;
  font-size: 0.8rem;
  font-weight: 600;
  padding: 0.4rem 0.8rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-action-delete:hover {
  background: rgba(239, 68, 68, 0.25);
  color: #fca5a5;
}

.empty-state, .loading-state {
  text-align: center;
  padding: 3.5rem 1rem;
  color: #94a3b8;
}

.empty-icon, .spinner {
  font-size: 2.5rem;
  display: block;
  margin-bottom: 1rem;
}

.btn-clear-filters {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  font-weight: 600;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  margin-top: 1rem;
  cursor: pointer;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
