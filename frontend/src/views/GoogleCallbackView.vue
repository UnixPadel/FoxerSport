<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0a0a0a]">
    <div class="text-center">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-foxer-orange mb-4"></div>
      <p class="text-gray-600 dark:text-gray-400">Authentification Google en cours...</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

onMounted(async () => {
  try {
    // The access token is in the URL hash, like #access_token=ya29.a0...&token_type=Bearer&expires_in=3599
    const hash = window.location.hash.substring(1)
    const params = new URLSearchParams(hash)
    const accessToken = params.get('access_token')

    if (accessToken) {
      const result = await authStore.loginWithGoogle(accessToken)
      if (result === true) {
        // Find if there was a redirect query before login
        const redirectPath = sessionStorage.getItem('redirectPath') || '/account'
        sessionStorage.removeItem('redirectPath')
        router.push(redirectPath)
      } else if (result && result.code === 'USER_NOT_FOUND') {
        router.push({ path: '/register', query: result.googleData })
      } else {
        router.push('/login?error=google_auth_failed')
      }
    } else {
      console.error('No access token found in URL hash')
      router.push('/login?error=no_token')
    }
  } catch (err) {
    console.error('Callback error:', err)
    router.push('/login?error=exception')
  }
})
</script>
