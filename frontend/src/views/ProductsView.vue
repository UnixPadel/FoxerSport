<template>
  <div
    class="min-h-screen pt-24 pb-16 relative overflow-hidden transition-colors duration-700"
    :class="isDark ? 'text-white' : 'text-gray-900'"
  >
    <!-- ── Animated gradient background ── -->
    <div class="absolute inset-0 -z-10" :class="isDark ? 'bg-[#080810]' : 'bg-[#f5f5f7]'">
      <!-- Blob 1 — Orange warm -->
      <div
        class="absolute rounded-full blur-[120px] opacity-30 animate-blob"
        :class="isDark ? 'bg-orange-600/40' : 'bg-orange-400/25'"
        style="width:55%;height:55%;top:-10%;left:-15%;"
      ></div>
      <!-- Blob 2 — Deep blue/indigo -->
      <div
        class="absolute rounded-full blur-[140px] opacity-20 animate-blob animation-delay-3000"
        :class="isDark ? 'bg-indigo-700/50' : 'bg-blue-400/20'"
        style="width:50%;height:50%;top:40%;right:-10%;"
      ></div>
      <!-- Blob 3 — Amber/gold -->
      <div
        class="absolute rounded-full blur-[100px] opacity-25 animate-blob animation-delay-5000"
        :class="isDark ? 'bg-amber-500/30' : 'bg-amber-300/20'"
        style="width:40%;height:40%;bottom:-5%;left:30%;"
      ></div>
      <!-- Subtle noise overlay for texture -->
      <div class="absolute inset-0 opacity-[0.025]"
           style="background-image:url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/%3E%3C/svg%3E');background-size:200px;">
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">

      <!-- ── Page Header ── -->
      <div class="mb-4">
        <h1 class="text-4xl font-display font-bold mb-0">{{ $t('nav.products', 'Products') }}</h1>
        <p :class="isDark ? 'text-gray-400' : 'text-gray-500'">
          {{ pagination.totalItems ?? 0 }} {{ $t('products.results', 'results found') }}
        </p>
      </div>

      <!-- ── Mobile: Filter Toggle ── -->
      <div class="lg:hidden mb-4">
        <button
          @click="mobileFiltersOpen = !mobileFiltersOpen"
          class="flex items-center gap-2.5 px-4 py-2.5 rounded-xl border font-semibold text-sm transition-all duration-200"
          :class="isDark ? 'border-white/15 bg-white/5 hover:bg-white/10' : 'border-gray-200 bg-white hover:bg-gray-50 shadow-sm'"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M3 4h18M7 8h10M11 12h2" />
          </svg>
          {{ $t('products.filters', 'Filters') }}
          <span v-if="activeFiltersCount > 0"
                class="bg-foxer-orange text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
            {{ activeFiltersCount }}
          </span>
        </button>
      </div>

      <!-- ── Main layout ── -->
      <div class="flex flex-col lg:flex-row gap-8">

        <!-- ══════════════════════════════════════
             SIDEBAR — Premium Filter Panel
        ══════════════════════════════════════ -->
        <aside
          class="w-full lg:w-72 flex-shrink-0"
          :class="{ 'hidden lg:block': !mobileFiltersOpen }"
        >
          <div
            class="rounded-2xl overflow-hidden"
            :class="isDark
              ? 'bg-[#111] border border-white/8 shadow-2xl'
              : 'bg-white border border-gray-100 shadow-xl'"
          >
            <!-- Panel header -->
            <div
              class="flex items-center justify-between px-6 py-4 border-b"
              :class="isDark ? 'border-white/8' : 'border-gray-100'"
            >
              <div class="flex items-center gap-2.5">
                <div class="w-7 h-7 rounded-lg bg-foxer-orange/15 flex items-center justify-center">
                  <svg class="w-3.5 h-3.5 text-foxer-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M3 4h18M7 9h10M10 14h4" />
                  </svg>
                </div>
                <span class="font-bold text-base tracking-tight">{{ $t('products.filters', 'Filters') }}</span>
                <span v-if="activeFiltersCount > 0"
                      class="bg-foxer-orange text-white text-xs font-black w-5 h-5 rounded-full flex items-center justify-center leading-none">
                  {{ activeFiltersCount }}
                </span>
              </div>
              <button
                v-if="activeFiltersCount > 0"
                @click="resetFilters"
                class="flex items-center gap-1 text-xs font-bold text-foxer-orange hover:text-orange-400 transition-colors"
              >
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
                {{ $t('products.reset_filters', 'Clear all') }}
              </button>
            </div>

            <!-- Panel body -->
            <div class="p-6 space-y-7 pr-5">

              <!-- ── SORT BY ── -->
              <section>
                <p class="text-[10px] font-black uppercase tracking-[0.14em] mb-3"
                   :class="isDark ? 'text-gray-500' : 'text-gray-400'">
                  {{ $t('products.sort_by', 'Sort By') }}
                </p>
                <div class="grid grid-cols-2 gap-2">
                  <button
                    v-for="opt in sortOptions"
                    :key="opt.value"
                    @click="filters.sort = opt.value; fetchProducts(1)"
                    class="py-2 px-2.5 rounded-xl text-xs font-semibold border transition-all duration-200 text-center truncate"
                    :class="filters.sort === opt.value
                      ? 'bg-foxer-orange border-foxer-orange text-white shadow-lg shadow-orange-500/20'
                      : isDark
                        ? 'border-white/10 text-gray-400 hover:border-foxer-orange/40 hover:text-foxer-orange'
                        : 'border-gray-200 text-gray-600 hover:border-foxer-orange/40 hover:text-foxer-orange'"
                  >{{ opt.label }}</button>
                </div>
              </section>

              <!-- Divider -->
              <div class="h-px" :class="isDark ? 'bg-white/6' : 'bg-gray-100'"></div>

              <!-- ── CATEGORIES ── -->
              <section>
                <p class="text-[10px] font-black uppercase tracking-[0.14em] mb-3"
                   :class="isDark ? 'text-gray-500' : 'text-gray-400'">
                  {{ $t('products.categories', 'Categories') }}
                </p>

                <div class="space-y-0.5">
                  <!-- All -->
                  <button
                    @click="filters.categorySlug = ''; fetchProducts(1)"
                    class="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 text-left"
                    :class="!filters.categorySlug
                      ? 'bg-foxer-orange/10 text-foxer-orange font-semibold ring-1 ring-inset ring-foxer-orange/25'
                      : isDark ? 'text-gray-300 hover:bg-white/5' : 'text-gray-700 hover:bg-gray-50'"
                  >
                    <span class="w-2 h-2 rounded-full flex-shrink-0 transition-colors"
                          :class="!filters.categorySlug ? 'bg-foxer-orange' : isDark ? 'bg-gray-600' : 'bg-gray-300'">
                    </span>
                    {{ $t('products.all_categories', 'All Products') }}
                  </button>

                  <!-- Categories (parents only) -->
                  <button
                    v-for="cat in categories"
                    :key="cat.id"
                    @click="filters.categorySlug = cat.slug; fetchProducts(1)"
                    class="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 text-left"
                    :class="filters.categorySlug === cat.slug
                      ? 'bg-foxer-orange/10 text-foxer-orange ring-1 ring-inset ring-foxer-orange/25'
                      : isDark ? 'text-gray-200 hover:bg-white/5' : 'text-gray-800 hover:bg-gray-50'"
                  >
                    <span class="w-2 h-2 rounded-full flex-shrink-0 transition-colors"
                          :class="filters.categorySlug === cat.slug ? 'bg-foxer-orange' : isDark ? 'bg-gray-600' : 'bg-gray-300'">
                    </span>
                    <span class="truncate">
                      <AutoTranslate :fallbackText="getCategoryName(cat)" :translations="cat.translations" field="name" />
                    </span>
                  </button>
                </div>
              </section>

              <!-- Divider -->
              <div class="h-px" :class="isDark ? 'bg-white/6' : 'bg-gray-100'"></div>

              <!-- ── PRICE RANGE ── -->
              <section>
                <div class="flex items-center justify-between mb-3">
                  <p class="text-[10px] font-black uppercase tracking-[0.14em]"
                     :class="isDark ? 'text-gray-500' : 'text-gray-400'">
                    {{ $t('products.price', 'Price Range') }}
                  </p>
                  <span class="text-xs font-bold"
                        :class="(filters.minPrice || filters.maxPrice) ? 'text-foxer-orange' : (isDark ? 'text-gray-500' : 'text-gray-400')">
                    {{ filters.minPrice || '0' }}₺ – {{ filters.maxPrice || '∞' }}
                  </span>
                </div>

                <!-- Min / Max inputs -->
                <div class="grid grid-cols-2 gap-2.5 mb-3">
                  <div class="relative">
                    <label class="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-black uppercase"
                           :class="isDark ? 'text-gray-500' : 'text-gray-400'">{{ $t('products.min_label') }}</label>
                    <input
                      type="number"
                      v-model="filters.minPrice"
                      min="0"
                      placeholder="0"
                      @change="fetchProducts(1)"
                      class="w-full pl-9 pr-2 py-2.5 rounded-xl border text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-foxer-orange/40 focus:border-foxer-orange transition-all"
                      :class="isDark
                        ? 'bg-white/5 border-white/10 text-white placeholder-gray-700'
                        : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'"
                    />
                  </div>
                  <div class="relative">
                    <label class="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-black uppercase"
                           :class="isDark ? 'text-gray-500' : 'text-gray-400'">{{ $t('products.max_label') }}</label>
                    <input
                      type="number"
                      v-model="filters.maxPrice"
                      min="0"
                      placeholder="∞"
                      @change="fetchProducts(1)"
                      class="w-full pl-10 pr-2 py-2.5 rounded-xl border text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-foxer-orange/40 focus:border-foxer-orange transition-all"
                      :class="isDark
                        ? 'bg-white/5 border-white/10 text-white placeholder-gray-700'
                        : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'"
                    />
                  </div>
                </div>

                <!-- Quick price presets -->
                <div class="flex flex-wrap gap-1.5">
                  <button
                    v-for="preset in pricePresets"
                    :key="preset.label"
                    @click="applyPricePreset(preset)"
                    class="px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all duration-200"
                    :class="isDark
                      ? 'border-white/10 text-gray-400 hover:border-foxer-orange/40 hover:text-foxer-orange hover:bg-foxer-orange/5'
                      : 'border-gray-200 text-gray-500 hover:border-foxer-orange/40 hover:text-foxer-orange hover:bg-foxer-orange/5'"
                  >{{ preset.label }}</button>
                </div>
              </section>

            </div>

            <!-- Mobile: apply button -->
            <div class="lg:hidden px-6 pb-6">
              <button
                @click="mobileFiltersOpen = false"
                class="w-full py-3 rounded-xl font-bold text-sm bg-foxer-orange text-white hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                </svg>
                {{ $t('products.apply_filters', 'Show Results') }}
                <span v-if="pagination.totalItems" class="opacity-70">({{ pagination.totalItems }})</span>
              </button>
            </div>
          </div>
        </aside>

        <!-- ══════════════════════════════════════
             PRODUCT GRID
        ══════════════════════════════════════ -->
        <div class="flex-1 min-w-0">

          <!-- Loading spinner -->
          <div v-if="loading" class="flex justify-center py-24">
            <div class="relative">
              <div class="w-12 h-12 rounded-full border-4 border-foxer-orange/20 border-t-foxer-orange animate-spin"></div>
            </div>
          </div>

          <!-- Empty state -->
          <div
            v-else-if="products.length === 0"
            class="text-center py-24 rounded-2xl border"
            :class="isDark ? 'border-white/8 bg-white/3' : 'border-gray-200 bg-white'"
          >
            <div class="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-white/5 flex items-center justify-center mx-auto mb-5">
              <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 class="text-xl font-bold mb-2">{{ $t('products.no_products', 'No products found') }}</h3>
            <p class="mb-6" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
              {{ $t('products.no_products_hint', 'Try adjusting your filters.') }}
            </p>
            <button
              @click="resetFilters"
              class="px-6 py-2.5 bg-foxer-orange text-white font-bold rounded-xl hover:bg-orange-600 transition-colors"
            >
              {{ $t('products.reset_filters', 'Reset Filters') }}
            </button>
          </div>

          <!-- Product cards -->
          <div v-else>
            <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              <router-link
                v-for="product in products"
                :key="product.id"
                :to="'/product/' + product.slug"
                class="group relative border rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
                :class="isDark
                  ? 'bg-white/5 border-white/10 hover:border-foxer-orange/40 hover:shadow-[0_0_30px_rgba(255,90,0,0.12)]'
                  : 'bg-white border-gray-200 hover:border-foxer-orange/30 hover:shadow-xl'"
              >
                <!-- Product image -->
                <div
                  class="relative pt-[100%] overflow-hidden"
                  :class="isDark ? 'bg-gray-800' : 'bg-gray-100'"
                >
                  <img
                    :src="getPrimaryImage(product)"
                    :alt="getProductName(product)"
                    loading="lazy"
                    class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    :class="{ 'opacity-50 grayscale': product.stockQuantity === 0 }"
                  />
                  <!-- Out of stock overlay -->
                  <div v-if="product.stockQuantity === 0" class="absolute inset-0 flex items-center justify-center bg-black/40 z-10">
                    <div class="bg-red-600 text-white font-bold px-4 py-2 rounded-lg rotate-12 border-2 border-white/20 shadow-[0_0_20px_rgba(220,38,38,0.5)]">
                      {{ $t('product.out_of_stock', 'Rupture de stock') }}
                    </div>
                  </div>

                  <div v-if="isOnSale(product) && product.stockQuantity > 0"
                       class="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-md">
                    {{ $t('products.sale_badge') }}
                  </div>
                </div>

                <!-- Product info -->
                <div class="p-5">
                  <div class="text-xs font-bold text-foxer-orange mb-1 uppercase tracking-wide">
                    <AutoTranslate :fallbackText="getCategoryName(product.category)" :translations="product.category?.translations" field="name" />
                  </div>
                  <h3 class="font-bold text-gray-900 dark:text-white line-clamp-2 hover:text-foxer-orange transition-colors duration-300">
                    <AutoTranslate :fallbackText="getProductName(product)" :translations="product.translations" field="name" />
                  </h3>

                  <div class="flex items-end justify-between mt-3">
                    <div class="flex flex-col">
                      <div class="flex items-center space-x-2">
                        <p class="text-foxer-orange font-bold text-xl font-display">{{ formatPrice(product, currencyStore.currency) }}</p>
                        <p v-if="product.compareAtPriceTry" class="text-gray-400 dark:text-gray-500 font-bold text-sm line-through decoration-red-500/50">{{ formatPrice(product, currencyStore.currency, true) }}</p>
                      </div>
                    </div>

                    <button
                      @click.prevent="addToCart(product, $event)"
                      class="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 flex-shrink-0"
                      :class="isDark
                        ? 'bg-white/10 hover:bg-foxer-orange text-white'
                        : 'bg-gray-100 hover:bg-foxer-orange text-gray-700 hover:text-white'"
                    >
                      <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </router-link>
            </div>

            <!-- Pagination -->
            <div v-if="pagination.totalPages > 1" class="mt-12 flex justify-center flex-wrap gap-2">
              <button
                @click="fetchProducts(pagination.page - 1)"
                :disabled="pagination.page === 1"
                class="w-10 h-10 rounded-xl flex items-center justify-center border disabled:opacity-30 transition-colors"
                :class="isDark ? 'border-white/10 hover:bg-white/10' : 'border-gray-200 hover:bg-gray-100'"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                v-for="page in visiblePages"
                :key="page"
                @click="typeof page === 'number' && fetchProducts(page)"
                class="w-10 h-10 rounded-xl flex items-center justify-center border transition-all font-medium"
                :class="[
                  page === '...' ? 'cursor-default pointer-events-none' : '',
                  pagination.page === page
                    ? 'bg-foxer-orange border-foxer-orange text-white shadow-lg shadow-orange-500/20'
                    : isDark ? 'border-white/10 hover:bg-white/10' : 'border-gray-200 hover:bg-gray-100'
                ]"
              >{{ page }}</button>

              <button
                @click="fetchProducts(pagination.page + 1)"
                :disabled="pagination.page === pagination.totalPages"
                class="w-10 h-10 rounded-xl flex items-center justify-center border disabled:opacity-30 transition-colors"
                :class="isDark ? 'border-white/10 hover:bg-white/10' : 'border-gray-200 hover:bg-gray-100'"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- Simple Toast Notification -->
    <div 
      class="fixed bottom-6 right-6 z-[100] transition-all duration-500 transform"
      :class="showToast ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'"
    >
      <div class="bg-gray-900 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center space-x-3 border border-white/10">
        <div class="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
          <svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <span class="font-medium text-sm">{{ toastMessage }}</span>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDark } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import api from '../api'
