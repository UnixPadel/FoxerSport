<template>
  <div class="bg-gray-50 dark:bg-foxer-dark h-full text-gray-900 dark:text-white pt-32 pb-24 transition-colors duration-300 relative z-0">
    <!-- Dotted Background -->
    <div class="absolute inset-0 pointer-events-none z-[-1]">
      <div class="absolute inset-0 opacity-[0.10] dark:opacity-0 block dark:hidden" style="background-image: radial-gradient(circle, #000 1px, transparent 1px); background-size: 30px 30px;"></div>
      <div class="absolute inset-0 opacity-0 dark:opacity-[0.15] hidden dark:block" style="background-image: radial-gradient(circle, #fff 1px, transparent 1px); background-size: 30px 30px;"></div>
    </div>
    
    <!-- Breadcrumbs -->
    <div 
      class="container mx-auto px-6 mb-8 text-sm text-gray-400"
      v-motion
      :initial="{ opacity: 0, x: -20 }"
      :enter="{ opacity: 1, x: 0, transition: { duration: 600 } }"
    >
      <router-link to="/" class="hover:text-foxer-orange transition-colors">{{ $t('nav.home') }}</router-link>
      <span class="mx-2">/</span>
      <router-link to="/products" class="hover:text-foxer-orange transition-colors">{{ productCategory }}</router-link>
      <span class="mx-2">/</span>
      <span class="text-gray-900 dark:text-white font-bold">{{ productName }}</span>
    </div>

    <!-- Main Product Section -->
    <div class="container mx-auto px-6">
      <div class="flex flex-col lg:flex-row gap-12">
        
        <!-- Left Column -->
        <div class="w-full lg:w-1/2 flex flex-col gap-12">
          
          <!-- Image Gallery -->
          <div class="flex gap-4">
            <!-- Thumbnails (Desktop) -->
            <div 
              class="hidden lg:flex flex-col gap-4 w-24 flex-shrink-0 overflow-y-auto thumbnails-scroll pr-1"
            :style="{ maxHeight: 'min(70vh, 600px)' }"
            v-motion
            :initial="{ opacity: 0, y: 30 }"
            :enter="{ opacity: 1, y: 0, transition: { delay: 100, duration: 600 } }"
          >
            <button 
              v-for="(img, idx) in product.images" 
              :key="idx"
              @click="activeImage = img"
              class="w-full aspect-square rounded-xl overflow-hidden glass-card border-2 transition-all duration-300"
              :class="activeImage === img ? 'border-foxer-orange shadow-[0_0_15px_rgba(255,90,0,0.3)]' : 'border-transparent hover:border-white/20'"
            >
              <img :src="img" class="w-full h-full object-cover" />
            </button>
          </div>

          <!-- Main Image -->
          <div 
            class="w-full glass-card rounded-3xl overflow-hidden relative group flex items-center justify-center bg-white/[0.02] dark:bg-black/20"
            :style="{ height: 'min(70vh, 600px)' }"
            v-motion
            :initial="{ opacity: 0, scale: 0.95 }"
            :enter="{ opacity: 1, scale: 1, transition: { delay: 200, duration: 800, type: 'spring' } }"
          >
            <div class="absolute inset-0 bg-gradient-to-tr from-foxer-orange/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none"></div>
            <img :src="activeImage" class="max-w-full max-h-full object-contain transition-transform duration-700 group-hover:scale-102" :class="{ 'opacity-50 grayscale': product.stockQuantity === 0 }" />
            
            <!-- Out of stock overlay -->
            <div v-if="product.stockQuantity === 0" class="absolute inset-0 flex items-center justify-center bg-black/40 z-10">
              <div class="bg-red-600 text-white font-bold px-6 py-3 rounded-xl rotate-12 border-2 border-white/20 shadow-[0_0_20px_rgba(220,38,38,0.5)] text-xl">
                {{ $t('product.out_of_stock', 'Rupture de stock') }}
              </div>
            </div>
            
            <!-- Mobile Thumbnails overlay -->
            <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 lg:hidden z-20">
              <button 
                v-for="(img, idx) in product.images" 
                :key="'mob-'+idx"
                @click="activeImage = img"
                class="w-2.5 h-2.5 rounded-full transition-all duration-300 shadow-md"
                :class="activeImage === img ? 'bg-foxer-orange w-6' : 'bg-white/50'"
              ></button>
            </div>
          </div>
        </div>

        <!-- Write Review Section (Desktop only - fills empty space on the left) -->
          <div class="hidden lg:block mt-4 border-t border-gray-200 dark:border-white/10 pt-8">
            <h3 class="text-2xl font-display font-bold mb-6">{{ $t('product_detail.write_review', 'Écrire un avis') }}</h3>
            
            <!-- Not Authenticated -->
            <div v-if="!authStore.isAuthenticated" class="bg-gray-100 dark:bg-white/5 p-8 rounded-3xl text-center border border-gray-200 dark:border-white/5 shadow-sm">
              <p class="text-gray-600 dark:text-gray-400 mb-6 font-medium text-lg">{{ $t('product_detail.login_to_review', 'Vous devez être connecté pour laisser un avis.') }}</p>
              <button @click="redirectToLogin" class="bg-gradient-to-r from-foxer-orange to-[#ff7a33] text-white px-10 py-3.5 rounded-xl font-bold shadow-[0_10px_20px_rgba(255,90,0,0.2)] hover:shadow-[0_10px_25px_rgba(255,90,0,0.4)] hover:-translate-y-0.5 transition-all">
                {{ $t('auth.login', 'Connexion') }}
              </button>
            </div>

            <!-- Authenticated -->
            <form v-else @submit.prevent="submitReview" class="space-y-6 bg-gray-50 dark:bg-white/[0.02] p-8 rounded-3xl border border-gray-200 dark:border-white/5">
              <div>
                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">{{ $t('product_detail.rating', 'Votre note') }}</label>
                <div class="flex space-x-3 text-foxer-orange">
                  <svg v-for="i in 5" :key="i" @click="reviewForm.rating = i" class="h-10 w-10 cursor-pointer transition-transform hover:scale-110 drop-shadow-sm" :class="i <= reviewForm.rating ? 'fill-current' : 'text-gray-300 dark:text-gray-600 fill-current'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">{{ $t('product_detail.comment', 'Votre commentaire') }}</label>
                <textarea v-model="reviewForm.comment" rows="5" class="w-full bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/10 rounded-xl p-5 text-gray-900 dark:text-white focus:outline-none focus:border-foxer-orange focus:ring-1 focus:ring-foxer-orange transition-all placeholder-gray-400 dark:placeholder-gray-600 shadow-inner" :placeholder="$t('product_detail.review_placeholder', 'Partagez votre expérience avec ce produit...')"></textarea>
              </div>
              <button type="submit" :disabled="!reviewForm.comment || submittingReview" class="w-full bg-gradient-to-r from-foxer-orange to-[#ff7a33] disabled:opacity-50 text-white font-bold px-8 py-4 rounded-xl transition-all hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(255,90,0,0.3)] flex items-center justify-center space-x-2">
                <span v-if="submittingReview" class="animate-spin inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span>
                <span v-else>{{ $t('product_detail.submit_review', 'Envoyer mon avis') }}</span>
              </button>
            </form>
          </div>

        </div>

        <!-- Right: Product Details -->
        <div class="w-full lg:w-1/2 flex flex-col justify-center">
          
          <div 
            v-motion
            :initial="{ opacity: 0, scale: 0.9, rotateY: -10 }"
            :enter="{ opacity: 1, scale: 1, rotateY: 0, transition: { duration: 1000, type: 'spring', bounce: 0.4 } }"
            class="mb-8"
          >
            <div class="flex items-center space-x-3 mb-3">
              <span class="bg-foxer-orange/20 text-foxer-orange px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">{{ productCategory }}</span>
              <span v-if="product.stockQuantity > 0" class="text-green-400 text-sm font-bold flex items-center">
                <span class="w-2 h-2 rounded-full bg-green-400 mr-2 animate-pulse"></span>
                {{ $t('product_detail.in_stock') }}
              </span>
              <span v-else class="text-red-400 text-sm font-bold flex items-center">
                <span class="w-2 h-2 rounded-full bg-red-400 mr-2"></span>
                {{ $t('product_detail.out_of_stock') }}
              </span>
              <span class="text-gray-500 text-sm">{{ $t('products.sku_label') }} {{ product.sku }}</span>
            </div>
            
            <h1 class="text-4xl md:text-5xl font-display font-extrabold mb-4 leading-tight">{{ productName }}</h1>
            
            <!-- Star Ratings -->
            <div class="flex items-center space-x-2 mb-4">
              <div class="flex text-foxer-orange">
                <svg v-for="i in 5" :key="i" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <span class="text-gray-400 text-sm hover:text-foxer-orange cursor-pointer transition-colors" @click="activeTab = 'reviews'">
                ({{ product.reviewCount || 0 }} {{ $t('product_detail.reviews') }})
              </span>
            </div>
            
            <div class="flex items-end space-x-4 mb-6">
              <span class="text-5xl font-display font-bold text-foxer-orange">{{ formatPrice(product, currencyStore.currency) }}</span>
              <span v-if="product.compareAtPriceTry" class="text-xl text-gray-500 line-through mb-1">{{ formatPrice(product, currencyStore.currency, true) }}</span>
            </div>

            <div class="text-gray-400 dark:text-gray-400 leading-relaxed text-lg mb-6 description-content" v-html="productShortDesc"></div>

            <!-- Product Options (e.g. Size/Weight) -->
            <div v-if="product.variants && product.variants.length > 0" class="mb-6">
              <h3 class="text-sm font-bold text-gray-900 dark:text-white mb-3 uppercase tracking-wider">{{ $t('product_detail.options') }}</h3>
              <div class="flex flex-wrap gap-3">
                <button 
                  v-for="variant in product.variants" 
                  :key="variant.id"
                  @click="selectedOption = variant"
                  class="px-4 py-2 rounded-lg border transition-all duration-300 font-bold text-sm"
                  :class="selectedOption?.id === variant.id ? 'border-foxer-orange bg-foxer-orange/20 text-foxer-orange' : 'border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-white/30 hover:text-gray-900 dark:hover:text-white'"
                >
                  {{ variant.size || variant.color || variant.sku }}
                </button>
              </div>
            </div>
          </div>

           <!-- Quantity & Actions -->
          <div 
            class="glass-card p-6 rounded-2xl mb-12"
            v-motion
            :initial="{ opacity: 0, y: 30 }"
            :enter="{ opacity: 1, y: 0, transition: { delay: 400, duration: 600 } }"
          >
            <div class="flex flex-col gap-4">
              
              <!-- Quantity Selector -->
              <div class="flex items-center bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/15 rounded-xl h-14 w-full sm:w-1/3">
                <button @click="quantity > 1 && quantity--" class="w-12 h-full text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white flex items-center justify-center transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" /></svg>
                </button>
                <input type="number" v-model="quantity" class="w-full h-full bg-transparent text-center font-bold text-lg text-gray-900 dark:text-white focus:outline-none" readonly />
                <button @click="quantity++" class="w-12 h-full text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white flex items-center justify-center transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" /></svg>
                </button>
              </div>

              <!-- Action Buttons -->
              <div class="flex space-x-4">
                <!-- Add to Cart -->
                <button @click="addToCart" :disabled="addingToCart" class="flex-grow bg-gradient-to-r from-foxer-orange to-orange-500 hover:from-orange-500 hover:to-foxer-orange text-white font-bold h-14 rounded-xl transition-all shadow-[0_10px_20px_rgba(255,90,0,0.3)] hover:shadow-[0_0_30px_rgba(255,90,0,0.6)] hover:-translate-y-1 flex items-center justify-center space-x-2 disabled:opacity-50">
                  <span v-if="addingToCart" class="animate-spin inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span>
                  <span v-else>{{ $t('product_detail.buy_now') }}</span>
                </button>

                <!-- Add to Wishlist -->
                <button @click="toggleWishlist" class="w-14 h-14 rounded-xl border border-gray-200 dark:border-white/15 flex items-center justify-center transition-all" :class="wishlistStore.isInWishlist(product?.id) ? 'bg-red-50 dark:bg-red-900/20 text-red-500 border-red-200 dark:border-red-900/30' : 'bg-white dark:bg-[#0a0a0a] text-gray-500 dark:text-gray-400 hover:text-red-500 hover:border-red-200'">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 transition-transform" :class="wishlistStore.isInWishlist(product?.id) ? 'fill-current scale-110' : ''" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Tabs (Description / Specs) -->
          <div 
            v-motion
            :initial="{ opacity: 0 }"
            :enter="{ opacity: 1, transition: { delay: 600, duration: 800 } }"
          >
            <div class="flex space-x-8 border-b border-gray-200 dark:border-white/10 mb-6">
              <button 
                @click="activeTab = 'desc'" 
                class="pb-4 text-lg font-bold transition-colors relative"
                :class="activeTab === 'desc' ? 'text-foxer-orange' : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'"
              >
                {{ $t('product_detail.description') }}
                <span v-if="activeTab === 'desc'" class="absolute bottom-0 left-0 w-full h-0.5 bg-foxer-orange"></span>
              </button>
              <button 
                @click="activeTab = 'specs'" 
                class="pb-4 text-lg font-bold transition-colors relative"
                :class="activeTab === 'specs' ? 'text-foxer-orange' : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'"
              >
                {{ $t('product_detail.specifications') }}
                <span v-if="activeTab === 'specs'" class="absolute bottom-0 left-0 w-full h-0.5 bg-foxer-orange"></span>
              </button>
              <button 
                @click="activeTab = 'reviews'" 
                class="pb-4 text-lg font-bold transition-colors relative"
                :class="activeTab === 'reviews' ? 'text-foxer-orange' : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'"
              >
                {{ $t('product_detail.reviews') }}
                <span v-if="activeTab === 'reviews'" class="absolute bottom-0 left-0 w-full h-0.5 bg-foxer-orange"></span>
              </button>
            </div>

            <div class="min-h-[150px]">
              <div v-if="activeTab === 'desc'" class="text-gray-600 dark:text-gray-400 leading-relaxed animate-fade-in-up description-content" v-html="productDesc">
              </div>
              <div v-if="activeTab === 'specs'" class="animate-fade-in-up">
                <ul class="space-y-3">
                  <li class="flex justify-between py-2 border-b border-gray-200 dark:border-white/5"><span class="text-gray-500 dark:text-gray-400">{{ $t('product_detail.specs.shape') }}</span><span class="font-bold text-gray-900 dark:text-white">{{ $t('product_detail.specs.teardrop') }}</span></li>
                  <li class="flex justify-between py-2 border-b border-gray-200 dark:border-white/5"><span class="text-gray-500 dark:text-gray-400">{{ $t('product_detail.specs.core') }}</span><span class="font-bold text-gray-900 dark:text-white">{{ $t('product_detail.specs.black_eva') }}</span></li>
                  <li class="flex justify-between py-2 border-b border-gray-200 dark:border-white/5"><span class="text-gray-500 dark:text-gray-400">{{ $t('product_detail.specs.surface') }}</span><span class="font-bold text-gray-900 dark:text-white">{{ $t('product_detail.specs.carbon_18k') }}</span></li>
                  <li class="flex justify-between py-2 border-b border-gray-200 dark:border-white/5"><span class="text-gray-500 dark:text-gray-400">{{ $t('product_detail.specs.weight') }}</span><span class="font-bold text-gray-900 dark:text-white">360-375g</span></li>
                  <li class="flex justify-between py-2 border-b border-gray-200 dark:border-white/5"><span class="text-gray-500 dark:text-gray-400">{{ $t('product_detail.specs.balance') }}</span><span class="font-bold text-gray-900 dark:text-white">{{ $t('product_detail.specs.med_high') }}</span></li>
                </ul>
              </div>
              <div v-if="activeTab === 'reviews'" class="animate-fade-in-up">
                <div class="space-y-6">
                  <!-- Single Review -->
                  <div class="border-b border-gray-200 dark:border-white/5 pb-4">
                    <div class="flex items-center space-x-2 mb-2">
                      <div class="flex text-foxer-orange w-4 h-4">
                        <svg v-for="i in 5" :key="i" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                      </div>
                      <span class="font-bold">Ahmet Y.</span>
                      <span class="text-gray-500 text-xs">{{ $t('product_detail.days_ago') }}</span>
                    </div>
                    <p class="text-gray-600 dark:text-gray-400 text-sm">{{ $t('product_detail.demo_review') }}</p>
                  </div>
                  
                  <!-- Write Review Section (Mobile only) -->
                  <div class="lg:hidden mt-10 pt-8 border-t border-gray-200 dark:border-white/10">
                    <h3 class="text-lg font-bold mb-4">{{ $t('product_detail.write_review', 'Écrire un avis') }}</h3>
                    
                    <!-- Not Authenticated -->
                    <div v-if="!authStore.isAuthenticated" class="bg-gray-100 dark:bg-white/5 p-6 rounded-2xl text-center border border-gray-200 dark:border-white/5 shadow-sm">
                      <p class="text-gray-600 dark:text-gray-400 mb-5 font-medium">{{ $t('product_detail.login_to_review', 'Vous devez être connecté pour laisser un avis.') }}</p>
                      <button @click="redirectToLogin" class="bg-gradient-to-r from-foxer-orange to-[#ff7a33] text-white px-8 py-3 rounded-xl font-bold shadow-[0_10px_20px_rgba(255,90,0,0.2)] hover:shadow-[0_10px_25px_rgba(255,90,0,0.4)] hover:-translate-y-0.5 transition-all">
                        {{ $t('auth.login', 'Connexion') }}
                      </button>
                    </div>

                    <!-- Authenticated -->
                    <form v-else @submit.prevent="submitReview" class="space-y-5 bg-gray-50 dark:bg-white/[0.02] p-6 rounded-2xl border border-gray-200 dark:border-white/5">
                      <div>
                        <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{{ $t('product_detail.rating', 'Votre note') }}</label>
                        <div class="flex space-x-2 text-foxer-orange">
                          <svg v-for="i in 5" :key="i" @click="reviewForm.rating = i" class="h-8 w-8 cursor-pointer transition-transform hover:scale-110 drop-shadow-sm" :class="i <= reviewForm.rating ? 'fill-current' : 'text-gray-300 dark:text-gray-600 fill-current'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        </div>
                      </div>
                      <div>
                        <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{{ $t('product_detail.comment', 'Votre commentaire') }}</label>
                        <textarea v-model="reviewForm.comment" rows="4" class="w-full bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/10 rounded-xl p-4 text-gray-900 dark:text-white focus:outline-none focus:border-foxer-orange focus:ring-1 focus:ring-foxer-orange transition-all placeholder-gray-400 dark:placeholder-gray-600 shadow-inner" :placeholder="$t('product_detail.review_placeholder', 'Partagez votre expérience avec ce produit...')"></textarea>
                      </div>
                      <button type="submit" :disabled="!reviewForm.comment || submittingReview" class="bg-gradient-to-r from-foxer-orange to-[#ff7a33] disabled:opacity-50 text-white font-bold px-8 py-3.5 rounded-xl transition-all hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(255,90,0,0.3)] flex items-center space-x-2">
                        <span v-if="submittingReview" class="animate-spin inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span>
                        <span v-else>{{ $t('product_detail.submit_review', 'Envoyer mon avis') }}</span>
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <!-- Related Products -->
      <div 
        class="mt-32"
        v-motion
        :initial="{ opacity: 0, y: 30 }"
        :enter="{ opacity: 1, y: 0, transition: { delay: 200, duration: 600 } }"
      >
        <h2 class="text-3xl font-display font-bold mb-8 flex items-center">
          {{ $t('product_detail.related_products') }}
          <div class="h-1 flex-grow bg-gray-200 dark:bg-white/10 ml-6 rounded-full"></div>
        </h2>

        <div v-if="relatedProducts.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div 
            v-for="relatedProduct in relatedProducts" :key="relatedProduct.id"
            class="glass-card rounded-2xl p-4 group hover:-translate-y-2 transition-all duration-300 hover:shadow-xl border border-gray-200/80 dark:border-white/5 flex flex-col relative"
          >
            <div class="relative aspect-[4/5] rounded-xl overflow-hidden bg-gray-100 dark:bg-foxer-gray mb-4">
              <img :src="getPrimaryImage(relatedProduct)" :alt="getProductName(relatedProduct)" class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            </div>
            <div class="space-y-1 relative flex-grow flex flex-col justify-end">
              <h3 class="text-base font-bold line-clamp-1">
                <router-link :to="'/product/' + relatedProduct.slug" class="hover:text-foxer-orange transition-colors before:absolute before:inset-0 before:z-0">{{ getProductName(relatedProduct) }}</router-link>
              </h3>
              <p class="text-foxer-orange font-bold text-lg font-display">{{ formatPrice(relatedProduct, currencyStore.currency) }}</p>
            </div>
          </div>
        </div>
        <div v-else class="text-gray-500 italic">
          {{ $t('products.empty_title', 'No related products found') }}
        </div>
      </div>

    </div>
    
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import DOMPurify from 'dompurify'
import api from '../api'
import { useCartStore } from '../stores/cart'
import { useWishlistStore } from '../stores/wishlist'
import { useRecentlyViewedStore } from '../stores/recentlyViewed'
import { useAuthStore } from '../stores/auth'
import { useCurrencyStore } from '../stores/currency'
import { formatPrice } from '@/utils/currency'

