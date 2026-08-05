<template>
  <div class="bg-gray-50 dark:bg-slate-900 min-h-screen text-gray-900 dark:text-gray-100 transition-colors duration-300 selection:bg-foxer-orange/30">
    <!-- Top Header -->
    <header class="h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl fixed top-0 w-full z-40 flex items-center justify-between px-6 shadow-sm border-b border-gray-200 dark:border-white/10">
      <div class="flex items-center gap-4">
        <button @click="isSidebarOpen = !isSidebarOpen" class="lg:hidden text-gray-500 dark:text-gray-400 hover:text-foxer-orange transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
        <router-link to="/admin/dashboard" class="text-xl font-display font-bold text-gray-900 dark:text-white tracking-wide flex items-center gap-2">
          Foxer<span class="text-foxer-orange">Admin</span>
        </router-link>
      </div>
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-2">
          <select 
            v-model="$i18n.locale" 
            class="bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 text-sm font-bold rounded-xl px-3 py-2 border-none focus:ring-2 focus:ring-foxer-orange outline-none cursor-pointer appearance-none"
            style="background-image: none;"
          >
            <option value="fr">🇫🇷 FR</option>
            <option value="en">🇬🇧 EN</option>
            <option value="tr">🇹🇷 TR</option>
            <option value="ar">🇸🇦 AR</option>
          </select>
        </div>
        <button @click="toggleDark()" class="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-yellow-400 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">
          <svg v-if="isDark" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
          <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
        </button>
        <a href="/" target="_blank" class="hidden sm:flex items-center gap-2 text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-foxer-orange transition-colors">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
          {{ $t('admin.store') }}
        </a>
        <div class="h-8 w-px bg-gray-200 dark:bg-white/10 mx-2 hidden sm:block"></div>
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-foxer-orange to-red-500 flex items-center justify-center font-bold text-white text-sm shadow-lg shadow-foxer-orange/20">
            {{ authStore.user?.firstName?.charAt(0) || 'A' }}
          </div>
          <span class="text-sm font-bold hidden sm:block">{{ authStore.user?.firstName || 'Admin' }}</span>
        </div>
      </div>
    </header>

    <div class="flex pt-16 h-screen overflow-hidden">
      <!-- Mobile Backdrop -->
      <div 
        v-if="isSidebarOpen" 
        @click="isSidebarOpen = false"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
      ></div>

      <!-- Sidebar -->
      <aside 
        class="fixed inset-y-0 left-0 pt-16 lg:pt-0 z-50 w-64 bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-white/5 transform transition-transform duration-300 lg:relative lg:translate-x-0"
        :class="isSidebarOpen ? 'translate-x-0' : '-translate-x-full'"
      >
        <div class="h-full flex flex-col p-4 overflow-y-auto">
          <nav class="space-y-2 flex-grow">
            <p class="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 mb-4 px-4 mt-4">{{ $t('admin.main_menu') }}</p>

            <router-link @click="isSidebarOpen = false" to="/admin/dashboard" class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-gray-600 dark:text-gray-300 hover:text-foxer-orange hover:bg-orange-50 dark:hover:bg-white/5" exact-active-class="!text-foxer-orange bg-orange-50 dark:bg-white/10 !border-l-4 !border-foxer-orange font-bold">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
              <span class="text-sm">{{ $t('admin.dashboard_title') }}</span>
            </router-link>

            <router-link @click="isSidebarOpen = false" to="/admin/products" class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-gray-600 dark:text-gray-300 hover:text-foxer-orange hover:bg-orange-50 dark:hover:bg-white/5" active-class="!text-foxer-orange bg-orange-50 dark:bg-white/10 !border-l-4 !border-foxer-orange font-bold">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
              <span class="text-sm">{{ $t('admin.products_title') }}</span>
            </router-link>

            <router-link @click="isSidebarOpen = false" to="/admin/orders" class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-gray-600 dark:text-gray-300 hover:text-foxer-orange hover:bg-orange-50 dark:hover:bg-white/5" active-class="!text-foxer-orange bg-orange-50 dark:bg-white/10 !border-l-4 !border-foxer-orange font-bold">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
              <span class="text-sm">{{ $t('admin.orders_title') }}</span>
            </router-link>

            <router-link to="/admin/blogs" class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200" :class="$route.path.startsWith('/admin/blogs') ? 'bg-gradient-to-r from-foxer-orange to-orange-500 text-white shadow-lg shadow-orange-500/30' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-foxer-orange'">
            <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-.586-1.414l-4.5-4.5A2 2 0 0012.586 3H12" /></svg>
            <span class="truncate">Blog & Articles</span>
          </router-link>

          <router-link to="/admin/campaigns" class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200" :class="$route.path.startsWith('/admin/campaigns') ? 'bg-gradient-to-r from-foxer-orange to-orange-500 text-white shadow-lg shadow-orange-500/30' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-foxer-orange'">
            <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>
            <span class="truncate">Campagnes (Email/WA)</span>
          </router-link>

            <router-link @click="isSidebarOpen = false" to="/admin/users" class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-gray-600 dark:text-gray-300 hover:text-foxer-orange hover:bg-orange-50 dark:hover:bg-white/5" active-class="!text-foxer-orange bg-orange-50 dark:bg-white/10 !border-l-4 !border-foxer-orange font-bold">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              <span class="text-sm">{{ $t('admin.users_title') }}</span>
            </router-link>
            
            <p class="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 mb-4 px-4 mt-8">{{ $t('admin.configuration') }}</p>

            <router-link @click="isSidebarOpen = false" to="/admin/settings" class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-gray-600 dark:text-gray-300 hover:text-foxer-orange hover:bg-orange-50 dark:hover:bg-white/5" active-class="!text-foxer-orange bg-orange-50 dark:bg-white/10 !border-l-4 !border-foxer-orange font-bold">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              <span class="text-sm">{{ $t('admin.settings') }}</span>
            </router-link>
          </nav>

          <div class="mt-8 border-t border-gray-200 dark:border-white/10 pt-4">
            <button @click="handleLogout" class="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-bold text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              <span class="text-sm">{{ $t('admin.logout') }}</span>
            </button>
          </div>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 overflow-y-auto transition-colors duration-300">
        <div class="p-6 lg:p-10 max-w-7xl mx-auto">
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </div>
      </main>
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
const isSidebarOpen = ref(false)

const isDark = useDark()
const toggleDark = useToggle(isDark)

const handleLogout = () => {
  authStore.logout()
  router.push('/admin/login')
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
