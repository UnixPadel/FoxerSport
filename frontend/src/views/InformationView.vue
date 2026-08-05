<template>
  <div class="bg-gray-50 dark:bg-foxer-dark h-full text-gray-900 dark:text-white pt-32 pb-24 transition-colors duration-300">
    <div class="container mx-auto px-6 max-w-4xl">
      
      <!-- Page Header -->
      <div class="mb-12 text-center" v-motion :initial="{ opacity: 0, y: -20 }" :enter="{ opacity: 1, y: 0, transition: { duration: 800 } }">
        <h1 class="text-4xl md:text-5xl font-display font-bold mb-4">{{ title }}</h1>
        <div class="w-24 h-1 bg-foxer-orange rounded-full mx-auto"></div>
      </div>

      <!-- Content Area -->
      <div 
        class="glass-card p-8 md:p-12 rounded-3xl prose prose-lg dark:prose-invert max-w-none"
        v-motion
        :initial="{ opacity: 0, y: 30 }"
        :enter="{ opacity: 1, y: 0, transition: { delay: 200, duration: 600 } }"
      >
        <template v-if="pageId === 'faq'">
          <h3>{{ $t('info.title_faq') }}</h3>
          <div class="space-y-4 not-prose mt-8">
            <div v-for="(item, index) in faqItems" :key="index" class="border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden shadow-sm">
              <button @click="toggleFaq(index)" class="w-full px-6 py-4 text-left font-bold flex justify-between items-center bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 text-gray-900 dark:text-white transition-colors">
                <span>{{ item.q }}</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 transform transition-transform" :class="{ 'rotate-180 text-foxer-orange': activeFaq === index }" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </button>
              <div v-show="activeFaq === index" class="px-6 py-4 text-gray-600 dark:text-gray-300 border-t border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-black/20">
                {{ item.a }}
              </div>
            </div>
          </div>
        </template>

        <template v-else-if="pageId === 'delivery'">
          <h3>{{ $t('info.title_delivery') }}</h3>
          <p>{{ $t('info.delivery.p1') }}</p>
          <h4>{{ $t('info.delivery.h_time') }}</h4>
          <ul>
            <li>{{ $t('info.delivery.l1') }}</li>
            <li>{{ $t('info.delivery.l2') }}</li>
            <li>{{ $t('info.delivery.l3') }}</li>
          </ul>
          <h4>{{ $t('info.delivery.h_return') }}</h4>
          <p>{{ $t('info.delivery.p2') }}</p>
        </template>

        <template v-else-if="pageId === 'privacy'">
          <h3>{{ $t('info.title_privacy') }}</h3>
          <p>{{ $t('info.privacy.p1') }} {{ new Date().toLocaleDateString() }}</p>
          <p>{{ $t('info.privacy.p2') }}</p>
          <h4>{{ $t('info.privacy.h1') }}</h4>
          <p>{{ $t('info.privacy.p3') }}</p>
          <h4>{{ $t('info.privacy.h2') }}</h4>
          <p>{{ $t('info.privacy.p4') }}</p>
          <h4>{{ $t('info.privacy.h3') }}</h4>
          <p>{{ $t('info.privacy.p5') }}</p>
        </template>

        <template v-else>
          <p>{{ $t('info.not_available') }}</p>
        </template>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

const route = useRoute()
const { t } = useI18n()
const pageId = ref('')
const activeFaq = ref(null)

const title = computed(() => {
  switch (pageId.value) {
    case 'faq': return t('info.title_faq')
    case 'delivery': return t('info.title_delivery')
    case 'privacy': return t('info.title_privacy')
    default: return t('info.title_default')
  }
})

const faqItems = computed(() => [
  { q: t('info.faq.q1'), a: t('info.faq.a1') },
  { q: t('info.faq.q2'), a: t('info.faq.a2') },
  { q: t('info.faq.q3'), a: t('info.faq.a3') },
  { q: t('info.faq.q4'), a: t('info.faq.a4') }
])

const toggleFaq = (index) => {
  activeFaq.value = activeFaq.value === index ? null : index
}

const loadPage = () => {
  pageId.value = route.params.id
}

watch(() => route.params.id, () => {
  loadPage()
})

onMounted(() => {
  loadPage()
})
</script>
