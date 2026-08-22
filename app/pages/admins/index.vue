<script setup lang="ts">
// Meramente diseño visual - Dashboard del Administrador / SuperAdmin (Sin lógica conectada)
</script>

<template>
  <div class="admin-dashboard">
    <!-- Luz ambiental de fondo con acento carmesí/ámbar para Administrador -->
    <div class="bg-glow"></div>

    <div class="container dashboard-container">
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
            <h1 class="admin-name">Centro de Control: <span class="text-gradient-admin">CommunityHub Global</span></h1>
            <p class="admin-desc">Sesión Admin: miguel.admin@communityhub.org • Nivel de acceso: Total</p>
          </div>
        </div>

        <div class="hero-actions">
          <button class="btn-primary-admin">
            <span>⚙️ Configuración Global</span>
          </button>
          <button class="btn-secondary-action">
            📋 Ver Logs del Sistema
          </button>
        </div>
      </header>

      <!-- 2. KPIs Globales de la Plataforma -->
      <section class="kpi-grid">
        <div class="kpi-card">
          <div class="kpi-icon-wrap icon-purple">
            <span>👥</span>
          </div>
          <div class="kpi-content">
            <span class="kpi-value">1,248</span>
            <span class="kpi-label">Usuarios Totales</span>
            <span class="kpi-sub positive">+124 esta semana</span>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-icon-wrap icon-blue">
            <span>📅</span>
          </div>
          <div class="kpi-content">
            <span class="kpi-value">154</span>
            <span class="kpi-label">Actividades Totales</span>
            <span class="kpi-sub">89 activas • 65 pasadas</span>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-icon-wrap icon-emerald">
            <span>🗄️</span>
          </div>
          <div class="kpi-content">
            <span class="kpi-value">MongoDB Atlas</span>
            <span class="kpi-label">Base de Datos</span>
            <span class="kpi-sub status-ok">● Conexión Estable</span>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-icon-wrap icon-amber">
            <span>☁️</span>
          </div>
          <div class="kpi-content">
            <span class="kpi-value">AWS Serverless</span>
            <span class="kpi-label">Lambda & Cron Jobs</span>
            <span class="kpi-sub status-ok">● 0 errores en 24h</span>
          </div>
        </div>
      </section>

      <!-- 3. Contenido Principal: Gestión de Usuarios y Sidebar -->
      <div class="dashboard-layout">
        <!-- Columna Izquierda: Tabla de Usuarios y Moderación -->
        <main class="main-column">
          <!-- Barra de Título y Filtros -->
          <div class="section-title-bar">
            <div>
              <span class="sub-tag">Control de Cuentas</span>
              <h2 class="block-title">Directorio de Usuarios & Roles</h2>
            </div>

            <!-- Filtros de Rol -->
            <div class="filter-tabs">
              <button class="tab-btn active">Todos (1,248)</button>
              <button class="tab-btn">Organizadores (42)</button>
              <button class="tab-btn">Participantes (1,202)</button>
              <button class="tab-btn">Admins (4)</button>
            </div>
          </div>

          <!-- Buscador de Usuarios -->
          <div class="user-search-bar">
            <span class="search-icon">🔍</span>
            <input
              type="text"
              class="search-input"
              placeholder="Buscar usuario por nombre, correo o ID de MongoDB..."
            />
          </div>

          <!-- Tabla / Lista de Gestión de Usuarios -->
          <div class="users-table-card">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Correo</th>
                  <th>Rol Asignado</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <!-- Fila 1: Organizador -->
                <tr>
                  <td>
                    <div class="user-cell">
                      <div class="user-avatar-small avatar-purple">MR</div>
                      <div class="user-cell-meta">
                        <strong class="user-real-name">María Rodríguez</strong>
                        <small class="user-join">Registrado: Hoy</small>
                      </div>
                    </div>
                  </td>
                  <td class="email-text">maria.rodriguez@opensource.org</td>
                  <td>
                    <span class="role-tag role-organizer">🎯 Organizador</span>
                  </td>
                  <td>
                    <span class="status-indicator status-active">● Activo</span>
                  </td>
                  <td>
                    <div class="action-buttons">
                      <button class="btn-table-action" title="Cambiar rol">🔄 Rol</button>
                      <button class="btn-table-action" title="Editar">✏️</button>
                      <button class="btn-table-action btn-table-danger" title="Suspender">🚫</button>
                    </div>
                  </td>
                </tr>

                <!-- Fila 2: Participante -->
                <tr>
                  <td>
                    <div class="user-cell">
                      <div class="user-avatar-small avatar-blue">CM</div>
                      <div class="user-cell-meta">
                        <strong class="user-real-name">Carlos Mendoza</strong>
                        <small class="user-join">Registrado: Ayer</small>
                      </div>
                    </div>
                  </td>
                  <td class="email-text">carlos.mendoza@correo.com</td>
                  <td>
                    <span class="role-tag role-user">🙋‍♂️ Participante</span>
                  </td>
                  <td>
                    <span class="status-indicator status-active">● Activo</span>
                  </td>
                  <td>
                    <div class="action-buttons">
                      <button class="btn-table-action" title="Cambiar rol">🔄 Rol</button>
                      <button class="btn-table-action" title="Editar">✏️</button>
                      <button class="btn-table-action btn-table-danger" title="Suspender">🚫</button>
                    </div>
                  </td>
                </tr>

                <!-- Fila 3: Admin -->
                <tr>
                  <td>
                    <div class="user-cell">
                      <div class="user-avatar-small avatar-amber">MC</div>
                      <div class="user-cell-meta">
                        <strong class="user-real-name">Miguel Cruz</strong>
                        <small class="user-join">SuperAdmin Principal</small>
                      </div>
                    </div>
                  </td>
                  <td class="email-text">miguel.admin@communityhub.org</td>
                  <td>
                    <span class="role-tag role-admin">👑 Admin</span>
                  </td>
                  <td>
                    <span class="status-indicator status-active">● Activo</span>
                  </td>
                  <td>
                    <div class="action-buttons">
                      <button class="btn-table-action" title="Configurar permisos">🔒 Permisos</button>
                    </div>
                  </td>
                </tr>

                <!-- Fila 4: Participante Suspendido -->
                <tr>
                  <td>
                    <div class="user-cell">
                      <div class="user-avatar-small avatar-gray">JP</div>
                      <div class="user-cell-meta">
                        <strong class="user-real-name">Juan Pérez</strong>
                        <small class="user-join">Registrado: 10 Ago 2026</small>
                      </div>
                    </div>
                  </td>
                  <td class="email-text">juan.perez.spam@correo.com</td>
                  <td>
                    <span class="role-tag role-user">🙋‍♂️ Participante</span>
                  </td>
                  <td>
                    <span class="status-indicator status-suspended">● Suspendido</span>
                  </td>
                  <td>
                    <div class="action-buttons">
                      <button class="btn-table-action" title="Reactivar">✅ Reactivar</button>
                      <button class="btn-table-action btn-table-danger" title="Eliminar cuenta">🗑️</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Sección de Categorías del Sistema -->
          <div class="categories-admin-box">
            <div class="cat-header">
              <h3>🏷️ Categorías del Sistema</h3>
              <button class="btn-new-cat">+ Nueva Categoría</button>
            </div>
            <div class="cat-chips-list">
              <span class="cat-chip">💻 Tecnología <small>(32)</small></span>
              <span class="cat-chip">📚 Educación & Talleres <small>(24)</small></span>
              <span class="cat-chip">⚽ Deportes & Salud <small>(18)</small></span>
              <span class="cat-chip">🎨 Arte & Cultura <small>(15)</small></span>
              <span class="cat-chip">🌱 Voluntariado <small>(20)</small></span>
            </div>
          </div>
        </main>

        <!-- Columna Derecha: Sidebar de Monitoreo & Acciones -->
        <aside class="sidebar-column">
          <!-- Alertas del Sistema -->
          <div class="sidebar-card">
            <h3 class="sidebar-title">⚠️ Registro de Auditoría Reciente</h3>
            <div class="audit-stream">
              <div class="audit-item">
                <div class="audit-dot dot-green"></div>
                <div class="audit-body">
                  <p class="audit-text">Nuevo usuario <strong>Carlos Mendoza</strong> se registró con rol <em>user</em>.</p>
                  <span class="audit-time">Hace 10 min</span>
                </div>
              </div>

              <div class="audit-item">
                <div class="audit-dot dot-purple"></div>
                <div class="audit-body">
                  <p class="audit-text">Organizador <strong>OpenSource Labs</strong> publicó <em>Hackathon Serverless</em>.</p>
                  <span class="audit-time">Hace 45 min</span>
                </div>
              </div>

              <div class="audit-item">
                <div class="audit-dot dot-red"></div>
                <div class="audit-body">
                  <p class="audit-text">Intento fallido de login con credenciales erróneas (IP: 192.168.1.45).</p>
                  <span class="audit-time">Hace 2 horas</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Estado del Servidor & Seguridad -->
          <div class="sidebar-card server-status-box">
            <div class="server-header">
              <span class="server-icon">🖥️</span>
              <div>
                <h4>Servidor Express & MongoDB</h4>
                <p>Node.js v25 • Puerto 4000</p>
              </div>
            </div>
            <ul class="system-stats-list">
              <li>
                <span>Encriptación Contraseñas:</span>
                <strong>bcrypt (12 rounds)</strong>
              </li>
              <li>
                <span>Seguridad de Sesiones:</span>
                <strong>JWT (Expira en 24h)</strong>
              </li>
              <li>
                <span>Protección CORS:</span>
                <strong class="color-green">Habilitado</strong>
              </li>
              <li>
                <span>Manejo de Errores:</span>
                <strong>AppError Handler Activo</strong>
              </li>
            </ul>
          </div>

          <!-- Accesos Rápidos del SuperAdmin -->
          <div class="sidebar-card">
            <h3 class="sidebar-title">⚡ Navegación de SuperAdmin</h3>
            <div class="quick-links">
              <NuxtLink to="/managers" class="quick-link-item">
                <span>🎯 Ver Panel de Organizadores</span>
                <span>→</span>
              </NuxtLink>
              <NuxtLink to="/users" class="quick-link-item">
                <span>🙋‍♂️ Ver Panel de Participantes</span>
                <span>→</span>
              </NuxtLink>
              <NuxtLink to="/" class="quick-link-item">
                <span>🏠 Ir al Inicio (Público)</span>
                <span>→</span>
              </NuxtLink>
              <button class="quick-link-item logout-btn">
                <span>🚪 Cerrar Sesión Admin</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<style scoped>