import { useCartStore } from '../stores/cart'
import { useCurrencyStore } from '../stores/currency'
import AutoTranslate from '@/components/AutoTranslate.vue'
import { formatPrice } from '@/utils/currency'

const isDark = useDark()
const { t, locale } = useI18n()
const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()
const currencyStore = useCurrencyStore()

// ── State ─────────────────────────────────────────────
const loading = ref(true)
const products = ref([])
const categories = ref([])
const mobileFiltersOpen = ref(false)

const showToast = ref(false)
const toastMessage = ref('')
let toastTimer = null

const showNotification = (msg) => {
  toastMessage.value = msg
  showToast.value = true
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    showToast.value = false
  }, 3000)
}

const pagination = ref({ page: 1, limit: 12, totalPages: 1, totalItems: 0 })

const filters = ref({
  categorySlug: '',
  minPrice: '',
  maxPrice: '',
  sort: 'newest'
})

// ── Sort options ───────────────────────────────────────
const sortOptions = computed(() => [
  { value: 'newest',    label: t('products.sort_newest', 'Newest') },
  { value: 'popular',   label: t('products.sort_popular', 'Popular') },
  { value: 'priceAsc',  label: t('products.sort_price_low_high', 'Price ↑') },
  { value: 'priceDesc', label: t('products.sort_price_high_low', 'Price ↓') },
  { value: 'rating',    label: t('products.sort_rating', 'Top Rated') },
])

