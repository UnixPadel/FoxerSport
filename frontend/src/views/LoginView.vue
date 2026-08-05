<template>
  <div class="bg-gray-50 dark:bg-foxer-dark min-h-screen flex items-center justify-center pt-32 pb-10 transition-colors duration-300 relative z-0">
    <!-- Dotted Background -->
    <div class="absolute inset-0 pointer-events-none z-[-1]">
      <div class="absolute inset-0 opacity-[0.10] dark:opacity-0 block dark:hidden" style="background-image: radial-gradient(circle, #000 1px, transparent 1px); background-size: 30px 30px;"></div>
      <div class="absolute inset-0 opacity-0 dark:opacity-[0.15] hidden dark:block" style="background-image: radial-gradient(circle, #fff 1px, transparent 1px); background-size: 30px 30px;"></div>
    </div>
    <div 
      class="w-full max-w-5xl mx-6 flex flex-col md:flex-row shadow-[0_20px_50px_rgba(0,0,0,0.2)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-[2rem] overflow-hidden glass-card p-0 border border-white/20 dark:border-white/10 z-10"
      v-motion
      :initial="{ opacity: 0, scale: 0.95, y: 30 }"
      :enter="{ opacity: 1, scale: 1, y: 0, transition: { duration: 600, type: 'spring' } }"
    >
      <!-- Left side: Illustration -->
      <div class="w-full md:w-1/2 relative min-h-[250px] md:min-h-full overflow-hidden bg-foxer-dark group">
        <div class="absolute inset-0 bg-gradient-to-br from-foxer-orange/80 to-black/90 z-10 mix-blend-multiply transition-opacity duration-500 group-hover:opacity-70"></div>
        <img src="https://foxersport.com/image/cache/catalog/clothing-994x540.png" alt="Foxer Padel" class="absolute inset-0 w-full h-full object-cover scale-110 transition-transform duration-[2s] ease-out group-hover:scale-100" />
        <div class="absolute inset-0 z-20 flex flex-col justify-end p-8 md:p-12 text-white">
          <div class="w-12 h-1 bg-foxer-orange mb-6"></div>
          <h2 class="text-3xl md:text-4xl font-display font-bold mb-4 tracking-tight drop-shadow-md">{{ $t('auth.hero_title', "Rejoignez l'élite du Padel") }}</h2>
          <p class="text-white/80 font-medium">{{ $t('auth.hero_subtitle', 'Accédez à des offres exclusives et dominez le court avec des équipements premiums.') }}</p>
        </div>
      </div>

      <!-- Right side: Form -->
      <div class="w-full md:w-1/2 p-8 md:p-12 relative bg-white/50 dark:bg-[#0a0a0a]/50">
        <div class="text-center mb-10">
          <h1 class="text-3xl font-display font-bold text-gray-900 dark:text-white mb-2">{{ $t('auth.login', 'Connexion') }}</h1>
          <p class="text-sm text-gray-500 dark:text-gray-400">{{ $t('auth.login_subtitle', 'Content de vous revoir ! Veuillez entrer vos identifiants.') }}</p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-6">
          <transition name="fade">
            <div v-if="authStore.error" class="bg-red-500/10 border border-red-500/30 text-red-500 p-3 rounded-xl text-sm text-center flex items-center justify-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>
              <span>{{ authStore.error }}</span>
            </div>
          </transition>

          <div>
            <label class="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">{{ $t('auth.email', 'Email') }}</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" /><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" /></svg>
              </div>
              <input 
                v-model="email"
                type="email" 
                required
                class="w-full bg-white dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-gray-900 dark:text-white focus:outline-none focus:border-foxer-orange focus:ring-1 focus:ring-foxer-orange transition-all placeholder-gray-400 dark:placeholder-gray-600 shadow-sm"
                :placeholder="$t('auth.placeholders.email_login')"
              />
            </div>
          </div>

          <div>
            <div class="flex justify-between items-center mb-2">
              <label class="block text-sm font-semibold text-gray-600 dark:text-gray-400">{{ $t('auth.password', 'Mot de passe') }}</label>
              <a href="#" class="text-xs font-bold text-foxer-orange hover:text-orange-400 transition-colors">{{ $t('auth.forgot', 'Mot de passe oublié ?') }}</a>
            </div>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" /></svg>
              </div>
              <input 
                v-model="password"
                type="password" 
                required
                class="w-full bg-white dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-gray-900 dark:text-white focus:outline-none focus:border-foxer-orange focus:ring-1 focus:ring-foxer-orange transition-all placeholder-gray-400 dark:placeholder-gray-600 shadow-sm"
                :placeholder="$t('auth.placeholders.password')"
              />
            </div>
          </div>

          <button 
            :disabled="authStore.loading"
            class="w-full bg-gradient-to-r from-foxer-orange to-[#ff7a33] disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition-all hover:-translate-y-1 hover:shadow-[0_10px_25px_rgba(255,90,0,0.4)] mt-6 flex items-center justify-center space-x-2"
          >
            <span v-if="authStore.loading" class="animate-spin inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span>
            <span v-else>{{ $t('auth.login', 'Connexion') }}</span>
          </button>

          <div class="relative mt-6">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-200 dark:border-white/10"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white/50 dark:bg-[#0a0a0a]/50 text-gray-500">{{ $t('auth.or_continue_with', 'Ou continuer avec') }}</span>
            </div>
          </div>

          <div class="mt-6 flex justify-center w-full">
            <button @click="handleGoogleLogin" type="button" class="w-full flex items-center justify-center space-x-3 bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/10 rounded-xl py-3.5 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-all hover:shadow-md cursor-pointer">
              <svg class="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span class="font-semibold">{{ $t('auth.continue_with_google', 'Continuer avec Google') }}</span>
            </button>
          </div>
        </form>

        <div class="mt-8 pt-6 border-t border-gray-200 dark:border-white/10 text-center text-sm text-gray-600 dark:text-gray-400">
          {{ $t('auth.no_account', "Vous n'avez pas de compte ?") }} 
          <router-link to="/register" class="text-foxer-orange font-bold hover:text-orange-400 transition-colors">
            {{ $t('auth.create_account', 'Créer un compte') }}
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { googleTokenLogin } from 'vue3-google-login'

const email = ref('')
const password = ref('')

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const handleLogin = async () => {
  const success = await authStore.login(email.value, password.value)
  if (success) {
    const redirectPath = route.query.redirect || '/account'
    router.push(redirectPath)
  }
}

const handleGoogleLogin = () => {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const redirectUri = window.location.origin + '/auth/google/callback'; 
  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=token&scope=email profile`;
  window.location.href = url;
}
</script>

