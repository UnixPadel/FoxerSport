<template>
  <main class="relative bg-white dark:bg-[#080810] text-gray-900 dark:text-white transition-colors duration-700">
    
    <!-- ── Animated gradient background (same system as ProductsView) ── -->
    <div class="fixed inset-0 z-0 pointer-events-none overflow-hidden">

      <!-- Blob 1 — Orange warm (top-left) -->
      <div
        class="absolute rounded-full blur-[130px] animate-blob"
        style="width:60%;height:55%;top:-15%;left:-20%;background:radial-gradient(circle, rgba(255,90,0,0.28) 0%, rgba(255,140,0,0.12) 60%, transparent 100%);"
      ></div>

      <!-- Blob 2 — Cyan/teal (right side) -->
      <div
        class="absolute rounded-full blur-[150px] animate-blob animation-delay-3000"
        style="width:55%;height:50%;top:35%;right:-18%;background:radial-gradient(circle, rgba(6,182,212,0.18) 0%, rgba(79,70,229,0.10) 60%, transparent 100%);"
      ></div>

      <!-- Blob 3 — Fuchsia/purple (bottom) -->
      <div
        class="absolute rounded-full blur-[120px] animate-blob animation-delay-5000"
        style="width:50%;height:45%;bottom:-10%;left:20%;background:radial-gradient(circle, rgba(192,38,211,0.12) 0%, rgba(251,146,60,0.10) 60%, transparent 100%);"
      ></div>

      <!-- Light mode tint overlay -->
      <div class="absolute inset-0 bg-white/60 dark:bg-transparent"></div>

      <!-- Grid pattern overlay -->
      <div class="absolute inset-0 opacity-[0.18] dark:opacity-[0.08]"
           style="background-image:linear-gradient(rgba(100,100,100,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(100,100,100,0.3) 1px, transparent 1px);background-size:40px 40px;">
      </div>

      <!-- Dot pattern overlay -->
      <div class="absolute inset-0 opacity-[0.3] dark:opacity-[0.12]"
           style="background-image:radial-gradient(rgba(255,90,0,0.18) 1.5px, transparent 1.5px);background-size:60px 60px;background-position:0 0,30px 30px;">
      </div>

    </div>
    
    <!-- ════════════════════════════════════════════ -->
    <!--  HERO SECTION                                -->
    <!-- ════════════════════════════════════════════ -->
    <section class="hero relative min-h-screen overflow-hidden -mt-10" @mousemove="onMouseMove">
      <!-- Rich Background for dark mode & WOW effect -->
      <div class="absolute inset-0 z-0 overflow-hidden pointer-events-none bg-white dark:bg-[#0d0d0d]">
        <div class="absolute inset-0 bg-gradient-to-br from-[#0d0d0d] via-[#111118] to-[#0d0d0d] dark:block hidden"></div>
        <!-- Animated Particles -->
        <div class="absolute top-[10%] left-[20%] w-6 h-6 rounded-full bg-foxer-orange/20 blur-sm animate-[glow-pulse_4s_infinite]"></div>
        <div class="absolute top-[30%] right-[10%] w-8 h-8 rounded-full bg-foxer-orange/10 blur-md animate-[glow-pulse_5s_infinite_1s]"></div>
        <div class="absolute bottom-[20%] left-[15%] w-10 h-10 rounded-full bg-foxer-orange/15 blur-md animate-[glow-pulse_6s_infinite_2s]"></div>
        <div class="absolute bottom-[40%] right-[25%] w-4 h-4 rounded-full bg-white/20 blur-[2px] animate-[glow-pulse_3s_infinite_0.5s]"></div>
        
        <div class="absolute -top-20 -right-20 w-[600px] h-[600px] rounded-full opacity-[0.06] dark:opacity-[0.15]" style="background: radial-gradient(circle, #FF5A00 0%, transparent 70%);"></div>
        <div class="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full opacity-[0.04] dark:opacity-[0.10]" style="background: radial-gradient(circle, #22d3ee 0%, transparent 70%);"></div>
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-0 dark:opacity-[0.06]" style="background: radial-gradient(circle, #FF5A00 0%, transparent 60%);"></div>
        <div class="absolute inset-0 opacity-[0.10] dark:opacity-0 block dark:hidden" style="background-image: radial-gradient(circle, #000 1px, transparent 1px); background-size: 30px 30px;"></div>
        <div class="absolute inset-0 opacity-0 dark:opacity-[0.15] hidden dark:block" style="background-image: radial-gradient(circle, #fff 1px, transparent 1px); background-size: 30px 30px;"></div>
      </div>
      
      <!-- Seamless Gradient Transition to rest of the page -->
      <div class="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-gray-50 dark:from-[#0d0d0d] to-transparent z-10 pointer-events-none"></div>

      <!-- Main Hero Layout -->
      <div class="relative z-10 container mx-auto px-6 lg:px-12 w-full pt-32 lg:pt-27 pb-12 lg:pb-16">
        <div class="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-6 items-center">

          <!-- ═══ LEFT: Text Content ═══ -->
          <div class="flex flex-col justify-center order-1 lg:order-1 z-10">
            
            <!-- Badge -->
            <div 
              v-motion
              :initial="{ opacity: 0, y: 20 }"
              :enter="{ opacity: 1, y: 0, transition: { delay: 100, duration: 600, ease: 'easeOut' } }"
              class="inline-flex items-center gap-2 bg-white/50 dark:bg-white/10 border border-foxer-orange/30 dark:border-foxer-orange/50 rounded-full px-4 py-1.5 mb-6 w-fit backdrop-blur-md shadow-[0_0_15px_rgba(255,90,0,0.15)]"
            >
              <span class="w-2 h-2 rounded-full bg-foxer-orange animate-pulse shadow-[0_0_8px_#FF5A00]"></span>
              <span class="text-[11px] font-bold tracking-wide text-gray-800 dark:text-gray-200 uppercase">{{ $t('home.premium_badge', 'Équipement Padel Premium') }}</span>
            </div>

            <!-- Main Title -->
            <h1 
              v-motion
              :initial="{ opacity: 0, y: 40 }"
              :enter="{ opacity: 1, y: 0, transition: { delay: 250, duration: 900, type: 'spring', damping: 20, stiffness: 90 } }"
              class="font-display font-black text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.05] tracking-tight mb-5"
            >
              <span class="block text-gray-900 dark:text-white">{{ $t('home.hero_title_1', 'Le Sommet De La') }}</span>
              <span class="block text-gradient italic">{{ $t('home.hero_title_2', 'Performance Padel') }}</span>
            </h1>

            <!-- Subtitle -->
            <p 
              v-motion
              :initial="{ opacity: 0, y: 20 }"
              :enter="{ opacity: 1, y: 0, transition: { delay: 500, duration: 700, ease: 'easeOut' } }"
              class="text-gray-500 dark:text-gray-400 text-sm md:text-base leading-relaxed max-w-md mb-7 font-medium"
            >
              {{ $t('home.hero_subtitle', 'Where Innovation Meets Impact. From the club to major tournaments, our gear combines power with professional performance.') }}
            </p>

            <!-- CTA Row -->
            <div 
              v-motion
              :initial="{ opacity: 0, y: 20 }"
              :enter="{ opacity: 1, y: 0, transition: { delay: 650, duration: 700, ease: 'easeOut' } }"
              class="flex items-center gap-4 mb-8"
            >
              <router-link aria-label="Explore our products" 
                to="/products" 
                class="group relative inline-flex items-center gap-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold text-sm tracking-wide px-7 py-4 rounded-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-gray-900/20 dark:hover:shadow-white/20 hover:-translate-y-0.5"
              >
                <span class="relative z-10">{{ $t('home.explore_store') }}</span>
                <span class="relative z-10 w-8 h-8 rounded-full bg-foxer-orange flex items-center justify-center transition-transform duration-300 group-hover:rotate-45">
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M7 17L17 7M17 7H7M17 7v10"/></svg>
                </span>
                <div class="absolute inset-0 bg-foxer-orange translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"></div>
              </router-link>

              <router-link 
                to="/products?categorySlug=rackets" 
                class="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-foxer-orange dark:hover:text-foxer-orange font-semibold text-sm transition-colors duration-300"
              >
                <span>{{ $t('home.view_rackets') }}</span>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
              </router-link>
            </div>

            <!-- Stats Row -->
            <div 
              v-motion
              :initial="{ opacity: 0, y: 20 }"
              :enter="{ opacity: 1, y: 0, transition: { delay: 850, duration: 700, ease: 'easeOut' } }"
              class="flex items-center gap-6"
            >
              <div>
                <p class="text-2xl lg:text-3xl font-black text-gray-900 dark:text-white tracking-tight whitespace-nowrap">500<span class="text-foxer-orange">+</span></p>
                <p class="text-[10px] lg:text-[11px] font-semibold uppercase tracking-[0.1em] lg:tracking-[0.15em] text-gray-400 dark:text-gray-500 mt-1">{{ $t('home.expert_endorsements') }}</p>
              </div>
              <div class="w-px h-10 lg:h-12 bg-gray-200 dark:bg-white/15"></div>
              <div>
                <p class="text-2xl lg:text-3xl font-black text-gray-900 dark:text-white tracking-tight whitespace-nowrap">100<span class="text-foxer-orange">%</span></p>
                <p class="text-[10px] lg:text-[11px] font-semibold uppercase tracking-[0.1em] lg:tracking-[0.15em] text-gray-400 dark:text-gray-500 mt-1">{{ $t('home.precision_engineered') }}</p>
              </div>
              <div class="w-px h-10 lg:h-12 bg-gray-200 dark:bg-white/15"></div>
              <div>
                <p class="text-2xl lg:text-3xl font-black text-gray-900 dark:text-white tracking-tight whitespace-nowrap">4.9<span class="text-foxer-orange">★</span></p>
                <p class="text-[10px] lg:text-[11px] font-semibold uppercase tracking-[0.1em] lg:tracking-[0.15em] text-gray-400 dark:text-gray-500 mt-1">{{ $t('home.player_rating') }}</p>
              </div>
            </div>

          </div>

          <!-- ═══ RIGHT: Athlete Image ═══ -->
          <div class="relative flex items-center justify-center order-2 lg:order-2 w-full min-h-[50vh] lg:min-h-[70vh]">
            
            <!-- Decorative circle behind athlete -->
            <div 
              class="absolute top-1/2 left-1/2 w-[70%] lg:w-[85%] aspect-square rounded-full will-change-transform"
              :style="{ transform: `translate(-50%, -50%) translate3d(${mx * -5}px, ${my * -5}px, 0)` }"
            >
              <div class="w-full h-full rounded-full bg-gradient-to-br from-foxer-orange/15 to-orange-400/5 dark:from-foxer-orange/[0.06] dark:to-white/[0.02] border border-foxer-orange/20 dark:border-white/[0.08] shadow-[0_0_50px_rgba(255,90,0,0.1)]"></div>
            </div>

            <!-- Secondary decorative ring -->
            <div 
              class="absolute top-1/2 left-1/2 w-[80%] lg:w-[95%] aspect-square rounded-full border border-foxer-orange/20 dark:border-white/[0.06] will-change-transform"
              :style="{ transform: `translate(-50%, -50%) translate3d(${mx * -8}px, ${my * -8}px, 0)` }"
            ></div>

            <!-- Small floating accent dot -->
            <div 
              class="absolute top-[20%] right-[10%] z-20 will-change-transform"
              :style="{ transform: `translate3d(${mx * 15}px, ${my * 15}px, 0)` }"
            >
              <div 
                v-motion
                :initial="{ opacity: 0, scale: 0 }"
                :enter="{ opacity: 1, scale: 1, transition: { delay: 1200, duration: 800, type: 'spring' } }"
                class="w-4 h-4 rounded-full bg-foxer-orange shadow-lg shadow-foxer-orange/30"
              ></div>
            </div>

            <!-- Floating badge: "Loved by 500k Users" -->
            <div 
              v-motion
              :initial="{ opacity: 0, x: 20, scale: 0.9 }"
              :enter="{ opacity: 1, x: 0, scale: 1, transition: { delay: 1000, duration: 800, type: 'spring', damping: 20 } }"
              class="absolute top-[10%] sm:top-[15%] right-0 sm:right-[5%] lg:right-[-5%] xl:right-[5%] z-30 glass rounded-2xl px-4 py-3 shadow-2xl border border-white/20 will-change-transform max-w-[180px] sm:max-w-none"
              :style="{ transform: `translate3d(${mx * 10}px, ${my * 8}px, 0)` }"
            >
              <div class="flex items-center gap-2">
                <div class="flex -space-x-2">
                  <div class="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-foxer-orange flex items-center justify-center text-white text-[10px] font-bold ring-2 ring-white dark:ring-[#1a1a1a] z-30">🏆</div>
                  <div class="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-cyan-500 flex items-center justify-center text-white text-[10px] font-bold ring-2 ring-white dark:ring-[#1a1a1a] z-20">⭐</div>
                  <div class="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white text-[10px] font-bold ring-2 ring-white dark:ring-[#1a1a1a] z-10">💪</div>
                </div>
                <div class="flex flex-col">
                  <span class="text-xs sm:text-sm font-bold text-gray-900 dark:text-white leading-none">500k+</span>
                  <span class="text-[9px] sm:text-[10px] font-medium text-gray-500 dark:text-gray-400 leading-tight">{{ $t('home.happy_users', 'Joueurs satisfaits') }}</span>
                </div>
              </div>
            </div>

            <!-- THE ATHLETE -->
            <img 
  :src="athleteImage" 
  alt="Foxer Padel Athlete" 
  v-motion
  :initial="{ opacity: 0, y: 60, scale: 0.95 }"
  :enter="{ opacity: 1, y: 0, scale: 1, transition: { delay: 300, duration: 1200, type: 'spring', damping: 22, stiffness: 70 } }"
  class="relative z-10 block w-full max-w-[400px] sm:max-w-[500px] lg:max-w-[550px] xl:max-w-[600px] h-auto object-contain mx-auto drop-shadow-[0_30px_50px_rgba(255,90,0,0.4)] transform lg:scale-100 origin-bottom"
/>
          </div>

        </div>
      </div>

    </section>

    <!-- ════════════════════════════════════════════ -->
    <!--  COLLECTION CARDS ROW                        -->
    <!-- ════════════════════════════════════════════ -->
    <section class="relative z-20 pb-3">
      <div class="container mx-auto px-4 sm:px-6 lg:px-12 -mt-[80px] md:-mt-[100px] lg:-mt-[60px]">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          <router-link 
            v-for="(cat, i) in categories" 
            :key="cat.name"
            :to="cat.link"
            v-motion
            :initial="{ opacity: 0, y: 30 }"
            :visible-once="{ opacity: 1, y: 0, transition: { delay: 100 * i, duration: 600, ease: 'easeOut' } }"
            class="group relative bg-white dark:bg-[#1a1a1a] rounded-2xl md:rounded-3xl p-3 sm:p-5 lg:p-6 border border-gray-200/80 dark:border-white/[0.1] shadow-lg shadow-gray-100 dark:shadow-black/50 hover:border-foxer-orange/40 dark:hover:border-foxer-orange/40 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:shadow-foxer-orange/10 dark:hover:shadow-foxer-orange/10 flex flex-col justify-between"
          >
            <div class="flex items-start justify-between mb-3 md:mb-4">
              <div class="pr-2">
                <h3 class="text-sm sm:text-lg lg:text-xl font-bold text-gray-900 dark:text-white group-hover:text-foxer-orange transition-colors duration-300 leading-tight">{{ $t('home.cat_' + cat.name.toLowerCase(), cat.name) }}</h3>
                <p class="text-[9px] sm:text-[11px] text-gray-400 dark:text-gray-500 font-medium mt-1 line-clamp-1">{{ $t('home.cat_sub_' + cat.name.toLowerCase(), cat.sub) }}</p>
              </div>
              <div class="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-200/60 dark:bg-white/[0.06] flex items-center justify-center shrink-0 group-hover:bg-foxer-orange group-hover:text-white transition-all duration-300">
                <svg class="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M7 17L17 7M17 7H7M17 7v10"/></svg>
              </div>
            </div>
            <div class="w-full aspect-[4/3] rounded-xl md:rounded-2xl bg-gray-100 dark:bg-white/[0.03] overflow-hidden mt-auto">
              <img :src="cat.img" :alt="cat.name" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            </div>
          </router-link>
        </div>
      </div>
    </section>

    <!-- ════════════════════════════════════════════ -->
    <!--  CATEGORIES BENTO GRID                       -->
    <!-- ════════════════════════════════════════════ -->
    <section class="pt-12 pb-24 container mx-auto px-4 sm:px-6 lg:px-12">
      <div 
        v-motion
        :initial="{ opacity: 0, y: 30 }"
        :visible-once="{ opacity: 1, y: 0, transition: { duration: 800, ease: 'easeOut' } }"
        class="text-center mb-10 md:mb-16"
      >
        <h2 class="text-3xl md:text-5xl font-display font-bold mb-4">{{ $t('home.categories') }}</h2>
        <div class="w-20 md:w-24 h-1 bg-foxer-orange mx-auto rounded-full"></div>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 auto-rows-[160px] sm:auto-rows-[200px] md:auto-rows-[280px]">
        <!-- Giyim (Large) -->
        <router-link 
          to="/products?categorySlug=clothing" 
          v-motion
          :initial="{ opacity: 0, scale: 0.9, y: 60 }"
          :visible-once="{ opacity: 1, scale: 1, y: 0, transition: { delay: 100, duration: 800, type: 'spring', stiffness: 100, damping: 15 } }"
          class="col-span-2 md:col-span-2 row-span-2 group relative rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl hover:shadow-[0_0_40px_rgba(255,90,0,0.3)] transition-all duration-500 border border-gray-200 dark:border-white/10 hover:border-foxer-orange/50"
        >
          <img src="https://foxersport.com/image/cache/catalog/clothing-994x540.png" :alt="$t('nav.clothing', 'Giyim')" class="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500"></div>
          <div class="absolute bottom-6 left-6 md:bottom-10 md:left-10 transform translate-y-4 md:translate-y-6 group-hover:translate-y-0 transition-transform duration-500">
            <h3 class="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-white mb-2 md:mb-3 drop-shadow-lg tracking-wide">{{ $t('nav.clothing') }}</h3>
            <span class="inline-flex items-center space-x-2 text-foxer-orange font-bold uppercase tracking-widest text-xs md:text-sm opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <span>{{ $t('home.discover') }}</span>
              <span class="transform group-hover:translate-x-2 transition-transform duration-300">&rarr;</span>
            </span>
          </div>
        </router-link>

        <!-- Raketler -->
        <router-link 
          to="/products?categorySlug=rackets" 
          v-motion
          :initial="{ opacity: 0, scale: 0.9, x: 60 }"
          :enter="{ opacity: 1, scale: 1, x: 0, transition: { duration: 800, type: 'spring', bounce: 0.4, delay: 300 } }"
          class="col-span-1 relative group overflow-hidden rounded-2xl md:rounded-3xl shadow-lg"
        >
          <img src="https://foxersport.com/image/cache/catalog/994x540-994x540.png" :alt="$t('nav.rackets', 'Rackets')" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
          <div class="absolute bottom-0 left-0 p-4 md:p-6">
            <h3 class="text-base sm:text-lg md:text-xl font-bold text-white mb-1 uppercase">{{ $t('nav.rackets') }}</h3>
            <p class="text-xs md:text-sm text-gray-300 opacity-100 md:opacity-0 transform translate-y-0 md:translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 hidden sm:block">{{ $t('home.categories_sub.rackets') }}</p>
          </div>
        </router-link>

        <!-- Çantalar -->
        <router-link 
          to="/products?categorySlug=bags" 
          v-motion
          :initial="{ opacity: 0, scale: 0.9, y: 60 }"
          :enter="{ opacity: 1, scale: 1, y: 0, transition: { duration: 800, type: 'spring', bounce: 0.4, delay: 400 } }"
          class="col-span-1 relative group overflow-hidden rounded-2xl md:rounded-3xl shadow-lg"
        >
          <img src="https://foxersport.com/image/cache/catalog/bags,-994x540.png" :alt="$t('nav.bags', 'Bags')" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
          <div class="absolute bottom-0 left-0 p-4 md:p-6">
            <h3 class="text-base sm:text-lg md:text-xl font-bold text-white mb-1 uppercase">{{ $t('nav.bags') }}</h3>
            <p class="text-xs md:text-sm text-gray-300 opacity-100 md:opacity-0 transform translate-y-0 md:translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 hidden sm:block">{{ $t('home.categories_sub.bags') }}</p>
          </div>
        </router-link>

        <!-- Ekipmanlar -->
        <router-link 
          to="/products?categorySlug=training-equipment" 
          v-motion
          :initial="{ opacity: 0, scale: 0.9, x: 60 }"
          :enter="{ opacity: 1, scale: 1, x: 0, transition: { duration: 800, type: 'spring', bounce: 0.4, delay: 500 } }"
          class="col-span-2 relative group overflow-hidden rounded-2xl md:rounded-3xl shadow-lg"
        >
          <img src="https://foxersport.com/image/cache/catalog/anasayfa_3_920x994-994x540.png" :alt="$t('nav.equipment', 'Ekipmanlar')" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
          <div class="absolute bottom-0 left-0 p-4 md:p-6">
            <h3 class="text-lg md:text-xl font-bold text-white mb-1 uppercase">{{ $t('nav.equipment') }}</h3>
            <p class="text-xs md:text-sm text-gray-300 opacity-100 md:opacity-0 transform translate-y-0 md:translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">{{ $t('home.categories_sub.equipment') }}</p>
          </div>
        </router-link>
      </div>
    </section>

    <!-- ════════════════════════════════════════════ -->
    <!--  POPULAR PRODUCTS                            -->
    <!-- ════════════════════════════════════════════ -->
    <section class="pt-8 pb-24 relative overflow-hidden">
      <div class="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-foxer-orange/10 rounded-full blur-[100px] pointer-events-none"></div>
      
      <div class="container mx-auto px-6 lg:px-12 relative z-10">
        <div 
          v-motion
          :initial="{ opacity: 0, y: 30 }"
          :visible-once="{ opacity: 1, y: 0, transition: { duration: 800, ease: 'easeOut' } }"
          class="flex justify-between items-end mb-12"
        >
          <div>
            <h2 class="text-4xl md:text-5xl font-display font-bold mb-4">{{ $t('home.popular', 'Populaires') }}</h2>
            <div class="w-24 h-1 bg-foxer-orange rounded-full"></div>
          </div>
          <router-link to="/products?sort=popular" class="text-gray-400 hover:text-foxer-orange transition-colors hidden md:flex items-center space-x-2 group">
            <span>{{ $t('home.see_all') }}</span>
            <span class="group-hover:translate-x-2 transition-transform duration-300">&rarr;</span>
          </router-link>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div v-if="loadingPopular" class="col-span-3 text-center py-12 text-gray-600 dark:text-gray-400">
            <svg class="animate-spin h-8 w-8 mx-auto mb-4 text-foxer-orange" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ $t('common.loading', 'Yükleniyor...') }}
          </div>

          <router-link 
            v-else
            v-for="(product, idx) in popularProducts" :key="product.id"
            :to="'/product/' + product.slug"
            v-motion
            :initial="{ opacity: 0, y: 50 }"
            :visible-once="{ opacity: 1, y: 0, transition: { delay: 100 * (idx + 1), duration: 600, ease: 'easeOut' } }"
            class="bg-white dark:bg-[#111] rounded-2xl p-4 group hover:-translate-y-2 transition-all duration-300 hover:shadow-xl border border-gray-200/80 dark:border-white/5 flex flex-col relative"
          >
            <div class="relative aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-foxer-gray mb-4">
              <img :src="getPrimaryImage(product)" :alt="getProductName(product)" class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" :class="{ 'opacity-50 grayscale': product.stockQuantity === 0 }" />
              
              <!-- Out of stock overlay -->
              <div v-if="product.stockQuantity === 0" class="absolute inset-0 flex items-center justify-center bg-black/40 z-10">
                <div class="bg-red-600 text-white font-bold px-4 py-2 rounded-lg rotate-12 border-2 border-white/20 shadow-[0_0_20px_rgba(220,38,38,0.5)]">
                  {{ $t('product.out_of_stock', 'Rupture de stock') }}
                </div>
              </div>
              
              <div v-if="product.stockQuantity > 0" class="absolute bottom-4 left-1/2 -translate-x-1/2 translate-y-16 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out z-20">
                <button @click.prevent="addToCart(product, $event)" class="bg-foxer-orange text-white px-6 py-2.5 rounded-full font-bold shadow-lg hover:bg-orange-600 flex items-center space-x-2 hover:scale-105 transition-transform relative z-20">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
                  </svg>
                  <span class="whitespace-nowrap">{{ $t('home.add_to_cart') }}</span>
                </button>
              </div>
            </div>
            <div class="space-y-2 relative flex-grow flex flex-col justify-end">
              <h3 class="text-lg font-bold line-clamp-2 hover:text-foxer-orange transition-colors">
                <AutoTranslate :fallbackText="getProductName(product)" :translations="product.translations" field="name" />
              </h3>
              <div class="flex items-center space-x-2">
                <p class="text-foxer-orange font-bold text-2xl font-display tracking-tight">{{ formatPrice(product, currencyStore.currency) }}</p>
                <p v-if="product.compareAtPriceTry" class="text-gray-400 dark:text-gray-500 font-bold text-sm line-through decoration-red-500/50">{{ formatPrice(product, currencyStore.currency, true) }}</p>
              </div>
            </div>
          </router-link>

        </div>
      </div>
    </section>

    <!-- ════════════════════════════════════════════ -->
    <!--  RECENTLY VIEWED PRODUCTS                    -->
    <!-- ════════════════════════════════════════════ -->
    <section v-if="recentlyViewedProducts.length >= 3" class="py-12 relative overflow-hidden">
      <div class="container mx-auto px-6 lg:px-12 relative z-10">
        <div 
          v-motion
          :initial="{ opacity: 0, y: 30 }"
          :visible-once="{ opacity: 1, y: 0, transition: { duration: 800, ease: 'easeOut' } }"
          class="mb-10"
        >
          <h2 class="text-3xl md:text-4xl font-display font-bold mb-4">{{ $t('home.recently_viewed', 'Récemment consultés') }}</h2>
          <div class="w-24 h-1 bg-foxer-orange rounded-full"></div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <router-link 
            v-for="(product, idx) in recentlyViewedProducts" :key="'recent-'+product.id"
            :to="'/product/' + product.slug"
            v-motion
            :initial="{ opacity: 0, y: 30 }"
            :visible-once="{ opacity: 1, y: 0, transition: { delay: 100 * (idx + 1), duration: 500, ease: 'easeOut' } }"
            class="bg-white dark:bg-[#111] rounded-2xl p-4 group hover:-translate-y-2 transition-all duration-300 hover:shadow-xl border border-gray-200/80 dark:border-white/5 flex flex-col relative"
          >
            <div class="relative aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-foxer-gray mb-4">
              <img :src="getPrimaryImage(product)" :alt="getProductName(product)" class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            </div>
            <div class="space-y-1 relative flex-grow flex flex-col justify-end">
              <h3 class="text-base font-bold line-clamp-2 hover:text-foxer-orange transition-colors">
                <AutoTranslate :fallbackText="getProductName(product)" :translations="product.translations" field="name" />
              </h3>
              <p class="text-foxer-orange font-bold text-lg font-display tracking-tight">{{ formatPrice(product, currencyStore.currency) }}</p>
            </div>
          </router-link>
        </div>
      </div>
    </section>
    <!-- ════════════════════════════════════════════ -->
    <!--  BLOG & NEWS                                 -->
    <!-- ════════════════════════════════════════════ -->
    <section class="py-10 container mx-auto px-6 lg:px-12 relative">
      <div 
        v-motion
        :initial="{ opacity: 0, y: 30 }"
        :visible-once="{ opacity: 1, y: 0, transition: { duration: 800, ease: 'easeOut' } }"
        class="text-center mb-16"
      >
        <h2 class="text-4xl md:text-5xl font-display font-bold mb-4">{{ $t('blog.title') }}</h2>
        <div class="w-24 h-1 bg-foxer-orange mx-auto rounded-full"></div>
      </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <router-link 
          v-for="(blog, index) in blogs"
          :key="blog.id"
          :to="'/blog/' + blog.slug"
          v-motion
          :initial="{ opacity: 0, y: 40 }"
          :visible-once="{ opacity: 1, y: 0, transition: { delay: (index + 1) * 100, duration: 600, ease: 'easeOut' } }"
          class="block bg-white dark:bg-[#111] rounded-3xl overflow-hidden group hover:-translate-y-2 transition-transform duration-300 flex flex-col border border-gray-200/80 dark:border-white/5 shadow-sm hover:shadow-xl"
        >
          <div class="relative aspect-video overflow-hidden">
            <img :src="getBlogImage(blog)" :alt="getBlogTitle(blog)" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div class="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500"></div>
          </div>
          <div class="p-8 flex-grow flex flex-col justify-between">
            <div>
              <p class="text-foxer-orange text-sm font-bold mb-3 uppercase tracking-wider">{{ $t('blog.news', 'Nouveautés') }}</p>
              <h3 class="text-xl font-bold mb-3 line-clamp-2 group-hover:text-foxer-orange transition-colors cursor-pointer">
                <AutoTranslate :fallbackText="getBlogTitle(blog)" :translations="blog.translations" field="title" />
              </h3>
              <p class="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-6">
                <AutoTranslate :fallbackText="getBlogExcerpt(blog)" :translations="blog.translations" field="excerpt" :isHtml="true" />
              </p>
            </div>
            <span class="inline-flex items-center space-x-2 text-gray-900 dark:text-white font-bold group-hover:text-foxer-orange dark:group-hover:text-foxer-orange transition-colors">
              <span>{{ $t('blog.read_more') }}</span>
              <span>&rarr;</span>
            </span>
          </div>
        </router-link>
      </div>

      <!-- Voir plus button -->
      <div 
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :visible-once="{ opacity: 1, y: 0, transition: { delay: 400, duration: 600, ease: 'easeOut' } }"
        class="mt-12 flex justify-center"
      >
        <router-link 
          to="/blogs" 
          class="inline-flex items-center gap-2 bg-transparent border-2 border-foxer-orange text-foxer-orange hover:bg-foxer-orange hover:text-white font-bold px-6 py-2 text-sm rounded-full transition-colors duration-300 shadow-sm hover:shadow-foxer-orange/30 group"
        >
          <span>{{ $t('home.see_more_blogs', 'Voir plus') }}</span>
          <span class="transform group-hover:translate-x-1 transition-transform duration-300">&rarr;</span>
        </router-link>
      </div>
    </section>

    <!-- Simple Toast Notification -->
    <div 
      class="fixed bottom-6 right-6 z-[100] transition-all duration-500 transform"
      :class="showToast ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'"
    >
      <div class="bg-gray-900 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center space-x-3 border border-white/10">
        <div class="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
          <svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <span class="font-medium text-sm">{{ toastMessage }}</span>
      </div>
    </div>

  </main>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import api from '../api'