// ── Price presets ──────────────────────────────────────
const pricePresets = [
  { label: '< 500₺',       min: '',    max: '500'  },
  { label: '500 – 1000₺',  min: '500', max: '1000' },
  { label: '1000 – 2000₺', min: '1000',max: '2000' },
  { label: '> 2000₺',      min: '2000',max: ''     },
]

const applyPricePreset = ({ min, max }) => {
  filters.value.minPrice = min
  filters.value.maxPrice = max
  fetchProducts(1)
}

// ── Computed ───────────────────────────────────────────
const activeFiltersCount = computed(() => {
  let n = 0
  if (filters.value.categorySlug) n++
  if (filters.value.minPrice)     n++
  if (filters.value.maxPrice)     n++
  if (filters.value.sort && filters.value.sort !== 'newest') n++
  return n
})

const visiblePages = computed(() => {
  const total   = pagination.value.totalPages
  const current = pagination.value.page
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  if (current <= 4) return [1, 2, 3, 4, 5, '...', total]
  if (current >= total - 3) return [1, '...', total-4, total-3, total-2, total-1, total]
  return [1, '...', current - 1, current, current + 1, '...', total]
})

// ── Helpers ────────────────────────────────────────────
const getPrimaryImage = (p) =>
  p?.images?.[0]?.url?.startsWith('/uploads/') 
    ? 'http://localhost:3000' + p.images[0].url 
    : (p?.images?.[0]?.url ?? 'https://foxersport.com/image/cache/catalog/clothing-994x540.png')

