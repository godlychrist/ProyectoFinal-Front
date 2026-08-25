<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

definePageMeta({
  middleware: 'auth'
})

const { logout } = useAuth()
const { getUsers } = useUsers()
const { getEvents, getCategories } = useEvents()

const totalUsersCount = ref(0)
const totalEventsCount = ref(0)
const totalCategoriesCount = ref(0)
const loadingStats = ref(true)

onMounted(async () => {
  try {
    const [usersRes, eventsRes, catsRes] = await Promise.all([
      getUsers(),
      getEvents(),
      getCategories()
    ])

    if (usersRes.ok && Array.isArray(usersRes.data)) totalUsersCount.value = usersRes.data.length
    if (eventsRes.ok && Array.isArray(eventsRes.data)) totalEventsCount.value = eventsRes.data.length
    if (catsRes.ok && Array.isArray(catsRes.data)) totalCategoriesCount.value = catsRes.data.length
  } catch (err) {
    console.error('Error al cargar datos del panel admin:', err)
  } finally {
    loadingStats.value = false
  }
})
</script>

<template>
  <div class="admin-dashboard-page">
    <!-- Luz ambiental -->
    <div class="bg-glow"></div>

    <div class="container admin-container">
      <!-- 1. Header / Perfil del Administrador -->
      <header class="admin-hero">
        <div class="profile-main">
          <div class="admin-avatar">
            <span class="avatar-icon">🛡️</span>
            <span class="root-badge" title="SuperAdmin">ROOT</span>
          </div>

          <div class="profile-info">
            <div class="role-badge-wrap">
              <span class="role-pill">👑 Super Administrador</span>
              <span class="status-pill">🟢 Sistema Operativo 100%</span>
            </div>
            <h1 class="admin-name">Centro de Control: <span class="text-gradient">CommunityHub Global</span></h1>
            <p class="admin-desc">Sesión Administrador • Nivel de acceso: Total</p>
          </div>
        </div>

        <div class="hero-actions">
          <button class="btn-logout-action" @click="logout">
            🚪 Cerrar Sesión
          </button>
        </div>
      </header>

      <!-- 2. KPIs Rápidos del Sistema -->
      <section class="kpi-grid">
        <div class="kpi-card">
          <div class="kpi-icon-wrap icon-purple">👥</div>
          <div class="kpi-content">
            <span class="kpi-value">{{ loadingStats ? '...' : totalUsersCount }}</span>
            <span class="kpi-label">Usuarios Registrados</span>
            <span class="kpi-sub positive">En base de datos</span>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-icon-wrap icon-blue">📅</div>
          <div class="kpi-content">
            <span class="kpi-value">{{ loadingStats ? '...' : totalEventsCount }}</span>
            <span class="kpi-label">Actividades Totales</span>
            <span class="kpi-sub">Creadas en plataforma</span>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-icon-wrap icon-amber">🏷️</div>
          <div class="kpi-content">
            <span class="kpi-value">{{ loadingStats ? '...' : totalCategoriesCount }}</span>
            <span class="kpi-label">Categorías Oficiales</span>
            <span class="kpi-sub">En catálogo</span>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-icon-wrap icon-emerald">🗄️</div>
          <div class="kpi-content">
            <span class="kpi-value">MongoDB Atlas</span>
            <span class="kpi-label">Base de Datos</span>
            <span class="kpi-sub status-ok">● Conexión Estable</span>
          </div>
        </div>
      </section>

      <!-- 3. Módulos de Gestión (Los 4 Botones Principales del Panel de Control) -->
      <section class="modules-section">
        <div class="section-title-box">
          <span class="section-tag">Módulos Administrativos</span>
          <h2 class="section-heading">Selecciona una Sección de Gestión</h2>
          <p class="section-subtitle">Accede a las herramientas de supervisión, moderación y analíticas de la comunidad.</p>
        </div>

        <div class="modules-grid">
          <!-- Módulo 1: Usuarios (Ya conectado y funcional) -->
          <NuxtLink to="/admins/users" class="module-card card-users">
            <div class="module-card-glow"></div>
            <div class="module-icon-wrap icon-users-bg">
              <span>👥</span>
            </div>
            <div class="module-body">
              <div class="module-header-row">
                <h3 class="module-title">Gestión de Usuarios</h3>
                <span class="module-badge badge-active">Operativo</span>
              </div>
              <p class="module-desc">
                Supervisa el directorio completo de cuentas, asigna roles de Organizador o Administrador y modera usuarios.
              </p>
              <div class="module-footer">
                <span class="module-link-text">Administrar Usuarios</span>
                <span class="arrow-icon">→</span>
              </div>
            </div>
          </NuxtLink>

          <!-- Módulo 2: Actividades -->
          <NuxtLink to="/admins/events" class="module-card card-events">
            <div class="module-card-glow"></div>
            <div class="module-icon-wrap icon-events-bg">
              <span>📅</span>
            </div>
            <div class="module-body">
              <div class="module-header-row">
                <h3 class="module-title">Gestión de Actividades</h3>
                <span class="module-badge badge-active">Operativo</span>
              </div>
              <p class="module-desc">
                Supervisa todas las actividades publicadas por cualquier organizador y elimina contenido inapropiado o spam.
              </p>
              <div class="module-footer">
                <span class="module-link-text">Moderar Actividades</span>
                <span class="arrow-icon">→</span>
              </div>
            </div>
          </NuxtLink>

          <!-- Módulo 3: Categorías -->
          <NuxtLink to="/admins/categories" class="module-card card-categories">
            <div class="module-card-glow"></div>
            <div class="module-icon-wrap icon-categories-bg">
              <span>🏷️</span>
            </div>
            <div class="module-body">
              <div class="module-header-row">
                <h3 class="module-title">Administrar Categorías</h3>
                <span class="module-badge badge-active">Operativo</span>
              </div>
              <p class="module-desc">
                Crea, edita o elimina las categorías temáticas oficiales para clasificar las actividades en el catálogo.
              </p>
              <div class="module-footer">
                <span class="module-link-text">Gestionar Categorías</span>
                <span class="arrow-icon">→</span>
              </div>
            </div>
          </NuxtLink>

          <!-- Módulo 4: Estadísticas & Dashboard -->
          <NuxtLink to="/admins/statistics" class="module-card card-stats">
            <div class="module-card-glow"></div>
            <div class="module-icon-wrap icon-stats-bg">
              <span>📊</span>
            </div>
            <div class="module-body">
              <div class="module-header-row">
                <h3 class="module-title">Dashboard & Estadísticas</h3>
                <span class="module-badge badge-active">Operativo</span>
              </div>
              <p class="module-desc">
                Consulta analíticas globales de inscripciones, actividades activas vs finalizadas y crecimiento de la plataforma.
              </p>
              <div class="module-footer">
                <span class="module-link-text">Ver Estadísticas</span>
                <span class="arrow-icon">→</span>
              </div>
            </div>
          </NuxtLink>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.admin-dashboard-page {
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
  background: radial-gradient(circle, rgba(239, 68, 68, 0.12) 0%, rgba(168, 85, 247, 0.08) 50%, transparent 70%);
  filter: blur(80px);
  pointer-events: none;
  z-index: 0;
}