const route = useRoute()
const router = useRouter()
const { locale } = useI18n()
const cartStore = useCartStore()
const wishlistStore = useWishlistStore()
const recentlyViewedStore = useRecentlyViewedStore()
const authStore = useAuthStore()
const currencyStore = useCurrencyStore()

const loading = ref(true)
const product = ref({})
const relatedProducts = ref([])
const activeImage = ref('')
const selectedOption = ref(null)
const quantity = ref(1)
const activeTab = ref('desc')
const addingToCart = ref(false)

const reviewForm = ref({ rating: 5, comment: '' })
const submittingReview = ref(false)

const redirectToLogin = () => {
  router.push(`/login?redirect=${encodeURIComponent(route.fullPath)}`)
}

const submitReview = async () => {
  if (!reviewForm.value.comment.trim()) return
  submittingReview.value = true
  
  // Fake API call
  setTimeout(() => {
    submittingReview.value = false
    reviewForm.value.comment = ''
    alert('Merci pour votre avis !') // Basic feedback for now
  }, 800)
}

const addToCart = async () => {
  if (!product.value || !product.value.id) return
  addingToCart.value = true
  await cartStore.addToCart(product.value, quantity.value)
  addingToCart.value = false
  // Optional: show a toast or notification
}

const toggleWishlist = async () => {
  if (!product.value) return
  await wishlistStore.toggleWishlist(product.value)
}