.admin-dashboard {
  position: relative;
  min-height: calc(100vh - 72px);
  padding: 2.5rem 0 5rem;
}

/* Efecto de luz ambiental ámbar/dorado para admin */
.bg-glow {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 800px;
  height: 400px;
  background: radial-gradient(circle, rgba(245, 158, 11, 0.12) 0%, rgba(99, 102, 241, 0.08) 50%, transparent 70%);
  filter: blur(70px);
  pointer-events: none;
  z-index: 0;
}

.dashboard-container {
  position: relative;
  z-index: 1;
}

/* 1. Hero del Administrador */
.admin-hero {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(22, 30, 49, 0.85);
  border: 1px solid rgba(245, 158, 11, 0.2);
  border-radius: 20px;
  padding: 2rem 2.5rem;
  backdrop-filter: blur(16px);
  margin-bottom: 2rem;
  box-shadow: 0 15px 35px -10px rgba(0, 0, 0, 0.5);
  flex-wrap: wrap;
  gap: 1.5rem;
}

.profile-main {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.admin-avatar {
  position: relative;
  width: 68px;
  height: 68px;
  border-radius: 18px;
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #b45309 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 20px rgba(245, 158, 11, 0.35);
}

.avatar-icon {
  font-size: 2rem;
}

.root-badge {
  position: absolute;
  bottom: -6px;
  right: -6px;
  background: #dc2626;
  color: white;
  font-size: 0.65rem;
  font-weight: 800;
  padding: 0.15rem 0.45rem;
  border-radius: 6px;
  border: 2px solid #161e31;
  letter-spacing: 0.05em;
}

.role-badge-wrap {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.35rem;
}

.role-pill {
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.2rem 0.65rem;
  border-radius: 999px;
  background: rgba(245, 158, 11, 0.15);
  border: 1px solid rgba(245, 158, 11, 0.35);
  color: #fde68a;
}

.status-pill {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.2rem 0.65rem;
  border-radius: 999px;
  background: rgba(16, 185, 129, 0.12);
  border: 1px solid rgba(16, 185, 129, 0.3);
  color: #6ee7b7;
}

.admin-name {
  font-size: 1.65rem;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.text-gradient-admin {
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #f97316 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.admin-desc {
  font-size: 0.9rem;
  color: #94a3b8;
}

.hero-actions {
  display: flex;
  gap: 0.75rem;
}

.btn-primary-admin {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: #0b0f19;
  border: none;
  font-size: 0.9rem;
  font-weight: 800;
  padding: 0.75rem 1.4rem;
  border-radius: 12px;
  cursor: pointer;
  box-shadow: 0 6px 18px rgba(245, 158, 11, 0.3);
  transition: all 0.2s;
}

.btn-primary-admin:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(245, 158, 11, 0.45);
}

.btn-secondary-action {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #f8fafc;
  font-size: 0.9rem;
  font-weight: 600;
  padding: 0.75rem 1.2rem;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary-action:hover {
  background: rgba(255, 255, 255, 0.1);
}

/* 2. Grid de KPIs */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.25rem;
  margin-bottom: 2.5rem;
}

.kpi-card {
  display: flex;
  align-items: center;
  gap: 1.15rem;
  background: rgba(22, 30, 49, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 1.25rem 1.5rem;
  backdrop-filter: blur(12px);
}

.kpi-icon-wrap {
  width: 50px;
  height: 50px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  flex-shrink: 0;
}

.icon-purple { background: rgba(168, 85, 247, 0.15); border: 1px solid rgba(168, 85, 247, 0.3); }
.icon-blue { background: rgba(59, 130, 246, 0.15); border: 1px solid rgba(59, 130, 246, 0.3); }
.icon-emerald { background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.3); }
.icon-amber { background: rgba(245, 158, 11, 0.15); border: 1px solid rgba(245, 158, 11, 0.3); }

.kpi-content {
  display: flex;
  flex-direction: column;
}

.kpi-value {
  font-size: 1.55rem;
  font-weight: 800;
  color: #f8fafc;
  line-height: 1.15;
}

.kpi-label {
  font-size: 0.825rem;
  color: #94a3b8;
  font-weight: 500;
  margin-top: 0.15rem;
}

.kpi-sub {
  font-size: 0.75rem;
  color: #64748b;
  margin-top: 0.25rem;
}

.kpi-sub.positive {
  color: #34d399;
  font-weight: 600;
}

.status-ok {
  color: #34d399;
  font-weight: 600;
}

/* 3. Layout Principal */
.dashboard-layout {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 2rem;
  align-items: start;
}

.section-title-bar {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.sub-tag {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 700;
  color: #fbbf24;
}

.block-title {
  font-size: 1.45rem;
  font-weight: 800;
}

.filter-tabs {
  display: flex;
  gap: 0.4rem;
  background: rgba(11, 15, 25, 0.6);
  padding: 0.3rem;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.tab-btn {
  background: transparent;
  border: none;
  color: #94a3b8;
  font-size: 0.825rem;
  font-weight: 600;
  padding: 0.4rem 0.85rem;
  border-radius: 7px;
  cursor: pointer;
  transition: all 0.2s;
}

.tab-btn.active {
  background: rgba(245, 158, 11, 0.2);
  color: #fde68a;
}

/* Buscador de Usuarios */
.user-search-bar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: rgba(22, 30, 49, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 0.75rem 1.25rem;
  margin-bottom: 1.25rem;
}

.search-icon {
  font-size: 1rem;
  opacity: 0.7;
}

.search-input {
  width: 100%;
  background: transparent;
  border: none;
  color: white;
  font-size: 0.9rem;
  outline: none;
}

.search-input::placeholder {
  color: #64748b;
}

/* Tabla de Usuarios */
.users-table-card {
  background: rgba(22, 30, 49, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  overflow-x: auto;
  backdrop-filter: blur(12px);
  margin-bottom: 2rem;
}

.admin-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.admin-table th {
  padding: 1rem 1.25rem;
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #94a3b8;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(11, 15, 25, 0.4);
}

.admin-table td {
  padding: 1rem 1.25rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  font-size: 0.875rem;
}

.user-cell {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-avatar-small {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 800;
  color: white;
  flex-shrink: 0;
}

.avatar-purple { background: #a855f7; }
.avatar-blue { background: #3b82f6; }
.avatar-amber { background: #f59e0b; color: #0b0f19; }
.avatar-gray { background: #64748b; }

.user-cell-meta {
  display: flex;
  flex-direction: column;
}

.user-real-name {
  color: #f8fafc;
  font-size: 0.9rem;
}

.user-join {
  font-size: 0.72rem;
  color: #64748b;
}

.email-text {
  color: #cbd5e1;
  font-family: var(--font-mono);
  font-size: 0.825rem;
}

.role-tag {
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.25rem 0.65rem;
  border-radius: 6px;
  display: inline-block;
}

.role-organizer { background: rgba(168, 85, 247, 0.15); color: #d8b4fe; border: 1px solid rgba(168, 85, 247, 0.3); }
.role-user { background: rgba(99, 102, 241, 0.15); color: #a5b4fc; border: 1px solid rgba(99, 102, 241, 0.3); }
.role-admin { background: rgba(245, 158, 11, 0.15); color: #fde68a; border: 1px solid rgba(245, 158, 11, 0.35); }

.status-indicator {
  font-size: 0.75rem;
  font-weight: 600;
}

.status-active { color: #34d399; }
.status-suspended { color: #f87171; }

.action-buttons {
  display: flex;
  gap: 0.4rem;
}

.btn-table-action {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #cbd5e1;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.35rem 0.65rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-table-action:hover {
  background: rgba(255, 255, 255, 0.12);
  color: white;
}

.btn-table-danger {
  color: #f87171;
  border-color: rgba(239, 68, 68, 0.3);
}

.btn-table-danger:hover {
  background: rgba(239, 68, 68, 0.2);
}

/* Categorías del Sistema */
.categories-admin-box {
  background: rgba(22, 30, 49, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 1.5rem;
  backdrop-filter: blur(12px);
}

.cat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.cat-header h3 {
  font-size: 1.1rem;
  font-weight: 700;
}

.btn-new-cat {
  background: rgba(99, 102, 241, 0.15);
  border: 1px solid rgba(99, 102, 241, 0.3);
  color: #a5b4fc;
  font-size: 0.8rem;
  font-weight: 700;
  padding: 0.4rem 0.8rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-new-cat:hover {
  background: #6366f1;
  color: white;
}

.cat-chips-list {
  display: flex;
  gap: 0.6rem;
  flex-wrap: wrap;
}

.cat-chip {
  background: rgba(11, 15, 25, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 0.45rem 0.85rem;
  border-radius: 999px;
  font-size: 0.825rem;
  color: #cbd5e1;
}

.cat-chip small {
  color: #818cf8;
  font-weight: 700;
  margin-left: 0.2rem;
}

/* Sidebar */
.sidebar-column {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.sidebar-card {
  background: rgba(22, 30, 49, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 1.5rem;
  backdrop-filter: blur(12px);
}

.sidebar-title {
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #f8fafc;
}

/* Auditoría */
.audit-stream {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.audit-item {
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
}

.audit-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-top: 0.4rem;
  flex-shrink: 0;
}

.dot-green { background: #10b981; box-shadow: 0 0 8px #10b981; }
.dot-purple { background: #a855f7; box-shadow: 0 0 8px #a855f7; }
.dot-red { background: #ef4444; box-shadow: 0 0 8px #ef4444; }

.audit-text {
  font-size: 0.825rem;
  color: #cbd5e1;
  line-height: 1.35;
}

.audit-text strong {
  color: #f8fafc;
}

.audit-time {
  font-size: 0.72rem;
  color: #64748b;
  display: block;
  margin-top: 0.15rem;
}

/* Server Status Box */
.server-status-box {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(22, 30, 49, 0.9) 100%);
  border-color: rgba(16, 185, 129, 0.2);
}

.server-header {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  margin-bottom: 1rem;
}

.server-icon {
  font-size: 1.5rem;
}

.server-header h4 {
  font-size: 0.95rem;
  font-weight: 700;
}

.server-header p {
  font-size: 0.8rem;
  color: #94a3b8;
}

.system-stats-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  font-size: 0.8rem;
  color: #cbd5e1;
}

.system-stats-list li {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  padding-bottom: 0.4rem;
}

.color-green {
  color: #34d399;
}

/* Quick Links */
.quick-links {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.quick-link-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.65rem 0.85rem;
  background: rgba(11, 15, 25, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 10px;
  color: #cbd5e1;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s;
  cursor: pointer;
}

.quick-link-item:hover {
  background: rgba(245, 158, 11, 0.15);
  border-color: rgba(245, 158, 11, 0.3);
  color: #f8fafc;
}

.logout-btn {
  border-color: rgba(239, 68, 68, 0.2);
  color: #fca5a5;
  background: rgba(239, 68, 68, 0.06);
}

.logout-btn:hover {
  background: rgba(239, 68, 68, 0.15);
  border-color: rgba(239, 68, 68, 0.4);
  color: #f87171;
}

@media (max-width: 968px) {
  .dashboard-layout {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .admin-hero {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
