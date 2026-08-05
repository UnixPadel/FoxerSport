<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div>
        <h1 class="text-3xl font-display font-bold text-gray-900 dark:text-white mb-1">{{ $t('admin.orders_title') }}</h1>
        <p class="text-gray-500 dark:text-gray-400 text-sm">{{ $t('admin.orders_desc') }}</p>
      </div>
      <div class="flex gap-2">
        <button @click="exportCSV" class="flex items-center gap-2 px-4 py-2 bg-white dark:bg-white/10 hover:bg-gray-50 dark:hover:bg-white/20 text-gray-900 dark:text-white border border-gray-200 dark:border-white/10 rounded-xl font-bold transition-colors shadow-sm">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          {{ $t('admin.export_csv') }}
        </button>
      </div>
    </div>

    <div class="glass-card rounded-[2rem] bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10 overflow-hidden shadow-sm">
      <!-- Controls -->
      <div class="p-6 border-b border-gray-200 dark:border-white/10 flex flex-col lg:flex-row gap-4 items-center justify-between bg-gray-50 dark:bg-slate-800">
        
        <!-- Search -->
        <div class="relative w-full lg:w-80">
          <input 
            type="text" 
            v-model="searchQuery"
            :placeholder="$t('admin.search_order')" 
            class="w-full pl-11 pr-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder-gray-400 focus:border-foxer-orange focus:ring-1 focus:ring-foxer-orange transition-all outline-none shadow-sm"
          >
          <svg class="w-5 h-5 text-gray-400 absolute left-4 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>

        <div class="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
          <!-- Date Filter -->
          <div class="flex items-center gap-2 w-full sm:w-auto">
            <input 
              type="date" 
              v-model="startDate"
              class="w-full sm:w-auto px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white focus:border-foxer-orange focus:ring-1 focus:ring-foxer-orange outline-none shadow-sm"
            >
            <span class="text-gray-400">-</span>
            <input 
              type="date" 
              v-model="endDate"
              class="w-full sm:w-auto px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white focus:border-foxer-orange focus:ring-1 focus:ring-foxer-orange outline-none shadow-sm"
            >
          </div>

          <!-- Status Filter -->
          <select 
            v-model="currentFilter"
            class="w-full sm:w-auto px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white focus:border-foxer-orange focus:ring-1 focus:ring-foxer-orange outline-none shadow-sm"
          >
            <option value="all">{{ $t('admin.all_statuses') }}</option>
            <option value="pending">{{ $t('admin.pending') }}</option>
            <option value="processing">{{ $t('admin.processing') }}</option>
            <option value="shipped">{{ $t('admin.shipped') }}</option>
            <option value="delivered">{{ $t('admin.delivered') }}</option>
            <option value="cancelled">{{ $t('admin.cancelled') }}</option>
          </select>
        </div>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse text-xs whitespace-nowrap">
          <thead>
            <tr class="bg-gray-50 dark:bg-slate-900 text-gray-500 dark:text-gray-400 text-sm uppercase tracking-wider font-bold">
              <th class="p-2 pl-6">{{ $t('admin.order_number') }}</th>
              <th class="p-2">{{ $t('admin.client') }}</th>
              <th class="p-2">{{ $t('admin.date') }}</th>
              <th class="p-2">{{ $t('admin.total') }}</th>
              <th class="p-2">{{ $t('admin.status') }}</th>
              <th class="p-2 pr-6 text-right">{{ $t('admin.actions') }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-white/5">
            <tr v-if="loading" v-for="i in 5" :key="i" class="animate-pulse">
              <td class="p-2 pl-6"><div class="h-6 bg-gray-200 dark:bg-white/5 rounded w-24"></div></td>
              <td class="p-2"><div class="h-6 bg-gray-200 dark:bg-white/5 rounded w-32"></div></td>
              <td class="p-2"><div class="h-6 bg-gray-200 dark:bg-white/5 rounded w-20"></div></td>
              <td class="p-2"><div class="h-6 bg-gray-200 dark:bg-white/5 rounded w-16"></div></td>
              <td class="p-2"><div class="h-8 bg-gray-200 dark:bg-white/5 rounded-full w-24"></div></td>
              <td class="p-2 pr-6"><div class="h-8 bg-gray-200 dark:bg-white/5 rounded-lg w-20 ml-auto"></div></td>
            </tr>
            
            <tr v-else-if="paginatedOrders.length === 0">
              <td colspan="6" class="p-12 text-center text-gray-500 dark:text-gray-400">
                <div class="w-16 h-16 mx-auto bg-gray-100 dark:bg-slate-900 rounded-full flex items-center justify-center mb-4">
                  <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                </div>
                {{ $t('admin.no_orders_found') || 'No orders match these criteria.' }}
              </td>
            </tr>

            <tr v-else v-for="order in paginatedOrders" :key="order.id" class="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
              <td class="p-2 pl-6">
                <span class="font-mono text-gray-900 dark:text-white font-bold bg-gray-100 dark:bg-white/5 px-2 py-1 rounded">{{ order.orderNumber || ('#' + order.id.substring(0, 8).toUpperCase()) }}</span>
              </td>
              <td class="p-2">
                <p class="text-gray-900 dark:text-white font-bold">{{ order.user?.firstName }} {{ order.user?.lastName }}</p>
                <p class="text-xs text-gray-500">{{ order.user?.email || 'N/A' }}</p>
              </td>
              <td class="p-2 text-gray-600 dark:text-gray-300">{{ new Date(order.createdAt).toLocaleDateString() }}</td>
              <td class="p-2 text-foxer-orange font-bold">{{ order.total }} TL</td>
              <td class="p-2">
                <select 
                  :value="order.status"
                  @change="updateOrderStatus(order.id, $event.target.value)"
                  class="px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider outline-none cursor-pointer border"
                  :class="getStatusClass(order.status)"
                >
                  <option value="pending" class="bg-white dark:bg-slate-900">{{ $t('admin.pending') }}</option>
                  <option value="processing" class="bg-white dark:bg-slate-900">{{ $t('admin.processing') }}</option>
                  <option value="shipped" class="bg-white dark:bg-slate-900">{{ $t('admin.shipped') }}</option>
                  <option value="delivered" class="bg-white dark:bg-slate-900">{{ $t('admin.delivered') }}</option>
                  <option value="cancelled" class="bg-white dark:bg-slate-900">{{ $t('admin.cancelled') }}</option>
                </select>
              </td>
              <td class="p-2 pr-6 text-right transition-colors whitespace-nowrap">
                <div class="flex flex-nowrap items-center justify-end gap-2">
                  <button @click="viewOrderDetail(order)" class="px-3 py-1.5 text-sm font-bold text-gray-700 dark:text-white bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 rounded-lg transition-colors">
                    {{ $t('admin.details', 'Détails') }}
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Pagination -->
      <div class="p-2 border-t border-gray-200 dark:border-white/10 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-slate-800">
        <p>{{ $t('admin.page') }} {{ currentPage }} / {{ totalPages }} ({{ filteredOrders.length }} {{ $t('admin.order_count') }})</p>
        <div class="flex gap-2">
          <button 
            @click="currentPage = Math.max(1, currentPage - 1)" 
            :disabled="currentPage <= 1"
            class="px-3 py-1 rounded-lg bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors disabled:opacity-50"
          >{{ $t('admin.previous') }}</button>
          <button 
            @click="currentPage = Math.min(totalPages, currentPage + 1)" 
            :disabled="currentPage >= totalPages"
            class="px-3 py-1 rounded-lg bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors disabled:opacity-50"
          >{{ $t('admin.next') }}</button>
        </div>
      </div>
    </div>

    <!-- Order Detail Modal -->
    <Teleport to="body">
      <div v-if="selectedOrder" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" @click="selectedOrder = null"></div>
        <div class="relative w-full max-w-lg bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-white/10 p-6 max-h-[90vh] overflow-y-auto">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-display font-bold text-gray-900 dark:text-white">{{ $t('admin.order_detail_title') }}</h3>
            <button @click="selectedOrder = null" class="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center text-gray-500 hover:text-red-500 transition-colors">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <div class="space-y-4 text-sm">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-gray-500 dark:text-gray-400 text-xs uppercase font-bold mb-1">{{ $t('admin.order_number') }}</p>
                <p class="font-mono font-bold text-gray-900 dark:text-white">{{ selectedOrder.orderNumber || selectedOrder.id.substring(0,8) }}</p>
              </div>
              <div>
                <p class="text-gray-500 dark:text-gray-400 text-xs uppercase font-bold mb-1">{{ $t('admin.status') }}</p>
                <span class="px-2 py-1 rounded-full text-xs font-bold uppercase" :class="getStatusClass(selectedOrder.status)">{{ selectedOrder.status }}</span>
              </div>
              <div>
                <p class="text-gray-500 dark:text-gray-400 text-xs uppercase font-bold mb-1">{{ $t('admin.client') }}</p>
                <p class="text-gray-900 dark:text-white font-bold">{{ selectedOrder.user?.firstName }} {{ selectedOrder.user?.lastName }}</p>
                <p class="text-gray-500">{{ selectedOrder.user?.email }}</p>
              </div>
              <div>
                <p class="text-gray-500 dark:text-gray-400 text-xs uppercase font-bold mb-1">{{ $t('admin.date') }}</p>
                <p class="text-gray-900 dark:text-white">{{ new Date(selectedOrder.createdAt).toLocaleString() }}</p>
              </div>
            </div>
            <div class="border-t border-gray-200 dark:border-white/10 pt-4">
              <div class="flex justify-between py-1"><span class="text-gray-500">{{ $t('admin.subtotal') }}</span><span class="font-bold text-gray-900 dark:text-white">{{ selectedOrder.subtotal || 0 }} TL</span></div>
              <div class="flex justify-between py-1"><span class="text-gray-500">{{ $t('admin.shipping') }}</span><span class="font-bold text-gray-900 dark:text-white">{{ selectedOrder.shippingCost || 0 }} TL</span></div>
              <div class="flex justify-between py-1"><span class="text-gray-500">{{ $t('admin.discount') }}</span><span class="font-bold text-green-600">-{{ selectedOrder.discountAmount || 0 }} TL</span></div>
              <div class="flex justify-between py-2 border-t border-gray-200 dark:border-white/10 mt-2"><span class="text-gray-900 dark:text-white font-bold text-base">{{ $t('admin.total') }}</span><span class="font-bold text-foxer-orange text-lg">{{ selectedOrder.total }} TL</span></div>
            </div>
            <div v-if="selectedOrder.trackingNumber" class="border-t border-gray-200 dark:border-white/10 pt-4">
              <p class="text-gray-500 dark:text-gray-400 text-xs uppercase font-bold mb-1">{{ $t('admin.tracking_number') }}</p>
              <p class="font-mono text-gray-900 dark:text-white">{{ selectedOrder.trackingNumber }}</p>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useToast } from 'vue-toastification'