import { useCartStore } from '../stores/cart'
import { useRecentlyViewedStore } from '../stores/recentlyViewed'
import { useCurrencyStore } from '../stores/currency'
import AutoTranslate from '@/components/AutoTranslate.vue'
import { formatPrice } from '@/utils/currency'

import athleteImage from '@/assets/images/home.webp'

const { locale, t } = useI18n()
const cartStore = useCartStore()
const recentlyViewedStore = useRecentlyViewedStore()
const currencyStore = useCurrencyStore()

// ─── Mouse parallax (lightweight) ───
const mx = ref(0)
const my = ref(0)

const onMouseMove = (e) => {
  if (typeof window === 'undefined') return
  mx.value = (e.clientX / window.innerWidth - 0.5) * 2
  my.value = (e.clientY / window.innerHeight - 0.5) * 2
}

// ─── Category cards data ───
const categories = computed(() => [
  { name: t('nav.rackets'), sub: t('home.categories_sub.rackets'), img: "https://foxersport.com/image/cache/catalog/994x540-994x540.png", link: "/products?categorySlug=rackets" },
  { name: t('nav.clothing'), sub: t('home.categories_sub.clothing'), img: "https://foxersport.com/image/cache/catalog/clothing-994x540.png", link: "/products?categorySlug=clothing" },
  { name: t('nav.bags'), sub: t('home.categories_sub.bags'), img: "https://foxersport.com/image/cache/catalog/bags,-994x540.png", link: "/products?categorySlug=bags" },
  { name: t('nav.equipment'), sub: t('home.categories_sub.equipment'), img: "https://foxersport.com/image/cache/catalog/anasayfa_3_920x994-994x540.png", link: "/products?categorySlug=training-equipment" },
])

