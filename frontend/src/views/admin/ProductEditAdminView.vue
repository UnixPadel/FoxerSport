<template>
  <div class="px-4 sm:px-6 lg:px-8 py-10 w-full max-w-[1200px] mx-auto bg-gray-50/50 dark:bg-slate-900/50 min-h-screen">
    
    <!-- Page Header (Sticky) -->
    <div class="sticky top-0 z-20 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-4 mb-8 backdrop-blur-md bg-gray-50/80 dark:bg-slate-900/80 border-b border-gray-200/50 dark:border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div class="flex items-center gap-4">
        <router-link to="/admin/products" class="p-2 bg-white dark:bg-slate-800 rounded-full shadow-sm border border-gray-200 dark:border-white/10 text-gray-500 hover:text-foxer-orange transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </router-link>
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ isEditing ? `${$t('admin.edit_product', 'Modifier le Produit')} : ${translations.fr.name || productData.slug || ''}` : $t('admin.add_product_title', 'Ajouter un produit') }}
          </h1>
          <p class="text-sm text-gray-500 dark:text-gray-400" v-if="!isEditing">{{ $t('admin.add_product_desc', 'Remplissez les détails pour créer un nouveau produit dans votre catalogue.') }}</p>
        </div>
      </div>
      
      <div class="flex items-center gap-3 w-full sm:w-auto">
        <router-link to="/admin/products" class="px-4 py-2 text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors">
          {{ $t('admin.cancel', 'Annuler') }}
        </router-link>
        <button 
          @click="saveProduct" 
          :disabled="saving"
          class="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-gray-900 hover:bg-gray-800 dark:bg-foxer-orange dark:hover:bg-orange-600 text-white rounded-lg font-bold shadow-md transition-all active:scale-95 disabled:opacity-50"
        >
          <svg v-if="saving" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          <span>{{ saving ? $t('admin.saving', 'Enregistrement...') : $t('admin.save', 'Enregistrer') }}</span>
        </button>
      </div>
    </div>

    <!-- Layout Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      <!-- Main Column: Product Core Info -->
      <div class="lg:col-span-2 space-y-8">
        
        <!-- Section: Général -->
        <div class="bg-white dark:bg-slate-800 shadow-sm rounded-xl border border-gray-200 dark:border-white/5 p-6">
          <h2 class="text-base font-bold text-gray-900 dark:text-white mb-6">{{ $t('admin.general_info', 'Informations générales') }}</h2>
          
          <div class="space-y-5">
            <!-- Titre -->
            <div>
              <label class="block text-sm font-bold text-blue-700 dark:text-blue-400 mb-1">{{ $t('admin.title', 'Titre') }} <span class="text-red-500">*</span></label>
              <input 
                type="text" 
                v-model="translations.fr.name" 
                @input="generateSlugIfEmpty('fr')"
                class="w-full px-4 py-3 rounded-xl border-2 border-blue-100 dark:border-blue-900/30 bg-blue-50/30 dark:bg-blue-500/5 text-gray-900 dark:text-white outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-lg font-bold"
                :placeholder="$t('admin.title_placeholder', 'Ex: T-shirt Sport Premium')"
              />
            </div>

            <!-- Description -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ $t('admin.detailed_desc', 'Description détaillée') }} <span class="text-red-500">*</span></label>
              <div class="rounded-lg border border-gray-300 dark:border-slate-600 overflow-hidden bg-white dark:bg-slate-900">
                <QuillEditor
                  v-model:content="translations.fr.description"
                  contentType="html"
                  theme="snow"
                  toolbar="minimal"
                  class="min-h-[250px]"
                />
              </div>
            </div>
            
            <!-- Description Courte -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ $t('admin.short_desc', 'Résumé (Aperçu)') }}</label>
              <textarea 
                v-model="translations.fr.shortDescription" 
                rows="2"
                class="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-foxer-orange transition-shadow resize-none text-sm"
                :placeholder="$t('admin.short_desc_placeholder', `Un résumé rapide pour attirer l'attention...`)"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Section: Médias -->
        <div class="bg-white dark:bg-slate-800 shadow-sm rounded-xl border border-gray-200 dark:border-white/5 p-6">
          <h2 class="text-base font-bold text-gray-900 dark:text-white mb-6">{{ $t('admin.media', 'Médias') }} <span class="text-red-500">*</span></h2>
          
          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-4" v-if="productImages.length > 0">
            <div v-for="(img, index) in productImages" :key="index" class="relative group rounded-xl overflow-hidden border-2" :class="img.isPrimary ? 'border-foxer-orange dark:border-foxer-orange' : 'border-gray-200 dark:border-slate-700'">
              <img :src="img.url" class="w-full h-32 object-cover" />
              <!-- Set Primary Overlay -->
              <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                <button v-if="!img.isPrimary" @click.prevent="setPrimaryImage(index)" class="text-xs bg-white text-gray-900 px-3 py-1 rounded-full font-bold shadow-sm hover:bg-gray-100 transition-transform hover:scale-105">
                  {{ $t('admin.primary', 'Principal') }}
                </button>
              </div>
              <!-- Primary Badge -->
              <div v-if="img.isPrimary" class="absolute top-2 left-2 bg-foxer-orange text-white text-xs px-2 py-0.5 rounded shadow-sm font-bold">
                {{ $t('admin.primary', 'Principal') }}
              </div>
              <!-- Delete -->
              <button @click.prevent="removeImage(index)" class="absolute top-2 right-2 bg-white text-red-500 p-1.5 rounded-full shadow-sm hover:text-red-600 hover:bg-red-50 transition-colors z-10">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          </div>

          <div class="border-2 border-dashed rounded-xl p-8 text-center transition-colors border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-900/50 hover:border-gray-400 dark:hover:border-slate-500">
            <div class="flex flex-col items-center justify-center">
              <div class="w-16 h-16 bg-white dark:bg-slate-800 rounded-full shadow-sm border border-gray-200 dark:border-white/5 flex items-center justify-center mb-4">
                <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </div>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {{ $t('admin.add_image_desc', 'Ajoutez une image pour illustrer votre produit.') }}
              </p>
              <label class="cursor-pointer">
                <span class="px-5 py-2.5 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors shadow-sm inline-block">
                  {{ $t('admin.add_file', 'Ajouter un fichier') }}
                </span>
                <input type="file" class="sr-only" accept="image/*" @change="uploadImage" :disabled="uploadingImage" multiple>
              </label>
              <p class="text-xs text-foxer-orange mt-4 font-medium animate-pulse" v-if="uploadingImage">{{ $t('admin.uploading', 'Téléversement en cours...') }}</p>
            </div>
          </div>
        </div>

        <!-- Section: Tarification -->
        <div class="bg-white dark:bg-slate-800 shadow-sm rounded-xl border border-gray-200 dark:border-white/5 p-6 relative overflow-hidden">
          <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-emerald-500/10 to-transparent rounded-bl-full -z-10"></div>
          <h2 class="text-base font-bold text-gray-900 dark:text-white mb-6">{{ $t('admin.pricing', 'Tarification') }}</h2>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            <!-- Prix de base -->
            <div>
              <label class="block text-sm font-bold text-emerald-700 dark:text-emerald-400 mb-1">{{ $t('admin.price', 'Prix régulier') }} <span class="text-red-500">*</span></label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span class="text-emerald-600/50 font-bold">TL</span>
                </div>
                <input 
                  type="number" 
                  step="0.01"
                  v-model="basePrice" 
                  class="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-emerald-100 dark:border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-500/5 text-emerald-900 dark:text-emerald-100 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all font-bold text-lg"
                  placeholder="0.00"
                />
              </div>
            </div>

            <!-- Réduction -->
            <div>
              <label class="block text-sm font-bold text-rose-600 dark:text-rose-400 mb-1">{{ $t('admin.discount_percent', 'Réduction (Optionnelle)') }}</label>
              <div class="relative">
                <input 
                  type="number" 
                  min="0" max="100"
                  v-model="discountPercent" 
                  class="w-full pl-4 pr-10 py-3 rounded-xl border-2 border-rose-100 dark:border-rose-500/20 bg-rose-50/50 dark:bg-rose-500/5 text-rose-700 dark:text-rose-300 outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 transition-all font-bold text-lg"
                  :placeholder="$t('admin.discount_placeholder', 'Ex: 20')"
                />
                <div class="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                  <span class="text-rose-500 font-bold">%</span>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-gradient-to-r from-gray-900 to-gray-800 dark:from-slate-900 dark:to-slate-800 rounded-xl p-5 flex items-center justify-between text-white shadow-lg">
            <div>
              <p class="text-sm font-medium text-gray-300">{{ $t('admin.selling_price', 'Prix de vente final') }}</p>
              <p class="text-xs text-emerald-400 font-medium mt-1" v-if="discountPercent > 0">{{ $t('admin.customers_save', 'Vos clients économisent') }} {{ (basePrice * discountPercent / 100).toFixed(2) }} TL 🔥</p>
            </div>
            <div class="text-3xl font-bold text-white">
              {{ finalPrice }} <span class="text-base font-medium text-gray-400">TL</span>
            </div>
          </div>
        </div>

        <!-- Section: Traductions (Sorti de l'accordéon) -->
        <div class="bg-white dark:bg-slate-800 shadow-sm rounded-xl border border-gray-200 dark:border-white/5 overflow-hidden">
          <div class="p-6 border-b border-gray-200 dark:border-white/5 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-900/10 dark:to-indigo-900/10">
            <h2 class="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <svg class="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" /></svg>
              {{ $t('admin.international_translations', 'Traductions Internationales') }}
            </h2>
            <p class="text-sm text-gray-500 mt-1">{{ $t('admin.translate_product_desc', 'Traduisez votre produit pour toucher plus de clients.') }}</p>
          </div>
          
          <div class="p-6">
            <div class="flex flex-wrap gap-3 mb-6">
              <button 
                v-for="(lang, code) in { en: { name: $t('admin.lang_en', 'Anglais'), color: 'blue' }, tr: { name: $t('admin.lang_tr', 'Turc'), color: 'red' }, ar: { name: $t('admin.lang_ar', 'Arabe'), color: 'emerald' } }" 
                :key="code"
                @click="activeAdvLang = code"
                class="px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 border-2"
                :class="activeAdvLang === code 
                  ? `bg-${lang.color}-50 border-${lang.color}-500 text-${lang.color}-700 dark:bg-${lang.color}-500/10 dark:border-${lang.color}-500 dark:text-${lang.color}-400 shadow-sm` 
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 dark:bg-slate-800 dark:border-slate-600 dark:text-gray-400'"
              >
                {{ lang.name }}
              </button>
            </div>
            
            <div class="space-y-5 animate-fade-in">
              <div>
                <label class="block text-sm font-bold mb-1" :class="activeAdvLang === 'en' ? 'text-blue-700 dark:text-blue-400' : activeAdvLang === 'tr' ? 'text-red-700 dark:text-red-400' : 'text-emerald-700 dark:text-emerald-400'">{{ $t('admin.translated_title', 'Titre traduit') }}</label>
                <input type="text" v-model="translations[activeAdvLang].name" class="w-full px-4 py-3 rounded-xl border-2 bg-white dark:bg-slate-900 text-gray-900 dark:text-white outline-none transition-all"
                  :class="activeAdvLang === 'en' ? 'border-blue-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-blue-900/30' : activeAdvLang === 'tr' ? 'border-red-100 focus:border-red-500 focus:ring-4 focus:ring-red-500/10 dark:border-red-900/30' : 'border-emerald-100 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-emerald-900/30'"
                  :placeholder="$t('admin.name_placeholder', 'Nom dans cette langue...')"
                />
              </div>
              <div>
                <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">{{ $t('admin.short_desc', 'Résumé') }}</label>
                <textarea v-model="translations[activeAdvLang].shortDescription" rows="2" class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-white outline-none focus:border-gray-900 dark:focus:border-white transition-all"></textarea>
              </div>
              <div>
                <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">{{ $t('admin.html_desc', 'Description HTML') }}</label>
                <textarea v-model="translations[activeAdvLang].description" rows="4" class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-white outline-none focus:border-gray-900 dark:focus:border-white transition-all font-mono text-sm"></textarea>
              </div>
            </div>
          </div>
        </div>

        <!-- Paramètres Avancés (SEO & Tech) -->
        <div class="bg-white dark:bg-slate-800 shadow-sm rounded-xl border border-gray-200 dark:border-white/5 overflow-hidden">
          <button 
            @click="showAdvanced = !showAdvanced"
            class="w-full px-6 py-5 flex items-center justify-between bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
          >
            <span class="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /></svg>
              {{ $t('admin.technical_seo', 'Paramètres techniques & SEO') }}
            </span>
            <svg class="w-5 h-5 transition-transform duration-300 text-gray-400" :class="{'rotate-180': showAdvanced}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
          </button>
          
          <div v-show="showAdvanced" class="p-6 border-t border-gray-200 dark:border-white/5 space-y-6 bg-gray-50/50 dark:bg-slate-900/50">
            <!-- SEO -->
            <div>
              <h3 class="text-sm font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-wider">{{ $t('admin.seo_title', 'Référencement (SEO)') }}</h3>
              <div class="space-y-4">
                <div>
                  <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">{{ $t('admin.meta_title', 'Balise Titre (Meta Title)') }}</label>
                  <input type="text" v-model="translations.fr.metaTitle" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-white outline-none focus:ring-1 focus:ring-gray-900" :placeholder="$t('admin.meta_title_placeholder', 'Laissez vide pour utiliser le titre du produit')" />
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">{{ $t('admin.meta_description', 'Méta Description') }}</label>
                  <textarea v-model="translations.fr.metaDescription" rows="2" class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-white outline-none focus:ring-1 focus:ring-gray-900" :placeholder="$t('admin.meta_desc_placeholder', 'Description pour les moteurs de recherche')"></textarea>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

      <!-- Sidebar Column: Settings -->
      <div class="space-y-6">
        
        <!-- Visibilité -->
        <div class="bg-white dark:bg-slate-800 shadow-sm rounded-xl border border-gray-200 dark:border-white/5 p-6">
          <h3 class="text-base font-bold text-gray-900 dark:text-white mb-4">{{ $t('admin.product_status', 'Statut du produit') }}</h3>
          
          <div class="space-y-4">
            <div class="flex items-start justify-between">
              <div>
                <p class="text-sm font-bold text-gray-900 dark:text-white">{{ $t('admin.online_store', 'Boutique en ligne') }}</p>
                <p class="text-xs text-gray-500">{{ $t('admin.make_visible', 'Rendre visible aux clients') }}</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer mt-1">
                <input type="checkbox" v-model="productData.isActive" class="sr-only peer">
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-green-500"></div>
              </label>
            </div>
            
            <div class="flex items-start justify-between">
              <div>
                <p class="text-sm font-bold text-gray-900 dark:text-white">{{ $t('admin.popular', 'Populaire') }}</p>
                <p class="text-xs text-gray-500">{{ $t('admin.show_on_home', `Afficher sur la page d'accueil`) }}</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer mt-1">
                <input type="checkbox" v-model="productData.isFeatured" class="sr-only peer">
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-yellow-500"></div>
              </label>
            </div>
          </div>
        </div>

        <!-- Organisation -->
        <div class="bg-white dark:bg-slate-800 shadow-sm rounded-xl border border-gray-200 dark:border-white/5 p-6">
          <h3 class="text-base font-bold text-gray-900 dark:text-white mb-4">{{ $t('admin.organization', 'Organisation') }}</h3>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ $t('admin.category', 'Catégorie') }} <span class="text-red-500">*</span></label>
              <select 
                v-model="productData.categoryId" 
                class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-gray-900 transition-shadow text-sm"
              >
                <option :value="null">{{ $t('admin.select_category', 'Sélectionnez...') }}</option>
                <option v-for="cat in flatCategories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ $t('admin.brand', 'Marque') }}</label>
              <input 
                type="text" 
                v-model="productData.brand" 
                class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-gray-900 transition-shadow text-sm"
                :placeholder="$t('admin.brand_placeholder', 'Ex: Foxer')"
              />
            </div>
          </div>
        </div>

        <!-- Inventaire -->
        <div class="bg-white dark:bg-slate-800 shadow-sm rounded-xl border border-gray-200 dark:border-white/5 p-6">
          <h3 class="text-base font-bold text-gray-900 dark:text-white mb-4">{{ $t('admin.inventory_tracking', 'Inventaire & Suivi') }}</h3>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ $t('admin.quantity_stock', 'Quantité disponible') }} <span class="text-red-500">*</span></label>
              <input 
                type="number" 
                v-model="productData.stockQuantity" 
                class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-gray-900 transition-shadow text-sm"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Poids (g)</label>
              <input 
                type="number" 
                v-model="productData.weightGrams" 
                class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-gray-900 transition-shadow text-sm"
                placeholder="Ex: 360"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ $t('admin.sku_desc', 'SKU (Unité de gestion)') }}</label>
              <input 
                type="text" 
                v-model="productData.sku" 
                class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-gray-900 transition-shadow font-mono text-sm uppercase"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ $t('admin.slug_desc', 'Slug (URL du produit)') }}</label>
              <input 
                type="text" 
                v-model="productData.slug" 
                class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-gray-900 transition-shadow font-mono text-xs text-gray-500"
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import api from '@/api';