const fetchProduct = async () => {
  loading.value = true
  try {
    const res = await api.get(`/products/${route.params.id}`)
    if (res.data.status === 'success') {
      product.value = res.data.product
      
      // Set active image
      if (product.value.images && product.value.images.length > 0) {
        product.value.images = product.value.images.map(img => {
          let url = img.url || img;
          if (url && typeof url === 'string' && url.startsWith('/uploads/')) {
            url = `http://localhost:3000${url}`;
          }
          return url;
        });
        activeImage.value = product.value.images[0]
      } else {
        product.value.images = ['https://foxersport.com/image/cache/catalog/clothing-994x540.png']
        activeImage.value = product.value.images[0]
      }

      // Set default variant
      if (product.value.variants && product.value.variants.length > 0) {
        selectedOption.value = product.value.variants[0]
      }
      
      recentlyViewedStore.addViewerProduct(product.value.id)
      fetchRelatedProducts(product.value.slug)
    }
  } catch (error) {
    console.error('Error fetching product:', error)
  } finally {
    loading.value = false
  }
}

// Translations Computed Properties
const getTranslation = (field) => {
  if (!product.value.translations || product.value.translations.length === 0) return ''
  const t = product.value.translations.find(t => t.locale === locale.value) ||
            product.value.translations.find(t => t.locale === 'en') ||
            product.value.translations.find(t => t.locale === 'tr') ||
            product.value.translations[0]
  return t ? t[field] : ''
}

