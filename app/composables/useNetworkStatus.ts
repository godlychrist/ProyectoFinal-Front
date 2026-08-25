import { ref, onMounted, onUnmounted } from 'vue'

export const useNetworkStatus = () => {
  const isOnline = ref(true)

  const updateStatus = () => {
    if (typeof navigator !== 'undefined') {
      isOnline.value = navigator.onLine
    }
  }

  onMounted(() => {
    updateStatus()
    if (typeof window !== 'undefined') {
      window.addEventListener('online', updateStatus)
      window.addEventListener('offline', updateStatus)
    }
  })

  onUnmounted(() => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('online', updateStatus)
      window.removeEventListener('offline', updateStatus)
    }
  })

  return {
    isOnline
  }
}