import { useI18n } from 'vue-i18n';

const slugify = (text) => {
  if (!text) return '';
  return text.toString().toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .replace(/[\s\W-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

const route = useRoute();
const router = useRouter();
const toast = useToast();
const { t } = useI18n();

const isEditing = computed(() => !!route.params.id);
const saving = ref(false);
const uploadingImage = ref(false);
const showAdvanced = ref(false);

const activeAdvLang = ref('en');

// Price Calculation Logic
const basePrice = ref(0);
const discountPercent = ref(0);
const finalPrice = ref(0);

watch([basePrice, discountPercent], ([newBase, newDiscount]) => {
  if (newBase > 0) {
    const calculated = newBase - (newBase * (newDiscount || 0) / 100);
    finalPrice.value = parseFloat(calculated.toFixed(2));
  } else {
    finalPrice.value = 0;
  }
});

const productData = ref({
  slug: '',
  sku: '',
  categoryId: null,
  brand: 'Foxer',
  stockQuantity: 10,
  weightGrams: null,
  isActive: true,
  isFeatured: false
});

const translations = ref({
  fr: { name: '', shortDescription: '', description: '', metaTitle: '', metaDescription: '' },
  en: { name: '', shortDescription: '', description: '', metaTitle: '', metaDescription: '' },
  tr: { name: '', shortDescription: '', description: '', metaTitle: '', metaDescription: '' },
  ar: { name: '', shortDescription: '', description: '', metaTitle: '', metaDescription: '' }
});

const productImages = ref([]);
const categories = ref([]);

const fetchCategories = async () => {
  try {
    const res = await api.get('/categories');
    if (res.data.status === 'success') {
      categories.value = res.data.categories || [];
    }
  } catch (error) {
    console.error('Error fetching categories:', error);
  }
};

const flatCategories = computed(() => {
  const flat = [];
  for (const cat of categories.value) {
    flat.push({ id: cat.id, name: cat.translations?.[0]?.name || cat.slug || 'Catégorie' });
    if (cat.children) {
      for (const child of cat.children) {
        flat.push({ id: child.id, name: '  └ ' + (child.translations?.[0]?.name || child.slug || 'Sous-catégorie') });
      }
    }
  }
  return flat;
});

const generateSlugIfEmpty = (langCode) => {
  if (langCode === 'fr' && !productData.value.slug && translations.value.fr.name) {
    productData.value.slug = slugify(translations.value.fr.name);
  }
  if (!productData.value.sku && translations.value[langCode].name) {
    const random = Math.floor(1000 + Math.random() * 9000);
    productData.value.sku = `FXR-${random}`;
  }
};

const uploadImage = async (event) => {
  const files = event.target.files;
  if (!files || files.length === 0) return;

  uploadingImage.value = true;
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await api.post('/admin/products/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.status === 'success') {
        productImages.value.push({ 
          url: res.data.imageUrl, 
          isPrimary: productImages.value.length === 0 
        });
        toast.success(t('admin.image_uploaded', { name: file.name }, 'Image uploadée avec succès'));
      } else {
        toast.error(t('admin.upload_error', { name: file.name }, "Erreur d'upload"));
      }
    } catch (error) {
      console.error('Upload Error:', error);
      toast.error(t('admin.upload_error', { name: file.name }, "Erreur d'upload"));
    }
  }
  
  uploadingImage.value = false;
  event.target.value = ''; // reset input
};

const setPrimaryImage = (index) => {
  productImages.value.forEach((img, i) => {
    img.isPrimary = i === index;
  });
};

const removeImage = (index) => {
  productImages.value.splice(index, 1);
  if (productImages.value.length > 0 && !productImages.value.some(img => img.isPrimary)) {
    productImages.value[0].isPrimary = true;
  }
};

const saveProduct = async () => {
  if (!productData.value.categoryId) {
    toast.error(t('admin.select_category_error', 'Veuillez sélectionner une catégorie.'));
    return;
  }
  if (!translations.value.fr.name || !translations.value.fr.description) {
    toast.error(t('admin.name_desc_error', 'Veuillez renseigner le nom et la description du produit.'));
    return;
  }
  if (productImages.value.length === 0) {
    toast.error(t('admin.one_image_error', 'Au moins une image est requise.'));
    return;
  }

  saving.value = true;
  try {
    const payload = {
      ...productData.value,
      priceTry: Number(finalPrice.value),
      compareAtPriceTry: discountPercent.value > 0 ? Number(basePrice.value) : null,
      stockQuantity: Number(productData.value.stockQuantity) || 0,
      weightGrams: productData.value.weightGrams ? Number(productData.value.weightGrams) : null,
      translations: Object.keys(translations.value)
        .map(lang => ({
          locale: lang,
          ...translations.value[lang]
        }))
        .filter(t => t.name.trim() !== ''),
      images: productImages.value
    };

    if (isEditing.value) {
      const res = await api.put(`/admin/products/${route.params.id}`, payload);
      if (res.data.status === 'success') {
        toast.success(t('admin.product_updated_success', 'Produit mis à jour avec succès !'));
        router.push('/admin/products');
      }
    } else {
      const res = await api.post('/admin/products', payload);
      if (res.data.status === 'success') {
        toast.success(t('admin.product_added_success', 'Produit ajouté au catalogue avec succès !'));
        router.push('/admin/products');
      }
    }
  } catch (error) {
    console.error('Save Product Error:', error);
    toast.error(t('admin.save_error', 'Erreur lors de la sauvegarde du produit.'));
  } finally {
    saving.value = false;
  }
};

const fetchProduct = async () => {
  try {
    const res = await api.get(`/admin/products/${route.params.id}`);
    if (res.data.status === 'success') {
      const p = res.data.data;
      
      productData.value = {
        slug: p.slug || '',
        sku: p.sku || '',
        categoryId: p.category?.id || null,
        brand: p.brand || '',
        stockQuantity: p.stockQuantity || 0,
        weightGrams: p.weightGrams || null,
        isActive: p.isActive !== false,
        isFeatured: p.isFeatured === true
      };
      
      basePrice.value = p.compareAtPriceTry || p.priceTry || 0;
      if (p.compareAtPriceTry && p.compareAtPriceTry > p.priceTry) {
        discountPercent.value = Math.round(((p.compareAtPriceTry - p.priceTry) / p.compareAtPriceTry) * 100);
      } else {
        discountPercent.value = 0;
      }

      if (p.images && p.images.length > 0) {
        productImages.value = p.images.map(img => ({
          url: img.url,
          isPrimary: img.isPrimary
        }));
      }

      if (p.translations) {
        p.translations.forEach(t => {
          if (translations.value[t.locale]) {
            translations.value[t.locale].name = t.name || '';
            translations.value[t.locale].shortDescription = t.shortDescription || '';
            translations.value[t.locale].description = t.description || '';
            translations.value[t.locale].metaTitle = t.metaTitle || '';
            translations.value[t.locale].metaDescription = t.metaDescription || '';
          }
        });
        
        if (!translations.value.fr.name && p.translations.length > 0) {
          translations.value.fr.name = p.translations[0].name || p.slug;
          translations.value.fr.description = p.translations[0].description || '';
        }
      }
    }
  } catch (error) {
    console.error('Error fetching product:', error);
    toast.error(t('admin.load_product_error', 'Erreur de chargement du produit'));
  }
};

onMounted(() => {
  fetchCategories();
  if (isEditing.value) {
    fetchProduct();
  }
});
</script>

<style>
/* Clean Shopify-like Quill UI */
.ql-editor {
  min-height: 250px;
  font-family: inherit;
  font-size: 0.875rem;
  line-height: 1.5;
}
.dark .ql-editor {
  color: #e5e7eb;
}
.ql-toolbar.ql-snow {
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
  padding: 8px 12px;
  border-color: #d1d5db !important;
  background-color: #f9fafb;
}
.ql-container.ql-snow {
  border-bottom-left-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
  border-color: #d1d5db !important;
}

/* Dark mode tweaks */
.dark .ql-toolbar.ql-snow {
  background-color: #1e293b;
  border-color: #475569 !important;
}
.dark .ql-container.ql-snow {
  border-color: #475569 !important;
}
.dark .ql-snow .ql-stroke { stroke: #9ca3af; }
.dark .ql-snow .ql-fill { fill: #9ca3af; }
.dark .ql-snow .ql-picker { color: #9ca3af; }
</style>
