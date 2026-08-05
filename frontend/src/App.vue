<template>
  <div class="flex flex-col min-h-screen">
    <Navbar v-if="!isAdminRoute" />
    <main class="flex-grow">
      <router-view />
    </main>
    <Footer v-if="!isAdminRoute" />
  </div>
</template>

<script setup>
import { onMounted, watchEffect, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useStorage } from '@vueuse/core'
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
import { useAuthStore } from './stores/auth'

import { useTheme } from './composables/useTheme'

const route = useRoute()
const isAdminRoute = computed(() => route.path.startsWith('/admin'))

const { theme } = useTheme()

watchEffect(() => {
  if (theme.value === 'dark') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
})


const authStore = useAuthStore()

onMounted(() => {
  authStore.fetchProfile()
})
</script>

<style>
/* Global styles can go here if needed */
</style>
