<template>
  <div class="bg-gray-50 dark:bg-foxer-dark h-full text-gray-900 dark:text-white transition-colors duration-300 pt-32 pb-24 relative overflow-hidden">
    
    <div class="absolute top-0 right-0 w-[600px] h-[600px] bg-foxer-orange/5 rounded-full blur-[120px] pointer-events-none"></div>

    <div class="container mx-auto px-6 relative z-10 max-w-4xl">
      
      <!-- Back to Home -->
      <router-link to="/" class="inline-flex items-center space-x-2 text-gray-400 hover:text-foxer-orange transition-colors mb-8">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" /></svg>
        <span>{{ $t('blog.back', 'Geri Dön') }}</span>
      </router-link>

      <div v-if="loading" class="text-center py-20">
        <svg class="animate-spin h-10 w-10 mx-auto text-foxer-orange" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>

      <div v-else-if="!blog" class="text-center py-20 text-gray-500">
        <h2 class="text-3xl font-display font-bold mb-4">{{ $t('blog.not_found_title', 'Article introuvable') }}</h2>
        <p>{{ $t('blog.not_found_desc', 'L\'article que vous recherchez n\'existe pas ou a été retiré.') }}</p>
      </div>

      <article v-else itemscope itemtype="https://schema.org/BlogPosting"
        v-motion
        :initial="{ opacity: 0, y: 30 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 800 } }"
      >
        <!-- Header -->
        <header class="mb-10 text-center">
          <p class="text-foxer-orange font-bold uppercase tracking-widest mb-4">{{ $t('blog.news') }}</p>
          <h1 class="text-4xl md:text-5xl lg:text-6xl font-display font-extrabold mb-6 leading-tight">{{ blogTitle }}</h1>
          <div class="flex items-center justify-center space-x-4 text-sm text-gray-400">
            <span>{{ $t('blog.published_on') }} {{ formatDate(blog.publishedAt) }}</span>
            <span>&bull;</span>
            <span><i class="fa fa-eye"></i> {{ blog.viewCount }}</span>
          </div>
        </header>

        <!-- Featured Image -->
        <div class="w-full aspect-video rounded-3xl overflow-hidden mb-12 shadow-2xl relative">
          <img :src="getBlogImage(blog)" :alt="blogTitle" class="w-full h-full object-cover" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
        </div>

        <!-- Content -->
        <div class="prose dark:prose-invert prose-lg prose-orange max-w-none mb-16 text-gray-800 dark:text-gray-200" v-html="blogContent">
        </div>

        <!-- Footer / Share -->
        <footer class="border-t border-gray-200 dark:border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between mb-16">
          <div class="flex items-center space-x-4 mb-4 md:mb-0">
            <span class="font-bold text-gray-500 dark:text-gray-400">{{ $t('blog.share') }}:</span>
            <button class="w-10 h-10 rounded-full bg-gray-200/50 dark:bg-white/5 flex items-center justify-center hover:bg-foxer-orange hover:text-white dark:hover:text-white text-gray-600 dark:text-gray-400 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
            </button>
            <button class="w-10 h-10 rounded-full bg-gray-200/50 dark:bg-white/5 flex items-center justify-center hover:bg-foxer-orange hover:text-white dark:hover:text-white text-gray-600 dark:text-gray-400 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
            </button>
          </div>
        </footer>

        <!-- Comments Section -->
        <section class="bg-white dark:bg-black/20 p-8 rounded-3xl border border-gray-200 dark:border-white/10 shadow-sm">
          <h3 class="text-2xl font-display font-bold mb-8">{{ $t('blog.comments', 'Commentaires') }} ({{ blog.comments?.length || 0 }})</h3>
          
          <!-- Comment Form -->
          <form @submit.prevent="submitComment" class="mb-10 space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4" v-if="!isAuthenticated">
              <input v-model="commentForm.guestName" type="text" :placeholder="$t('blog.your_name', 'Votre nom')" required class="w-full bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/15 rounded-xl p-3 focus:outline-none focus:border-foxer-orange transition-colors text-gray-900 dark:text-white" />
              <input v-model="commentForm.guestEmail" type="email" :placeholder="$t('blog.your_email', 'Votre adresse email')" required class="w-full bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/15 rounded-xl p-3 focus:outline-none focus:border-foxer-orange transition-colors text-gray-900 dark:text-white" />
            </div>
            <textarea v-model="commentForm.content" rows="4" :placeholder="$t('blog.your_comment', 'Votre commentaire...')" required class="w-full bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/15 rounded-xl p-3 focus:outline-none focus:border-foxer-orange transition-colors resize-none text-gray-900 dark:text-white"></textarea>
            
            <p v-if="commentSuccess" class="text-green-500 font-bold text-sm">{{ commentSuccess }}</p>
            <p v-if="commentError" class="text-red-500 font-bold text-sm">{{ commentError }}</p>
            
            <button type="submit" :disabled="submittingComment" class="bg-foxer-orange text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-600 transition-colors shadow-lg disabled:opacity-50">
              <span v-if="submittingComment">{{ $t('blog.sending', 'Envoi...') }}</span>
              <span v-else>{{ $t('blog.send_comment', 'Envoyer le commentaire') }}</span>
            </button>
          </form>

          <!-- Comment List -->
          <div class="space-y-6">
            <div v-for="comment in blog.comments" :key="comment.id" class="border-b border-gray-200 dark:border-white/10 pb-6 last:border-0 last:pb-0">
              <div class="flex justify-between items-start mb-2">
                <h4 class="font-bold text-gray-900 dark:text-white">{{ comment.guestName || $t('blog.user', 'Utilisateur') }}</h4>
                <span class="text-xs text-gray-500">{{ formatDate(comment.createdAt) }}</span>
              </div>
              <p class="text-gray-600 dark:text-gray-300 text-sm">{{ comment.content }}</p>
            </div>
          </div>
        </section>

      </article>
      
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import DOMPurify from 'dompurify'
import { useAuthStore } from '../stores/auth'
import api from '../api'