const getProductName = (p) => {
  if (!p) return ''
  const t = p.translations?.find(tr => tr.locale === locale.value)
  if (t?.name) return t.name
  return p.translations?.find(tr => tr.locale === 'en')?.name ?? p.translations?.[0]?.name ?? p.slug ?? ''
}

const getCategoryName = (c) => {
  if (!c) return ''
  const t = c.translations?.find(tr => tr.locale === locale.value)
  if (t?.name) return t.name
  return c.translations?.find(tr => tr.locale === 'en')?.name ?? c.translations?.[0]?.name ?? c.slug ?? ''
}

const isOnSale = (p) =>
  p.compareAtPriceTry && parseFloat(p.compareAtPriceTry) > parseFloat(p.priceTry)



const addToCart = async (product, e) => {
  if (e) e.preventDefault();
  const success = await cartStore.addToCart(product, 1)
  if (success) {
    showNotification(t('cart.added_success', 'Produit ajouté au panier !'))
  }
}

// ── Data fetching ──────────────────────────────────────
const fetchCategories = async () => {
  try {
    const res = await api.get('/categories')
    // Backend: { status: 'success', categories: [...] }
    categories.value = res.data?.categories ?? res.data?.data ?? (Array.isArray(res.data) ? res.data : [])
  } catch (err) {
    console.error('fetchCategories error:', err)
  }
}