import api from '../../api'

import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const toast = useToast()
const orders = ref([])
const loading = ref(true)
const selectedOrder = ref(null)

// Filters
const currentFilter = ref('all')
const searchQuery = ref('')
const startDate = ref('')
const endDate = ref('')

// Pagination
const currentPage = ref(1)
const perPage = 15

const fetchOrders = async () => {
  loading.value = true
  try {
    const res = await api.get('/admin/orders?limit=500')
    if (res.data.status === 'success') {
      orders.value = (res.data.data || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    }
  } catch (error) {
    console.error('Error fetching admin orders:', error)
    toast.error(t('admin.load_error_orders'))
  } finally {
    loading.value = false
  }
}

const filteredOrders = computed(() => {
  currentPage.value = 1
  return orders.value.filter(o => {
    if (currentFilter.value !== 'all' && o.status?.toLowerCase() !== currentFilter.value.toLowerCase()) {
      return false
    }
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase()
      const clientName = `${o.user?.firstName || ''} ${o.user?.lastName || ''}`.toLowerCase()
      const clientEmail = (o.user?.email || '').toLowerCase()
      const orderId = (o.id || '').toLowerCase()
      const orderNum = (o.orderNumber || '').toLowerCase()
      if (!clientName.includes(q) && !clientEmail.includes(q) && !orderId.includes(q) && !orderNum.includes(q)) {
        return false
      }
    }
    if (startDate.value || endDate.value) {
      const oDate = new Date(o.createdAt).getTime()
      if (startDate.value && oDate < new Date(startDate.value).getTime()) return false
      if (endDate.value && oDate > new Date(endDate.value).setHours(23,59,59,999)) return false
    }
    return true
  })
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredOrders.value.length / perPage)))
const paginatedOrders = computed(() => {
  const start = (currentPage.value - 1) * perPage
  return filteredOrders.value.slice(start, start + perPage)
})

