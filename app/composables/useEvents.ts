import { ref } from 'vue'

export const useEvents = () => {
    const loading = ref(false)
    const error = ref<string | null>(null)
    const tokenCookie = useCookie('auth_token')



    const createEvent = async (eventData: any) => {
        loading.value = true
        error.value = null

        try {
            const data = await $fetch<any>('http://localhost:4000/api/events', {
                method: 'POST',
                body: eventData,
                headers: {
                    Authorization: `Bearer ${tokenCookie.value}`
                }
            })

            return { ok: true, data }

        } catch (err: any) {
            error.value = err.data?.message || 'Error al crear la actividad'
            return { ok: false, error: error.value }
        } finally {
            loading.value = false
        }
    }

    const getEvents = async () => {
        loading.value = true
        error.value = null
        try {
            const data = await $fetch<any>('http://localhost:4000/api/events')
            return { ok: true, data: data?.data?.events || data?.data || [] }
        } catch (err: any) {
            error.value = err.data?.message || 'Error al cargar actividades'
            return { ok: false, error: error.value, data: [] }
        } finally {
            loading.value = false
        }
    }

    const getEventById = async (id: string) => {
        loading.value = true
        error.value = null
        try {
            const data = await $fetch<any>(`http://localhost:4000/api/events/${id}`)
            return { ok: true, data: data?.data?.event || data?.data }
        } catch (err: any) {
            error.value = err.data?.message || 'Error al obtener la actividad'
            return { ok: false, error: error.value }
        } finally {
            loading.value = false
        }
    }

    const updateEvent = async (id: string, eventData: any) => {
        loading.value = true
        error.value = null
        try {
            const data = await $fetch<any>(`http://localhost:4000/api/events/${id}`, {
                method: 'PATCH',
                body: eventData,
                headers: {
                    Authorization: `Bearer ${tokenCookie.value}`
                }
            })
            return { ok: true, data }
        } catch (err: any) {
            error.value = err.data?.message || 'Error al actualizar actividad'
            return { ok: false, error: error.value }
        } finally {
            loading.value = false
        }
    }

    const deleteEvent = async (id: string) => {
        loading.value = true
        error.value = null

        try {
            const data = await $fetch<any>(`http://localhost:4000/api/events/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${tokenCookie.value}`
                }
            })

            return { ok: true, data }

        } catch (err: any) {
            error.value = err.data?.message || 'Error al eliminar actividad'
            return { ok: false, error: error.value }

        } finally {
            loading.value = false
        }
    }

    const getCategories = async () => {
        try {
            const data = await $fetch<any>('http://localhost:4000/api/categories')
            return { ok: true, data: data?.data || [] }
        } catch (err: any) {
            return { ok: false, error: err.data?.message || 'Error al cargar categorías', data: [] }
        }
    }

    return {
        loading,
        error,
        createEvent,
        getEvents,
        getEventById,
        updateEvent,
        deleteEvent,
        getCategories
    }

}