.admin-container {
  max-width: 1100px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

/* 1. Header */
.admin-hero {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2.5rem;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.profile-main {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.admin-avatar {
  position: relative;
  width: 64px;
  height: 64px;
  border-radius: 18px;
  background: linear-gradient(135deg, #f43f5e 0%, #a855f7 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  box-shadow: 0 8px 25px rgba(244, 63, 94, 0.35);
}

.root-badge {
  position: absolute;
  bottom: -6px;
  right: -6px;
  background: #0b0f19;
  color: #fca5a5;
  border: 1px solid rgba(244, 63, 94, 0.5);
  font-size: 0.65rem;
  font-weight: 800;
  padding: 0.1rem 0.4rem;
  border-radius: 6px;
}

.role-badge-wrap {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 0.35rem;
}

.role-pill {
  background: rgba(244, 63, 94, 0.15);
  border: 1px solid rgba(244, 63, 94, 0.3);
  color: #fda4af;
  font-size: 0.8rem;
  font-weight: 700;
  padding: 0.2rem 0.65rem;
  border-radius: 6px;
}

.status-pill {
  background: rgba(16, 185, 129, 0.15);
  color: #34d399;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.2rem 0.65rem;
  border-radius: 6px;
}

.admin-name {
  font-size: 1.85rem;
  font-weight: 800;
  color: #f8fafc;
  line-height: 1.2;
}

.text-gradient {
  background: linear-gradient(135deg, #f43f5e 0%, #a855f7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.admin-desc {
  font-size: 0.875rem;
  color: #94a3b8;
  margin-top: 0.25rem;
}

.btn-logout-action {
  background: rgba(22, 30, 49, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #cbd5e1;
  font-size: 0.875rem;
  font-weight: 600;
  padding: 0.65rem 1.25rem;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-logout-action:hover {
  background: rgba(239, 68, 68, 0.15);
  border-color: rgba(239, 68, 68, 0.3);
  color: #f87171;
}

/* 2. KPIs */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.25rem;
  margin-bottom: 3rem;
}

.kpi-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: rgba(22, 30, 49, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 1.25rem;
  backdrop-filter: blur(12px);
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

.icon-purple { background: rgba(168, 85, 247, 0.15); color: #c084fc; }
.icon-blue { background: rgba(99, 102, 241, 0.15); color: #818cf8; }
.icon-amber { background: rgba(251, 191, 36, 0.15); color: #fbbf24; }
.icon-emerald { background: rgba(52, 211, 153, 0.15); color: #34d399; }

.kpi-content {
  display: flex;
  flex-direction: column;
}

.kpi-value {
  font-size: 1.55rem;
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

.kpi-sub.positive { color: #34d399; font-weight: 600; }
.status-ok { color: #34d399; font-weight: 600; }

/* 3. Módulos */
.modules-section {
  margin-top: 1rem;
}

.section-title-box {
  margin-bottom: 2rem;
}

.section-tag {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #f43f5e;
  margin-bottom: 0.35rem;
}

.section-heading {
  font-size: 1.65rem;
  font-weight: 800;
  color: #f8fafc;
  margin-bottom: 0.35rem;
}

.section-subtitle {
  font-size: 0.95rem;
  color: #94a3b8;
}

.modules-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.module-card {
  position: relative;
  display: flex;
  flex-direction: column;
  background: rgba(22, 30, 49, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 1.75rem;
  text-decoration: none;
  overflow: hidden;
  backdrop-filter: blur(16px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.5);
}

.module-card:hover {
  transform: translateY(-4px);
  border-color: rgba(99, 102, 241, 0.4);
  box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.7);
}

.card-users:hover { border-color: rgba(244, 63, 94, 0.5); }
.card-events:hover { border-color: rgba(99, 102, 241, 0.5); }
.card-categories:hover { border-color: rgba(251, 191, 36, 0.5); }
.card-stats:hover { border-color: rgba(52, 211, 153, 0.5); }

.module-icon-wrap {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  margin-bottom: 1.25rem;
}

.icon-users-bg { background: rgba(244, 63, 94, 0.15); }
.icon-events-bg { background: rgba(99, 102, 241, 0.15); }
.icon-categories-bg { background: rgba(251, 191, 36, 0.15); }
.icon-stats-bg { background: rgba(52, 211, 153, 0.15); }

.module-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.module-title {
  font-size: 1.25rem;
  font-weight: 800;
  color: #f8fafc;
}

.module-badge {
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.2rem 0.55rem;
  border-radius: 6px;
}

.badge-active {
  background: rgba(16, 185, 129, 0.15);
  color: #34d399;
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.badge-wip {
  background: rgba(148, 163, 184, 0.12);
  color: #94a3b8;
  border: 1px solid rgba(148, 163, 184, 0.25);
}

.module-desc {
  font-size: 0.875rem;
  color: #94a3b8;
  line-height: 1.55;
  margin-bottom: 1.5rem;
  flex: 1;
}

.module-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  font-size: 0.875rem;
  font-weight: 700;
  color: #818cf8;
}

.arrow-icon {
  font-size: 1.1rem;
  transition: transform 0.2s;
}

.module-card:hover .arrow-icon {
  transform: translateX(4px);
}
</style>
