<template>
  <div class="bg-gray-50 dark:bg-foxer-dark min-h-screen text-gray-900 dark:text-white pt-32 pb-24 transition-colors duration-300 relative z-0">
    <!-- Dotted Background -->
    <div class="absolute inset-0 pointer-events-none z-[-1]">
      <div class="absolute inset-0 opacity-[0.10] dark:opacity-0 block dark:hidden" style="background-image: radial-gradient(circle, #000 1px, transparent 1px); background-size: 30px 30px;"></div>
      <div class="absolute inset-0 opacity-0 dark:opacity-[0.15] hidden dark:block" style="background-image: radial-gradient(circle, #fff 1px, transparent 1px); background-size: 30px 30px;"></div>
    </div>

    <!-- Background Accents -->
    <div v-if="isSuccess" class="absolute top-1/4 left-0 w-[400px] h-[400px] bg-green-500/5 rounded-full blur-[100px] pointer-events-none"></div>
    <div v-else class="absolute top-1/4 left-0 w-[400px] h-[400px] bg-red-500/5 rounded-full blur-[100px] pointer-events-none"></div>

    <div class="container mx-auto px-6 relative z-10 max-w-2xl">

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-20">
        <svg class="animate-spin h-12 w-12 mx-auto text-foxer-orange" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="mt-4 text-gray-500 dark:text-gray-400">{{ $t('common.loading') }}</p>
      </div>

      <!-- Success State -->
      <div
        v-else-if="isSuccess"
        class="glass-card rounded-3xl p-10 text-center"
        v-motion
        :initial="{ opacity: 0, scale: 0.9 }"
        :enter="{ opacity: 1, scale: 1, transition: { duration: 600 } }"
      >
        <!-- Animated Check Circle -->
        <div class="mx-auto w-24 h-24 rounded-full bg-green-500/10 border-2 border-green-500/30 flex items-center justify-center mb-8">
          <svg
            class="w-12 h-12 text-green-500"
            v-motion
            :initial="{ opacity: 0, scale: 0 }"
            :enter="{ opacity: 1, scale: 1, transition: { delay: 300, duration: 500, type: 'spring' } }"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 class="text-3xl md:text-4xl font-display font-bold mb-4 text-green-600 dark:text-green-400">
          {{ $t('checkout.payment_success', 'Ödeme Başarılı!') }}
        </h1>

        <p class="text-gray-600 dark:text-gray-400 text-lg mb-8">
          {{ $t('checkout.payment_success_desc', 'Siparişiniz başarıyla alındı. En kısa sürede kargolanacaktır.') }}
        </p>

        <!-- Order Details Card -->
        <div
          class="bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 mb-8 text-left"
          v-motion
          :initial="{ opacity: 0, y: 20 }"
          :enter="{ opacity: 1, y: 0, transition: { delay: 400, duration: 500 } }"
        >
          <div class="flex items-center justify-between mb-4 pb-4 border-b border-gray-200 dark:border-white/10">
            <span class="text-sm text-gray-500 dark:text-gray-400">{{ $t('admin.order_id', 'Sipariş No') }}</span>
            <span class="font-bold font-mono text-foxer-orange">{{ orderNumber || '—' }}</span>
          </div>

          <div v-if="paymentDetails" class="space-y-3">
            <div class="flex justify-between text-sm">
              <span class="text-gray-500 dark:text-gray-400">{{ $t('admin.status', 'Durum') }}</span>
              <span class="text-green-600 dark:text-green-400 font-semibold flex items-center space-x-1">
                <span class="w-2 h-2 rounded-full bg-green-500 inline-block"></span>
                <span>{{ $t('admin.paid', 'Ödendi') }}</span>
              </span>
            </div>
            <div class="flex justify-between text-sm" v-if="paymentDetails.total">
              <span class="text-gray-500 dark:text-gray-400">{{ $t('admin.total', 'Toplam') }}</span>
              <span class="font-bold text-gray-900 dark:text-white">{{ formatPrice(paymentDetails.total) }}₺</span>
            </div>
            <div class="flex justify-between text-sm" v-if="paymentDetails.payment?.cardLastFour">
              <span class="text-gray-500 dark:text-gray-400">{{ $t('checkout.card', 'Kart') }}</span>
              <span class="font-mono text-gray-700 dark:text-gray-300">**** {{ paymentDetails.payment.cardLastFour }}</span>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-4">
          <router-link
            to="/account/orders"
            class="flex-1 bg-foxer-orange hover:bg-orange-600 text-white font-bold h-14 rounded-xl transition-all shadow-lg hover:shadow-[0_0_20px_rgba(255,90,0,0.4)] flex items-center justify-center space-x-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span>{{ $t('checkout.view_orders', 'Siparişlerimi Gör') }}</span>
          </router-link>

          <router-link
            to="/products"
            class="flex-1 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/15 text-gray-900 dark:text-white font-bold h-14 rounded-xl transition-all hover:bg-gray-100 dark:hover:bg-white/10 flex items-center justify-center space-x-2"
          >
            <span>{{ $t('cart.continue_shopping', 'Alışverişe Devam') }}</span>
          </router-link>
        </div>
      </div>

      <!-- Failed State -->
      <div
        v-else
        class="glass-card rounded-3xl p-10 text-center"
        v-motion
        :initial="{ opacity: 0, scale: 0.9 }"
        :enter="{ opacity: 1, scale: 1, transition: { duration: 600 } }"
      >
        <!-- Error Icon -->
        <div class="mx-auto w-24 h-24 rounded-full bg-red-500/10 border-2 border-red-500/30 flex items-center justify-center mb-8">
          <svg
            class="w-12 h-12 text-red-500"
            v-motion
            :initial="{ opacity: 0, scale: 0 }"
            :enter="{ opacity: 1, scale: 1, transition: { delay: 300, duration: 500, type: 'spring' } }"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>

        <h1 class="text-3xl md:text-4xl font-display font-bold mb-4 text-red-600 dark:text-red-400">
          {{ $t('checkout.payment_failed', 'Ödeme Başarısız') }}
        </h1>

        <p class="text-gray-600 dark:text-gray-400 text-lg mb-4">
          {{ $t('checkout.payment_failed_desc', 'Ödemeniz işlenemedi. Lütfen tekrar deneyin.') }}
        </p>

        <p v-if="errorMessage" class="text-red-500 dark:text-red-400 text-sm mb-8 bg-red-500/5 border border-red-500/20 rounded-xl p-4">
          {{ errorMessage }}
        </p>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-4">
          <router-link
            to="/checkout"
            class="flex-1 bg-foxer-orange hover:bg-orange-600 text-white font-bold h-14 rounded-xl transition-all shadow-lg hover:shadow-[0_0_20px_rgba(255,90,0,0.4)] flex items-center justify-center space-x-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>{{ $t('checkout.try_again', 'Tekrar Dene') }}</span>
          </router-link>

          <router-link
            to="/cart"
            class="flex-1 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/15 text-gray-900 dark:text-white font-bold h-14 rounded-xl transition-all hover:bg-gray-100 dark:hover:bg-white/10 flex items-center justify-center space-x-2"
          >
            <span>{{ $t('checkout.back_to_cart', 'Sepete Dön') }}</span>
          </router-link>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '../api'

const route = useRoute()

const loading = ref(true)
const paymentDetails = ref(null)

// Parse query params from Iyzico redirect
const status = computed(() => route.query.status)
const orderId = computed(() => route.query.orderId)
const orderNumber = computed(() => route.query.orderNumber)
const errorMessage = computed(() => route.query.error ? decodeURIComponent(route.query.error) : null)
const isSuccess = computed(() => status.value === 'success')

/**
 * Fetch payment details from API for confirmed orders.
 */
const fetchPaymentDetails = async () => {
  if (!orderId.value || !isSuccess.value) {
    loading.value = false
    return
  }

  try {
    const res = await api.get(`/payment/status/${orderId.value}`)
    if (res.data.status === 'success') {
      paymentDetails.value = res.data.order
    }
  } catch (err) {
    console.error('Could not fetch payment details:', err)
  } finally {
    loading.value = false
  }
}

const formatPrice = (price) => {
  if (!price) return '0.00'
  return parseFloat(price).toLocaleString('tr-TR', { minimumFractionDigits: 2 })
}

onMounted(() => {
  fetchPaymentDetails()
})
</script>
