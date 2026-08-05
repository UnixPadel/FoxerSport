<template>
  <div class="fixed top-0 left-0 w-full z-50 flex flex-col">
    <!-- Promo Banner -->
    <div v-if="isBannerActive" class="bg-gradient-to-r from-foxer-orange via-[#ff7a33] to-foxer-orange animate-[shimmer_2s_linear_infinite] bg-[length:200%_auto] text-white text-sm py-2 px-4 text-center font-bold tracking-wide w-full shadow-md z-50">
      <span class="inline-block animate-bounce mr-1">🔥</span> {{ currentPromoText }} <span class="inline-block animate-bounce ml-1">🔥</span>
    </div>

    <header 
      class="w-full transition-all duration-500"
      :class="(isScrolled || !isHome) ? 'glass py-3 shadow-[0_10px_30px_rgba(0,0,0,0.05)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.5)]' : 'bg-transparent py-5'"
    >
      <div class="container mx-auto px-6">
        <div class="flex items-center justify-between">
          
          <!-- Logo -->
          <router-link to="/" class="flex-shrink-0">
            <img src="https://foxersport.com/image/catalog/foxer-logo.png" alt="Foxer" class="h-8 md:h-10 object-contain drop-shadow-lg" />
          </router-link>

          <!-- Desktop Navigation -->
          <nav aria-label="Main Navigation" class="hidden lg:flex items-center space-x-8">
            <router-link to="/products?categorySlug=clothing" class="text-sm font-semibold tracking-wide text-gray-800 dark:text-gray-200 hover:text-foxer-orange dark:hover:text-foxer-orange transition-colors relative group uppercase">
              {{ $t('nav.clothing') }}
              <span class="absolute -bottom-2 left-0 w-0 h-0.5 bg-foxer-orange transition-all duration-300 group-hover:w-full"></span>
            </router-link>
            <router-link to="/products?categorySlug=rackets" class="text-sm font-semibold tracking-wide text-gray-800 dark:text-gray-200 hover:text-foxer-orange dark:hover:text-foxer-orange transition-colors relative group uppercase">
              {{ $t('nav.rackets') }}
              <span class="absolute -bottom-2 left-0 w-0 h-0.5 bg-foxer-orange transition-all duration-300 group-hover:w-full"></span>
            </router-link>
            <router-link to="/products?categorySlug=accessories" class="text-sm font-semibold tracking-wide text-gray-800 dark:text-gray-200 hover:text-foxer-orange dark:hover:text-foxer-orange transition-colors relative group uppercase">
              {{ $t('nav.accessories') }}
              <span class="absolute -bottom-2 left-0 w-0 h-0.5 bg-foxer-orange transition-all duration-300 group-hover:w-full"></span>
            </router-link>
            <router-link to="/products?categorySlug=shoes" class="text-sm font-semibold tracking-wide text-gray-800 dark:text-gray-200 hover:text-foxer-orange dark:hover:text-foxer-orange transition-colors relative group uppercase">
              {{ $t('nav.shoes') }}
              <span class="absolute -bottom-2 left-0 w-0 h-0.5 bg-foxer-orange transition-all duration-300 group-hover:w-full"></span>
            </router-link>
            <router-link to="/products?categorySlug=training-equipment" class="text-sm font-semibold tracking-wide text-gray-800 dark:text-gray-200 hover:text-foxer-orange dark:hover:text-foxer-orange transition-colors relative group uppercase">
              {{ $t('nav.equipment') }}
              <span class="absolute -bottom-2 left-0 w-0 h-0.5 bg-foxer-orange transition-all duration-300 group-hover:w-full"></span>
            </router-link>
            <router-link to="/products?categorySlug=bags" class="text-sm font-semibold tracking-wide text-gray-800 dark:text-gray-200 hover:text-foxer-orange dark:hover:text-foxer-orange transition-colors relative group uppercase">
              {{ $t('nav.bags') }}
              <span class="absolute -bottom-2 left-0 w-0 h-0.5 bg-foxer-orange transition-all duration-300 group-hover:w-full"></span>
            </router-link>

          </nav>

          <!-- Right Side Actions -->
          <div class="flex items-center space-x-4">
            
            <!-- Language Switcher -->
            <div class="relative group flex items-center">
              <select v-model="$i18n.locale" class="appearance-none bg-transparent border-none text-gray-600 dark:text-gray-300 text-xs font-bold py-1 pl-1 pr-4 cursor-pointer hover:text-foxer-orange transition-colors uppercase focus:ring-0">
                <option value="tr">TR</option>
                <option value="en">EN</option>
                <option value="fr">FR</option>
                <option value="ar">AR</option>
              </select>
              <div class="pointer-events-none absolute right-0 flex items-center text-gray-400">
                <svg class="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>

            <!-- Currency Switcher -->
            <div class="relative group flex items-center">
              <select v-model="currencyStore.currency" @change="currencyStore.setCurrency($event.target.value)" class="appearance-none bg-transparent border-none text-gray-600 dark:text-gray-300 text-xs font-bold py-1 pl-1 pr-4 cursor-pointer hover:text-foxer-orange transition-colors uppercase focus:ring-0">
                <option value="TRY">TRY</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
              <div class="pointer-events-none absolute right-0 flex items-center text-gray-400">
                <svg class="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>

              <!-- Wishlist -->
              <router-link to="/account/wishlist" class="text-gray-800 dark:text-gray-200 hover:text-foxer-orange dark:hover:text-foxer-orange transition-colors relative group">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span v-if="wishlistStore.wishlistItemCount > 0" class="absolute -top-2 -right-2 bg-foxer-orange text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white dark:border-foxer-dark">{{ wishlistStore.wishlistItemCount }}</span>
              </router-link>

            <!-- Theme Toggle -->
            <button id="theme-toggle" aria-label="Toggle theme" @click="toggleTheme" class="text-gray-600 hover:text-foxer-orange dark:text-gray-300 dark:hover:text-foxer-orange transition-colors">
              <!-- Sun Icon for Light Mode (shown when dark mode is active to switch to light) -->
              <svg v-if="theme === 'dark'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <!-- Moon Icon for Dark Mode (shown when light mode is active to switch to dark) -->
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            </button>

            <!-- Account Icon -->
            <router-link :to="authStore.isAuthenticated ? '/account' : '/login'" class="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors relative group">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <!-- Small dot indicator if logged in -->
              <span v-if="authStore.isAuthenticated" class="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full border border-black"></span>
            </router-link>

            <!-- Cart Button -->
            <router-link to="/cart" class="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white group">
              <div class="relative">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span v-if="cartStore.cartItemCount > 0" class="absolute -top-2 -right-2 bg-foxer-orange text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-lg group-hover:scale-110 transition-transform">{{ cartStore.cartItemCount }}</span>
              </div>
              <span class="ml-2 text-sm hidden md:block font-medium">{{ cartStore.cartTotal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") }}₺</span>
            </router-link>

            <!-- Mobile Menu Button -->
            <button class="lg:hidden text-gray-800 dark:text-white" @click="isMobileMenuOpen = !isMobileMenuOpen">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div 
        v-if="isMobileMenuOpen" 
        class="lg:hidden absolute top-full left-0 w-full backdrop-blur-2xl bg-white/95 dark:bg-[#0a0a0a]/95 border-t border-gray-200 dark:border-white/10 p-4 shadow-2xl"
      >
        <div class="flex flex-col space-y-4">
          <router-link to="/products?categorySlug=clothing" class="text-lg font-medium text-gray-900 dark:text-gray-200 hover:text-foxer-orange uppercase transition-colors" @click="isMobileMenuOpen = false">{{ $t('nav.clothing') }}</router-link>
          <router-link to="/products?categorySlug=rackets" class="text-lg font-medium text-gray-900 dark:text-gray-200 hover:text-foxer-orange uppercase transition-colors" @click="isMobileMenuOpen = false">{{ $t('nav.rackets') }}</router-link>
          <router-link to="/products?categorySlug=accessories" class="text-lg font-medium text-gray-900 dark:text-gray-200 hover:text-foxer-orange uppercase transition-colors" @click="isMobileMenuOpen = false">{{ $t('nav.accessories') }}</router-link>
          <router-link to="/products?categorySlug=shoes" class="text-lg font-medium text-gray-900 dark:text-gray-200 hover:text-foxer-orange uppercase transition-colors" @click="isMobileMenuOpen = false">{{ $t('nav.shoes') }}</router-link>
          <router-link to="/products?categorySlug=training-equipment" class="text-lg font-medium text-gray-900 dark:text-gray-200 hover:text-foxer-orange uppercase transition-colors" @click="isMobileMenuOpen = false">{{ $t('nav.equipment') }}</router-link>
          <router-link to="/products?categorySlug=bags" class="text-lg font-medium text-gray-900 dark:text-gray-200 hover:text-foxer-orange uppercase transition-colors" @click="isMobileMenuOpen = false">{{ $t('nav.bags') }}</router-link>

        </div>
      </div>
    </header>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useStorage } from '@vueuse/core'
import { useAuthStore } from '../stores/auth'
import { useCartStore } from '../stores/cart'
import { useWishlistStore } from '../stores/wishlist'
import { useCurrencyStore } from '../stores/currency'

import { useTheme } from '../composables/useTheme'
import { useI18n } from 'vue-i18n'
import api from '../api'

const route = useRoute()
const authStore = useAuthStore()
const cartStore = useCartStore()
const wishlistStore = useWishlistStore()
const currencyStore = useCurrencyStore()

const isScrolled = ref(false)
const isMobileMenuOpen = ref(false)
const isHome = computed(() => route.path === '/')

const { theme, toggleTheme } = useTheme()
const { locale, t } = useI18n()

const settings = ref({
  promo_banner_active: false,
  promo_banner_text_en: '',
  promo_banner_text_fr: '',
  promo_banner_text_tr: ''
})

const currentPromoText = computed(() => {
  const lang = locale.value || 'tr'
  return settings.value[`promo_banner_text_${lang}`] || t('promo')
})

const isBannerActive = computed(() => {
  return settings.value.promo_banner_active === true || settings.value.promo_banner_active === 'true'
})

const loadSettings = async () => {
  try {
    const res = await api.get('/settings')
    if (res.data && res.data.data) {
      settings.value = { ...settings.value, ...res.data.data }
    }
  } catch (error) {
    console.error('Failed to load settings:', error)
  }
}

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  cartStore.fetchCart()
  wishlistStore.fetchWishlist()
  loadSettings()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>
