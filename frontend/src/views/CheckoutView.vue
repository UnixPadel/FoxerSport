<template>
  <div class="bg-gray-50 dark:bg-foxer-dark h-full text-gray-900 dark:text-white pt-32 pb-24 transition-colors duration-300 relative z-0">
    <!-- Dotted Background -->
    <div class="absolute inset-0 pointer-events-none z-[-1]">
      <div class="absolute inset-0 opacity-[0.10] dark:opacity-0 block dark:hidden" style="background-image: radial-gradient(circle, #000 1px, transparent 1px); background-size: 30px 30px;"></div>
      <div class="absolute inset-0 opacity-0 dark:opacity-[0.15] hidden dark:block" style="background-image: radial-gradient(circle, #fff 1px, transparent 1px); background-size: 30px 30px;"></div>
    </div>
    
    <!-- Background Accents -->
    <div class="absolute top-1/4 left-0 w-[400px] h-[400px] bg-foxer-orange/5 rounded-full blur-[100px] pointer-events-none"></div>

    <div class="container mx-auto px-6 relative z-10">
      
      <!-- Header -->
      <div 
        class="mb-12"
        v-motion
        :initial="{ opacity: 0, y: -20 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 600 } }"
      >
        <h1 class="text-4xl md:text-5xl font-display font-bold mb-4">{{ $t('checkout.title') }}</h1>
        <div class="w-24 h-1 bg-foxer-orange rounded-full"></div>
      </div>

      <!-- Empty Cart Redirect -->
      <div v-if="!loading && cartItems.length === 0" class="text-center py-20 glass-card rounded-3xl">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-24 w-24 mx-auto text-gray-400 dark:text-gray-500 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        <h2 class="text-2xl font-bold mb-6 text-gray-700 dark:text-gray-300">{{ $t('cart.empty') }}</h2>
        <router-link to="/products" class="inline-block bg-foxer-orange text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-orange-600 transition-colors">
          {{ $t('cart.continue_shopping') }}
        </router-link>
      </div>

      <div v-else class="flex flex-col lg:flex-row gap-12">
        
        <!-- Left: Forms -->
        <div class="w-full lg:w-2/3 space-y-8">
          
          <!-- Billing & Shipping -->
          <div 
            class="glass-card p-8 rounded-3xl"
            v-motion
            :initial="{ opacity: 0, x: -30 }"
            :enter="{ opacity: 1, x: 0, transition: { delay: 100, duration: 600 } }"
          >
            <h2 class="text-2xl font-bold font-display mb-6 border-b border-gray-200 dark:border-white/10 pb-4">{{ $t('checkout.billing') }}</h2>
            
            <!-- Address Selection (if user has saved addresses) -->
            <div v-if="userAddresses.length > 0" class="mb-6">
              <label class="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3">{{ $t('checkout.select_address', 'Kayıtlı Adres Seçin') }}</label>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div
                  v-for="addr in userAddresses"
                  :key="addr.id"
                  @click="selectedAddressId = addr.id"
                  :class="[
                    'p-4 rounded-xl border-2 cursor-pointer transition-all',
                    selectedAddressId === addr.id
                      ? 'border-foxer-orange bg-foxer-orange/5'
                      : 'border-gray-200 dark:border-white/10 hover:border-foxer-orange/50'
                  ]"
                >
                  <p class="font-bold text-sm">{{ addr.firstName }} {{ addr.lastName }}</p>
                  <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{ addr.addressLine1 }}</p>
                  <p class="text-sm text-gray-500 dark:text-gray-400">{{ addr.city }}, {{ addr.postalCode }}</p>
                  <span v-if="addr.isDefault" class="inline-block mt-2 text-xs bg-foxer-orange/10 text-foxer-orange px-2 py-0.5 rounded-full">
                    {{ $t('checkout.default_address', 'Varsayılan') }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Manual Address Form (fallback) -->
            <div v-else>
              <form class="space-y-5">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label class="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">{{ $t('auth.first_name') }}</label>
                    <input type="text" v-model="manualAddress.firstName" class="w-full bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/15 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-foxer-orange transition-all" />
                  </div>
                  <div>
                    <label class="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">{{ $t('auth.last_name') }}</label>
                    <input type="text" v-model="manualAddress.lastName" class="w-full bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/15 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-foxer-orange transition-all" />
                  </div>
                </div>
                
                <div>
                  <label class="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">{{ $t('checkout.address') }}</label>
                  <input type="text" v-model="manualAddress.addressLine1" class="w-full bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/15 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-foxer-orange transition-all" />
                </div>

                <!-- Smart address fields -->
                <AddressFields v-model="addressFields" />
              </form>
            </div>
          </div>

          <!-- Payment Method -->
          <div 
            class="glass-card p-8 rounded-3xl"
            v-motion
            :initial="{ opacity: 0, x: -30 }"
            :enter="{ opacity: 1, x: 0, transition: { delay: 200, duration: 600 } }"
          >
            <h2 class="text-2xl font-bold font-display mb-6 border-b border-gray-200 dark:border-white/10 pb-4 flex justify-between items-center">
              <span>{{ $t('checkout.payment') }}</span>
              <span class="text-xs bg-green-500/20 text-green-600 dark:text-green-400 px-3 py-1 rounded-full border border-green-500/30 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                {{ $t('checkout.secure_payment') }}
              </span>
            </h2>
            
            <div class="border border-foxer-orange bg-foxer-orange/5 rounded-xl p-6 relative overflow-hidden">
              <div class="absolute top-0 right-0 p-4 flex gap-1">
                <div class="h-6 px-2 bg-[#1434CB] text-white font-bold italic text-xs flex items-center justify-center rounded shadow-sm">VISA</div>
                <div class="h-6 w-10 bg-gray-100 flex items-center justify-center rounded relative overflow-hidden shadow-sm">
                  <div class="w-4 h-4 rounded-full bg-[#EB001B] absolute -translate-x-1.5 opacity-90"></div>
                  <div class="w-4 h-4 rounded-full bg-[#F79E1B] absolute translate-x-1.5 opacity-90 mix-blend-multiply"></div>
                </div>
                <div class="h-6 px-2 bg-white text-gray-900 font-bold text-[10px] tracking-wider flex items-center justify-center rounded border border-gray-200 shadow-sm">TROY</div>
              </div>
              <div class="relative z-10 flex items-center space-x-4">
                <input type="radio" checked class="w-5 h-5 text-foxer-orange focus:ring-foxer-orange bg-white dark:bg-[#0a0a0a] border-gray-300 dark:border-gray-600" />
                <div>
                  <h3 class="font-bold text-lg text-gray-900 dark:text-white">{{ $t('checkout.credit_card', 'Kredi / Banka Kartı') }}</h3>
                  <p class="text-gray-500 dark:text-gray-400 text-sm">{{ $t('checkout.secure_payment_desc', 'Tüm kartlara güvenli ödeme imkanı.') }}</p>
                </div>
              </div>
            </div>
            <p class="text-sm text-gray-500 mt-4 italic">{{ $t('checkout.redirect_info', 'Ödeme adımında güvenli ödeme sayfasına yönlendirileceksiniz.') }}</p>
          </div>

        </div>

        <!-- Right: Order Summary Sticky -->
        <div class="w-full lg:w-1/3">
          <div 
            class="glass-card p-8 rounded-3xl sticky top-32"
            v-motion
            :initial="{ opacity: 0, y: 50 }"
            :enter="{ opacity: 1, y: 0, transition: { delay: 400, duration: 600 } }"
          >
            <h3 class="text-2xl font-bold font-display mb-6 border-b border-gray-200 dark:border-white/10 pb-4">{{ $t('cart.total') }}</h3>
            
            <!-- Dynamic Cart Items -->
            <div class="space-y-4 mb-6 text-sm max-h-60 overflow-y-auto pr-2">
              <div v-for="item in cartItems" :key="item.id" class="flex justify-between items-center">
                <span class="text-gray-700 dark:text-gray-300 flex-1 mr-3 line-clamp-1">{{ item.name }} <span class="text-gray-500">x{{ item.quantity }}</span></span>
                <span class="font-bold text-gray-900 dark:text-white whitespace-nowrap">{{ formatRawPrice(getRawPrice(item, currencyStore.currency) * item.quantity, currencyStore.currency) }}</span>
              </div>
            </div>

            <div class="space-y-4 mb-6 border-t border-gray-200 dark:border-white/10 pt-4">
              <div class="flex justify-between text-gray-500 dark:text-gray-400">
                <span>{{ $t('cart.subtotal') }}</span>
                <span class="text-gray-900 dark:text-white font-bold">{{ formatRawPrice(cartSubtotal, currencyStore.currency) }}</span>
              </div>
              <div class="flex justify-between text-gray-500 dark:text-gray-400">
                <span>{{ $t('cart.shipping') }} (DHL)</span>
                <span v-if="shippingStatus === 'WEIGHT_MISSING'" class="text-red-500 text-xs font-bold">{{ $t('cart.shipping_unavailable_weight', 'Calcul impossible (Poids manquant)') }}</span>
                <span v-else-if="shippingStatus === 'NOT_SUPPORTED'" class="text-red-500 text-xs font-bold">{{ $t('cart.shipping_unavailable_country', 'Non disponible pour ce pays') }}</span>
                <span v-else-if="shippingLoading" class="text-gray-400 text-xs italic">{{ $t('cart.calculating', 'Calcul...') }}</span>
                <span v-else class="text-foxer-orange font-bold">{{ formatRawPrice(shippingCost, currencyStore.currency) }}</span>
              </div>
            </div>

            <!-- Block Checkout if Weight is missing -->
            <div v-if="shippingStatus === 'WEIGHT_MISSING'" class="mb-4 p-4 bg-orange-500/10 border border-orange-500/30 rounded-xl text-orange-700 dark:text-orange-400 text-sm">
              <div class="flex items-start gap-2">
                <svg class="w-5 h-5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                <p>Certains articles de votre panier n'ont pas de poids renseigné. Les frais de livraison exacts ne peuvent pas être calculés. Veuillez nous contacter pour finaliser votre commande.</p>
              </div>
            </div>

            <div class="border-t border-gray-200 dark:border-white/10 pt-6 mb-8 flex justify-between items-end">
              <span class="text-lg font-bold">{{ $t('cart.total') }}</span>
              <span class="text-4xl font-display font-extrabold text-foxer-orange">{{ formatRawPrice(orderTotal, currencyStore.currency) }}</span>
            </div>

            <!-- Error Message -->
            <div v-if="paymentError" class="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-600 dark:text-red-400 text-sm">
              {{ paymentError }}
            </div>

            <!-- Pay Button -->
            <button
              @click="handlePayment"
              :disabled="paymentLoading || !canProceed"
              :class="[
                'w-full font-bold h-14 rounded-xl transition-all flex items-center justify-center space-x-2',
                paymentLoading || !canProceed
                  ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-foxer-orange hover:bg-orange-600 text-white shadow-lg hover:shadow-[0_0_20px_rgba(255,90,0,0.4)]'
              ]"
            >
              <!-- Loading Spinner -->
              <svg v-if="paymentLoading" class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span v-if="paymentLoading">{{ $t('checkout.processing', 'İşleniyor...') }}</span>
              <span v-else>{{ $t('checkout.place_order') }}</span>
            </button>

            <div class="mt-6 flex justify-center space-x-2 transition-all duration-300">
              <div class="h-6 px-2 bg-[#1434CB] text-white font-bold italic text-xs flex items-center justify-center rounded shadow-sm border border-[#1434CB]">VISA</div>
              <div class="h-6 w-10 bg-gray-100 flex items-center justify-center rounded relative overflow-hidden shadow-sm border border-gray-200">
                <div class="w-4 h-4 rounded-full bg-[#EB001B] absolute -translate-x-1.5 opacity-90"></div>
                <div class="w-4 h-4 rounded-full bg-[#F79E1B] absolute translate-x-1.5 opacity-90 mix-blend-multiply"></div>
              </div>
              <div class="h-6 px-2 bg-[#006FCF] text-white font-bold text-[10px] flex items-center justify-center rounded shadow-sm border border-[#006FCF]">AMEX</div>
              <div class="h-6 px-2 bg-white text-gray-900 font-bold text-[10px] tracking-wider flex items-center justify-center rounded border border-gray-200 shadow-sm">TROY</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import AddressFields from '../components/AddressFields.vue'
