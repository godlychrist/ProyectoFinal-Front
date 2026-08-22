<script setup lang="ts">
import { ref } from 'vue'

const searchQuery = ref('')
const selectedCategory = ref('all')

const categories = [
  { id: 'all', name: 'Todas', icon: '✨' },
  { id: 'tech', name: 'Tecnología', icon: '💻' },
  { id: 'education', name: 'Educación & Talleres', icon: '📚' },
  { id: 'sports', name: 'Deportes & Salud', icon: '⚽' },
  { id: 'culture', name: 'Arte & Cultura', icon: '🎨' },
  { id: 'social', name: 'Voluntariado', icon: '🌱' }
]

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    navigateTo(`/actividades?q=${encodeURIComponent(searchQuery.value.trim())}`)
  } else {
    navigateTo('/actividades')
  }
}
</script>

<template>
  <div class="home-page">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-glow"></div>
      <div class="container hero-container">
        <div class="hero-badge">
          <span class="badge-dot"></span>
          <span>Plataforma Comunitaria Open Source</span>
        </div>

        <h1 class="hero-title">
          Conecta, Aprende y Participa en Actividades de tu <span class="text-gradient">Comunidad</span>
        </h1>

        <p class="hero-subtitle">
          Descubre talleres, eventos tecnológicos, encuentros deportivos y voluntariados. Inscríbete en un click y gestiona tus actividades incluso sin conexión.
        </p>

        <!-- Search Bar Hero -->
        <div class="search-box">
          <div class="search-input-wrap">
            <span class="search-icon">🔍</span>
            <input
              v-model="searchQuery"
              type="text"
              class="search-input"
              placeholder="Buscar por taller, tecnología, ubicación..."
              @keyup.enter="handleSearch"
            />
          </div>
          <button class="btn-search" @click="handleSearch">
            Buscar Eventos
          </button>
        </div>

        <!-- Quick CTAs -->
        <div class="hero-actions">
          <NuxtLink to="/actividades" class="btn-hero-primary">
            Explorar Catálogo <span>→</span>
          </NuxtLink>
          <NuxtLink to="/auth/register" class="btn-hero-secondary">
            Crear Actividad <span>+</span>
          </NuxtLink>
        </div>

        <!-- Stats Strip -->
        <div class="stats-strip">
          <div class="stat-item">
            <span class="stat-num">+150</span>
            <span class="stat-lbl">Actividades Activas</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-num">+2,400</span>
            <span class="stat-lbl">Miembros Registrados</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-num" style="color: #facc15;">WIP</span>
            <span class="stat-lbl">PWA Modo Offline</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-num" style="color: #facc15;">WIP</span>
            <span class="stat-lbl">AWS Serverless</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Categories Section -->
    <section id="categorias" class="container categories-section">
      <div class="section-header">
        <div>
          <span class="section-tag">Explora por Temáticas</span>
          <h2 class="section-title">Categorías Populares</h2>
        </div>
        <p class="section-desc">Filtra rápidamente las actividades según tus intereses y pasiones.</p>
      </div>

      <div class="categories-chips">
        <NuxtLink
          v-for="cat in categories"
          :key="cat.id"
          :to="cat.id === 'all' ? '/actividades' : `/actividades?cat=${cat.id}`"
          class="category-chip"
        >
          <span class="chip-icon">{{ cat.icon }}</span>
          <span class="chip-name">{{ cat.name }}</span>
        </NuxtLink>
      </div>
    </section>

    <!-- Architecture & Features Section -->
    <section id="pwa-features" class="features-section">
      <div class="container">
        <div class="section-header text-center">
          <span class="section-tag">Tecnología de Vanguardia</span>
          <h2 class="section-title">Diseñado con la Mejor Arquitectura</h2>
          <p class="section-desc">Una solución full-stack robusta construida con tecnologías de Software Libre.</p>
        </div>

        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">📱</div>
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem;">
              <h3 style="margin-bottom: 0;">Progressive Web App (PWA)</h3>
              <span class="badge-wip">WIP</span>
            </div>
            <p>
              Instala la aplicación en tu dispositivo móvil o de escritorio. Consulta actividades previamente guardadas en caché incluso cuando pierdas la conexión a Internet.
            </p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">⚡</div>
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem;">
              <h3 style="margin-bottom: 0;">AWS Lambda & Serverless</h3>
              <span class="badge-wip">WIP</span>
            </div>
            <p>
              Microservicios serverless en la nube de Amazon Web Services (AWS) para el envío automatizado de notificaciones de recordatorio y sincronización en segundo plano.
            </p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">🛡️</div>
            <h3>Seguridad & Control de Roles</h3>
            <p>
              Autenticación robusta con tokens JWT, protección de contraseñas con bcrypt y permisos específicos para Usuarios, Organizadores y Administradores.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="container cta-section">
      <div class="cta-box">
        <div class="cta-content">
          <h2>¿Listo para formar parte de CommunityHub?</h2>
          <p>
            Crea tu cuenta gratuita hoy y comienza a organizar y participar en las mejores iniciativas de tu comunidad.
          </p>
          <div class="cta-buttons">
            <NuxtLink to="/auth/register" class="btn-cta-primary">
              Comenzar Ahora Gratis
            </NuxtLink>
            <NuxtLink to="/auth/login" class="btn-cta-secondary">
              Ya tengo una cuenta
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home-page {
  overflow-x: hidden;
}