const productName = computed(() => {
  return getTranslation('name') || product.value.slug || ''
})

const decodeHTML = (html) => {
  if (!html) return ''
  const txt = document.createElement('textarea')
  txt.innerHTML = html
  return txt.value
}

const productShortDesc = computed(() => {
  return DOMPurify.sanitize(decodeHTML(getTranslation('shortDescription') || ''))
})

const productDesc = computed(() => {
  return DOMPurify.sanitize(decodeHTML(getTranslation('description') || ''))
})

const productCategory = computed(() => {
  if (!product.value.category || !product.value.category.translations || product.value.category.translations.length === 0) return 'Category'
  const t = product.value.category.translations.find(t => t.locale === locale.value) ||
            product.value.category.translations.find(t => t.locale === 'en') ||
            product.value.category.translations.find(t => t.locale === 'tr') ||
            product.value.category.translations[0]
  return t ? t.name : product.value.category.slug || 'Category'
})

const fetchRelatedProducts = async (slug) => {
  try {
    const res = await api.get(`/products/${slug}/related?limit=4`)
    if (res.data.status === 'success') {
      relatedProducts.value = res.data.data
    }
  } catch (error) {
    console.error('Error fetching related products:', error)
  }
}

const getPrimaryImage = (p) => {
  if (p.images && p.images.length > 0) {
    const url = p.images[0].url || p.images[0];
    if (url && typeof url === 'string' && url.startsWith('/uploads/')) {
      return `http://localhost:3000${url}`;
    }
    return url;
  }
  return 'https://foxersport.com/image/cache/catalog/clothing-994x540.png'
}

