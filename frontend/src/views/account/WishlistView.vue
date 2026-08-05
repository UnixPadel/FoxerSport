<template>
  <div class="space-y-6">
    <div class="glass-card rounded-3xl p-6 lg:p-8 bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 shadow-lg">
      <h2 class="text-2xl font-display font-bold text-gray-900 dark:text-white mb-2">{{ $t('account.wishlist_title', 'Ma Liste de Souhaits') }}</h2>
      <p class="text-gray-500 dark:text-gray-400 mb-8">{{ $t('account.wishlist_desc', 'Retrouvez tous les articles que vous avez sauvegardés pour plus tard.') }}</p>

      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <div v-for="i in 3" :key="i" class="animate-pulse flex gap-4 p-4 rounded-2xl border border-gray-200 dark:border-white/10">
          <div class="w-24 h-24 bg-gray-200 dark:bg-white/5 rounded-xl"></div>
          <div class="flex-1 py-2 space-y-3">
            <div class="h-4 bg-gray-200 dark:bg-white/5 rounded w-3/4"></div>
            <div class="h-4 bg-gray-200 dark:bg-white/5 rounded w-1/2"></div>
            <div class="h-8 bg-gray-200 dark:bg-white/5 rounded-lg w-full mt-2"></div>
          </div>
        </div>
      </div>

      <div v-else-if="wishlist.length === 0" class="text-center py-16 bg-gray-50 dark:bg-white/5 rounded-2xl border border-dashed border-gray-300 dark:border-white/20">
        <div class="w-20 h-20 mx-auto bg-gray-200 dark:bg-white/10 rounded-full flex items-center justify-center mb-6 text-gray-400">
          <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
        </div>
        <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">{{ $t('account.wishlist_empty', 'Votre liste est vide') }}</h3>
        <p class="text-gray-500 dark:text-gray-400 mb-6">{{ $t('account.wishlist_empty_desc', 'Sauvegardez vos articles préférés en cliquant sur le petit cœur.') }}</p>
        <router-link to="/products" class="inline-block px-8 py-3 bg-foxer-orange hover:bg-orange-600 text-white rounded-xl font-bold transition-colors">
          {{ $t('account.start_shopping', 'Commencer mes achats') }}
        </router-link>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <div v-for="item in wishlist" :key="item.id" class="group relative flex gap-4 p-4 bg-white dark:bg-[#0f0f0f] rounded-2xl border border-gray-200 dark:border-white/10 hover:border-foxer-orange/50 transition-colors shadow-sm">
          <button @click="removeFromWishlist(item.product.id)" class="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-colors z-10 opacity-0 group-hover:opacity-100">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          
          <router-link :to="`/product/${item.product.slug}`">
            <div class="w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 bg-gray-100 dark:bg-black/40 rounded-xl overflow-hidden relative group">
              <img v-if="item.product.images?.[0]?.url" 
                   :src="item.product.images[0].url.startsWith('/uploads/') ? 'http://localhost:3000' + item.product.images[0].url : item.product.images[0].url" 
                   class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            </div>
          </router-link>
          
          <div class="flex flex-col justify-between flex-grow min-w-0">
            <div>
              <router-link :to="`/product/${item.product.slug}`" class="font-bold text-gray-900 dark:text-white truncate block hover:text-foxer-orange transition-colors">
                {{ item.product.translations?.[0]?.name || item.product.slug }}
              </router-link>
              <p class="font-display font-bold text-foxer-orange mt-1">{{ item.product.priceTry }} TL</p>
            </div>
            <button @click="addToCart(item.product)" class="w-full py-2 bg-gray-900 hover:bg-foxer-orange dark:bg-white dark:text-gray-900 dark:hover:bg-foxer-orange text-white rounded-lg text-sm font-bold transition-colors">
              {{ $t('common.add_to_cart', 'Ajouter au panier') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import { useCartStore } from '../../stores/cart'
import api from '../../api'

const toast = useToast()
const cartStore = useCartStore()

const wishlist = ref([])
const loading = ref(true)

const fetchWishlist = async () => {
  loading.value = true
  try {
    const res = await api.get('/wishlist')
    if (res.data.status === 'success') {
      wishlist.value = res.data.wishlist || []
    }
  } catch (error) {
    console.error('Error fetching wishlist:', error)
  } finally {
    loading.value = false
  }
}

const removeFromWishlist = async (productId) => {
  try {
    await api.delete(`/wishlist/${productId}`)
    wishlist.value = wishlist.value.filter(item => item.product.id !== productId)
    toast.success('Article retiré des favoris.')
  } catch (error) {
    toast.error('Erreur lors de la suppression.')
  }
}

const addToCart = async (product) => {
  const success = await cartStore.addToCart(product, 1)
  if (success) {
    toast.success('Ajouté au panier !')
  } else {
    toast.error('Erreur lors de l\'ajout.')
  }
}

onMounted(() => {
  fetchWishlist()
})
</script>