// ─── Data ───
const popularProducts = ref([])
const recentlyViewedProducts = ref([])
const blogs = ref([])
const loadingPopular = ref(true)
const loadingRecently = ref(true)

const showToast = ref(false)
const toastMessage = ref('')
let toastTimer = null

const showNotification = (msg) => {
  toastMessage.value = msg
  showToast.value = true
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    showToast.value = false
  }, 3000)
}

const addToCart = async (product, e) => {
  if (e) e.preventDefault()
  const success = await cartStore.addToCart(product, 1)
  if (success) {
    showNotification(t('cart.added_success', 'Produit ajouté au panier !'))
  }
}

const fetchPopularProducts = async () => {
  try {
    const res = await api.get('/products?limit=3&isFeatured=true')
    if (res.data.status === 'success') {
      popularProducts.value = res.data.data
    }
  } catch (error) {
    console.error('Error fetching popular products:', error)
  } finally {
    loadingPopular.value = false
  }
}

const fetchRecentlyViewed = async () => {
  const ids = recentlyViewedStore.viewedIds.slice(0, 4)
  if (ids.length === 0) {
    loadingRecently.value = false
    return
  }
  try {
    const res = await api.get(`/products?ids=${ids.join(',')}&limit=4`)
    if (res.data.status === 'success') {
      recentlyViewedProducts.value = res.data.data
    }
  } catch (error) {
    console.error('Error fetching recently viewed:', error)
  } finally {
    loadingRecently.value = false
  }
}

