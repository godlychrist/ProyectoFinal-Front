import { ref } from 'vue'

export const useUsers = () => {
    const loading = ref(false)
    const error = ref<string | null>(null)
    const tokenCookie = useCookie('auth_token')

    const getUsers = async () => {
        loading.value = true
        error.value = null
        try {
            const data = await $fetch<any>('http://localhost:4000/api/users', {
                headers: {
                    Authorization: `Bearer ${tokenCookie.value}`
                }
            })
            return { ok: true, data: data?.data?.users || [] }
        } catch (err: any) {
            error.value = err.data?.message || 'Error al cargar usuarios'
            return { ok: false, error: error.value, data: [] }
        } finally {
            loading.value = false
        }
    }

    const updateUserRole = async (userId: string, role: string) => {
        loading.value = true
        error.value = null
        try {
            const data = await $fetch<any>(`http://localhost:4000/api/users/${userId}`, {
                method: 'PATCH',
                body: { role },
                headers: {
                    Authorization: `Bearer ${tokenCookie.value}`
                }
            })
            return { ok: true, data }
        } catch (err: any) {
            error.value = err.data?.message || 'Error al actualizar usuario'
            return { ok: false, error: error.value }
        } finally {
            loading.value = false
        }
    }

    const deleteUser = async (userId: string) => {
        loading.value = true
        error.value = null
        try {
            const data = await $fetch<any>(`http://localhost:4000/api/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${tokenCookie.value}`
                }
            })
            return { ok: true, data }
        } catch (err: any) {
            error.value = err.data?.message || 'Error al desactivar usuario'
            return { ok: false, error: error.value }
        } finally {
            loading.value = false
        }
    }

    return {
        loading,
        error,
        getUsers,
        updateUserRole,
        deleteUser
    }
}