import { useCartStore } from '../stores/cart'
import { useCurrencyStore } from '../stores/currency'
import { formatRawPrice, getRawPrice } from '@/utils/currency'
import api from '../api'
import countriesData from '../assets/data/countries.json'

const router = useRouter()
const cartStore = useCartStore()
const currencyStore = useCurrencyStore()

// ── State ──────────────────────────────────────────────────────────
const loading = ref(true)
const paymentLoading = ref(false)
const paymentError = ref(null)

const userAddresses = ref([])
const selectedAddressId = ref(null)

const manualAddress = ref({
  firstName: '',
  lastName: '',
  addressLine1: '',
})

const addressFields = ref({
  country: '',
  city: '',
  postcode: '',
})

// ── Computed ───────────────────────────────────────────────────────
const cartItems = computed(() => cartStore.items)
const cartSubtotal = computed(() => cartStore.cartTotal)

const shippingCost = ref(0)
const shippingStatus = ref('CALCULATED')
const shippingLoading = ref(false)

const orderTotal = computed(() => cartSubtotal.value + shippingCost.value)

const currentCountryCode = computed(() => {
  if (userAddresses.value.length > 0 && selectedAddressId.value) {
    const addr = userAddresses.value.find(a => a.id === selectedAddressId.value)
    if (addr) return addr.countryCode
  }
  const selectedCountryName = addressFields.value.country || 'Türkiye';
  const matchedCountry = countriesData.find(c => c.name === selectedCountryName);
  return matchedCountry ? matchedCountry.cca2 : 'TR';
})

