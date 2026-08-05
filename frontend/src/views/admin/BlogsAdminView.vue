<template>
  <div class="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
    <!-- Page header -->
    <div class="sm:flex sm:justify-between sm:items-center mb-8">
      <div class="mb-4 sm:mb-0">
        <h1 class="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">Blogs</h1>
      </div>
      <div class="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
        <router-link to="/admin/blogs/new" class="btn bg-foxer-orange hover:bg-orange-600 text-white rounded-lg px-4 py-2 font-medium transition-colors flex items-center">
          <svg class="w-4 h-4 fill-current opacity-50 shrink-0 mr-2" viewBox="0 0 16 16">
            <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
          </svg>
          <span class="hidden xs:block ml-2">Add Blog</span>
        </router-link>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white dark:bg-slate-800 shadow-lg rounded-xl border border-gray-200 dark:border-slate-700 relative">
      <div class="overflow-x-auto">
        <table class="table-auto w-full dark:text-gray-300">
          <thead class="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700">
            <tr>
              <th class="px-4 py-4 whitespace-nowrap"><div class="font-semibold text-left">Title</div></th>
              <th class="px-4 py-4 whitespace-nowrap"><div class="font-semibold text-left">Author</div></th>
              <th class="px-4 py-4 whitespace-nowrap"><div class="font-semibold text-left">Status</div></th>
              <th class="px-4 py-4 whitespace-nowrap"><div class="font-semibold text-left">Views</div></th>
              <th class="px-4 py-4 whitespace-nowrap"><div class="font-semibold text-left">Date</div></th>
              <th class="px-4 py-4 whitespace-nowrap"><div class="font-semibold text-center">Actions</div></th>
            </tr>
          </thead>
          <tbody class="text-sm divide-y divide-gray-200 dark:divide-white/10">
            <tr v-if="loading">
              <td colspan="6" class="px-4 py-8 text-center text-gray-500">Loading blogs...</td>
            </tr>
            <tr v-else-if="blogs.length === 0">
              <td colspan="6" class="px-4 py-8 text-center text-gray-500">No blogs found.</td>
            </tr>
            <tr v-else v-for="blog in blogs" :key="blog.id" class="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
              <td class="px-4 py-3">
                <div class="flex items-center">
                  <div class="w-10 h-10 shrink-0 mr-3">
                    <img class="rounded-lg w-full h-full object-cover" :src="blog.featuredImage || 'https://foxersport.com/image/cache/catalog/blog1-600x400.jpg'" alt="Blog Image" />
                  </div>
                  <div class="font-medium text-gray-800 dark:text-gray-100 line-clamp-1 max-w-[200px]">{{ getTitle(blog) }}</div>
                </div>
              </td>
              <td class="px-4 py-3 whitespace-nowrap">
                <div class="text-left">{{ blog.author ? `${blog.author.firstName} ${blog.author.lastName}` : 'Admin' }}</div>
              </td>
              <td class="px-4 py-3 whitespace-nowrap">
                <div class="text-left">
                  <span class="inline-flex text-xs font-medium rounded-full px-2.5 py-0.5" 
                    :class="blog.isPublished ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'">
                    {{ blog.isPublished ? 'Published' : 'Draft' }}
                  </span>
                </div>
              </td>
              <td class="px-4 py-3 whitespace-nowrap">
                <div class="text-left font-medium">{{ blog.viewCount }}</div>
              </td>
              <td class="px-4 py-3 whitespace-nowrap">
                <div class="text-left">{{ new Date(blog.createdAt).toLocaleDateString() }}</div>
              </td>
              <td class="px-4 py-3 whitespace-nowrap transition-colors">
                <div class="flex flex-nowrap items-center justify-center space-x-2">
                  <router-link :to="`/admin/blogs/${blog.id}`" class="text-gray-400 hover:text-foxer-orange transition-colors">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                  </router-link>
                  <button @click="deleteBlog(blog.id)" class="text-gray-400 hover:text-red-500 transition-colors">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '@/api';
import { useToast } from 'vue-toastification';
import { useI18n } from 'vue-i18n';

const blogs = ref([]);
const loading = ref(true);
const toast = useToast();
const { locale } = useI18n();

const fetchBlogs = async () => {
  loading.value = true;
  try {
    const res = await api.get('/admin/blogs');
    if (res.data.status === 'success') {
      blogs.value = res.data.data;
    }
  } catch (error) {
    console.error('Error fetching blogs:', error);
    toast.error('Failed to load blogs');
  } finally {
    loading.value = false;
  }
};

const deleteBlog = async (id) => {
  if (!confirm('Are you sure you want to delete this blog?')) return;
  
  try {
    const res = await api.delete(`/admin/blogs/${id}`);
    if (res.data.status === 'success') {
      toast.success('Blog deleted successfully');
      fetchBlogs();
    }
  } catch (error) {
    console.error('Error deleting blog:', error);
    toast.error('Failed to delete blog');
  }
};

const getTitle = (blog) => {
  const t = blog.translations?.find(t => t.locale === locale.value);
  if (t && t.title) return t.title;
  const en = blog.translations?.find(t => t.locale === 'en');
  if (en && en.title) return en.title;
  return blog.translations?.[0]?.title || blog.slug;
};

onMounted(() => {
  fetchBlogs();
});
</script>
