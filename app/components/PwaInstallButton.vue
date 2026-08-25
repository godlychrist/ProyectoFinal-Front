<script setup lang="ts">
import { ref, onMounted } from 'vue'

const deferredPrompt = ref<any>(null)
const isInstalled = ref(false)
const showHelpModal = ref(false)

onMounted(() => {
  if (typeof window !== 'undefined') {
    // Comprobar si ya está instalada o abierta en modo standalone
    if (
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true ||
      document.referrer.includes('android-app://')
    ) {
      isInstalled.value = true
    }

    // Capturar evento nativo de instalación
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault()
      deferredPrompt.value = e
    })

    window.addEventListener('appinstalled', () => {
      isInstalled.value = true
      deferredPrompt.value = null
      showHelpModal.value = false
    })
  }
})

const handleInstallClick = async () => {
  if (deferredPrompt.value) {
    deferredPrompt.value.prompt()
    const choice = await deferredPrompt.value.userChoice
    if (choice && choice.outcome === 'accepted') {
      deferredPrompt.value = null
    }
  } else {
    // Si el navegador no disparó el evento nativo automático, mostrar instrucciones interactivas
    showHelpModal.value = true
  }
}
</script>

<template>
  <div class="pwa-install-wrapper">
    <!-- Botón visible de instalación -->
    <button 
      v-if="!isInstalled" 
      class="btn-install-pwa" 
      @click="handleInstallClick"
      title="Instalar CommunityHub como Aplicación PWA"
    >
      <span class="pwa-icon">📲</span>
      <span>Instalar App</span>
    </button>

    <!-- Modal con instrucciones si el navegador no soporta el prompt automático -->
    <Teleport to="body">
      <div v-if="showHelpModal" class="modal-backdrop" @click="showHelpModal = false">
        <div class="modal-card" @click.stop>
          <div class="modal-icon">📲</div>
          <h3 class="modal-title">Cómo Instalar CommunityHub</h3>
          <p class="modal-desc">
            Instala CommunityHub en tu escritorio o celular para usarla a pantalla completa y acceder a tus boletos sin conexión a internet.
          </p>

          <div class="steps-list">
            <div class="step-item">
              <span class="step-num">1</span>
              <span>En tu navegador (Chrome / Edge), mira la esquina superior derecha y haz clic en los <strong>tres puntos `⋮`</strong> (o el icono de instalar en la barra de URL).</span>
            </div>
            <div class="step-item">
              <span class="step-num">2</span>
              <span>Selecciona <strong>"Instalar CommunityHub"</strong> o <strong>"Instalar este sitio como aplicación"</strong>.</span>
            </div>
            <div class="step-item">
              <span class="step-num">3</span>
              <span>¡Listo! Se creará un acceso directo en tu escritorio y barra de tareas.</span>
            </div>
          </div>

          <button class="btn-close-modal" @click="showHelpModal = false">
            ¡Entendido!
          </button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.pwa-install-wrapper {
  display: inline-flex;
  align-items: center;
}

.btn-install-pwa {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 0.45rem 0.95rem;
  border-radius: 10px;
  font-size: 0.825rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
  transition: all 0.2s ease;
}

.btn-install-pwa:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(16, 185, 129, 0.45);
  background: linear-gradient(135deg, #34d399 0%, #10b981 100%);
}

.pwa-icon {
  font-size: 1rem;
}

/* Modal Styling */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 1rem;
}

.modal-card {
  background: #111827;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 20px;
  padding: 2rem;
  max-width: 480px;
  width: 100%;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
  animation: pop-in 0.25s ease-out;
}

@keyframes pop-in {
  from { transform: scale(0.92); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.modal-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.modal-title {
  font-size: 1.35rem;
  font-weight: 800;
  color: #f8fafc;
  margin-bottom: 0.6rem;
}

.modal-desc {
  font-size: 0.9rem;
  color: #94a3b8;
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

.steps-list {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  text-align: left;
  margin-bottom: 1.75rem;
}

.step-item {
  display: flex;
  align-items: flex-start;
  gap: 0.85rem;
  font-size: 0.85rem;
  color: #cbd5e1;
  background: rgba(255, 255, 255, 0.04);
  padding: 0.75rem 1rem;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.step-num {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  background: #10b981;
  color: #ffffff;
  font-weight: 800;
  font-size: 0.75rem;
  border-radius: 50%;
  flex-shrink: 0;
}

.btn-close-modal {
  width: 100%;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  border: none;
  padding: 0.75rem;
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-close-modal:hover {
  opacity: 0.95;
  transform: translateY(-1px);
}
</style>