const calculateShipping = async () => {
  if (cartItems.value.length === 0) return;
  shippingLoading.value = true;
  try {
    const res = await api.post('/shop/cart/calculate-shipping', {
      countryCode: currentCountryCode.value
    });
    if (res.data.status === 'success') {
      shippingStatus.value = res.data.shippingStatus;
      shippingCost.value = res.data.shippingCost || 0;
    } else {
      shippingStatus.value = 'NOT_SUPPORTED';
      shippingCost.value = 0;
    }
  } catch (error) {
    console.error('Error calculating shipping', error);
    shippingStatus.value = 'NOT_SUPPORTED';
  } finally {
    shippingLoading.value = false;
  }
}

// Watch for country changes to recalculate shipping
watch(currentCountryCode, () => {
  calculateShipping()
})

const canProceed = computed(() => {
  if (cartItems.value.length === 0) return false
  if (shippingStatus.value !== 'CALCULATED') return false // Block if missing weight or unsupported country
  
  if (userAddresses.value.length > 0) return !!selectedAddressId.value
  // For manual address, require all fields
  return !!(
    manualAddress.value.firstName &&
    manualAddress.value.lastName &&
    manualAddress.value.addressLine1 &&
    addressFields.value.city &&
    addressFields.value.postcode
  )
})

