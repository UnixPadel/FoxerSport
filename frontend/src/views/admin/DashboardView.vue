<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-display font-bold text-gray-900 dark:text-white mb-1">{{ $t('admin.dashboard_title') }}</h1>
        <p class="text-gray-500 dark:text-gray-400 text-sm">{{ $t('admin.dashboard_desc') || 'Overview of the store performances' }}</p>
      </div>
      <div class="flex items-center gap-2 px-4 py-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm rounded-xl">
        <select v-model="selectedRange" @change="fetchStats" class="bg-transparent border-none text-sm font-bold text-gray-700 dark:text-white focus:ring-0 cursor-pointer outline-none">
          <option value="7d">{{ $t('admin.last_7_days') }}</option>
          <option value="30d">{{ $t('admin.last_30_days') }}</option>
          <option value="thisMonth">{{ $t('admin.this_month') }}</option>
          <option value="thisYear">{{ $t('admin.this_year') }}</option>
          <option value="all">{{ $t('admin.all_time') }}</option>
        </select>
      </div>
    </div>

    <div v-if="loading" class="animate-pulse space-y-6">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-for="i in 4" :key="i" class="h-32 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-2xl shadow-sm"></div>
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 h-96 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-2xl shadow-sm"></div>
        <div class="h-96 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-2xl shadow-sm"></div>
      </div>
    </div>

    <div v-else>
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <!-- Revenue -->
        <div class="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10 shadow-sm relative overflow-hidden group">
          <div class="flex items-center justify-between mb-4">
            <p class="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider">{{ $t('admin.revenue') }}</p>
            <div class="w-10 h-10 rounded-xl bg-foxer-orange/10 text-foxer-orange flex items-center justify-center">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
          </div>
          <h3 class="text-3xl font-display font-bold text-gray-900 dark:text-white">{{ kpis.revenue.current.toLocaleString() }} TL</h3>
          <p class="text-xs font-bold mt-2" :class="kpis.revenue.trend >= 0 ? 'text-green-500' : 'text-red-500'">
            {{ kpis.revenue.trend >= 0 ? '+' : '' }}{{ kpis.revenue.trend }}% {{ $t('admin.vs_prev', 'vs préc.') }}
          </p>
        </div>

        <!-- Orders -->
        <div class="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10 shadow-sm relative overflow-hidden group">
          <div class="flex items-center justify-between mb-4">
            <p class="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider">{{ $t('admin.orders') }}</p>
            <div class="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
            </div>
          </div>
          <h3 class="text-3xl font-display font-bold text-gray-900 dark:text-white">{{ kpis.orders.current }}</h3>
          <p class="text-xs font-bold mt-2" :class="kpis.orders.trend >= 0 ? 'text-green-500' : 'text-red-500'">
            {{ kpis.orders.trend >= 0 ? '+' : '' }}{{ kpis.orders.trend }}% {{ $t('admin.vs_prev', 'vs préc.') }}
          </p>
        </div>

        <!-- AOV -->
        <div class="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10 shadow-sm relative overflow-hidden group">
          <div class="flex items-center justify-between mb-4">
            <p class="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider">{{ $t('admin.avg_cart') }}</p>
            <div class="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            </div>
          </div>
          <h3 class="text-3xl font-display font-bold text-gray-900 dark:text-white">{{ Math.round(kpis.aov.current).toLocaleString() }} TL</h3>
          <p class="text-xs font-bold mt-2" :class="kpis.aov.trend >= 0 ? 'text-green-500' : 'text-red-500'">
            {{ kpis.aov.trend >= 0 ? '+' : '' }}{{ kpis.aov.trend }}% {{ $t('admin.vs_prev', 'vs préc.') }}
          </p>
        </div>

        <!-- Customers -->
        <div class="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10 shadow-sm relative overflow-hidden group">
          <div class="flex items-center justify-between mb-4">
            <p class="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider">{{ $t('admin.new_customers') }}</p>
            <div class="w-10 h-10 rounded-xl bg-green-500/10 text-green-500 flex items-center justify-center">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            </div>
          </div>
          <h3 class="text-3xl font-display font-bold text-gray-900 dark:text-white">{{ kpis.customers.current }}</h3>
          <p class="text-xs font-bold mt-2" :class="kpis.customers.trend >= 0 ? 'text-green-500' : 'text-red-500'">
            {{ kpis.customers.trend >= 0 ? '+' : '' }}{{ kpis.customers.trend }}% {{ $t('admin.vs_prev', 'vs préc.') }}
          </p>
        </div>
      </div>

      <!-- Charts -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div class="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10 shadow-sm">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">{{ $t('admin.revenue_evolution') }}</h3>
          <div class="h-80">
            <apexchart type="area" height="100%" :options="areaOptions" :series="areaSeries"></apexchart>
          </div>
        </div>
        
        <div class="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10 shadow-sm">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">{{ $t('admin.orders_status') || 'Orders Status' }}</h3>
          <div class="h-80 flex items-center justify-center">
            <apexchart type="donut" height="100%" :options="computedDonutOptions" :series="donutSeries"></apexchart>
          </div>
        </div>
      </div>

      <!-- Extra Data (Top Products & Alerts) -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10 shadow-sm">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">{{ $t('admin.top_5_products') }}</h3>
          <div v-if="topProducts.length === 0" class="text-center py-8 text-gray-500">{{ $t('admin.no_data') }}</div>
          <div v-else class="space-y-4">
            <div v-for="product in topProducts" :key="product.id" class="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
              <img v-if="product.image" :src="product.image" class="w-12 h-12 rounded-lg object-cover bg-gray-100 dark:bg-black" />
              <div v-else class="w-12 h-12 rounded-lg bg-gray-100 dark:bg-white/5"></div>
              <div class="flex-grow">
                <p class="font-bold text-gray-900 dark:text-white line-clamp-1">{{ product.name }}</p>
                <p class="text-sm text-gray-500">{{ product.quantity }} {{ $t('admin.units_sold') || 'units sold' }}</p>
              </div>
              <div class="text-right">
                <p class="font-bold text-foxer-orange">{{ product.revenue }} TL</p>
              </div>
            </div>
          </div>
        </div>

        <div class="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10 shadow-sm">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            {{ $t('admin.low_stock_alerts') || 'Low Stock Alerts' }}
          </h3>
          <div v-if="lowStockAlerts.length === 0" class="text-center py-8 text-gray-500">{{ $t('admin.all_stocks_normal') }}</div>
          <div v-else class="space-y-4">
            <div v-for="alert in lowStockAlerts" :key="alert.id" class="flex items-center gap-4 p-3 rounded-xl border border-red-100 dark:border-red-500/20 bg-red-50 dark:bg-red-500/5">
              <img v-if="alert.image" :src="alert.image" class="w-10 h-10 rounded-lg object-cover" />
              <div v-else class="w-10 h-10 rounded-lg bg-white dark:bg-black/20"></div>
              <div class="flex-grow">
                <p class="font-bold text-gray-900 dark:text-white line-clamp-1">{{ alert.name }}</p>
                <p class="text-sm font-bold text-red-600 dark:text-red-400">{{ alert.stock }} {{ $t('admin.left_in_stock') || 'left in stock!' }}</p>
              </div>
              <router-link :to="`/admin/products`" class="text-sm font-bold text-gray-600 hover:text-foxer-orange">{{ $t('admin.restock') || 'Restock' }} &rarr;</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useDark } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import api from '../../api'

