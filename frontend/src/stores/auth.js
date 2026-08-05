import { defineStore } from 'pinia'
import api from '../api'
import { useCartStore } from './cart'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    loading: false,
    error: null
  }),
  
  getters: {
    isAuthenticated: (state) => !!state.user,
  },
  
  actions: {
    async login(email, password) {
      this.loading = true
      this.error = null
      try {
        const response = await api.post('/auth/login', { email, password })
        if (response.data.status === 'success') {
          this.user = response.data.user
          await useCartStore().mergeGuestCart()
          return true
        }
      } catch (err) {
        this.error = err.response?.data?.message || 'Login failed'
        return false
      } finally {
        this.loading = false
      }
    },

    async loginWithGoogle(credential) {
      this.loading = true
      this.error = null
      try {
        const response = await api.post('/auth/google', { credential })
        if (response.data.status === 'success') {
          this.user = response.data.user
          await useCartStore().mergeGuestCart()
          return true
        }
      } catch (err) {
        if (err.response?.data?.code === 'USER_NOT_FOUND') {
          return { code: 'USER_NOT_FOUND', googleData: err.response.data.googleData }
        }
        this.error = err.response?.data?.message || 'Google Login failed'
        return false
      } finally {
        this.loading = false
      }
    },

    async register(userData) {
      this.loading = true
      this.error = null
      try {
        const response = await api.post('/auth/register', userData)
        if (response.data.status === 'success') {
          this.user = response.data.user
          await useCartStore().mergeGuestCart()
          return true
        }
      } catch (err) {
        this.error = err.response?.data?.message || 'Registration failed'
        return false
      } finally {
        this.loading = false
      }
    },

    async logout() {
      try {
        await api.post('/auth/logout')
      } catch (err) {
        console.error('Logout error', err)
      }
      this.user = null
    },

    async fetchProfile() {
      this.loading = true
      try {
        const response = await api.get('/auth/me')
        if (response.data.status === 'success') {
          this.user = response.data.user
        }
      } catch (err) {
        // Only log if it's not a standard 401 (not logged in) to avoid confusion
        if (err.response && err.response.status !== 401) {
          console.error('Failed to fetch profile', err)
        }
        this.logout()
      } finally {
        this.loading = false
      }
    }
  }
})
