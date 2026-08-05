<template>
  <span :class="{ 'opacity-70 transition-opacity': isLoading }">
    <span v-if="isHtml" v-html="DOMPurify.sanitize(displayText)"></span>
    <template v-else>{{ displayText }}</template>
  </span>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import DOMPurify from 'dompurify'

const props = defineProps({
  fallbackText: { type: String, required: true },
  translations: { type: Array, default: () => [] },
  field: { type: String, default: 'name' },
  isHtml: { type: Boolean, default: false }
})

const { locale } = useI18n()
const displayText = ref('')
const isLoading = ref(false)

const getDisplayText = async () => {
  if (!props.fallbackText) {
    displayText.value = ''
    return
  }

  const currentLocale = locale.value

  // 1. Check if DB has native translation
  if (props.translations && Array.isArray(props.translations)) {
    const nativeTranslation = props.translations.find(t => t.locale === currentLocale)
    if (nativeTranslation && nativeTranslation[props.field]) {
      displayText.value = nativeTranslation[props.field]
      isLoading.value = false
      return
    }
  }

  // If the target language is english, we assume the fallback text is already in english
  // Change this if the base language of your content is different!
  if (currentLocale === 'en') {
    displayText.value = props.fallbackText
    isLoading.value = false
    return
  }

  // 2. Not in DB. Check session storage cache for ultra-fast load
  const cacheKey = `trans_${currentLocale}_${props.fallbackText}`
  const cached = sessionStorage.getItem(cacheKey)
  if (cached) {
    displayText.value = cached
    isLoading.value = false
    return
  }

  // 3. Fallback to Google Translate API for dynamic translation
  displayText.value = props.fallbackText // optimistic update
  isLoading.value = true

  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${currentLocale}&dt=t&q=${encodeURIComponent(props.fallbackText)}`
    const res = await fetch(url)
    const data = await res.json()
    const translated = data[0].map(item => item[0]).join('')
    
    sessionStorage.setItem(cacheKey, translated)
    displayText.value = translated
  } catch (err) {
    console.warn('[AutoTranslate] Failed to translate:', err)
  } finally {
    isLoading.value = false
  }
}

watch([() => props.fallbackText, () => props.translations, locale], getDisplayText, { immediate: true })
</script>
