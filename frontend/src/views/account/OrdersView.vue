<template>
  <div class="space-y-6">
    <div class="glass-card rounded-3xl p-6 lg:p-8 bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 shadow-lg">
      <h2 class="text-2xl font-display font-bold text-gray-900 dark:text-white mb-2">{{ $t('account.my_orders', 'Mes Commandes') }}</h2>
      <p class="text-gray-500 dark:text-gray-400 mb-8">{{ $t('account.orders_desc', 'Consultez l\'historique et le statut de toutes vos commandes.') }}</p>

      <div v-if="loading" class="animate-pulse space-y-4">
        <div v-for="i in 4" :key="i" class="h-32 bg-gray-200 dark:bg-white/5 rounded-2xl"></div>
      </div>
      
      <div v-else-if="orders.length === 0" class="text-center py-16 bg-gray-50 dark:bg-white/5 rounded-2xl border border-dashed border-gray-300 dark:border-white/20">
        <div class="w-20 h-20 mx-auto bg-gray-200 dark:bg-white/10 rounded-full flex items-center justify-center mb-6 text-gray-400">
          <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
        </div>
        <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">{{ $t('account.no_orders_yet', 'Aucune commande') }}</h3>
        <p class="text-gray-500 dark:text-gray-400 mb-6">{{ $t('account.no_orders_desc', 'Vous n\'avez pas encore passé de commande sur notre boutique.') }}</p>
        <router-link to="/products" class="inline-block px-8 py-3 bg-foxer-orange hover:bg-orange-600 text-white rounded-xl font-bold transition-colors">
          {{ $t('account.start_shopping', 'Commencer mes achats') }}
        </router-link>
      </div>

      <div v-else class="space-y-6">
        <div v-for="order in orders" :key="order.id" class="bg-white dark:bg-[#0f0f0f] rounded-2xl border border-gray-200 dark:border-white/10 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
          <!-- Order Header -->
          <div class="p-6 border-b border-gray-100 dark:border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50 dark:bg-white/5">
            <div class="flex flex-wrap gap-x-8 gap-y-4">
              <div>
                <p class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-bold mb-1">{{ $t('account.order_number', 'N° Commande') }}</p>
                <p class="font-display font-bold text-gray-900 dark:text-white">#{{ order.id.substring(0, 8).toUpperCase() }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-bold mb-1">{{ $t('account.date', 'Date') }}</p>
                <p class="font-bold text-gray-900 dark:text-white">{{ new Date(order.createdAt).toLocaleDateString() }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-bold mb-1">{{ $t('account.total', 'Total') }}</p>
                <p class="font-display font-bold text-foxer-orange">{{ order.totalPrice }} TL</p>
              </div>
            </div>
            <div class="flex flex-col items-start md:items-end gap-2">
              <span :class="getStatusClass(order.status)" class="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border border-current/20">
                {{ order.status }}
              </span>
            </div>
          </div>
          
          <!-- Order Items -->
          <div class="p-6">
            <div class="space-y-4">
              <div v-for="item in order.orderItems" :key="item.id" class="flex items-center gap-4">
                <div class="w-20 h-20 bg-gray-100 dark:bg-black/40 rounded-xl overflow-hidden flex-shrink-0">
                  <img v-if="item.product?.images?.[0]?.url" 
                       :src="item.product.images[0].url.startsWith('/uploads/') ? 'http://localhost:3000' + item.product.images[0].url : item.product.images[0].url" 
                       class="w-full h-full object-cover" />
                  <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  </div>
                </div>
                <div class="flex-grow min-w-0">
                  <p class="font-bold text-gray-900 dark:text-white truncate">
                    {{ item.product?.translations?.[0]?.name || item.product?.slug || 'Produit' }}
                  </p>
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    {{ $t('account.qty', 'Qté') }}: {{ item.quantity }} &times; {{ item.price }} TL
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../../api'

const orders = ref([])
const loading = ref(true)

const fetchOrders = async () => {
  loading.value = true
  try {
    const res = await api.get('/orders')
    if (res.data.status === 'success') {
      // Sort by date descending
      orders.value = (res.data.orders || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    }
  } catch (error) {
    console.error('Error fetching orders:', error)
  } finally {
    loading.value = false
  }
}

const getStatusClass = (status) => {
  switch(status?.toUpperCase()) {
    case 'PENDING': return 'bg-yellow-50 text-yellow-600 dark:bg-yellow-500/10 dark:text-yellow-400'
    case 'PROCESSING': return 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400'
    case 'SHIPPED': return 'bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400'
    case 'DELIVERED': return 'bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400'
    case 'CANCELLED': return 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400'
    default: return 'bg-gray-50 text-gray-600 dark:bg-white/5 dark:text-gray-300'
  }
}

onMounted(() => {
  fetchOrders()
})
</script>
