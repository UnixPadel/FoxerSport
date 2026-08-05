<template>
  <div class="bg-gray-50 dark:bg-foxer-dark h-full text-gray-900 dark:text-white transition-colors duration-300 flex items-center justify-center relative overflow-hidden">
    
    <div class="absolute inset-0 bg-foxer-orange/5 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-foxer-orange/20 via-transparent to-transparent pointer-events-none"></div>

    <div 
      class="text-center relative z-10 p-6"
      v-motion
      :initial="{ opacity: 0, scale: 0.9 }"
      :enter="{ opacity: 1, scale: 1, transition: { duration: 600, type: 'spring' } }"
    >
      <h1 class="text-9xl font-display font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-foxer-orange to-orange-400 mb-4 drop-shadow-[0_0_30px_rgba(255,90,0,0.5)]">404</h1>
      <h2 class="text-3xl font-bold mb-6">{{ $t('errors.page_not_found') }}</h2>
      <p class="text-gray-400 mb-10 text-lg max-w-md mx-auto">{{ $t('errors.not_found_desc') }}</p>
      
      <router-link to="/" class="inline-flex items-center space-x-2 bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-foxer-orange hover:text-white transition-all shadow-lg hover:shadow-[0_0_20px_rgba(255,90,0,0.4)]">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clip-rule="evenodd" />
        </svg>
        <span>{{ $t('errors.back_home') }}</span>
      </router-link>
    </div>
  </div>
</template>

<script setup>
</script>
