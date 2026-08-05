<template>
  <div class="space-y-6">
    <div class="glass-card rounded-3xl p-6 lg:p-8 bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 shadow-lg">
      <h2 class="text-2xl font-display font-bold text-gray-900 dark:text-white mb-2">{{ $t('account.my_profile', 'Mon Profil') }}</h2>
      <p class="text-gray-500 dark:text-gray-400 mb-8">{{ $t('account.profile_desc', 'Mettez à jour vos informations personnelles et vos coordonnées.') }}</p>

      <form @submit.prevent="saveProfile" class="space-y-6 max-w-3xl">
        <div v-if="successMessage" class="p-4 rounded-xl bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 font-bold flex items-center gap-3">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
          {{ successMessage }}
        </div>
        
        <div v-if="errorMessage" class="p-4 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 font-bold flex items-center gap-3">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          {{ errorMessage }}
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-2">
            <label class="block text-sm font-bold text-gray-700 dark:text-gray-300">{{ $t('auth.first_name', 'Prénom') }}</label>
            <input 
              v-model="form.firstName" 
              type="text" 
              required
              class="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white focus:ring-2 focus:ring-foxer-orange/50 focus:border-foxer-orange transition-all outline-none"
            >
          </div>
          <div class="space-y-2">
            <label class="block text-sm font-bold text-gray-700 dark:text-gray-300">{{ $t('auth.last_name', 'Nom') }}</label>
            <input 
              v-model="form.lastName" 
              type="text" 
              required
              class="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white focus:ring-2 focus:ring-foxer-orange/50 focus:border-foxer-orange transition-all outline-none"
            >
          </div>
        </div>

        <div class="space-y-2">
          <label class="block text-sm font-bold text-gray-700 dark:text-gray-300">{{ $t('auth.email', 'Email') }}</label>
          <input 
            v-model="form.email" 
            type="email" 
            disabled
            class="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-black/40 border border-gray-200 dark:border-white/5 text-gray-500 cursor-not-allowed outline-none"
          >
          <p class="text-xs text-gray-400 mt-1">{{ $t('account.email_cannot_change', 'L\'adresse email ne peut pas être modifiée.') }}</p>
        </div>

        <div class="space-y-2">
          <label class="block text-sm font-bold text-gray-700 dark:text-gray-300">{{ $t('auth.phone', 'Téléphone') }}</label>
          <input 
            v-model="form.phone" 
            type="tel" 
            class="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white focus:ring-2 focus:ring-foxer-orange/50 focus:border-foxer-orange transition-all outline-none"
          >
        </div>

        <div class="pt-6 border-t border-gray-200 dark:border-white/10 flex justify-end">
          <button 
            type="submit" 
            :disabled="loading"
            class="px-8 py-3 bg-foxer-orange hover:bg-orange-600 disabled:opacity-50 text-white rounded-xl font-bold shadow-lg shadow-foxer-orange/20 transition-all active:scale-95"
          >
            <span v-if="loading" class="flex items-center gap-2">
              <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ $t('common.loading', 'Chargement...') }}
            </span>
            <span v-else>{{ $t('account.save_changes', 'Enregistrer les modifications') }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../../stores/auth'
import api from '../../api'

const authStore = useAuthStore()
const loading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: ''
})

onMounted(() => {
  if (authStore.user) {
    form.value.firstName = authStore.user.firstName || ''
    form.value.lastName = authStore.user.lastName || ''
    form.value.email = authStore.user.email || ''
    form.value.phone = authStore.user.phone || ''
  }
})

const saveProfile = async () => {
  loading.value = true
  successMessage.value = ''
  errorMessage.value = ''
  
  try {
    const res = await api.put('/users/profile', {
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      phone: form.value.phone
    })
    
    if (res.data.status === 'success') {
      successMessage.value = 'Profil mis à jour avec succès.'
      // Update local store
      authStore.user = { ...authStore.user, ...res.data.user }
    }
  } catch (err) {
    console.error(err)
    errorMessage.value = err.response?.data?.message || 'Une erreur est survenue lors de la mise à jour.'
  } finally {
    loading.value = false
  }
}
</script>
