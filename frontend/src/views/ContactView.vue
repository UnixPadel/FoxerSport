<template>
  <div class="bg-gray-50 dark:bg-foxer-dark h-full text-gray-900 dark:text-white pt-32 pb-24 transition-colors duration-300 relative z-0">
    <!-- Dotted Background -->
    <div class="absolute inset-0 pointer-events-none z-[-1]">
      <div class="absolute inset-0 opacity-[0.10] dark:opacity-0 block dark:hidden" style="background-image: radial-gradient(circle, #000 1px, transparent 1px); background-size: 30px 30px;"></div>
      <div class="absolute inset-0 opacity-0 dark:opacity-[0.15] hidden dark:block" style="background-image: radial-gradient(circle, #fff 1px, transparent 1px); background-size: 30px 30px;"></div>
    </div>
    <div class="container mx-auto px-6 max-w-5xl">
      
      <!-- Page Header -->
      <div class="mb-12 text-center" v-motion :initial="{ opacity: 0, y: -20 }" :enter="{ opacity: 1, y: 0, transition: { duration: 800 } }">
        <h1 class="text-4xl md:text-5xl font-display font-bold mb-4">{{ $t('contact.title', 'Contactez-nous') }}</h1>
        <div class="w-24 h-1 bg-foxer-orange rounded-full mx-auto"></div>
        <p class="mt-6 text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">{{ $t('contact.subtitle', 'Nous sommes là pour vous aider. Envoyez-nous un message et nous vous répondrons dans les plus brefs délais.') }}</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
        
        <!-- Contact Information -->
        <div class="space-y-8" v-motion :initial="{ opacity: 0, x: -30 }" :enter="{ opacity: 1, x: 0, transition: { delay: 200, duration: 600 } }">
          <div class="glass-card p-8 rounded-2xl h-full flex flex-col justify-center">
            <h3 class="text-2xl font-bold font-display mb-8 border-b border-gray-200 dark:border-white/10 pb-4">{{ $t('contact.info_title', 'Nos Coordonnées') }}</h3>
            
            <div class="space-y-6">
              <div class="flex items-start space-x-4">
                <div class="w-12 h-12 rounded-full bg-foxer-orange/20 flex items-center justify-center flex-shrink-0 text-foxer-orange">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h4 class="font-bold text-lg">{{ $t('contact.address', 'Adresse') }}</h4>
                  <p class="text-gray-500 dark:text-gray-400 mt-1">Foxersport HQ<br/>{{ $t('contact.address_value') }}</p>
                </div>
              </div>

              <div class="flex items-start space-x-4">
                <div class="w-12 h-12 rounded-full bg-foxer-orange/20 flex items-center justify-center flex-shrink-0 text-foxer-orange">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h4 class="font-bold text-lg">{{ $t('contact.email', 'Email') }}</h4>
                  <p class="text-gray-500 dark:text-gray-400 mt-1"><a href="mailto:info@foxersport.com" class="hover:text-foxer-orange transition-colors">info@foxersport.com</a></p>
                </div>
              </div>

              <div class="flex items-start space-x-4">
                <div class="w-12 h-12 rounded-full bg-foxer-orange/20 flex items-center justify-center flex-shrink-0 text-foxer-orange">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h4 class="font-bold text-lg">{{ $t('contact.phone', 'Téléphone') }}</h4>
                  <p class="text-gray-500 dark:text-gray-400 mt-1"><a href="tel:+905551234567" class="hover:text-foxer-orange transition-colors">+90 555 123 45 67</a></p>
                </div>
              </div>
            </div>
            
            <div class="mt-12 flex space-x-4">
              <a href="#" class="w-10 h-10 rounded-full bg-gray-200/50 dark:bg-white/5 flex items-center justify-center hover:bg-foxer-orange hover:text-white dark:hover:text-white transition-all text-gray-600 dark:text-gray-400 font-semibold">FB</a>
              <a href="#" class="w-10 h-10 rounded-full bg-gray-200/50 dark:bg-white/5 flex items-center justify-center hover:bg-foxer-orange hover:text-white dark:hover:text-white transition-all text-gray-600 dark:text-gray-400 font-semibold">IG</a>
              <a href="#" class="w-10 h-10 rounded-full bg-gray-200/50 dark:bg-white/5 flex items-center justify-center hover:bg-foxer-orange hover:text-white dark:hover:text-white transition-all text-gray-600 dark:text-gray-400 font-semibold">TW</a>
            </div>
          </div>
        </div>

        <!-- Contact Form -->
        <div v-motion :initial="{ opacity: 0, x: 30 }" :enter="{ opacity: 1, x: 0, transition: { delay: 400, duration: 600 } }">
          <div class="glass-card p-8 rounded-2xl">
            <h3 class="text-2xl font-bold font-display mb-6">{{ $t('contact.send_message', 'Envoyez-nous un message') }}</h3>
            
            <form @submit.prevent="submitForm" class="space-y-5">
              <div>
                <label class="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">{{ $t('contact.form_name', 'Nom complet') }}</label>
                <input v-model="form.name" type="text" required class="w-full bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/15 rounded-xl px-4 py-3 focus:outline-none focus:border-foxer-orange transition-colors text-gray-900 dark:text-white" />
              </div>
              
              <div>
                <label class="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">{{ $t('contact.form_email', 'Adresse email') }}</label>
                <input v-model="form.email" type="email" required class="w-full bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/15 rounded-xl px-4 py-3 focus:outline-none focus:border-foxer-orange transition-colors text-gray-900 dark:text-white" />
              </div>

              <div>
                <label class="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">{{ $t('contact.form_subject', 'Sujet') }}</label>
                <input v-model="form.subject" type="text" required class="w-full bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/15 rounded-xl px-4 py-3 focus:outline-none focus:border-foxer-orange transition-colors text-gray-900 dark:text-white" />
              </div>
              
              <div>
                <label class="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">{{ $t('contact.form_message', 'Message') }}</label>
                <textarea v-model="form.message" rows="5" required class="w-full bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/15 rounded-xl px-4 py-3 focus:outline-none focus:border-foxer-orange transition-colors text-gray-900 dark:text-white resize-none"></textarea>
              </div>

              <button type="submit" :disabled="loading" class="w-full bg-gradient-to-r from-foxer-orange to-orange-500 hover:from-orange-500 hover:to-foxer-orange text-white font-bold h-14 rounded-xl transition-all shadow-[0_10px_20px_rgba(255,90,0,0.3)] hover:shadow-[0_0_30px_rgba(255,90,0,0.6)] hover:-translate-y-1 flex items-center justify-center space-x-2 disabled:opacity-50">
                <span v-if="loading" class="animate-spin inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span>
                <span v-else>{{ $t('contact.submit', 'Envoyer') }}</span>
              </button>

              <div v-if="success" class="p-4 bg-green-500/20 border border-green-500/50 text-green-600 dark:text-green-400 rounded-xl mt-4 text-center text-sm font-medium">
                {{ $t('contact.success', 'Votre message a été envoyé avec succès !') }}
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const form = ref({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const loading = ref(false)
const success = ref(false)

const submitForm = async () => {
  loading.value = true
  success.value = false
  
  // Simulate API call for now
  setTimeout(() => {
    loading.value = false
    success.value = true
    form.value = { name: '', email: '', subject: '', message: '' }
    
    setTimeout(() => {
      success.value = false
    }, 5000)
  }, 1500)
}
</script>
