import { ref } from 'vue'

export const useAuth = () => {

    const loading = ref(false)
    const error = ref<string | null>(null)
    const tokenCookie = useCookie('auth_token') // Guarda el token en el navegador
    const roleCookie = useCookie('user_role')
    const userIdCookie = useCookie('user_id')
    const userEmailCookie = useCookie('user_email')
    const userNameCookie = useCookie('user_name')

    const register = async (userData: { name: string, email: string, password: string, role: string }) => {
        loading.value = true
        error.value = null

        try {
            const data = await $fetch('http://localhost:4000/api/auth/register', {
                method: 'POST',
                body: userData
            })

            return { ok: true, data }

        } catch (err: any) {
            error.value = err.data?.message || 'Error al registrar el usuario'
            return { ok: false, error: error.value }

        } finally {
            loading.value = false
        }
    }

    const login = async (credentials: { email: string, password: string }) => {
        loading.value = true
        error.value = null

        try {
            const data = await $fetch<any>('http://localhost:4000/api/auth/login', {
                method: 'POST', // En GET no se manda el body
                body: credentials
            })
            // Guarda el token y datos de usuario que devolvió el servidor
            if (data?.data?.token) {
                tokenCookie.value = data.data.token
                roleCookie.value = data.data.role
                userIdCookie.value = data.data.userId
                userEmailCookie.value = data.data.email
                userNameCookie.value = data.data.name
            }

            return { ok: true, data }
        } catch (err: any) {
            error.value = err.data?.message || 'El correo electrónico o la contraseña son incorrectos'
            return { ok: false, error: error.value }
        } finally {
            loading.value = false
        }
    }

    const getMe = async () => {
        if (!tokenCookie.value) return { ok: false }
        try {
            const data = await $fetch<any>('http://localhost:4000/api/auth/me', {
                headers: {
                    Authorization: `Bearer ${tokenCookie.value}`
                }
            })
            if (data?.data?.userId) {
                userIdCookie.value = data.data.userId
                userEmailCookie.value = data.data.email
                userNameCookie.value = data.data.name
                roleCookie.value = data.data.role
            }
            return { ok: true, data: data?.data }
        } catch (e) {
            return { ok: false }
        }
    }

    const logout = () => {
        tokenCookie.value = null
        roleCookie.value = null
        userIdCookie.value = null
        userEmailCookie.value = null
        userNameCookie.value = null
        navigateTo('/auth/login')
    }

    return {
        register,
        login,
        logout,
        getMe,
        token: tokenCookie,
        loading,
        role: roleCookie,
        userId: userIdCookie,
        userEmail: userEmailCookie,
        userName: userNameCookie,
        error
    }
}