const route = useRoute()
const { locale } = useI18n()

const loading = ref(true)
const blog = ref(null)
const authStore = useAuthStore()

// For comments
const isAuthenticated = computed(() => authStore.isAuthenticated)
const submittingComment = ref(false)
const commentSuccess = ref('')
const commentError = ref('')
const commentForm = ref({
  guestName: '',
  guestEmail: '',
  content: ''
})

const fetchBlog = async () => {
  loading.value = true
  try {
    const res = await api.get(`/blogs/${route.params.slug}`)
    if (res.data.status === 'success') {
      blog.value = res.data.data
    }
  } catch (error) {
    console.error('Error fetching blog:', error)
  } finally {
    loading.value = false
  }
}

const submitComment = async () => {
  submittingComment.value = true
  commentSuccess.value = ''
  commentError.value = ''
  
  try {
    const res = await api.post(`/blogs/${route.params.slug}/comments`, commentForm.value)
    if (res.data.status === 'success') {
      const { t } = useI18n()
      commentSuccess.value = res.data.message || t('blog.comment_success', 'Commentaire envoyé ! Il est en attente de validation.')
      commentForm.value.content = ''
      if (!isAuthenticated.value) {
        commentForm.value.guestName = ''
        commentForm.value.guestEmail = ''
      }
    }
  } catch (error) {
    const { t } = useI18n()
    commentError.value = error.response?.data?.message || t('blog.comment_error', 'Erreur lors de l\'envoi du commentaire')
  } finally {
    submittingComment.value = false
  }
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return new Intl.DateTimeFormat(locale.value, { year: 'numeric', month: 'long', day: 'numeric' }).format(date)
}

const getBlogImage = (blogItem) => {
  if (!blogItem?.featuredImage) return 'https://foxersport.com/image/cache/catalog/blog1-1200x800.jpg';
  if (blogItem.featuredImage.startsWith('/uploads/')) {
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
    return baseUrl.replace('/api', '') + blogItem.featuredImage;
  }
  return blogItem.featuredImage;
}

const blogTitle = computed(() => {
  if (!blog.value || !blog.value.translations) return ''
  const t = blog.value.translations.find(t => t.locale === locale.value) || blog.value.translations.find(t => t.locale === 'en')
  return t?.title || blog.value.slug
})

const blogContent = computed(() => {
  if (!blog.value || !blog.value.translations) return ''
  const t = blog.value.translations.find(t => t.locale === locale.value) || blog.value.translations.find(t => t.locale === 'en')
  
  let html = t?.content || ''
  
  // Create a textarea to decode HTML entities if necessary
  if (html) {
    const txt = document.createElement('textarea')
    txt.innerHTML = html
    html = txt.value
  }

  return DOMPurify.sanitize(html)
})

onMounted(() => {
  fetchBlog()
})
</script>
