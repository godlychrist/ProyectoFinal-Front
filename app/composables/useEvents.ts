import { ref } from 'vue'

export const useEvents = () => {
    const loading = ref(false)
    const error = ref<string | null>(null)
    const tokenCookie = useCookie('auth_token')



    // Crud Eventos
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
            const eventList = data?.data?.events || data?.data || []
            if (typeof window !== 'undefined' && eventList.length > 0) {
                localStorage.setItem('communityhub_cached_events', JSON.stringify(eventList))
            }
            return { ok: true, data: eventList, fromCache: false }
        } catch (err: any) {
            // Fallback Offline: leer de la caché local si no hay internet o el backend no responde
            if (typeof window !== 'undefined') {
                const cached = localStorage.getItem('communityhub_cached_events')
                if (cached) {
                    try {
                        const parsed = JSON.parse(cached)
                        return { ok: true, data: parsed, fromCache: true }
                    } catch (e) {}
                }
            }
            error.value = err.data?.message || 'Error al cargar actividades'
            return { ok: false, error: error.value, data: [] }
        } finally {
            loading.value = false
        }
    }

    const getFilteredEvents = async (filters?: {
        category?: string;
        organizer?: string;
        location?: string;
        search?: string;
        date?: string;
        available?: string;
    }) => {
        loading.value = true
        error.value = null
        try {
            const queryParams = new URLSearchParams()
            if (filters?.category && filters.category !== 'all') queryParams.append('category', filters.category)
            if (filters?.organizer && filters.organizer !== 'all') queryParams.append('organizer', filters.organizer)
            if (filters?.location && filters.location.trim()) queryParams.append('location', filters.location.trim())
            if (filters?.search && filters.search.trim()) queryParams.append('search', filters.search.trim())
            if (filters?.date) queryParams.append('date', filters.date)
            if (filters?.available && filters.available !== 'all') {
                queryParams.append('available', filters.available === 'available' ? 'true' : 'false')
            }

            const queryString = queryParams.toString() ? `?${queryParams.toString()}` : ''
            const data = await $fetch<any>(`http://localhost:4000/api/events/filtered${queryString}`)
            const filteredList = data?.data?.events || data?.data || []
            return { ok: true, data: filteredList, fromCache: false }
        } catch (err: any) {
            // Fallback Offline: filtrar en cliente sobre los datos cacheados
            if (typeof window !== 'undefined') {
                const cached = localStorage.getItem('communityhub_cached_events')
                if (cached) {
                    try {
                        let list = JSON.parse(cached)
                        if (filters?.category && filters.category !== 'all') {
                            list = list.filter((e: any) => (e.category?._id || e.category) === filters.category)
                        }
                        if (filters?.search && filters.search.trim()) {
                            const q = filters.search.toLowerCase().trim()
                            list = list.filter((e: any) => e.title?.toLowerCase().includes(q) || e.description?.toLowerCase().includes(q))
                        }
                        return { ok: true, data: list, fromCache: true }
                    } catch (e) {}
                }
            }
            error.value = err.data?.message || 'Error al filtrar actividades'
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
            const eventData = data?.data?.event || data?.data
            if (typeof window !== 'undefined' && eventData) {
                localStorage.setItem(`communityhub_event_${id}`, JSON.stringify(eventData))
            }
            return { ok: true, data: eventData, fromCache: false }
        } catch (err: any) {
            // Fallback Offline por ID
            if (typeof window !== 'undefined') {
                const cached = localStorage.getItem(`communityhub_event_${id}`)
                if (cached) {
                    try {
                        return { ok: true, data: JSON.parse(cached), fromCache: true }
                    } catch (e) {}
                }
            }
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
            const catList = data?.data || []
            if (typeof window !== 'undefined' && catList.length > 0) {
                localStorage.setItem('communityhub_cached_categories', JSON.stringify(catList))
            }
            return { ok: true, data: catList }
        } catch (err: any) {
            if (typeof window !== 'undefined') {
                const cached = localStorage.getItem('communityhub_cached_categories')
                if (cached) {
                    try {
                        return { ok: true, data: JSON.parse(cached) }
                    } catch (e) {}
                }
            }
            return { ok: false, error: err.data?.message || 'Error al cargar categorías', data: [] }
        }
    }

    const createCategory = async (categoryData: { name: string; description: string }) => {
        loading.value = true
        error.value = null
        try {
            const data = await $fetch<any>('http://localhost:4000/api/categories', {
                method: 'POST',
                body: categoryData,
                headers: {
                    Authorization: `Bearer ${tokenCookie.value}`
                }
            })
            return { ok: true, data: data?.data }
        } catch (err: any) {
            error.value = err.data?.message || 'Error al crear categoría'
            return { ok: false, error: error.value }
        } finally {
            loading.value = false
        }
    }

    const updateCategory = async (id: string, categoryData: { name?: string; description?: string }) => {
        loading.value = true
        error.value = null
        try {
            const data = await $fetch<any>(`http://localhost:4000/api/categories/${id}`, {
                method: 'PATCH',
                body: categoryData,
                headers: {
                    Authorization: `Bearer ${tokenCookie.value}`
                }
            })
            return { ok: true, data: data?.data }
        } catch (err: any) {
            error.value = err.data?.message || 'Error al actualizar categoría'
            return { ok: false, error: error.value }
        } finally {
            loading.value = false
        }
    }

    const deleteCategory = async (id: string) => {
        loading.value = true
        error.value = null
        try {
            const data = await $fetch<any>(`http://localhost:4000/api/categories/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${tokenCookie.value}`
                }
            })
            return { ok: true, data: data?.data }
        } catch (err: any) {
            error.value = err.data?.message || 'Error al eliminar categoría'
            return { ok: false, error: error.value }
        } finally {
            loading.value = false
        }
    }

    // Crud Registrations

    const registerForEvent = async (eventId: string) => {
        loading.value = true
        error.value = null
        try {
            const data = await $fetch<any>(`http://localhost:4000/api/events/${eventId}/register`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${tokenCookie.value}`
                }
            })
            return { ok: true, data }
        } catch (err: any) {
            error.value = err.data?.message || err.data?.error?.message || 'Error al inscribirse'
            return { ok: false, error: error.value }
        } finally {
            loading.value = false
        }
    }

    const cancelRegistration = async (eventId: string) => {
        loading.value = true
        error.value = null
        try {
            const data = await $fetch<any>(`http://localhost:4000/api/events/${eventId}/register`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${tokenCookie.value}`
                }
            })
            return { ok: true, data }
        } catch (err: any) {
            error.value = err.data?.message || err.data?.error?.message || 'Error al cancelar la inscripción'
            return { ok: false, error: error.value }
        } finally {
            loading.value = false
        }
    }

    const getMyRegistrations = async () => {
        try {
            const data = await $fetch<any>(`http://localhost:4000/api/users/me/registrations`, {
                headers: {
                    Authorization: `Bearer ${tokenCookie.value}`
                }
            })
            return { ok: true, data: data?.data?.registrations || [] }
        } catch (err: any) {
            return { ok: false, error: err.data?.message, data: [] }
        }
    }

    // Guardar favorito en la BD
    const addFavorite = async (eventId: string) => {
        try {
            const data = await $fetch<any>(`http://localhost:4000/api/events/${eventId}/favorite`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${tokenCookie.value}`
                }
            })
            return { ok: true, data }
        } catch (err: any) {
            return { ok: false, error: err.data?.message }
        }
    }

    // Eliminar favorito de la BD
    const removeFavorite = async (eventId: string) => {
        try {
            const data = await $fetch<any>(`http://localhost:4000/api/events/${eventId}/favorite`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${tokenCookie.value}`
                }
            })
            return { ok: true, data }
        } catch (err: any) {
            return { ok: false, error: err.data?.message }
        }
    }

    // Traer mis favoritos desde la BD
    const getMyFavorites = async () => {
        try {
            const data = await $fetch<any>('http://localhost:4000/api/users/me/favorites', {
                headers: {
                    Authorization: `Bearer ${tokenCookie.value}`
                }
            })
            return { ok: true, data: data?.data?.favorites || [] }
        } catch (err: any) {
            return { ok: false, error: err.data?.message, data: [] }
        }
    }


    // Traer estadísticas del dashboard del administrador
    const getAdminDashboardStats = async () => {
        loading.value = true
        error.value = null
        try {
            const data = await $fetch<any>('http://localhost:4000/api/dashboard/admin', {
                headers: {
                    Authorization: `Bearer ${tokenCookie.value}`
                }
            })
            return { ok: true, data: data?.data }
        } catch (err: any) {
            error.value = err.data?.message || 'Error al cargar estadísticas del administrador'
            return { ok: false, error: error.value }
        } finally {
            loading.value = false
        }
    }

    const getMyNotifications = async () => {
        try {
            const data = await $fetch<any>(`http://localhost:4000/api/users/me/notifications`, {
                headers: {
                    Authorization: `Bearer ${tokenCookie.value}`
                }
            })
            return { ok: true, data: data?.data?.notifications || data?.data || [] }
        } catch (err: any) {
            return { ok: false, error: err.data?.message, data: [] }
        }
    }

    const markNotificationAsRead = async (id: string) => {
        try {
            await $fetch<any>(`http://localhost:4000/api/notifications/${id}/read`, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${tokenCookie.value}`
                }
            })
            return { ok: true }
        } catch (err: any) {
            return { ok: false, error: err.data?.message }
        }
    }

    return {
        loading,
        error,
        createEvent,
        getEvents,
        getFilteredEvents,
        getEventById,
        updateEvent,
        deleteEvent,
        getCategories,
        createCategory,
        updateCategory,
        deleteCategory,
        registerForEvent,
        cancelRegistration,
        getMyRegistrations,
        addFavorite,
        removeFavorite,
        getMyFavorites,
        getAdminDashboardStats,
        getMyNotifications,
        markNotificationAsRead
    }

}