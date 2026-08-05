<template>
  <footer aria-label="Site Footer" class="bg-[#0a0a0a] text-gray-400 relative pt-16 pb-8 overflow-hidden">
    <!-- Premium top border gradient -->
    <div class="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-foxer-orange/50 to-transparent"></div>
    <!-- Ambient glow -->
    <div class="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-foxer-orange/5 rounded-full blur-[120px] pointer-events-none"></div>
    <div class="container mx-auto px-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        <!-- Brand Info -->
        <div class="space-y-6">
          <img src="https://foxersport.com/image/catalog/foxer-logo.png" alt="Foxer" class="h-10 opacity-90" />
          <p class="text-sm leading-relaxed">
            {{ $t('footer.about') }}
          </p>
        </div>

        <!-- Links -->
        <div>
          <h4 class="text-white font-display font-bold text-lg mb-6">{{ $t('home.categories') }}</h4>
          <ul class="space-y-3 text-sm">
            <li><router-link to="/products?categorySlug=clothing" class="hover:text-foxer-orange transition-colors">{{ $t('nav.clothing') }}</router-link></li>
            <li><router-link to="/products?categorySlug=rackets" class="hover:text-foxer-orange transition-colors">{{ $t('nav.rackets') }}</router-link></li>
            <li><router-link to="/products?categorySlug=accessories" class="hover:text-foxer-orange transition-colors">{{ $t('nav.accessories') }}</router-link></li>
            <li><router-link to="/products?categorySlug=shoes" class="hover:text-foxer-orange transition-colors">{{ $t('nav.shoes') }}</router-link></li>
            <li><router-link to="/products?categorySlug=training-equipment" class="hover:text-foxer-orange transition-colors">{{ $t('nav.equipment') }}</router-link></li>
            <li><router-link to="/products?categorySlug=bags" class="hover:text-foxer-orange transition-colors">{{ $t('nav.bags') }}</router-link></li>
          </ul>
        </div>

        <!-- Support -->
        <div>
          <h4 class="text-white font-display font-bold text-lg mb-6">{{ $t('footer.support') }}</h4>
          <ul class="space-y-3 text-sm">
            <li><router-link to="/information/faq" class="hover:text-foxer-orange transition-colors">{{ $t('footer.faq') }}</router-link></li>
            <li><router-link to="/information/delivery" class="hover:text-foxer-orange transition-colors">{{ $t('footer.shipping') }}</router-link></li>
            <li><router-link to="/contact" class="hover:text-foxer-orange transition-colors">{{ $t('footer.contact') }}</router-link></li>
            <li><router-link to="/information/privacy" class="hover:text-foxer-orange transition-colors">{{ $t('footer.privacy') }}</router-link></li>
            <li><router-link to="/blogs" class="hover:text-foxer-orange transition-colors">{{ $t('blog.title', 'Blog') }}</router-link></li>
          </ul>
        </div>

        <!-- Newsletter -->
        <div>
          <h4 class="text-white font-display font-bold text-lg mb-6">{{ $t('footer.newsletter') }}</h4>
          <p class="text-sm mb-4">{{ $t('footer.newsletter_desc') }}</p>
            <form class="flex mt-2 relative group" @submit.prevent="subscribeNewsletter">
              <input 
                type="email" 
                v-model="email"
                required
                :placeholder="$t('footer.email_placeholder')" 
                class="bg-white/5 border border-white/10 px-4 py-3 rounded-l-xl w-full focus:outline-none focus:border-foxer-orange/50 focus:bg-white/10 text-white transition-all duration-300"
              />
              <button type="submit" aria-label="Subscribe to newsletter" class="bg-foxer-orange text-white px-6 py-3 rounded-r-xl hover:bg-orange-600 transition-all font-bold whitespace-nowrap disabled:opacity-50 hover-glow" :disabled="loadingNewsletter">
                <span v-if="loadingNewsletter" class="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
                <span v-else>{{ $t('footer.subscribe') }}</span>
              </button>
            </form>
            <transition name="fade">
              <p v-if="newsletterMessage" :class="newsletterError ? 'text-red-400 bg-red-400/10' : 'text-green-400 bg-green-400/10'" class="text-sm mt-3 p-2 rounded-lg text-center font-medium border" :style="newsletterError ? 'border-color: rgba(248, 113, 113, 0.2)' : 'border-color: rgba(74, 222, 128, 0.2)'">
                {{ newsletterMessage }}
              </p>
            </transition>
        </div>
      </div>

      <!-- Copyright -->
      <div class="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-sm">
        <p>&copy; 2026 Foxersport. {{ $t('footer.rights') }}</p>
        <div class="flex space-x-3 mt-4 md:mt-0 relative z-10">
          <a href="https://facebook.com/foxersport" target="_blank" rel="noopener noreferrer" aria-label="Facebook" class="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-foxer-orange hover:border-foxer-orange hover:text-white transition-all duration-300 text-gray-400 hover:-translate-y-1 hover:shadow-[0_0_15px_rgba(255,90,0,0.4)]">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fill-rule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clip-rule="evenodd"></path></svg>
          </a>
          <a href="https://instagram.com/foxersport" target="_blank" rel="noopener noreferrer" aria-label="Instagram" class="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-foxer-orange hover:border-foxer-orange hover:text-white transition-all duration-300 text-gray-400 hover:-translate-y-1 hover:shadow-[0_0_15px_rgba(255,90,0,0.4)]">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fill-rule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clip-rule="evenodd"></path></svg>
          </a>
          <a href="https://api.whatsapp.com/send/?phone=905426502479" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" class="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#25D366] hover:border-[#25D366] hover:text-white transition-all duration-300 text-gray-400 hover:-translate-y-1 hover:shadow-[0_0_15px_rgba(37,211,102,0.4)]">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import api from '../api'

const { t } = useI18n()

const email = ref('')
const loadingNewsletter = ref(false)
const newsletterMessage = ref('')
const newsletterError = ref(false)

const subscribeNewsletter = async () => {
  if (!email.value) return
  loadingNewsletter.value = true
  newsletterMessage.value = ''
  newsletterError.value = false
  
  try {
    const res = await api.post('/newsletter/subscribe', { email: email.value })
    newsletterMessage.value = res.data.message || t('footer.subscribe_success', 'Merci pour votre inscription !')
    email.value = ''
  } catch (error) {
    newsletterError.value = true
    newsletterMessage.value = error.response?.data?.message || t('footer.subscribe_error', 'Une erreur est survenue.')
  } finally {
    loadingNewsletter.value = false
    setTimeout(() => {
      newsletterMessage.value = ''
    }, 5000)
  }
}
</script>
