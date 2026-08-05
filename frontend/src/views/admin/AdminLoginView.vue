<template>
  <div class="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center p-6 relative overflow-hidden transition-colors duration-300">
    <!-- Abstract Background -->
    <div class="absolute inset-0 z-0">
      <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-foxer-orange/20 dark:bg-foxer-orange/10 rounded-full blur-[100px]"></div>
      <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 dark:bg-blue-500/10 rounded-full blur-[100px]"></div>
    </div>

    <!-- Login Card -->
    <div class="relative z-10 w-full max-w-md">
      <div class="glass-card rounded-[2rem] p-8 md:p-10 bg-white/80 dark:bg-white/5 backdrop-blur-2xl border border-gray-200 dark:border-white/10 shadow-2xl">
        <div class="text-center mb-10">
          <div class="w-16 h-16 bg-foxer-orange/10 dark:bg-foxer-orange/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-foxer-orange/20 dark:border-foxer-orange/30 shadow-inner">
            <svg class="w-8 h-8 text-foxer-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
          </div>
          <h1 class="text-3xl font-display font-bold text-gray-900 dark:text-white mb-2">FoxerSport Admin</h1>
          <p class="text-gray-500 dark:text-gray-400">Accès restreint au panneau d'administration</p>
        </div>

        <div v-if="authStore.error" class="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm font-bold flex items-center gap-3">
          <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          {{ authStore.error }}
        </div>

        <form @submit.prevent="handleLogin" class="space-y-6">
          <div class="space-y-2">
            <label class="block text-sm font-bold text-gray-700 dark:text-gray-300">Email Administratif</label>
            <input 
              v-model="email" 
              type="email" 
              required
              class="w-full px-5 py-4 rounded-xl bg-white dark:bg-black/40 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-foxer-orange focus:ring-1 focus:ring-foxer-orange transition-all outline-none shadow-sm"
              placeholder="admin@foxersport.com"
            >
          </div>

          <div class="space-y-2">
            <label class="block text-sm font-bold text-gray-700 dark:text-gray-300">Mot de passe</label>
            <input 
              v-model="password" 
              type="password" 
              required
              class="w-full px-5 py-4 rounded-xl bg-white dark:bg-black/40 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-foxer-orange focus:ring-1 focus:ring-foxer-orange transition-all outline-none shadow-sm"
              placeholder="••••••••"
            >
          </div>

          <button 
            type="submit" 
            :disabled="authStore.loading"
            class="w-full py-4 rounded-xl bg-gradient-to-r from-foxer-orange to-orange-600 hover:from-orange-500 hover:to-red-600 text-white font-bold text-lg shadow-lg shadow-foxer-orange/20 transition-all active:scale-95 disabled:opacity-50"
          >
            <span v-if="authStore.loading" class="flex items-center justify-center gap-2">
              <svg class="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Connexion...
            </span>
            <span v-else>Accéder au Portail</span>
          </button>
        </form>

        <div class="mt-8 text-center flex items-center justify-between">
          <router-link to="/" class="text-sm font-bold text-gray-500 hover:text-foxer-orange transition-colors">
            &larr; Retour à la boutique
          </router-link>
          
          <button @click="toggleDark()" class="text-gray-400 hover:text-yellow-500 transition-colors">
            <svg v-if="isDark" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { useDark, useToggle } from '@vueuse/core'

const router = useRouter()
const authStore = useAuthStore()

const isDark = useDark()
const toggleDark = useToggle(isDark)

const email = ref('')
const password = ref('')

const handleLogin = async () => {
  const success = await authStore.login(email.value, password.value)
  if (success) {
    if (authStore.user?.role === 'ADMIN' || authStore.user?.role === 'admin') {
      router.push('/admin/dashboard')
    } else {
      authStore.error = "Accès refusé. Vous n'avez pas les privilèges d'administrateur."
      authStore.logout()
    }
  }
}
</script>