const getProductName = (p) => {
  const t = p.translations?.find(tr => tr.locale === locale.value)
  if (t && t.name) return t.name
  const en = p.translations?.find(tr => tr.locale === 'en')
  if (en && en.name) return en.name
  return p.translations?.[0]?.name || p.slug
}

watch(() => route.params.id, () => {
  fetchProduct()
})

onMounted(() => {
  fetchProduct()
})
</script>

<style scoped>
@keyframes shimmer {
  100% { transform: translateX(100%); }
}

/* Custom scrollbar for thumbnails */
.thumbnails-scroll::-webkit-scrollbar {
  width: 4px;
}
.thumbnails-scroll::-webkit-scrollbar-track {
  background: transparent;
}
.thumbnails-scroll::-webkit-scrollbar-thumb {
  background: rgba(255, 90, 0, 0.3);
  border-radius: 2px;
}
.thumbnails-scroll::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 90, 0, 0.5);
}

/* Nested styles for description content HTML rendering */
:deep(.description-content p) {
  margin-bottom: 1rem;
}
:deep(.description-content p:last-child) {
  margin-bottom: 0;
}
:deep(.description-content ul) {
  list-style-type: disc;
  padding-left: 1.5rem;
  margin-bottom: 1rem;
}
:deep(.description-content ol) {
  list-style-type: decimal;
  padding-left: 1.5rem;
  margin-bottom: 1rem;
}
:deep(.description-content li) {
  margin-bottom: 0.5rem;
}
:deep(.description-content strong) {
  font-weight: bold;
  color: inherit;
}
:deep(.description-content br) {
  margin-bottom: 0.5rem;
}
</style>