/* Hero Section */
.hero-section {
  position: relative;
  padding: 5rem 0 3.5rem;
  overflow: hidden;
}

.hero-glow {
  position: absolute;
  top: -100px;
  left: 50%;
  transform: translateX(-50%);
  width: 600px;
  height: 400px;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, rgba(168, 85, 247, 0.15) 40%, rgba(11, 15, 25, 0) 70%);
  filter: blur(50px);
  pointer-events: none;
  z-index: 0;
}

.hero-container {
  position: relative;
  z-index: 1;
  text-align: center;
  max-width: 900px;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(99, 102, 241, 0.12);
  border: 1px solid rgba(99, 102, 241, 0.3);
  padding: 0.35rem 1rem;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 600;
  color: #a5b4fc;
  margin-bottom: 1.5rem;
}

.badge-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #6366f1;
  box-shadow: 0 0 10px #6366f1;
}

.hero-title {
  font-size: 3.25rem;
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: -0.03em;
  margin-bottom: 1.25rem;
}

.hero-subtitle {
  font-size: 1.15rem;
  color: #94a3b8;
  max-width: 720px;
  margin: 0 auto 2.25rem;
  line-height: 1.6;
}

/* Search Box */
.search-box {
  display: flex;
  gap: 0.75rem;
  max-width: 650px;
  margin: 0 auto 2rem;
  background: rgba(22, 30, 49, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.12);
  padding: 0.5rem;
  border-radius: 14px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(12px);
}

.search-input-wrap {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
  padding-left: 0.75rem;
}

.search-icon {
  font-size: 1.1rem;
  opacity: 0.8;
}

.search-input {
  width: 100%;
  background: transparent;
  border: none;
  color: white;
  font-size: 0.95rem;
  font-family: inherit;
  outline: none;
}

.search-input::placeholder {
  color: #64748b;
}

.btn-search {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-search:hover {
  opacity: 0.95;
  box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4);
}

/* Hero Actions */
.hero-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 3.5rem;
  flex-wrap: wrap;
}

.btn-hero-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
  color: white;
  text-decoration: none;
  font-weight: 700;
  padding: 0.85rem 1.75rem;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(99, 102, 241, 0.35);
  transition: all 0.2s ease;
}

.btn-hero-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 30px rgba(99, 102, 241, 0.5);
}

.btn-hero-secondary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #f8fafc;
  text-decoration: none;
  font-weight: 600;
  padding: 0.85rem 1.75rem;
  border-radius: 12px;
  transition: all 0.2s ease;
}

