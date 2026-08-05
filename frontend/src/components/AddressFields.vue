<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-5">

    <!-- ── Country ── -->
    <div>
      <label class="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
        {{ $t('checkout.country', 'Country') }}
      </label>
      <div class="relative">
        <select
          v-model="form.country"
          @change="onCountryChange"
          class="w-full bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/15 rounded-xl px-4 py-3 pr-10 text-gray-900 dark:text-white focus:outline-none focus:border-foxer-orange transition-all appearance-none cursor-pointer"
          :disabled="loadingCountries"
        >
          <option value="" disabled>{{ loadingCountries ? '...' : 'Select a country' }}</option>
          <option
            v-for="c in countries"
            :key="c.name"
            :value="c.name"
          >
            {{ c.flag }} {{ c.name }}
          </option>
        </select>
        <!-- Chevron / loading icon -->
        <div class="pointer-events-none absolute inset-y-0 right-3 flex items-center">
          <svg v-if="!loadingCountries" class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
          <svg v-else class="w-4 h-4 text-gray-400 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
        </div>
      </div>
    </div>

    <!-- ── City Dropdown ── -->
    <div class="relative">
      <label class="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
        {{ $t('checkout.city', 'City') }}
      </label>
      <div class="relative">
        <select
          v-model="form.city"
          @change="$emit('update:modelValue', form)"
          :disabled="!form.country || loadingCities"
          class="w-full bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/15 rounded-xl px-4 py-3 pr-10 text-gray-900 dark:text-white focus:outline-none focus:border-foxer-orange transition-all appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option value="" disabled>{{ loadingCities ? 'Loading cities...' : (form.country ? 'Select a city' : 'Select a country first') }}</option>
          <option v-for="city in citySuggestions" :key="city" :value="city">
            {{ city }}
          </option>
        </select>
        <!-- Chevron / loading icon -->
        <div class="pointer-events-none absolute inset-y-0 right-3 flex items-center">
          <svg v-if="!loadingCities" class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
          <svg v-else class="w-4 h-4 text-gray-400 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
        </div>
      </div>
    </div>

    <!-- ── Postcode ── -->
    <div>
      <label class="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
        {{ $t('checkout.postcode', 'Postcode') }}
      </label>
      <div class="relative">
        <input
          type="text"
          v-model="form.postcode"
          @input="$emit('update:modelValue', form)"
          placeholder="Enter postcode"
          class="w-full bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/15 rounded-xl px-4 py-3 pr-10 text-gray-900 dark:text-white focus:outline-none focus:border-foxer-orange transition-all"
        />
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useDark } from '@vueuse/core'
import countriesData from '../assets/data/countries.json'

const props = defineProps({
  modelValue: { type: Object, default: () => ({}) }
})

const emit = defineEmits(['update:modelValue'])

const isDark = useDark()

// ── State ──────────────────────────────────────────────
const countries       = ref([])
const loadingCountries = ref(false)
const loadingCities   = ref(false)
const citySuggestions = ref([])

const form = ref({
  country:  props.modelValue?.country  || '',
  city:     props.modelValue?.city     || '',
  postcode: props.modelValue?.postcode || '',
})

// ── Sync with parent ───────────────────────────────────
watch(form, (val) => emit('update:modelValue', { ...val }), { deep: true })

// ── Load countries locally ──────────────────────────────
const fetchCountries = () => {
  countries.value = countriesData
}

// ── Country change → Fetch cities ──────────────────────
const onCountryChange = () => {
  form.value.city     = ''
  form.value.postcode = ''
  emit('update:modelValue', { ...form.value })
  fetchCities()
}

const fetchCities = async () => {
  if (!form.value.country) return
  loadingCities.value = true
  citySuggestions.value = []

  try {
    const res = await fetch('https://countriesnow.space/api/v0.1/countries/cities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ country: form.value.country })
    })
    const data = await res.json()
    if (!data.error && data.data) {
      citySuggestions.value = data.data
    }
  } catch (err) {
    console.error('Failed to load cities:', err)
  } finally {
    loadingCities.value = false
  }
}

// ── Init ───────────────────────────────────────────────
onMounted(() => {
  fetchCountries()
  if (form.value.country) {
    fetchCities()
  }
})
</script>
