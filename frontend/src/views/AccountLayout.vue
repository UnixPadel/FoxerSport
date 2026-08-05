<template>
  <div class="bg-gray-50 dark:bg-foxer-dark h-full text-gray-900 dark:text-white pt-32 pb-24 transition-colors duration-300 -mt-4  lg:-mt-9 -mb-4">
    <div class="container mx-auto px-6 ">
      
      <!-- Header -->
      <div 
        class=" mb-4 flex items-center justify-between"
        v-motion
        :initial="{ opacity: 0, y: -20 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 600 } }"
      >
      
        
        <!-- Mobile Menu Toggle Button -->
        <button 
          @click="isMobileMenuOpen = true"
          class="lg:hidden flex items-center gap-2 px-4 py-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl shadow-sm"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <span class="text-sm font-bold">{{ $t('account.menu', 'Menu') }}</span>
        </button>
      </div>

      <div class="flex flex-col lg:flex-row gap-10">
        
        <!-- Sidebar Navigation -->
        <!-- Mobile Backdrop -->
        <div 
          v-if="isMobileMenuOpen" 
          @click="isMobileMenuOpen = false"
          class="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] lg:hidden"
        ></div>

        <aside 
          class="fixed inset-y-0 left-0 z-[110] w-[85%] max-w-[320px] bg-white/95 dark:bg-[#0a0a0a]/95 backdrop-blur-2xl shadow-2xl transform transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] lg:relative lg:transform-none lg:w-1/4 lg:bg-transparent lg:shadow-none lg:z-auto"
          :class="isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'"
        >
          <div class="h-full flex flex-col overflow-y-auto lg:overflow-visible p-5 lg:p-0">
            <!-- Mobile Close Button -->
            <button 
              @click="isMobileMenuOpen = false"
              class="lg:hidden self-end mb-4 w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 transition-colors"
            >
              <svg class="w-6 h-6 text-gray-500 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div class="glass-card lg:rounded-3xl p-0 lg:p-5 sticky top-32 border-none lg:border-solid bg-transparent lg:bg-white/80 dark:lg:bg-white/5 backdrop-blur-xl">
            
              <!-- Premium Profile Header -->
              <div class="bg-gradient-to-br from-foxer-orange to-orange-600 rounded-3xl p-6 mb-6 shadow-xl shadow-foxer-orange/20 text-white relative overflow-hidden group">
                <!-- Abstract decorative element -->
                <div class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700"></div>
                <div class="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2 group-hover:scale-150 transition-transform duration-700"></div>
                
                <div class="relative z-10 flex flex-col items-center">
                  <div class="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full mb-4 border border-white/40 flex items-center justify-center shadow-inner overflow-hidden">
                    <span class="text-3xl font-display font-bold text-white">{{ authStore.user?.firstName?.charAt(0) }}{{ authStore.user?.lastName?.charAt(0) }}</span>
                  </div>
                  <p class="text-white/80 text-[10px] uppercase tracking-[0.2em] font-bold mb-1">{{ $t('account.welcome') }}</p>
                  <h3 class="font-display font-bold text-2xl drop-shadow-md text-center line-clamp-1">{{ authStore.user?.firstName }} {{ authStore.user?.lastName }}</h3>
                </div>
              </div>

              <nav class="space-y-2 lg:mt-0 flex-grow">
                <router-link @click="isMobileMenuOpen = false" to="/account" class="group flex items-center space-x-4 px-4 py-3.5 rounded-2xl transition-all duration-300 hover:bg-gray-100 dark:hover:bg-white/5" exact-active-class="bg-foxer-orange/10 dark:bg-foxer-orange/20 !text-foxer-orange">
                  <div class="w-10 h-10 rounded-xl bg-gray-100 dark:bg-white/5 group-hover:bg-foxer-orange/20 flex items-center justify-center transition-colors group-[.router-link-exact-active]:bg-foxer-orange text-gray-500 dark:text-gray-400 group-hover:text-foxer-orange group-[.router-link-exact-active]:text-white">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                  </div>
                  <span class="text-[15px] font-bold text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white group-[.router-link-exact-active]:text-foxer-orange transition-colors">
                    {{ $t('account.dashboard') }}
                  </span>
                </router-link>

                <router-link @click="isMobileMenuOpen = false" to="/account/orders" class="group flex items-center space-x-4 px-4 py-3.5 rounded-2xl transition-all duration-300 hover:bg-gray-100 dark:hover:bg-white/5" exact-active-class="bg-foxer-orange/10 dark:bg-foxer-orange/20 !text-foxer-orange">
                  <div class="w-10 h-10 rounded-xl bg-gray-100 dark:bg-white/5 group-hover:bg-foxer-orange/20 flex items-center justify-center transition-colors group-[.router-link-exact-active]:bg-foxer-orange text-gray-500 dark:text-gray-400 group-hover:text-foxer-orange group-[.router-link-exact-active]:text-white">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                  </div>
                  <span class="text-[15px] font-bold text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white group-[.router-link-exact-active]:text-foxer-orange transition-colors">
                    {{ $t('account.orders') }}
                  </span>
                </router-link>

                <router-link @click="isMobileMenuOpen = false" to="/account/wishlist" class="group flex items-center space-x-4 px-4 py-3.5 rounded-2xl transition-all duration-300 hover:bg-gray-100 dark:hover:bg-white/5" exact-active-class="bg-foxer-orange/10 dark:bg-foxer-orange/20 !text-foxer-orange">
                  <div class="w-10 h-10 rounded-xl bg-gray-100 dark:bg-white/5 group-hover:bg-foxer-orange/20 flex items-center justify-center transition-colors group-[.router-link-exact-active]:bg-foxer-orange text-gray-500 dark:text-gray-400 group-hover:text-foxer-orange group-[.router-link-exact-active]:text-white">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                  </div>
                  <span class="text-[15px] font-bold text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white group-[.router-link-exact-active]:text-foxer-orange transition-colors">
                    {{ $t('account.wishlist') }}
                  </span>
                </router-link>

                <router-link @click="isMobileMenuOpen = false" to="/account/profile" class="group flex items-center space-x-4 px-4 py-3.5 rounded-2xl transition-all duration-300 hover:bg-gray-100 dark:hover:bg-white/5" exact-active-class="bg-foxer-orange/10 dark:bg-foxer-orange/20 !text-foxer-orange">
                  <div class="w-10 h-10 rounded-xl bg-gray-100 dark:bg-white/5 group-hover:bg-foxer-orange/20 flex items-center justify-center transition-colors group-[.router-link-exact-active]:bg-foxer-orange text-gray-500 dark:text-gray-400 group-hover:text-foxer-orange group-[.router-link-exact-active]:text-white">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  </div>
                  <span class="text-[15px] font-bold text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white group-[.router-link-exact-active]:text-foxer-orange transition-colors">
                    {{ $t('account.profile') }}
                  </span>
                </router-link>

                <div class="pt-4 mt-4 border-t border-gray-200 dark:border-white/10">
                  <button @click="handleLogout" class="w-full group flex items-center space-x-4 px-4 py-3.5 rounded-2xl transition-all duration-300 hover:bg-red-50 dark:hover:bg-red-500/10">
                    <div class="w-10 h-10 rounded-xl bg-gray-100 dark:bg-white/5 group-hover:bg-red-100 dark:group-hover:bg-red-500/20 flex items-center justify-center transition-colors text-gray-500 dark:text-gray-400 group-hover:text-red-500">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                    </div>
                    <span class="text-[15px] font-bold text-gray-700 dark:text-gray-300 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                      {{ $t('account.logout') }}
                    </span>
                  </button>
                </div>
              </nav>
            </div>
          </div>
        </aside>

        <!-- Main Content Area -->
        <main class="w-full lg:w-3/4">
          <!-- We use transition for smooth page changes within the account -->
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </main>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const isMobileMenuOpen = ref(false)

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