const fetchProducts = async (page = 1) => {
  loading.value = true
  try {
    const params = new URLSearchParams({ page, limit: pagination.value.limit })
    if (filters.value.categorySlug) params.set('categorySlug', filters.value.categorySlug)
    if (filters.value.minPrice)     params.set('minPrice',     filters.value.minPrice)
    if (filters.value.maxPrice)     params.set('maxPrice',     filters.value.maxPrice)
    if (filters.value.sort)         params.set('sort',         filters.value.sort)

    // Keep URL in sync (clean — no empty params)
    const query = {}
    if (filters.value.categorySlug)                   query.categorySlug = filters.value.categorySlug
    if (filters.value.minPrice)                       query.minPrice     = filters.value.minPrice
    if (filters.value.maxPrice)                       query.maxPrice     = filters.value.maxPrice
    if (filters.value.sort && filters.value.sort !== 'newest') query.sort = filters.value.sort
    if (page > 1)                                     query.page         = page
    router.replace({ query })

    const res = await api.get(`/products?${params}`)
    if (res.data?.status === 'success') {
      products.value = res.data.data
      pagination.value = { ...pagination.value, ...res.data.pagination }
    }
  } catch (err) {
    console.error('fetchProducts error:', err)
  } finally {
    loading.value = false
  }
}