// ── Methods ────────────────────────────────────────────────────────



/**
 * Fetch user's saved addresses.
 */
const fetchAddresses = async () => {
  try {
    const res = await api.get('/addresses')
    if (res.data.status === 'success' && res.data.addresses) {
      userAddresses.value = res.data.addresses
      // Auto-select default address
      const defaultAddr = userAddresses.value.find(a => a.isDefault)
      if (defaultAddr) {
        selectedAddressId.value = defaultAddr.id
      } else if (userAddresses.value.length > 0) {
        selectedAddressId.value = userAddresses.value[0].id
      }
    }
  } catch (err) {
    console.error('Error fetching addresses:', err)
  }
}

/**
 * Creates the order and initializes payment via Iyzico.
 */
const handlePayment = async () => {
  if (paymentLoading.value || !canProceed.value) return

  paymentLoading.value = true
  paymentError.value = null

  try {
    // ── Step 1: Determine shipping address ─────────────────────
    let shippingAddressId = selectedAddressId.value

    // If no saved address, create one first
    if (!shippingAddressId) {
      // Find 2-letter country code
      const selectedCountryName = addressFields.value.country || 'Türkiye';
      const matchedCountry = countriesData.find(c => c.name === selectedCountryName);
      const mappedCountryCode = matchedCountry ? matchedCountry.cca2 : 'TR';

      const addrRes = await api.post('/addresses', {
        firstName:    manualAddress.value.firstName,
        lastName:     manualAddress.value.lastName,
        addressLine1: manualAddress.value.addressLine1,
        city:         addressFields.value.city || 'Istanbul',
        postalCode:   addressFields.value.postcode || '00000',
        countryCode:  mappedCountryCode,
      })
      if (addrRes.data.status === 'success') {
        shippingAddressId = addrRes.data.address.id
      } else {
        throw new Error('Failed to save address')
      }
    }

    // ── Step 2: Create the order ────────────────────────────────
    const orderPayload = {
      shippingAddressId,
      subtotal:     cartSubtotal.value,
      shippingCost: shippingCost.value,
      taxAmount:    0,
      currency:     currencyStore.currency,
      items: cartItems.value.map(item => ({
        productId:   item.productId,
        variantId:   item.variantId || null,
        quantity:    item.quantity,
        unitPrice:   getRawPrice(item, currencyStore.currency),
        productName: item.name,
      })),
    }

    const orderRes = await api.post('/orders', orderPayload)

    if (orderRes.data.status !== 'success') {
      throw new Error(orderRes.data.message || 'Failed to create order')
    }

    const orderId = orderRes.data.order.id

    // ── Step 3: Initialize Iyzico payment ───────────────────────
    const paymentRes = await api.post('/payment/initialize', { orderId })

    if (paymentRes.data.status !== 'success') {
      throw new Error(paymentRes.data.message || 'Failed to initialize payment')
    }

    // ── Step 4: Redirect to Iyzico checkout page ────────────────
    // Clear cart locally since order is created
    cartStore.clearCart()

    // Redirect the browser to Iyzico's hosted payment page
    window.location.href = paymentRes.data.paymentPageUrl

  } catch (err) {
    console.error('Payment error:', err)
    if (err.response?.data?.errors) {
      paymentError.value = err.response.data.errors.map(e => e.msg).join(', ')
    } else {
      paymentError.value = err.response?.data?.message || err.message || 'Une erreur est survenue'
    }
    paymentLoading.value = false
  }
}

// ── Lifecycle ──────────────────────────────────────────────────────
onMounted(async () => {
  // Ensure user is logged in
  const token = localStorage.getItem('token')
  if (!token) {
    router.push('/login')
    return
  }

  await Promise.all([
    cartStore.fetchCart(),
    fetchAddresses(),
  ])

  await calculateShipping()

  loading.value = false
})
</script>