const fetchBlogs = async () => {
  try {
    const res = await api.get('/blogs?limit=3')
    if (res.data.status === 'success') {
      blogs.value = res.data.data
    }
  } catch (error) {
    console.error('Error fetching blogs:', error)
  }
}

const getProductName = (product) => {
  const t = product.translations?.find(t => t.locale === locale.value)
  if (t && t.name) return t.name
  const en = product.translations?.find(t => t.locale === 'en')
  if (en && en.name) return en.name
  return product.translations?.[0]?.name || product.slug || 'Product'
}

const getPrimaryImage = (product) => {
  if (product.images && product.images.length > 0) {
    const url = product.images[0].url || product.images[0];
    if (url && url.startsWith('/uploads/')) {
      return `http://localhost:3000${url}`;
    }
    return url;
  }
  return 'https://foxersport.com/image/cache/catalog/clothing-994x540.png'
}

const getBlogTitle = (blog) => {
  const t = blog.translations?.find(t => t.locale === locale.value)
  if (t && t.title) return t.title
  const en = blog.translations?.find(t => t.locale === 'en')
  if (en && en.title) return en.title
  return blog.slug
}

const getBlogExcerpt = (blog) => {
  const t = blog.translations?.find(t => t.locale === locale.value)
  if (t && t.excerpt) return t.excerpt
  const en = blog.translations?.find(t => t.locale === 'en')
  if (en && en.excerpt) return en.excerpt
  return ''
}

const getBlogImage = (blog) => {
  if (!blog.featuredImage) return 'https://foxersport.com/image/cache/catalog/blog1-600x400.jpg';
  if (blog.featuredImage.startsWith('/uploads/')) {
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
    return baseUrl.replace('/api', '') + blog.featuredImage;
  }
  return blog.featuredImage;
}

onMounted(() => {
  fetchPopularProducts()
  fetchRecentlyViewed()
  fetchBlogs()
})
</script>
