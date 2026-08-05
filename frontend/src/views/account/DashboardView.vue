<template>
  <div class="space-y-6">
    <div class="glass-card rounded-3xl p-6 lg:p-8 bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 shadow-lg">
      <h2 class="text-2xl font-display font-bold text-gray-900 dark:text-white mb-2">{{ $t('account.overview', 'Aperçu du compte') }}</h2>
      <p class="text-gray-500 dark:text-gray-400 mb-8">{{ $t('account.overview_desc', 'Gérez vos informations et consultez vos activités récentes.') }}</p>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Orders Stat -->
        <div class="p-6 rounded-2xl bg-gradient-to-br from-foxer-orange/10 to-orange-500/10 border border-foxer-orange/20 relative overflow-hidden group">
          <div class="absolute top-0 right-0 w-24 h-24 bg-foxer-orange/20 rounded-full blur-xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500"></div>
          <div class="relative z-10 flex items-center justify-between">
            <div>
              <p class="text-foxer-orange text-sm font-bold uppercase tracking-wider mb-1">{{ $t('account.total_orders', 'Commandes') }}</p>
              <p class="text-3xl font-display font-bold text-gray-900 dark:text-white">{{ orders.length }}</p>
            </div>
            <div class="w-12 h-12 rounded-xl bg-foxer-orange/20 text-foxer-orange flex items-center justify-center">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
            </div>
          </div>
        </div>

        <!-- Wishlist Stat -->
        <div class="p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20 relative overflow-hidden group">
          <div class="absolute top-0 right-0 w-24 h-24 bg-blue-500/20 rounded-full blur-xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500"></div>
          <div class="relative z-10 flex items-center justify-between">
            <div>
              <p class="text-blue-500 text-sm font-bold uppercase tracking-wider mb-1">{{ $t('account.wishlist', 'Favoris') }}</p>
              <p class="text-3xl font-display font-bold text-gray-900 dark:text-white">{{ authStore.user?.wishlist?.length || 0 }}</p>
            </div>
            <div class="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-500 flex items-center justify-center">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Orders Summary -->
      <div class="mt-10">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-display font-bold text-gray-900 dark:text-white">{{ $t('account.recent_orders', 'Commandes récentes') }}</h3>
          <router-link to="/account/orders" class="text-foxer-orange hover:text-orange-600 font-bold text-sm">{{ $t('account.view_all', 'Voir tout') }} &rarr;</router-link>
        </div>

        <div v-if="loading" class="animate-pulse space-y-4">
          <div v-for="i in 3" :key="i" class="h-20 bg-gray-200 dark:bg-white/5 rounded-2xl"></div>
        </div>
        
        <div v-else-if="orders.length === 0" class="text-center py-10 bg-gray-50 dark:bg-white/5 rounded-2xl border border-dashed border-gray-300 dark:border-white/20">
          <div class="w-16 h-16 mx-auto bg-gray-200 dark:bg-white/10 rounded-full flex items-center justify-center mb-4 text-gray-400">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
          </div>
          <p class="text-gray-500 dark:text-gray-400">{{ $t('account.no_orders', 'Aucune commande pour le moment.') }}</p>
        </div>

        <div v-else class="space-y-4">
          <div v-for="order in recentOrders" :key="order.id" class="flex flex-col sm:flex-row items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10 hover:border-foxer-orange/50 transition-colors">
            <div class="flex items-center gap-4 mb-4 sm:mb-0">
              <div class="w-12 h-12 rounded-full bg-foxer-orange/10 flex items-center justify-center text-foxer-orange font-bold">
                #{{ order.id.substring(0, 4) }}
              </div>
              <div>
                <p class="font-bold text-gray-900 dark:text-white">{{ new Date(order.createdAt).toLocaleDateString() }}</p>
                <p class="text-sm text-gray-500">{{ order.orderItems?.length || 0 }} {{ $t('account.items', 'articles') }}</p>
              </div>
            </div>
            <div class="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
              <span class="font-display font-bold text-lg text-gray-900 dark:text-white">{{ order.totalPrice }} TL</span>
              <span :class="getStatusClass(order.status)" class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                {{ order.status }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '../../stores/auth'
import api from '../../api'

const authStore = useAuthStore()
const orders = ref([])
const loading = ref(true)

const recentOrders = computed(() => {
  return orders.value.slice(0, 3)
})

const fetchOrders = async () => {
  loading.value = true
  try {
    const res = await api.get('/orders')
    if (res.data.status === 'success') {
      orders.value = res.data.orders || []
    }
  } catch (error) {
    console.error('Error fetching orders:', error)
  } finally {
    loading.value = false
  }
}

const getStatusClass = (status) => {
  switch(status?.toUpperCase()) {
    case 'PENDING': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400'
    case 'PROCESSING': return 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400'
    case 'SHIPPED': return 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400'
    case 'DELIVERED': return 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400'
    case 'CANCELLED': return 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400'
    default: return 'bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-300'
  }
}

onMounted(() => {
  fetchOrders()
})
</script>
