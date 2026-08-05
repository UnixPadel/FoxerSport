<template>
  <div class="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
    
    <!-- Page header -->
    <div class="mb-8 flex justify-between items-center">
      <h1 class="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
        {{ isEditing ? 'Edit Blog Post' : 'Create Blog Post' }}
      </h1>
      <button 
        @click="saveBlog" 
        :disabled="saving"
        class="btn bg-foxer-orange hover:bg-orange-600 text-white rounded-lg px-6 py-2 font-medium transition-colors shadow-lg disabled:opacity-50"
      >
        <span v-if="saving">Saving...</span>
        <span v-else>Save Post</span>
      </button>
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-3 gap-8">
      
      <!-- Main Column: Translations & Content -->
      <div class="xl:col-span-2 space-y-8">
        
        <!-- Language Tabs -->
        <div class="bg-white dark:bg-slate-800 shadow-lg rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden">
          <div class="border-b border-gray-200 dark:border-slate-700 px-6 py-4 flex space-x-4 overflow-x-auto">
            <button 
              v-for="lang in supportedLanguages" 
              :key="lang.code"
              @click="activeLang = lang.code"
              class="px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap"
              :class="activeLang === lang.code ? 'bg-foxer-orange text-white' : 'bg-gray-100 dark:bg-slate-900 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/5'"
            >
              {{ lang.name }}
            </button>
          </div>

          <!-- Translation Form Content -->
          <div class="p-6">
            <div class="space-y-6">
              
              <!-- Title -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title ({{ activeLang.toUpperCase() }}) <span class="text-red-500">*</span></label>
                <input 
                  type="text" 
                  v-model="currentTranslation.title" 
                  @input="generateSlugIfEmpty(activeLang)"
                  class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-foxer-orange focus:border-transparent outline-none transition-shadow"
                  placeholder="Enter blog title"
                />
              </div>

              <!-- Excerpt -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Excerpt</label>
                <textarea 
                  v-model="currentTranslation.excerpt" 
                  rows="3"
                  class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-foxer-orange focus:border-transparent outline-none transition-shadow"
                  placeholder="Short description for blog listing"
                ></textarea>
              </div>

              <!-- Content (Rich Text) -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Content <span class="text-red-500">*</span></label>
                <div class="rounded-lg border border-gray-300 dark:border-slate-700 overflow-hidden bg-white dark:bg-slate-900">
                  <QuillEditor
                    v-model:content="currentTranslation.content"
                    contentType="html"
                    theme="snow"
                    toolbar="full"
                    class="min-h-[400px] text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <hr class="border-gray-200 dark:border-slate-700 my-6" />

              <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200">SEO Meta Settings</h3>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Meta Title</label>
                <input 
                  type="text" 
                  v-model="currentTranslation.metaTitle" 
                  class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-foxer-orange focus:border-transparent outline-none transition-shadow"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Meta Description</label>
                <textarea 
                  v-model="currentTranslation.metaDescription" 
                  rows="2"
                  class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-foxer-orange focus:border-transparent outline-none transition-shadow"
                ></textarea>
              </div>

            </div>
          </div>
        </div>
      </div>

      <!-- Sidebar: General Info -->
      <div class="space-y-8">
        
        <!-- General Settings -->
        <div class="bg-white dark:bg-slate-800 shadow-lg rounded-xl border border-gray-200 dark:border-slate-700 p-6 space-y-6">
          <h2 class="text-lg font-bold text-gray-800 dark:text-gray-100">Publishing</h2>
          
          <div>
            <label class="flex items-center cursor-pointer group">
              <div class="relative">
                <input type="checkbox" v-model="blogForm.isPublished" class="sr-only" />
                <div class="block bg-gray-200 dark:bg-gray-700 w-14 h-8 rounded-full transition-colors group-hover:bg-gray-300 dark:group-hover:bg-gray-600" :class="{ 'bg-foxer-orange dark:bg-foxer-orange': blogForm.isPublished }"></div>
                <div class="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform" :class="{ 'transform translate-x-6': blogForm.isPublished }"></div>
              </div>
              <div class="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                {{ blogForm.isPublished ? 'Published' : 'Draft' }}
              </div>
            </label>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">URL Slug <span class="text-red-500">*</span></label>
            <input 
              type="text" 
              v-model="blogForm.slug" 
              class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-foxer-orange focus:border-transparent outline-none transition-shadow"
              placeholder="e.g. the-new-padel-rackets-2026"
            />
          </div>
        </div>

        <!-- Featured Image -->
        <div class="bg-white dark:bg-slate-800 shadow-lg rounded-xl border border-gray-200 dark:border-slate-700 p-6 space-y-6">
          <h2 class="text-lg font-bold text-gray-800 dark:text-gray-100">Featured Image</h2>
          
          <div v-if="blogForm.featuredImage" class="relative group rounded-lg overflow-hidden border border-gray-200 dark:border-slate-700">
            <img :src="blogForm.featuredImage" class="w-full h-auto object-cover" />
            <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button @click="removeImage" class="bg-red-500 text-white px-3 py-1 rounded shadow">Remove</button>
            </div>
          </div>
          
          <div v-else class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-foxer-orange dark:hover:border-foxer-orange transition-colors cursor-pointer" @click="triggerImageUpload">
            <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">Click to upload image</p>
            <input type="file" ref="fileInput" class="hidden" accept="image/*" @change="handleImageUpload" />
          </div>
          <div v-if="uploadingImg" class="text-sm text-foxer-orange text-center animate-pulse">Uploading...</div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '@/api';
