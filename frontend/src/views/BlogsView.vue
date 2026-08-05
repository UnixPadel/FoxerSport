<template>
  <div class="bg-gray-50 dark:bg-[#080810] min-h-screen text-gray-900 dark:text-white transition-colors duration-700 pt-32 pb-24 relative overflow-hidden">
    
    <!-- Background Decor -->
    <div class="absolute top-0 right-0 w-[600px] h-[600px] bg-foxer-orange/5 rounded-full blur-[120px] pointer-events-none"></div>
    <div class="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none"></div>

    <div class="container mx-auto px-6 lg:px-12 relative z-10 max-w-7xl">
      
      <!-- Page Header -->
      <div 
        v-motion
        :initial="{ opacity: 0, y: 30 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 800, ease: 'easeOut' } }"
        class="text-center mb-16"
      >
        <p class="text-foxer-orange font-bold uppercase tracking-widest mb-4">{{ $t('blog.news', 'Nouveautés & Articles') }}</p>
        <h1 class="text-4xl md:text-5xl lg:text-6xl font-display font-extrabold mb-6 leading-tight">{{ $t('blog.title', 'Le Blog Foxer') }}</h1>
        <div class="w-24 h-1 bg-foxer-orange mx-auto rounded-full"></div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center py-20">
        <svg class="animate-spin h-10 w-10 text-foxer-orange" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>

      <!-- Empty State -->
      <div v-else-if="blogs.length === 0" class="text-center py-20 text-gray-500">
        <h2 class="text-2xl font-display font-bold mb-4">{{ $t('blog.empty', 'Aucun article trouvé') }}</h2>
      </div>

      <!-- Blogs Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <article 
          v-for="(blog, index) in blogs"
          :key="blog.id"
          v-motion
          :initial="{ opacity: 0, y: 40 }"
          :enter="{ opacity: 1, y: 0, transition: { delay: (index % 3) * 100, duration: 600, ease: 'easeOut' } }"
          class="bg-white dark:bg-[#111] rounded-3xl overflow-hidden group hover:-translate-y-2 transition-transform duration-300 flex flex-col border border-gray-200/80 dark:border-white/5 shadow-sm hover:shadow-xl"
        >
          <router-link :to="'/blog/' + blog.slug" class="relative aspect-[4/3] overflow-hidden block">
            <img :src="getBlogImage(blog)" :alt="getBlogTitle(blog)" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div class="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500"></div>
          </router-link>
          
          <div class="p-8 flex-grow flex flex-col justify-between">
            <div>
              <div class="flex justify-between items-center mb-3">
                <p class="text-foxer-orange text-xs font-bold uppercase tracking-wider">{{ formatDate(blog.publishedAt) }}</p>
                <p class="text-gray-400 text-xs font-medium"><i class="fa fa-eye"></i> {{ blog.viewCount }}</p>
              </div>
              
              <h3 class="text-xl font-bold mb-3 line-clamp-2 hover:text-foxer-orange transition-colors">
                <router-link :to="'/blog/' + blog.slug">
                  {{ getBlogTitle(blog) }}
                </router-link>
              </h3>
              
              <p class="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-6" v-html="getBlogExcerpt(blog)"></p>
            </div>
            
            <router-link :to="'/blog/' + blog.slug" class="inline-flex items-center space-x-2 text-gray-900 dark:text-white font-bold hover:text-foxer-orange dark:hover:text-foxer-orange transition-colors">
              <span>{{ $t('blog.read_more', 'Lire la suite') }}</span>
              <span class="transform group-hover:translate-x-1 transition-transform">&rarr;</span>
            </router-link>
          </div>
        </article>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import DOMPurify from 'dompurify'
import api from '@/api'

const { locale } = useI18n()
const blogs = ref([])
const loading = ref(true)

const fetchBlogs = async () => {
  loading.value = true
  try {
    const res = await api.get('/blogs?limit=20&sort=newest')
    if (res.data.status === 'success') {
      blogs.value = res.data.data
    }
  } catch (error) {
    console.error('Error fetching blogs:', error)
  } finally {
    loading.value = false
  }
}

const getBlogTitle = (blog) => {
  const t = blog.translations?.find(t => t.locale === locale.value)
  if (t && t.title) return t.title
  const en = blog.translations?.find(t => t.locale === 'en')
  if (en && en.title) return en.title
  return blog.translations?.[0]?.title || blog.slug
}

const getBlogExcerpt = (blog) => {
  const t = blog.translations?.find(t => t.locale === locale.value)
  if (t && t.excerpt) return DOMPurify.sanitize(t.excerpt)
  const en = blog.translations?.find(t => t.locale === 'en')
  if (en && en.excerpt) return DOMPurify.sanitize(en.excerpt)
  return DOMPurify.sanitize(blog.translations?.[0]?.excerpt || '')
}

const getBlogImage = (blog) => {
  if (!blog.featuredImage) return 'https://foxersport.com/image/cache/catalog/blog1-600x400.jpg';
  if (blog.featuredImage.startsWith('/uploads/')) {
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
    return baseUrl.replace('/api', '') + blog.featuredImage;
  }
  return blog.featuredImage;
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return new Intl.DateTimeFormat(locale.value, { year: 'numeric', month: 'long', day: 'numeric' }).format(date)
}

onMounted(() => {
  fetchBlogs()
})
</script>