const resetFilters = () => {
  filters.value = { categorySlug: '', minPrice: '', maxPrice: '', sort: 'newest' }
  fetchProducts(1)
}

watch(
  () => route.query,
  async (newQuery) => {
    const queryCategorySlug = newQuery.categorySlug || ''
    const queryMinPrice = newQuery.minPrice || ''
    const queryMaxPrice = newQuery.maxPrice || ''
    const querySort = newQuery.sort || 'newest'
    const queryPage = newQuery.page ? parseInt(newQuery.page) : 1

    const hasChanged = 
      filters.value.categorySlug !== queryCategorySlug ||
      filters.value.minPrice !== queryMinPrice ||
      filters.value.maxPrice !== queryMaxPrice ||
      filters.value.sort !== querySort ||
      pagination.value.page !== queryPage

    if (hasChanged) {
      filters.value.categorySlug = queryCategorySlug
      filters.value.minPrice = queryMinPrice
      filters.value.maxPrice = queryMaxPrice
      filters.value.sort = querySort
      pagination.value.page = queryPage
      await fetchProducts(queryPage)
    }
  },
  { deep: true }
)

// ── Init ───────────────────────────────────────────────
onMounted(async () => {
  if (route.query.categorySlug) filters.value.categorySlug = route.query.categorySlug
  if (route.query.minPrice)     filters.value.minPrice     = route.query.minPrice
  if (route.query.maxPrice)     filters.value.maxPrice     = route.query.maxPrice
  if (route.query.sort)         filters.value.sort         = route.query.sort
  if (route.query.page)         pagination.value.page      = parseInt(route.query.page)

  await fetchCategories()
  await fetchProducts(pagination.value.page)
})
</script>
