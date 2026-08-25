<template>
  <div class="app-root">
    <NuxtPwaManifest />
    <NuxtRouteAnnouncer />
    
    <!-- Navbar Global -->
    <Navbar />

    <!-- Contenido de las páginas -->
    <main class="main-content">
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </main>

    <!-- Footer Global -->
    <footer class="footer">
      <div class="container footer-content">
        <div class="footer-brand">
          <div class="logo-wrap">
            <span class="logo-badge">⚡</span>
            <h3>Community<span class="text-gradient">Hub</span></h3>
          </div>
          <p class="footer-desc">
            Plataforma comunitaria de actividades y eventos. Desarrollada con tecnologías de Software Libre: Express.js, MongoDB, Nuxt 4 y AWS Lambda.
          </p>
        </div>

        <div class="footer-links-group">
          <h4>Plataforma</h4>
          <NuxtLink to="">Explorar Eventos</NuxtLink>
          <NuxtLink to="/auth/register">Registrarse</NuxtLink>
          <NuxtLink to="/auth/login">Iniciar Sesión</NuxtLink>
        </div>

        <div class="footer-links-group">
          <h4>Software Libre</h4>
          <a href="https://github.com" target="_blank" rel="noopener">Código en GitHub</a>
          <NuxtLink to="/#pwa-features">Capacidades PWA</NuxtLink>
          <NuxtLink to="/#serverless">AWS Serverless</NuxtLink>
        </div>
      </div>

      <div class="footer-bottom container">
        <p>© 2026 CommunityHub — Licencia Open Source (MIT / GPL). Proyecto Final de Software Libre.</p>
      </div>
    </footer>
  </div>
</template>

<style>
/* Import Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap');

:root {
  --bg-dark: #0b0f19;
  --bg-card: rgba(22, 30, 49, 0.85);
  --border-color: rgba(255, 255, 255, 0.08);
  --primary: #6366f1;
  --primary-light: #818cf8;
  --text-main: #f8fafc;
  --text-muted: #94a3b8;
  --success: #10b981;
  --warning: #f59e0b;
  --font-sans: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: var(--font-sans);
  background-color: var(--bg-dark);
  color: var(--text-main);
  line-height: 1.6;
  min-height: 100vh;
  overflow-x: hidden;
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.text-gradient {
  background: linear-gradient(135deg, #818cf8 0%, #c084fc 50%, #f472b6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.main-content {
  min-height: calc(100vh - 72px - 260px);
}

/* Footer Styling */
.footer {
  background: #080c14;
  border-top: 1px solid var(--border-color);
  padding: 4rem 0 2rem;
  margin-top: 5rem;
}

.footer-content {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 3rem;
  margin-bottom: 3rem;
}

.footer-brand .logo-wrap {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  margin-bottom: 1rem;
}

.footer-brand .logo-badge {
  font-size: 1.3rem;
  background: rgba(99, 102, 241, 0.15);
  border: 1px solid rgba(99, 102, 241, 0.3);
  padding: 0.35rem 0.6rem;
  border-radius: 8px;
}

.footer-brand h3 {
  font-size: 1.35rem;
  font-weight: 800;
}

.footer-desc {
  color: var(--text-muted);
  font-size: 0.925rem;
  max-width: 440px;
  line-height: 1.6;
}

.footer-links-group h4 {
  color: var(--text-main);
  font-size: 0.95rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 1.25rem;
}

.footer-links-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.footer-links-group a {
  color: var(--text-muted);
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.2s;
}

.footer-links-group a:hover {
  color: var(--primary-light);
}

.footer-bottom {
  border-top: 1px solid var(--border-color);
  padding-top: 2rem;
  text-align: center;
  color: #64748b;
  font-size: 0.85rem;
}

@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}
</style>