const isDark = useDark()
const { t } = useI18n()
const loading = ref(true)
const selectedRange = ref('30d')

const kpis = ref({
  revenue: { current: 0, trend: 0 },
  orders: { current: 0, trend: 0 },
  aov: { current: 0, trend: 0 },
  customers: { current: 0, trend: 0 }
})

const topProducts = ref([])
const lowStockAlerts = ref([])

// Charts
const areaSeries = ref([])
const donutSeries = ref([])

const fetchStats = async () => {
  loading.value = true
  try {
    const res = await api.get(`/admin/dashboard?range=${selectedRange.value}`)
    if (res.data.status === 'success') {
      const d = res.data.data
      kpis.value = d.kpis
      topProducts.value = d.topProducts
      lowStockAlerts.value = d.lowStockAlerts

      // Prepare Area Chart
      const revTime = d.charts.revenueByTime || []
      areaSeries.value = [{
        name: t('admin.revenue_tl', 'Revenus (TL)'),
        data: revTime.map(item => ({ x: item.date, y: item.revenue }))
      }]

      // Prepare Donut Chart
      const statusCounts = d.charts.ordersByStatus || []
      donutSeries.value = statusCounts.map(item => item.count)
      // dynamically update labels
      donutOptions.value = {
        ...donutOptions.value,
        labels: statusCounts.map(item => item.status)
      }
    }
  } catch (err) {
    console.error('Error fetching admin stats', err)
  } finally {
    loading.value = false
  }
}

// Chart Options Computation (Reactive to Dark Mode)
const areaOptions = computed(() => ({
  chart: { type: 'area', toolbar: { show: false }, background: 'transparent' },
  theme: { mode: isDark.value ? 'dark' : 'light' },
  colors: ['#ea580c'], // foxer-orange
  fill: {
    type: 'gradient',
    gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.05, stops: [0, 100] }
  },
  dataLabels: { enabled: false },
  stroke: { curve: 'smooth', width: 3 },
  xaxis: {
    type: 'category',
    axisBorder: { show: false },
    axisTicks: { show: false }
  },
  yaxis: { labels: { formatter: (val) => val.toLocaleString() + ' TL' } },
  grid: { borderColor: isDark.value ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', strokeDashArray: 4 }
}))

const donutOptions = ref({
  chart: { type: 'donut', background: 'transparent' },
  theme: { mode: 'light' }, // will be overridden by computed if needed, but apexcharts is tricky with direct ref vs computed for deeply nested. 
  // Let's use a computed for donutOptions too
})

// Proper computed for Donut
const computedDonutOptions = computed(() => {
  const currentLabels = donutOptions.value.labels || []
  return {
    chart: { type: 'donut', background: 'transparent' },
    theme: { mode: isDark.value ? 'dark' : 'light' },
    labels: currentLabels,
    colors: ['#f59e0b', '#3b82f6', '#8b5cf6', '#10b981', '#ef4444'], // Default status colors
    stroke: { show: false },
    dataLabels: { enabled: false },
    plotOptions: {
      pie: {
        donut: {
          size: '75%',
          labels: {
            show: true,
            name: { show: true },
            value: { show: true, formatter: (val) => val },
            total: { show: true, label: 'Total', color: isDark.value ? '#fff' : '#000' }
          }
        }
      }
    },
    legend: { position: 'bottom', markers: { radius: 12 } }
  }
})



onMounted(() => {
  fetchStats()
})
</script>
