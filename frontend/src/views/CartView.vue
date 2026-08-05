<template>
  <div class="bg-gray-50 dark:bg-foxer-dark h-full text-gray-900 dark:text-white transition-colors duration-300 pt-32 pb-24 relative z-0">
    <!-- Dotted Background -->
    <div class="absolute inset-0 pointer-events-none z-[-1]">
      <div class="absolute inset-0 opacity-[0.10] dark:opacity-0 block dark:hidden" style="background-image: radial-gradient(circle, #000 1px, transparent 1px); background-size: 30px 30px;"></div>
      <div class="absolute inset-0 opacity-0 dark:opacity-[0.15] hidden dark:block" style="background-image: radial-gradient(circle, #fff 1px, transparent 1px); background-size: 30px 30px;"></div>
    </div>
    
    <div class="container mx-auto px-6">
      
      <!-- Header -->
      <div class="mb-12" v-motion :initial="{ opacity: 0, y: -20 }" :enter="{ opacity: 1, y: 0, transition: { duration: 600 } }">
        <h1 class="text-4xl md:text-5xl font-display font-bold mb-4">{{ $t('cart.title') }}</h1>
        <div class="w-24 h-1 bg-foxer-orange rounded-full"></div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-20">
        <svg class="animate-spin h-10 w-10 mx-auto text-foxer-orange" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>

      <!-- Empty Cart State -->
      <div v-else-if="cartItems.length === 0" class="text-center py-20 glass-card rounded-3xl" v-motion :initial="{ opacity: 0, scale: 0.95 }" :enter="{ opacity: 1, scale: 1, transition: { duration: 600 } }">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-24 w-24 mx-auto text-gray-400 dark:text-gray-500 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        <h2 class="text-2xl font-bold mb-6 text-gray-700 dark:text-gray-300">{{ $t('cart.empty') }}</h2>
        <router-link to="/products" class="inline-block bg-foxer-orange text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-orange-600 transition-colors">
          {{ $t('cart.continue_shopping') }}
        </router-link>
      </div>

      <!-- Cart Content -->
      <div v-else class="flex flex-col lg:flex-row gap-12">
        
        <!-- Left: Cart Items List -->
        <div class="w-full lg:w-2/3">
          
          <div class="hidden md:grid grid-cols-12 gap-4 pb-4 border-b border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 text-sm uppercase tracking-wider mb-6">
            <div class="col-span-6">{{ $t('cart.product') }}</div>
            <div class="col-span-2 text-center">{{ $t('cart.price') }}</div>
            <div class="col-span-2 text-center">{{ $t('cart.quantity') }}</div>
            <div class="col-span-2 text-right">{{ $t('cart.total') }}</div>
          </div>

          <div class="space-y-6">
            <div v-for="(item, index) in cartItems" :key="item.id" v-motion :initial="{ opacity: 0, x: -20 }" :enter="{ opacity: 1, x: 0, transition: { delay: index * 100, duration: 500 } }" class="glass-card rounded-2xl p-4 relative group">
              <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                
                <!-- Product Info -->
                <div class="col-span-6 flex items-center space-x-4">
                  <div class="w-24 h-24 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                    <img :src="item.image" :alt="item.name" class="w-full h-full object-cover" />
                  </div>
                  <div>
                    <router-link :to="`/product/${item.productId}`" class="text-lg font-bold hover:text-foxer-orange transition-colors line-clamp-2">
                      {{ item.name }}
                    </router-link>
                    <button @click="removeItem(item.id)" class="text-sm text-gray-500 hover:text-red-500 transition-colors mt-2 text-left flex items-center space-x-1">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      <span>{{ $t('cart.remove') }}</span>
                    </button>
                  </div>
                </div>

                <!-- Price -->
                <div class="col-span-2 text-center hidden md:block">
                  <span class="text-lg font-bold">{{ formatPrice(item, currencyStore.currency) }}</span>
                </div>

                <!-- Quantity -->
                <div class="col-span-2 flex justify-center w-full md:w-auto mt-4 md:mt-0">
                  <div class="flex items-center bg-white dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-lg h-10 w-32">
                    <button @click="updateQuantity(item.id, item.quantity - 1)" class="w-10 h-full text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white flex items-center justify-center transition-colors">-</button>
                    <input type="number" :value="item.quantity" class="w-full h-full bg-transparent text-center font-bold text-gray-900 dark:text-white focus:outline-none text-sm" readonly />
                    <button @click="updateQuantity(item.id, item.quantity + 1)" class="w-10 h-full text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white flex items-center justify-center transition-colors">+</button>
                  </div>
                </div>

                <!-- Total -->
                <div class="col-span-2 text-right w-full md:w-auto mt-4 md:mt-0 flex justify-between md:block">
                  <span class="md:hidden text-gray-500 dark:text-gray-400">{{ $t('cart.total') }}:</span>
                  <span class="text-xl font-display font-bold text-foxer-orange">{{ formatRawPrice(getRawPrice(item, currencyStore.currency) * item.quantity, currencyStore.currency) }}</span>
                </div>

              </div>
            </div>
          </div>

          <div class="mt-8 pt-8 border-t border-gray-200 dark:border-white/10" v-motion :initial="{ opacity: 0 }" :enter="{ opacity: 1, transition: { delay: 600, duration: 600 } }">
            <router-link to="/products" class="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white flex items-center space-x-2 transition-colors inline-flex group">
              <span class="group-hover:-translate-x-1 transition-transform">&larr;</span>
              <span>{{ $t('cart.continue_shopping') }}</span>
            </router-link>
          </div>

        </div>

        <!-- Right: Order Summary -->
        <div class="w-full lg:w-1/3" v-motion :initial="{ opacity: 0, y: 50 }" :enter="{ opacity: 1, y: 0, transition: { delay: 400, duration: 600 } }">
          <div class="glass-card p-8 rounded-3xl sticky top-32">
            <h3 class="text-2xl font-bold font-display mb-6 border-b border-gray-200 dark:border-white/10 pb-4">{{ $t('cart.total') }}</h3>
            
            <div class="space-y-4 mb-6">
              <div class="flex justify-between text-gray-500 dark:text-gray-400">
                <span>{{ $t('cart.subtotal') }}</span>
                <span class="text-gray-900 dark:text-white font-bold">{{ formatRawPrice(cartSubtotal, currencyStore.currency) }}</span>
              </div>
              <div class="flex justify-between text-gray-500 dark:text-gray-400">
                <span>{{ $t('cart.shipping') }}</span>
                <span class="text-gray-600 dark:text-gray-400 text-sm font-medium">{{ $t('cart.calculated_at_checkout', 'Calculé à la caisse') }}</span>
              </div>
            </div>

            <div class="border-t border-gray-200 dark:border-white/10 pt-6 mb-8 flex justify-between items-end">
              <span class="text-lg font-bold">{{ $t('cart.total') }}</span>
              <span class="text-4xl font-display font-extrabold text-foxer-orange">{{ formatRawPrice(cartSubtotal, currencyStore.currency) }}</span>
            </div>

            <router-link to="/checkout" class="w-full bg-foxer-orange hover:bg-orange-600 text-white font-bold h-14 rounded-xl transition-all shadow-lg hover:shadow-[0_0_20px_rgba(255,90,0,0.4)] flex items-center justify-center space-x-2">
              <span>{{ $t('cart.checkout') }}</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </router-link>

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
import { computed, onMounted } from 'vue'
import { useCartStore } from '../stores/cart'
import { useCurrencyStore } from '../stores/currency'
import { formatPrice, formatRawPrice, getRawPrice } from '@/utils/currency'

const cartStore = useCartStore()
const currencyStore = useCurrencyStore()

const cartItems = computed(() => cartStore.items)
const cartSubtotal = computed(() => cartStore.cartTotal)
const loading = computed(() => cartStore.loading)

const removeItem = async (id) => {
  await cartStore.removeItem(id)
}

const updateQuantity = async (id, quantity) => {
  if (quantity < 1) return
  await cartStore.updateQuantity(id, quantity)
}



onMounted(() => {
  cartStore.fetchCart()
})
</script>
