<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div>
        <h1 class="text-3xl font-display font-bold text-gray-900 dark:text-white mb-1">{{ $t('admin.settings_title') }}</h1>
        <p class="text-gray-500 dark:text-gray-400 text-sm">{{ $t('admin.settings_desc') }}</p>
      </div>
    </div>

    <div v-if="loading" class="animate-pulse grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-1 h-24 bg-gray-200 dark:bg-white/5 rounded-2xl"></div>
      <div class="lg:col-span-2 h-96 bg-gray-200 dark:bg-white/5 rounded-2xl"></div>
    </div>

    <div v-else class="space-y-8">
      <!-- General Settings -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-1">
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">{{ $t('admin.general') }}</h3>
          <p class="text-gray-500 dark:text-gray-400 text-sm mb-6">{{ $t('admin.general_desc') }}</p>
        </div>
        <div class="lg:col-span-2 glass-card rounded-[2rem] bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10 p-6 sm:p-8 shadow-sm">
          <form @submit.prevent="saveSettings" class="space-y-6">
            <div class="space-y-2">
              <label class="block text-sm font-bold text-gray-700 dark:text-gray-300">{{ $t('admin.store_name') }}</label>
              <input 
                type="text" 
                v-model="settings.store_name"
                :placeholder="$t('admin.store_name_placeholder')"
                class="w-full px-5 py-4 rounded-xl bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder-gray-400 focus:border-foxer-orange focus:ring-1 focus:ring-foxer-orange transition-all outline-none shadow-sm"
              >
            </div>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="block text-sm font-bold text-gray-700 dark:text-gray-300">{{ $t('admin.contact_email') }}</label>
                <input 
                  type="email" 
                  v-model="settings.contact_email"
                  :placeholder="$t('admin.contact_email_placeholder')"
                  class="w-full px-5 py-4 rounded-xl bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder-gray-400 focus:border-foxer-orange focus:ring-1 focus:ring-foxer-orange transition-all outline-none shadow-sm"
                >
              </div>
              <div class="space-y-2">
                <label class="block text-sm font-bold text-gray-700 dark:text-gray-300">{{ $t('admin.contact_phone') }}</label>
                <input 
                  type="tel" 
                  v-model="settings.contact_phone"
                  :placeholder="$t('admin.contact_phone_placeholder')"
                  class="w-full px-5 py-4 rounded-xl bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder-gray-400 focus:border-foxer-orange focus:ring-1 focus:ring-foxer-orange transition-all outline-none shadow-sm"
                >
              </div>
            </div>

            <div class="pt-6 border-t border-gray-200 dark:border-white/10 flex justify-end">
              <button 
                type="submit" 
                :disabled="saving"
                class="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-foxer-orange to-orange-600 hover:from-orange-500 hover:to-red-600 text-white rounded-xl font-bold shadow-lg shadow-foxer-orange/20 transition-all active:scale-95 disabled:opacity-50"
              >
                <svg v-if="saving" class="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ $t('admin.save') }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Promo Banner Settings -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-1">
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">{{ $t('admin.promo_banner_section') }}</h3>
          <p class="text-gray-500 dark:text-gray-400 text-sm mb-6">{{ $t('admin.promo_banner_desc') }}</p>
        </div>
        <div class="lg:col-span-2 glass-card rounded-[2rem] bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10 p-6 sm:p-8 shadow-sm">
          <form @submit.prevent="saveSettings" class="space-y-6">
            <!-- Toggle -->
            <div class="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-white/10">
              <div>
                <p class="font-bold text-gray-900 dark:text-white">{{ $t('admin.enable_banner') }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ $t('admin.enable_banner_desc') }}</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" v-model="bannerActive" class="sr-only peer">
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-[#222222] peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-foxer-orange"></div>
              </label>
            </div>

            <div v-if="bannerActive" class="space-y-4">
              <div class="space-y-2">
                <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider">🇫🇷 {{ $t('admin.text_fr') }}</label>
                <input type="text" v-model="settings.promo_banner_text_fr" :placeholder="$t('admin.text_fr_placeholder')" class="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white outline-none focus:border-foxer-orange">
              </div>
              <div class="space-y-2">
                <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider">🇬🇧 {{ $t('admin.text_en') }}</label>
                <input type="text" v-model="settings.promo_banner_text_en" :placeholder="$t('admin.text_en_placeholder')" class="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white outline-none focus:border-foxer-orange">
              </div>
              <div class="space-y-2">
                <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider">🇹🇷 {{ $t('admin.text_tr') }}</label>
                <input type="text" v-model="settings.promo_banner_text_tr" :placeholder="$t('admin.text_tr_placeholder')" class="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white outline-none focus:border-foxer-orange">
              </div>
            </div>

            <!-- Preview -->
            <div v-if="bannerActive && (settings.promo_banner_text_fr || settings.promo_banner_text_en)" class="p-4 rounded-xl bg-gradient-to-r from-foxer-orange to-[#ff7a33] text-white text-center text-sm font-bold">
              {{ settings.promo_banner_text_fr || settings.promo_banner_text_en }}
            </div>

            <div class="pt-6 border-t border-gray-200 dark:border-white/10 flex justify-end">
              <button 
                type="submit" 
                :disabled="saving"
                class="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-foxer-orange to-orange-600 hover:from-orange-500 hover:to-red-600 text-white rounded-xl font-bold shadow-lg shadow-foxer-orange/20 transition-all active:scale-95 disabled:opacity-50"
              >
                <svg v-if="saving" class="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ $t('admin.save') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import api from '../../api'

import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const toast = useToast()
const loading = ref(true)
const saving = ref(false)
const bannerActive = ref(false)

const settings = ref({
  store_name: '',
  contact_email: '',
  contact_phone: '',
  promo_banner_text_fr: '',
  promo_banner_text_en: '',
  promo_banner_text_tr: ''
})

const fetchSettings = async () => {
  loading.value = true
  try {
    const res = await api.get('/settings')
    if (res.data.status === 'success' && res.data.data) {
      const d = res.data.data
      // The backend returns { key: value } object
      settings.value.store_name = d.store_name || ''
      settings.value.contact_email = d.contact_email || ''
      settings.value.contact_phone = d.contact_phone || ''
      settings.value.promo_banner_text_fr = d.promo_banner_text_fr || ''
      settings.value.promo_banner_text_en = d.promo_banner_text_en || ''
      settings.value.promo_banner_text_tr = d.promo_banner_text_tr || ''
      
      // Handle boolean stored as Json
      bannerActive.value = d.promo_banner_active === true || d.promo_banner_active === 'true'
    }
  } catch (error) {
    console.error('Error fetching settings:', error)
    toast.error(t('admin.load_error_settings'))
  } finally {
    loading.value = false
  }
}

const saveSettings = async () => {
  saving.value = true
  try {
    const payload = {
      ...settings.value,
      promo_banner_active: bannerActive.value
    }

    const res = await api.put('/settings', payload)
    if (res.data.status === 'success') {
      toast.success(t('admin.settings_saved'))
    } else {
      toast.error(t('admin.save_error'))
    }
  } catch (error) {
    console.error('Error saving settings', error)
    toast.error(t('admin.save_error'))
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  fetchSettings()
})
</script>
