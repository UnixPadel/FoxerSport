<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div>
        <h1 class="text-3xl font-display font-bold text-gray-900 dark:text-white mb-1">{{ $t('admin.products_title') }}</h1>
        <p class="text-gray-500 dark:text-gray-400 text-sm">{{ $t('admin.products_desc') }}</p>
      </div>
      <router-link to="/admin/products/new" class="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-foxer-orange to-orange-600 hover:from-orange-500 hover:to-red-600 text-white rounded-xl font-bold shadow-lg shadow-foxer-orange/20 transition-all active:scale-95">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
        {{ $t('admin.new_product') }}
      </router-link>
      <button @click="showBulkDiscountModal = true" class="flex items-center gap-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-xl font-bold transition-colors">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        {{ $t('admin.global_discounts') }}
      </button>
    </div>

    <div class="glass-card rounded-[2rem] bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10 overflow-hidden shadow-sm">
      <!-- Controls -->
      <div class="p-6 border-b border-gray-200 dark:border-white/10 flex flex-col lg:flex-row gap-4 items-center justify-between bg-gray-50 dark:bg-slate-800">
        <div class="relative w-full lg:w-96">
          <input 
            type="text" 
            v-model="searchQuery"
            :placeholder="$t('admin.search_product')" 
            class="w-full pl-11 pr-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder-gray-400 focus:border-foxer-orange focus:ring-1 focus:ring-foxer-orange transition-all outline-none shadow-sm"
          >
          <svg class="w-5 h-5 text-gray-400 absolute left-4 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
        <div class="flex items-center gap-3 w-full lg:w-auto">
          <select v-model="selectedCategory" class="w-full lg:w-auto px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white focus:border-foxer-orange focus:ring-1 focus:ring-foxer-orange outline-none shadow-sm">
            <option value="all">{{ $t('admin.all_categories') }}</option>
            <option v-for="cat in allCategories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
          </select>
        </div>
      </div>

      <!-- Table Desktop -->
      <div class="hidden lg:block overflow-x-auto">
        <table class="w-full text-left border-collapse text-sm table-fixed">
          <thead>
            <tr class="bg-gray-50 dark:bg-slate-900 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider font-bold">
              <th class="p-2 pl-6 w-[30%]">{{ $t('admin.product') }}</th>
              <th class="p-2 w-[10%]">{{ $t('admin.category') }}</th>
              <th class="p-2 w-[12%]">{{ $t('admin.price_tl') }}</th>
              <th class="p-2 w-[8%]">{{ $t('admin.stock') }}</th>
              <th class="p-2 w-[10%]">{{ $t('admin.status') }}</th>
              <th class="p-2 w-[15%] text-center">{{ $t('admin.popular', 'Populaire') }}</th>
              <th class="p-2 pr-6 w-[20%] text-right">{{ $t('admin.actions') }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-white/5">
            <tr v-if="loading" v-for="i in 5" :key="i" class="animate-pulse">
              <td class="p-2 pl-6"><div class="h-10 bg-gray-200 dark:bg-white/5 rounded-lg w-48"></div></td>
              <td class="p-2"><div class="h-6 bg-gray-200 dark:bg-white/5 rounded w-24"></div></td>
              <td class="p-2"><div class="h-6 bg-gray-200 dark:bg-white/5 rounded w-16"></div></td>
              <td class="p-2"><div class="h-6 bg-gray-200 dark:bg-white/5 rounded w-12"></div></td>
              <td class="p-2"><div class="h-6 bg-gray-200 dark:bg-white/5 rounded-full w-20"></div></td>
              <td class="p-2"><div class="h-6 w-6 mx-auto bg-gray-200 dark:bg-white/5 rounded-full"></div></td>
              <td class="p-2 pr-6"><div class="h-8 bg-gray-200 dark:bg-white/5 rounded-lg w-16 ml-auto"></div></td>
            </tr>
            
            <tr v-else-if="paginatedProducts.length === 0">
              <td colspan="7" class="p-12 text-center text-gray-500 dark:text-gray-400">
                <div class="w-16 h-16 mx-auto bg-gray-100 dark:bg-slate-900 rounded-full flex items-center justify-center mb-4">
                  <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                </div>
                {{ $t('admin.no_products_found', 'Aucun produit ne correspond à ces critères.') }}
              </td>
            </tr>

            <tr v-else v-for="product in paginatedProducts" :key="product.id" class="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
              <td class="p-2 pl-6 truncate">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-lg bg-gray-100 dark:bg-black/40 overflow-hidden flex-shrink-0">
                    <img v-if="product.images?.[0]?.url" :src="product.images[0].url.startsWith('/uploads/') ? 'http://localhost:3000' + product.images[0].url : product.images[0].url" class="w-full h-full object-cover" />
                  </div>
                  <div class="min-w-0 flex-1">
                    <p class="text-gray-900 dark:text-white font-bold truncate">{{ product.translations?.[0]?.name || product.slug }}</p>
                    <p class="text-xs text-gray-500 truncate">REF: {{ product.id.substring(0,8) }}</p>
                  </div>
                </div>
              </td>
              <td class="p-2 text-gray-600 dark:text-gray-300 truncate">{{ product.category?.translations?.[0]?.name || 'N/A' }}</td>
              <td class="p-2 text-foxer-orange font-bold truncate">{{ product.priceTry }} TL</td>
              <td class="p-2">
                <span class="px-2 py-1 bg-gray-100 dark:bg-white/10 rounded-md text-gray-700 dark:text-gray-300 text-sm font-mono" :class="{'!text-red-500 !bg-red-50 dark:!bg-red-500/10 border border-red-200 dark:border-red-500/20': product.stockQuantity <= 5}">
                  {{ product.stockQuantity || 0 }}
                </span>
              </td>
              <td class="p-2">
                <span class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider" :class="product.isActive !== false ? 'bg-green-50 text-green-600 border border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20' : 'bg-red-50 text-red-600 border border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20'">
                  {{ product.isActive !== false ? $t('admin.active', 'Actif') : $t('admin.inactive', 'Inactif') }}
                </span>
              </td>
              <td class="p-2 text-center">
                <button @click="toggleFeatured(product)" class="p-1.5 rounded-full transition-colors" :class="product.isFeatured ? 'text-yellow-500 bg-yellow-50 dark:bg-yellow-500/10' : 'text-gray-300 dark:text-gray-600 hover:text-yellow-500'">
                  <svg class="w-5 h-5" :fill="product.isFeatured ? 'currentColor' : 'none'" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
                </button>
              </td>
              <td class="p-2 pr-6 text-right transition-colors whitespace-nowrap">
                <div class="flex flex-nowrap items-center justify-end gap-2">
                  <router-link :to="`/admin/products/${product.id}`" class="p-2 text-gray-400 hover:text-foxer-orange hover:bg-orange-50 dark:hover:bg-orange-400/10 rounded-lg transition-colors" :title="$t('admin.edit_full', 'Modifier (Complet)')">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                  </router-link>
                  <button @click="openEditModal(product)" class="p-2 text-gray-400 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-400/10 rounded-lg transition-colors" :title="$t('admin.quick_price_discount', 'Prix Rapide / Réduction')">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  </button>
                  <button @click="viewProduct(product)" class="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-400/10 rounded-lg transition-colors" :title="$t('admin.view')">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  </button>
                  <button @click="deleteProduct(product.id)" class="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-400/10 rounded-lg transition-colors" :title="$t('admin.delete')">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Mobile Cards -->
      <div class="lg:hidden divide-y divide-gray-100 dark:divide-white/5">
        <div v-if="loading" v-for="i in 5" :key="i" class="p-4 animate-pulse flex gap-4">
          <div class="w-16 h-16 bg-gray-200 dark:bg-white/5 rounded-xl"></div>
          <div class="flex-1 space-y-3">
            <div class="h-4 bg-gray-200 dark:bg-white/5 rounded w-3/4"></div>
            <div class="h-4 bg-gray-200 dark:bg-white/5 rounded w-1/2"></div>
          </div>
        </div>
        
        <div v-else-if="paginatedProducts.length === 0" class="p-12 text-center text-gray-500 dark:text-gray-400">
          <div class="w-16 h-16 mx-auto bg-gray-100 dark:bg-slate-900 rounded-full flex items-center justify-center mb-4">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
          </div>
          {{ $t('admin.no_products_found', 'Aucun produit ne correspond à ces critères.') }}
        </div>

        <div v-else v-for="product in paginatedProducts" :key="`mobile-${product.id}`" class="p-5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
          <div class="flex gap-4">
            <!-- Image -->
            <div class="w-20 h-20 rounded-xl bg-gray-100 dark:bg-black/40 overflow-hidden flex-shrink-0 border border-gray-200 dark:border-white/10 shadow-sm">
              <img v-if="product.images?.[0]?.url" :src="product.images[0].url.startsWith('/uploads/') ? 'http://localhost:3000' + product.images[0].url : product.images[0].url" class="w-full h-full object-cover" />
              <div v-else class="w-full h-full flex items-center justify-center text-gray-300">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </div>
            </div>
            
            <!-- Info -->
            <div class="flex-1 flex flex-col justify-between">
              <div>
                <div class="flex justify-between items-start gap-2">
                  <h3 class="text-sm font-bold text-gray-900 dark:text-white line-clamp-2 leading-tight">{{ product.translations?.[0]?.name || product.slug }}</h3>
                  <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider shrink-0" :class="product.isActive !== false ? 'bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400' : 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400'">
                    {{ product.isActive !== false ? $t('admin.active', 'Actif') : $t('admin.inactive', 'Inactif') }}
                  </span>
                </div>
                <p class="text-xs text-gray-500 mt-1">{{ product.category?.translations?.[0]?.name || 'N/A' }} • REF: {{ product.id.substring(0,6) }}</p>
              </div>
              
              <div class="mt-2 flex items-center justify-between">
                <span class="text-foxer-orange font-bold text-base">{{ product.priceTry }} TL</span>
                <span class="text-xs text-gray-500 bg-gray-100 dark:bg-white/5 px-2 py-1 rounded-md font-mono" :class="{'!text-red-500 !bg-red-50 dark:!bg-red-500/10 border border-red-200 dark:border-red-500/20': product.stockQuantity <= 5}">Stock: <strong class="text-gray-900 dark:text-white" :class="{'!text-red-600 dark:!text-red-400': product.stockQuantity <= 5}">{{ product.stockQuantity || 0 }}</strong></span>
              </div>
            </div>
          </div>
          
          <!-- Actions Mobile -->
          <div class="mt-4 flex items-center justify-between border-t border-gray-100 dark:border-white/5 pt-3">
             <button @click="toggleFeatured(product)" class="flex items-center gap-1.5 text-xs font-bold transition-colors px-3 py-1.5 rounded-lg border" :class="product.isFeatured ? 'text-yellow-600 bg-yellow-50 border-yellow-200 dark:bg-yellow-500/10 dark:text-yellow-500 dark:border-yellow-500/20' : 'text-gray-500 border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:text-yellow-600'">
                <svg class="w-4 h-4" :fill="product.isFeatured ? 'currentColor' : 'none'" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
                Star
             </button>
             
             <div class="flex gap-2">
                <router-link :to="`/admin/products/${product.id}`" class="p-2 text-gray-500 hover:text-foxer-orange bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-sm">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                </router-link>
                <button @click="openEditModal(product)" class="p-2 text-gray-500 hover:text-green-500 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-sm">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </button>
                <button @click="deleteProduct(product.id)" class="p-2 text-gray-500 hover:text-red-500 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-sm">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
             </div>
          </div>
        </div>
      </div>
      
      <!-- Pagination -->
      <div class="p-2 border-t border-gray-200 dark:border-white/10 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-slate-800">
        <p>{{ $t('admin.page') }} {{ currentPage }} / {{ totalPages }} ({{ filteredProducts.length }} {{ $t('admin.product_count') }})</p>
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

    <!-- Product Detail Modal -->
    <Teleport to="body">
      <div v-if="selectedProduct" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" @click="selectedProduct = null"></div>
        <div class="relative w-full max-w-lg bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-white/10 p-6 max-h-[90vh] overflow-y-auto">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-display font-bold text-gray-900 dark:text-white">{{ $t('admin.product_detail_title') }}</h3>
            <button @click="selectedProduct = null" class="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center text-gray-500 hover:text-red-500 transition-colors">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <div class="space-y-4 text-sm">
            <div v-if="selectedProduct.images?.[0]?.url" class="w-full h-48 rounded-xl overflow-hidden bg-gray-100 dark:bg-black/40">
              <img :src="selectedProduct.images[0].url.startsWith('/uploads/') ? 'http://localhost:3000' + selectedProduct.images[0].url : selectedProduct.images[0].url" class="w-full h-full object-contain" />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-gray-500 dark:text-gray-400 text-xs uppercase font-bold mb-1">{{ $t('admin.name') }}</p>
                <p class="font-bold text-gray-900 dark:text-white">{{ selectedProduct.translations?.[0]?.name || selectedProduct.slug }}</p>
              </div>
              <div>
                <p class="text-gray-500 dark:text-gray-400 text-xs uppercase font-bold mb-1">{{ $t('admin.category') }}</p>
                <p class="text-gray-900 dark:text-white">{{ selectedProduct.category?.translations?.[0]?.name || 'N/A' }}</p>
              </div>
              <div>
                <p class="text-gray-500 dark:text-gray-400 text-xs uppercase font-bold mb-1">{{ $t('admin.price') }}</p>
                <p class="text-foxer-orange font-bold text-lg">{{ selectedProduct.priceTry }} TL</p>
              </div>
              <div>
                <p class="text-gray-500 dark:text-gray-400 text-xs uppercase font-bold mb-1">{{ $t('admin.stock') }}</p>
                <p class="font-bold" :class="selectedProduct.stockQuantity <= 5 ? 'text-red-500' : 'text-gray-900 dark:text-white'">{{ selectedProduct.stockQuantity }}</p>
              </div>
              <div>
                <p class="text-gray-500 dark:text-gray-400 text-xs uppercase font-bold mb-1">Slug</p>
                <p class="font-mono text-gray-600 dark:text-gray-300 text-xs">{{ selectedProduct.slug }}</p>
              </div>
              <div>
                <p class="text-gray-500 dark:text-gray-400 text-xs uppercase font-bold mb-1">ID</p>
                <p class="font-mono text-gray-600 dark:text-gray-300 text-xs">{{ selectedProduct.id }}</p>
              </div>
            </div>
            <div v-if="selectedProduct.translations?.[0]?.description" class="border-t border-gray-200 dark:border-white/10 pt-4">
              <p class="text-gray-500 dark:text-gray-400 text-xs uppercase font-bold mb-1">{{ $t('admin.description') }}</p>
              <p class="text-gray-700 dark:text-gray-300">{{ selectedProduct.translations[0].description }}</p>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    
    <!-- Edit Product Modal -->
    <Teleport to="body">
      <div v-if="productToEdit" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" @click="productToEdit = null"></div>
        <div class="relative w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-white/10 p-6">
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">{{ $t('admin.edit_product', 'Modifier le Produit') }} : {{ productToEdit.translations?.[0]?.name || productToEdit.slug }}</h3>
          
          <div class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">{{ $t('admin.brand') }}</label>
                <input v-model="editForm.brand" type="text" class="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white outline-none focus:border-foxer-orange" />
              </div>
              <div>
                <label class="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Poids (g)</label>
                <input v-model="editForm.weightGrams" type="number" class="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white outline-none focus:border-foxer-orange" />
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label class="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">{{ $t('admin.quantity_stock') }}</label>
                <input v-model="editForm.stockQuantity" type="number" class="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white outline-none focus:border-foxer-orange" />
              </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">{{ $t('admin.price') }}</label>
                <input v-model="editForm.basePrice" type="number" step="0.01" class="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white outline-none focus:border-emerald-500" />
              </div>
              <div>
                <label class="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">{{ $t('admin.discount_percent') }} (%)</label>
                <input v-model="editForm.discountPercent" type="number" min="0" max="100" class="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white outline-none focus:border-rose-500" />
              </div>
            </div>
            
            <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-900/50 rounded-lg border border-gray-200 dark:border-white/10">
              <span class="text-xs font-medium text-gray-500">{{ $t('admin.selling_price') }}</span>
              <span class="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                {{ editForm.discountPercent > 0 ? (editForm.basePrice - (editForm.basePrice * editForm.discountPercent / 100)).toFixed(2) : editForm.basePrice }} TL
              </span>
            </div>

            <div class="flex items-center gap-2 mt-2">
              <input type="checkbox" id="editActive" v-model="editForm.isActive" class="w-4 h-4 text-foxer-orange bg-gray-100 border-gray-300 rounded focus:ring-foxer-orange dark:focus:ring-foxer-orange dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
              <label for="editActive" class="text-sm font-bold text-gray-900 dark:text-gray-300">{{ $t('admin.online_store') }}</label>
            </div>
          </div>

          <div class="flex justify-end gap-3 mt-6">
            <button @click="productToEdit = null" class="px-4 py-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg font-bold transition-colors">{{ $t('admin.cancel') }}</button>
            <button @click="saveProductEdit" :disabled="saving" class="px-4 py-2 bg-foxer-orange hover:bg-[#ff7a33] text-white rounded-lg font-bold transition-colors disabled:opacity-50">{{ $t('admin.save') }}</button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Bulk Discount Modal -->
    <Teleport to="body">
      <div v-if="showBulkDiscountModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" @click="showBulkDiscountModal = false"></div>
        <div class="relative w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-white/10 p-6">
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">{{ $t('admin.global_discounts') }}</h3>
          <p class="text-sm text-gray-500 mb-6">{{ $t('admin.bulk_discount_desc') }}</p>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">{{ $t('admin.discount_percentage') }}</label>
              <input v-model="bulkPercentage" type="number" min="1" max="99" placeholder="Ex: 20" class="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white outline-none focus:border-foxer-orange text-lg text-center font-bold" />
            </div>
            
            <button @click="applyBulkDiscount" :disabled="saving || !bulkPercentage" class="w-full py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white rounded-xl font-bold shadow-lg shadow-green-500/20 transition-all disabled:opacity-50">
              {{ $t('admin.apply_discount', { percentage: bulkPercentage || 0 }) }}
            </button>
            
            <div class="relative py-3">
              <div class="absolute inset-0 flex items-center"><div class="w-full border-t border-gray-200 dark:border-white/10"></div></div>
              <div class="relative flex justify-center"><span class="bg-white dark:bg-slate-800 px-3 text-xs text-gray-400 uppercase font-bold">{{ $t('admin.or') }}</span></div>
            </div>

            <button @click="removeBulkDiscount" :disabled="saving" class="w-full py-3 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-500/10 dark:hover:bg-red-500/20 rounded-xl font-bold transition-all disabled:opacity-50 border border-red-200 dark:border-red-500/20">
              {{ $t('admin.remove_all_discounts') }}
            </button>
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
const products = ref([])
const categories = ref([])
const loading = ref(true)
const selectedProduct = ref(null)
const showBulkDiscountModal = ref(false)
const bulkPercentage = ref('')
const saving = ref(false)
const productToEdit = ref(null)
const editForm = ref({ basePrice: 0, discountPercent: 0, isActive: true, stockQuantity: 0, brand: '', weightGrams: null })

const toggleFeatured = async (product) => {
  try {
    const res = await api.put(`/admin/products/${product.id}`, {
      isFeatured: !product.isFeatured
    })
    if (res.data.status === 'success') {
      product.isFeatured = !product.isFeatured
      toast.success(product.isFeatured ? t('admin.marked_popular') : t('admin.removed_popular'))
    }
  } catch (error) {
    toast.error(t('admin.edit_error'))
  }
}

const openEditModal = (product) => {
  productToEdit.value = product
  const basePrice = product.compareAtPriceTry || product.priceTry;
  const discountPercent = product.compareAtPriceTry ? Math.round(((product.compareAtPriceTry - product.priceTry) / product.compareAtPriceTry) * 100) : 0;
  editForm.value = {
    basePrice: basePrice,
    discountPercent: discountPercent,
    isActive: product.isActive,
    stockQuantity: product.stockQuantity,
    brand: product.brand || '',
    weightGrams: product.weightGrams || null
  }
}

const saveProductEdit = async () => {
  saving.value = true
  try {
    const basePrice = Number(editForm.value.basePrice) || 0;
    const discount = Number(editForm.value.discountPercent) || 0;
    const finalPrice = discount > 0 ? basePrice - (basePrice * discount / 100) : basePrice;

    const payload = {
      brand: editForm.value.brand,
      isActive: editForm.value.isActive,
      stockQuantity: Number(editForm.value.stockQuantity) || 0,
      priceTry: Number(finalPrice.toFixed(2)),
      compareAtPriceTry: discount > 0 ? basePrice : null,
      weightGrams: editForm.value.weightGrams ? Number(editForm.value.weightGrams) : null
    };
    
    const res = await api.put(`/admin/products/${productToEdit.value.id}`, payload)
    if (res.data.status === 'success') {
      toast.success(t('admin.product_updated'))
      productToEdit.value = null
      fetchProductsAndCategories()
    }
  } catch (error) {
    toast.error(t('admin.update_error'))
  } finally {
    saving.value = false
  }
}

const applyBulkDiscount = async () => {
  if (!confirm(t('admin.confirm_bulk_discount', { percentage: bulkPercentage.value }))) return;
  saving.value = true
  try {
    const res = await api.post('/admin/products/bulk-discount', { percentage: Number(bulkPercentage.value) })
    if (res.data.status === 'success') {
      toast.success(t('admin.bulk_discount_applied'))
      showBulkDiscountModal.value = false
      bulkPercentage.value = ''
      fetchProductsAndCategories()
    }
  } catch (error) {
    toast.error(t('admin.bulk_discount_error'))
  } finally {
    saving.value = false
  }
}

const removeBulkDiscount = async () => {
  if (!confirm(t('admin.confirm_remove_discounts'))) return;
  saving.value = true
  try {
    const res = await api.post('/admin/products/bulk-discount', { remove: true })
    if (res.data.status === 'success') {
      toast.success(t('admin.discounts_removed'))
      showBulkDiscountModal.value = false
      fetchProductsAndCategories()
    }
  } catch (error) {
    toast.error(t('admin.remove_error'))
  } finally {
    saving.value = false
  }
}


const searchQuery = ref('')
const selectedCategory = ref('all')

// Pagination
const currentPage = ref(1)
const perPage = 15

const fetchProductsAndCategories = async () => {
  loading.value = true
  try {
    const [pRes, cRes] = await Promise.all([
      api.get('/products?limit=1000&isAdmin=true'),
      api.get('/categories')
    ])
    if (pRes.data.status === 'success') {
      products.value = pRes.data.data || []
    }
    if (cRes.data.status === 'success') {
      categories.value = cRes.data.categories || []
    }
  } catch (error) {
    console.error('Error fetching products or categories:', error)
    toast.error(t('admin.load_error_products'))
  } finally {
    loading.value = false
  }
}

// Flatten categories (parent + children) for filter dropdown
const allCategories = computed(() => {
  const flat = []
  for (const cat of categories.value) {
    flat.push({ id: cat.id, name: cat.translations?.[0]?.name || cat.slug || 'Catégorie' })
    if (cat.children) {
      for (const child of cat.children) {
        flat.push({ id: child.id, name: '  └ ' + (child.translations?.[0]?.name || child.slug || 'Sous-catégorie') })
      }
    }
  }
  return flat
})

const filteredProducts = computed(() => {
  currentPage.value = 1
  return products.value.filter(p => {
    if (selectedCategory.value !== 'all' && p.category?.id !== selectedCategory.value) {
      return false
    }
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase()
      const name = p.translations?.[0]?.name?.toLowerCase() || ''
      const slug = p.slug?.toLowerCase() || ''
      const id = p.id?.toLowerCase() || ''
      if (!name.includes(q) && !slug.includes(q) && !id.includes(q)) {
        return false
      }
    }
    return true
  })
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredProducts.value.length / perPage)))
const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * perPage
  return filteredProducts.value.slice(start, start + perPage)
})

const viewProduct = (product) => {
  selectedProduct.value = product
}

const deleteProduct = async (id) => {
  if (confirm(t('admin.confirm_delete_product'))) {
    try {
      const res = await api.delete(`/admin/products/${id}`)
      if (res.data.status === 'success') {
        toast.success(t('admin.product_deleted'))
        products.value = products.value.filter(p => p.id !== id)
      } else {
        toast.error(t('admin.delete_error'))
      }
    } catch (error) {
      console.error(error)
      toast.error(t('admin.delete_error'))
    }
  }
}

onMounted(() => {
  fetchProductsAndCategories()
})
</script>