.btn-hero-secondary:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.25);
  transform: translateY(-2px);
}

/* Stats Strip */
.stats-strip {
  display: flex;
  align-items: center;
  justify-content: space-around;
  background: rgba(22, 30, 49, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 1.5rem;
  backdrop-filter: blur(12px);
  flex-wrap: wrap;
  gap: 1rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
}

.stat-num {
  font-size: 1.65rem;
  font-weight: 800;
  color: #f8fafc;
}

.stat-lbl {
  font-size: 0.825rem;
  color: #94a3b8;
  font-weight: 500;
}

.stat-divider {
  width: 1px;
  height: 40px;
  background: rgba(255, 255, 255, 0.1);
}

/* Section Header Styles */
.section-header {
  margin-bottom: 2rem;
}

.section-header.text-center {
  text-align: center;
}

.section-header.text-center .section-desc {
  margin: 0.5rem auto 0;
}

.section-header-flex {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.section-tag {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 700;
  color: #818cf8;
  display: block;
  margin-bottom: 0.35rem;
}

.section-title {
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.section-desc {
  color: #94a3b8;
  font-size: 1rem;
  max-width: 550px;
}

.results-count {
  font-size: 0.9rem;
  color: #94a3b8;
}

.results-count strong {
  color: #f8fafc;
}

/* Categories Section */
.categories-section {
  padding: 3rem 1.5rem;
}

.categories-chips {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.category-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.65rem 1.25rem;
  border-radius: 999px;
  background: rgba(22, 30, 49, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #cbd5e1;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.category-chip:hover {
  border-color: #6366f1;
  color: white;
  transform: translateY(-1px);
}

.category-chip.active {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  border-color: transparent;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

/* Events Section */
.events-section {
  padding: 2rem 1.5rem 5rem;
}

.events-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.75rem;
}

.event-card {
  background: rgba(22, 30, 49, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(12px);
  transition: all 0.25s ease;
}

.event-card:hover {
  transform: translateY(-4px);
  border-color: rgba(99, 102, 241, 0.35);
  box-shadow: 0 15px 35px -5px rgba(0, 0, 0, 0.6);
}

.card-banner {
  padding: 1.25rem 1.5rem 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cat-pill {
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  border: 1px solid;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.fav-btn {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 0.95rem;
  transition: all 0.2s;
}

.fav-btn:hover {
  background: rgba(255, 255, 255, 0.12);
  transform: scale(1.1);
}

.card-body {
  padding: 1rem 1.5rem;
  flex: 1;
}

.event-meta-time {
  font-size: 0.825rem;
  color: #94a3b8;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.65rem;
}

.meta-dot {
  color: #475569;
}

.event-title {
  font-size: 1.2rem;
  font-weight: 700;
  line-height: 1.35;
  margin-bottom: 0.6rem;
  color: #f8fafc;
}

.event-desc {
  color: #94a3b8;
  font-size: 0.885rem;
  line-height: 1.5;
  margin-bottom: 1.25rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.event-location {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #cbd5e1;
  font-size: 0.85rem;
  margin-bottom: 1.25rem;
}

/* Capacity Indicator */
.capacity-section {
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  padding: 0.75rem;
  margin-bottom: 1.25rem;
}

.capacity-header {
  display: flex;
  justify-content: space-between;
  font-size: 0.785rem;
  margin-bottom: 0.4rem;
  color: #94a3b8;
}

.capacity-header strong {
  color: #38bdf8;
}

.capacity-bar-bg {
  height: 6px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 999px;
  overflow: hidden;
}

.capacity-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #6366f1 0%, #38bdf8 100%);
  border-radius: 999px;
  transition: width 0.3s ease;
}

/* Organizer */
.organizer-info {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding-top: 0.75rem;
  border-top: 1px dashed rgba(255, 255, 255, 0.08);
}

.org-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #a855f7 0%, #6366f1 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.85rem;
  color: white;
}

.org-details {
  display: flex;
  flex-direction: column;
}

.org-name {
  font-size: 0.85rem;
  font-weight: 600;
  color: #f1f5f9;
}

.org-role {
  font-size: 0.725rem;
  color: #64748b;
}

/* Card Footer */
.card-footer {
  padding: 1rem 1.5rem;
  background: rgba(0, 0, 0, 0.2);
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  gap: 0.75rem;
}

.btn-detail {
  flex: 1;
  padding: 0.6rem 0.8rem;
  border-radius: 8px;
  text-align: center;
  font-size: 0.85rem;
  font-weight: 600;
  color: #cbd5e1;
  text-decoration: none;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition: all 0.2s;
}

.btn-detail:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.btn-action {
  flex: 1.3;
  padding: 0.6rem 0.8rem;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
}

.btn-register {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

.btn-register:hover {
  opacity: 0.95;
  box-shadow: 0 6px 16px rgba(99, 102, 241, 0.4);
}

.btn-registered {
  background: rgba(16, 185, 129, 0.15);
  color: #34d399;
  border: 1px solid rgba(16, 185, 129, 0.4);
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 4rem 1.5rem;
  background: rgba(22, 30, 49, 0.5);
  border: 1px dashed rgba(255, 255, 255, 0.1);
  border-radius: 16px;
}

.empty-icon {
  font-size: 2.5rem;
  display: block;
  margin-bottom: 1rem;
}

.empty-state h3 {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: #94a3b8;
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
}

.btn-reset-filter {
  background: #6366f1;
  color: white;
  border: none;
  padding: 0.55rem 1.25rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}

/* Features Section */
.features-section {
  background: #080c14;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  padding: 5rem 0;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
}

.feature-card {
  background: rgba(22, 30, 49, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.06);
  padding: 2rem;
  border-radius: 16px;
  transition: all 0.2s;
}

.feature-card:hover {
  border-color: rgba(99, 102, 241, 0.3);
  transform: translateY(-2px);
}

.feature-icon {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.feature-card h3 {
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
}

.feature-card p {
  color: #94a3b8;
  font-size: 0.9rem;
  line-height: 1.6;
}

/* CTA Section */
.cta-section {
  padding: 5rem 1.5rem 2rem;
}

.cta-box {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(168, 85, 247, 0.15) 100%);
  border: 1px solid rgba(99, 102, 241, 0.3);
  border-radius: 24px;
  padding: 4rem 2rem;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.cta-content {
  max-width: 650px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.cta-content h2 {
  font-size: 2.25rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  margin-bottom: 1rem;
}

.cta-content p {
  color: #cbd5e1;
  font-size: 1.05rem;
  margin-bottom: 2rem;
}

.cta-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-cta-primary {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  text-decoration: none;
  font-weight: 700;
  padding: 0.85rem 2rem;
  border-radius: 10px;
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4);
  transition: all 0.2s;
}

.btn-cta-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(99, 102, 241, 0.55);
}

.btn-cta-secondary {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: white;
  text-decoration: none;
  font-weight: 600;
  padding: 0.85rem 2rem;
  border-radius: 10px;
  transition: all 0.2s;
}

.btn-cta-secondary:hover {
  background: rgba(255, 255, 255, 0.14);
}

.badge-wip {
  display: inline-block;
  font-size: 0.65rem;
  font-weight: 800;
  text-transform: uppercase;
  background: rgba(234, 179, 8, 0.2);
  color: #facc15;
  border: 1px solid rgba(234, 179, 8, 0.4);
  padding: 0.15rem 0.45rem;
  border-radius: 6px;
  vertical-align: middle;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2.35rem;
  }
  .search-box {
    flex-direction: column;
  }
  .stats-strip {
    grid-template-columns: 1fr 1fr;
    display: grid;
  }
  .stat-divider {
    display: none;
  }
  .events-grid {
    grid-template-columns: 1fr;
  }
}
</style>