import { useToast } from 'vue-toastification';
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';

const route = useRoute();
const router = useRouter();
const toast = useToast();

const isEditing = computed(() => route.params.id && route.params.id !== 'new');
const saving = ref(false);
const uploadingImg = ref(false);
const fileInput = ref(null);

const supportedLanguages = [
  { code: 'tr', name: 'Türkçe' },
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'Français' },
  { code: 'ar', name: 'العربية' }
];

const activeLang = ref('tr');

// Reactive state
const blogForm = ref({
  slug: '',
  isPublished: false,
  featuredImage: '',
  translations: {}
});

// Initialize translations structure
supportedLanguages.forEach(lang => {
  blogForm.value.translations[lang.code] = {
    locale: lang.code,
    title: '',
    excerpt: '',
    content: '',
    metaTitle: '',
    metaDescription: ''
  };
});

const currentTranslation = computed(() => blogForm.value.translations[activeLang.value]);

const generateSlug = (str) => {
  return str.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
};

const generateSlugIfEmpty = (langCode) => {
  if (langCode === 'en' || langCode === 'tr') { // Primary languages to base slug on
    if (!blogForm.value.slug && blogForm.value.translations[langCode].title) {
      blogForm.value.slug = generateSlug(blogForm.value.translations[langCode].title);
    }
  }
};

const triggerImageUpload = () => {
  fileInput.value.click();
};

const handleImageUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('image', file);

  uploadingImg.value = true;
  try {
    const res = await api.post('/admin/products/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    
    if (res.data.status === 'success') {
      blogForm.value.featuredImage = res.data.url;
      toast.success('Image uploaded successfully');
    }
  } catch (error) {
    console.error('Image upload error:', error);
    toast.error('Failed to upload image');
  } finally {
    uploadingImg.value = false;
    event.target.value = null; // reset
  }
};

const removeImage = () => {
  blogForm.value.featuredImage = '';
};

const fetchBlog = async () => {
  try {
    const res = await api.get(`/admin/blogs/${route.params.id}`);
    if (res.data.status === 'success') {
      const b = res.data.data;
      blogForm.value.slug = b.slug;
      blogForm.value.isPublished = b.isPublished;
      blogForm.value.featuredImage = b.featuredImage || '';
      
      if (b.translations && b.translations.length) {
        b.translations.forEach(t => {
          blogForm.value.translations[t.locale] = {
            locale: t.locale,
            title: t.title || '',
            excerpt: t.excerpt || '',
            content: t.content || '',
            metaTitle: t.metaTitle || '',
            metaDescription: t.metaDescription || ''
          };
        });
      }
    }
  } catch (error) {
    console.error('Error fetching blog:', error);
    toast.error('Failed to load blog data');
  }
};

const saveBlog = async () => {
  if (!blogForm.value.slug) {
    toast.error('URL Slug is required');
    return;
  }
  
  // Transform translations object to array for API
  const translationsArr = Object.values(blogForm.value.translations).filter(t => t.title || t.content);
  
  if (translationsArr.length === 0) {
    toast.error('At least one language title and content is required');
    return;
  }

  const payload = {
    slug: blogForm.value.slug,
    isPublished: blogForm.value.isPublished,
    featuredImage: blogForm.value.featuredImage,
    translations: translationsArr
  };

  saving.value = true;
  try {
    let res;
    if (isEditing.value) {
      res = await api.put(`/admin/blogs/${route.params.id}`, payload);
    } else {
      res = await api.post('/admin/blogs', payload);
    }
    
    if (res.data.status === 'success') {
      toast.success(isEditing.value ? 'Blog updated successfully' : 'Blog created successfully');
      router.push('/admin/blogs');
    }
  } catch (error) {
    console.error('Save error:', error);
    if (error.response?.data?.message) {
      toast.error(error.response.data.message);
    } else {
      toast.error('Failed to save blog');
    }
  } finally {
    saving.value = false;
  }
};

onMounted(() => {
  if (isEditing.value) {
    fetchBlog();
  }
});
</script>

<style>
/* Adjust quill editor height and dark mode */
.ql-editor {
  min-height: 400px;
}
.dark .ql-editor {
  color: #e5e7eb;
}
.dark .ql-toolbar {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.1) !important;
}
.dark .ql-container {
  border-color: rgba(255, 255, 255, 0.1) !important;
}
.dark .ql-snow .ql-stroke {
  stroke: #e5e7eb;
}
.dark .ql-snow .ql-fill {
  fill: #e5e7eb;
}
.dark .ql-snow .ql-picker {
  color: #e5e7eb;
}
.dark .ql-snow .ql-picker-options {
  background: #1f2937;
  border-color: rgba(255, 255, 255, 0.1);
}
</style>