const getStatusClass = (status) => {
  switch(status?.toLowerCase()) {
    case 'pending': return 'bg-yellow-50 text-yellow-600 border-yellow-200 dark:bg-yellow-500/10 dark:text-yellow-400 dark:border-yellow-500/20'
    case 'processing': return 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20'
    case 'shipped': return 'bg-purple-50 text-purple-600 border-purple-200 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20'
    case 'delivered': return 'bg-green-50 text-green-600 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20'
    case 'cancelled': return 'bg-red-50 text-red-600 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20'
    default: return 'bg-gray-50 text-gray-600 border-gray-200 dark:bg-white/5 dark:text-gray-300 dark:border-white/10'
  }
}

const updateOrderStatus = async (orderId, newStatus) => {
  try {
    const res = await api.patch(`/admin/orders/${orderId}/status`, { status: newStatus })
    if (res.data.status === 'success') {
      const idx = orders.value.findIndex(o => o.id === orderId)
      if (idx !== -1) orders.value[idx].status = newStatus
      toast.success(t('admin.status_updated', { status: newStatus }))
    } else {
      toast.error(t('admin.status_update_error'))
    }
  } catch (error) {
    console.error(error)
    toast.error(t('admin.status_update_error'))
  }
}

const viewOrderDetail = (order) => {
  selectedOrder.value = order
}

const exportCSV = () => {
  if (!filteredOrders.value.length) return toast.info(t('admin.no_orders_export'))
  const headers = [t('admin.order_number', 'N°'), t('admin.client', 'Client'), 'Email', t('admin.date', 'Date'), t('admin.total', 'Total'), t('admin.status', 'Statut')]
  const rows = filteredOrders.value.map(o => [
    o.orderNumber || o.id.substring(0, 8),
    `"${o.user?.firstName || ''} ${o.user?.lastName || ''}"`,
    o.user?.email || '',
    new Date(o.createdAt).toLocaleDateString(),
    o.total,
    o.status
  ])
  const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join("\n");
  const link = document.createElement("a");
  link.setAttribute("href", encodeURI(csvContent));
  link.setAttribute("download", "orders.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  toast.success(t('admin.csv_exported'))
}

onMounted(() => {
  fetchOrders()
})
</script>
