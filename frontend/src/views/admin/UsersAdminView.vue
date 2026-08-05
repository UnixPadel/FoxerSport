<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div>
        <h1 class="text-3xl font-display font-bold text-gray-900 dark:text-white mb-1">{{ $t('admin.users_title') }}</h1>
        <p class="text-gray-500 dark:text-gray-400 text-sm">{{ $t('admin.users_desc') }}</p>
      </div>
      <button @click="showCreateModal = true" class="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-foxer-orange to-orange-600 hover:from-orange-500 hover:to-red-600 text-white rounded-xl font-bold shadow-lg shadow-foxer-orange/20 transition-all active:scale-95">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
        {{ $t('admin.new_user') }}
      </button>
    </div>

    <div class="glass-card rounded-[2rem] bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10 overflow-hidden shadow-sm">
      <!-- Controls -->
      <div class="p-6 border-b border-gray-200 dark:border-white/10 flex flex-col lg:flex-row gap-4 items-center justify-between bg-gray-50 dark:bg-slate-800">
        <div class="relative w-full lg:w-96">
          <input 
            type="text" 
            v-model="searchQuery"
            :placeholder="$t('admin.search_user')" 
            class="w-full pl-11 pr-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder-gray-400 focus:border-foxer-orange focus:ring-1 focus:ring-foxer-orange transition-all outline-none shadow-sm"
          >
          <svg class="w-5 h-5 text-gray-400 absolute left-4 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
        <div class="flex items-center gap-3 w-full lg:w-auto">
          <select v-model="selectedRole" class="w-full lg:w-auto px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white focus:border-foxer-orange focus:ring-1 focus:ring-foxer-orange outline-none shadow-sm">
            <option value="all">{{ $t('admin.all_roles') }}</option>
            <option value="admin">{{ $t('admin.admins') }}</option>
            <option value="customer">{{ $t('admin.clients') }}</option>
          </select>
        </div>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse text-xs whitespace-nowrap">
          <thead>
            <tr class="bg-gray-50 dark:bg-slate-900 text-gray-500 dark:text-gray-400 text-sm uppercase tracking-wider font-bold">
              <th class="p-2 pl-6">{{ $t('admin.user') }}</th>
              <th class="p-2">{{ $t('admin.email') }}</th>
              <th class="p-2">{{ $t('admin.role') }}</th>
              <th class="p-2">{{ $t('admin.status') }}</th>
              <th class="p-2">{{ $t('admin.registration_date') }}</th>
              <th class="p-2 pr-6 text-right">{{ $t('admin.actions') }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-white/5">
            <tr v-if="loading" v-for="i in 5" :key="i" class="animate-pulse">
              <td class="p-2 pl-6"><div class="flex items-center gap-3"><div class="w-10 h-10 bg-gray-200 dark:bg-white/5 rounded-full"></div><div class="h-6 bg-gray-200 dark:bg-white/5 rounded w-32"></div></div></td>
              <td class="p-2"><div class="h-6 bg-gray-200 dark:bg-white/5 rounded w-48"></div></td>
              <td class="p-2"><div class="h-6 bg-gray-200 dark:bg-white/5 rounded w-16"></div></td>
              <td class="p-2"><div class="h-6 bg-gray-200 dark:bg-white/5 rounded-full w-20"></div></td>
              <td class="p-2"><div class="h-6 bg-gray-200 dark:bg-white/5 rounded w-24"></div></td>
              <td class="p-2 pr-6"><div class="h-8 bg-gray-200 dark:bg-white/5 rounded-lg w-16 ml-auto"></div></td>
            </tr>
            
            <tr v-else-if="paginatedUsers.length === 0">
              <td colspan="6" class="p-12 text-center text-gray-500 dark:text-gray-400">
                <div class="w-16 h-16 mx-auto bg-gray-100 dark:bg-slate-900 rounded-full flex items-center justify-center mb-4">
                  <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                </div>
                {{ $t('admin.no_users_found', 'Aucun utilisateur ne correspond à ces critères.') }}
              </td>
            </tr>

            <tr v-else v-for="user in paginatedUsers" :key="user.id" class="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
              <td class="p-2 pl-6">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-gradient-to-tr from-foxer-orange to-red-500 flex items-center justify-center font-bold text-white shadow-lg shadow-foxer-orange/20">
                    {{ user.firstName?.charAt(0) || user.email?.charAt(0)?.toUpperCase() || 'U' }}
                  </div>
                  <div>
                    <p class="text-gray-900 dark:text-white font-bold">{{ user.firstName ? (user.firstName + ' ' + (user.lastName || '')) : $t('admin.no_name') }}</p>
                    <p class="text-xs text-gray-500">{{ user.phone || $t('admin.not_provided', 'Non renseigné') }}</p>
                  </div>
                </div>
              </td>
              <td class="p-2 text-gray-600 dark:text-gray-300">{{ user.email }}</td>
              <td class="p-2">
                <span class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider" :class="user.role?.toLowerCase() === 'admin' ? 'bg-purple-50 text-purple-600 border border-purple-200 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20' : 'bg-gray-100 text-gray-600 border border-gray-200 dark:bg-white/5 dark:text-gray-300 dark:border-white/10'">
                  {{ user.role }}
                </span>
              </td>
              <td class="p-2">
                <button 
                  @click="toggleUserStatus(user.id)"
                  class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider transition-colors"
                  :class="user.isActive !== false ? 'bg-green-50 hover:bg-green-100 text-green-600 border border-green-200 dark:bg-green-500/10 dark:hover:bg-green-500/20 dark:text-green-400 dark:border-green-500/20' : 'bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 dark:bg-red-500/10 dark:hover:bg-red-500/20 dark:text-red-400 dark:border-red-500/20'"
                >
                  {{ user.isActive !== false ? $t('admin.active', 'Actif') : $t('admin.inactive', 'Inactif') }}
                </button>
              </td>
              <td class="p-2 text-gray-500 dark:text-gray-400 text-sm">{{ new Date(user.createdAt).toLocaleDateString() }}</td>
              <td class="p-2 pr-6 text-right transition-colors whitespace-nowrap">
                <div class="flex flex-nowrap items-center justify-end gap-2">
                  <button @click="viewUser(user)" class="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-400/10 rounded-lg transition-colors" :title="$t('admin.view')">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Pagination -->
      <div class="p-2 border-t border-gray-200 dark:border-white/10 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-slate-800">
        <p>{{ $t('admin.page') }} {{ currentPage }} / {{ totalPages }} ({{ filteredUsers.length }} {{ $t('admin.user_count') }})</p>
        <div class="flex gap-2">
          <button 
            @click="currentPage = Math.max(1, currentPage - 1)" 
            :disabled="currentPage <= 1"
            class="px-3 py-1 rounded-lg bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors disabled:opacity-50"
          >{{ $t('admin.previous') }}</button>
          <button 
            @click="currentPage = Math.min(totalPages, currentPage + 1)" 
            :disabled="currentPage >= totalPages"
            class="px-3 py-1 rounded-lg bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors disabled:opacity-50"
          >{{ $t('admin.next') }}</button>
        </div>
      </div>
    </div>

    <!-- User Detail Modal -->
    <Teleport to="body">
      <div v-if="selectedUser" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" @click="selectedUser = null"></div>
        <div class="relative w-full max-w-lg bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-white/10 p-6 max-h-[90vh] overflow-y-auto">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-display font-bold text-gray-900 dark:text-white">{{ $t('admin.user_detail_title') }}</h3>
            <button @click="selectedUser = null" class="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center text-gray-500 hover:text-red-500 transition-colors">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <div class="flex items-center gap-4 mb-6">
            <div class="w-16 h-16 rounded-full bg-gradient-to-tr from-foxer-orange to-red-500 flex items-center justify-center font-bold text-white text-2xl shadow-lg shadow-foxer-orange/20">
              {{ selectedUser.firstName?.charAt(0) || 'U' }}
            </div>
            <div>
              <p class="text-xl font-bold text-gray-900 dark:text-white">{{ selectedUser.firstName }} {{ selectedUser.lastName }}</p>
              <p class="text-gray-500">{{ selectedUser.email }}</p>
            </div>
          </div>
          <div class="space-y-3 text-sm">
            <div class="flex justify-between py-2 border-b border-gray-100 dark:border-white/5">
              <span class="text-gray-500 font-bold">{{ $t('admin.role') }}</span>
              <span class="px-2 py-0.5 rounded-full text-xs font-bold uppercase" :class="selectedUser.role?.toLowerCase() === 'admin' ? 'bg-purple-100 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400' : 'bg-gray-100 text-gray-600 dark:bg-white/5 dark:text-gray-300'">{{ selectedUser.role }}</span>
            </div>
            <div class="flex justify-between py-2 border-b border-gray-100 dark:border-white/5">
              <span class="text-gray-500 font-bold">{{ $t('admin.status') }}</span>
              <span class="px-2 py-0.5 rounded-full text-xs font-bold" :class="selectedUser.isActive !== false ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'">{{ selectedUser.isActive !== false ? $t('admin.active', 'Actif') : $t('admin.inactive', 'Inactif') }}</span>
            </div>
            <div class="flex justify-between py-2 border-b border-gray-100 dark:border-white/5">
              <span class="text-gray-500 font-bold">{{ $t('admin.phone') }}</span>
              <span class="text-gray-900 dark:text-white">{{ selectedUser.phone || $t('admin.not_provided', 'Non renseigné') }}</span>
            </div>
            <div class="flex justify-between py-2 border-b border-gray-100 dark:border-white/5">
              <span class="text-gray-500 font-bold">{{ $t('admin.registered_on') }}</span>
              <span class="text-gray-900 dark:text-white">{{ new Date(selectedUser.createdAt).toLocaleString() }}</span>
            </div>
            <div class="flex justify-between py-2">
              <span class="text-gray-500 font-bold">ID</span>
              <span class="font-mono text-xs text-gray-600 dark:text-gray-400">{{ selectedUser.id }}</span>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Create User Modal -->
    <Teleport to="body">
      <div v-if="showCreateModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" @click="showCreateModal = false"></div>
        <div class="relative w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-white/10 p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-display font-bold text-gray-900 dark:text-white">{{ $t('admin.create_user_title') }}</h3>
            <button @click="showCreateModal = false" class="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center text-gray-500 hover:text-red-500 transition-colors">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <form @submit.prevent="createUser" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">{{ $t('admin.first_name') }}</label>
                <input v-model="newUser.firstName" type="text" required class="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white outline-none focus:border-foxer-orange" />
              </div>
              <div>
                <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">{{ $t('admin.last_name') }}</label>
                <input v-model="newUser.lastName" type="text" required class="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white outline-none focus:border-foxer-orange" />
              </div>
            </div>
            <div>
              <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">{{ $t('admin.email') }}</label>
              <input v-model="newUser.email" type="email" required class="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white outline-none focus:border-foxer-orange" />
            </div>
            <div>
              <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">{{ $t('admin.password') }}</label>
              <input v-model="newUser.password" type="password" required minlength="6" class="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white outline-none focus:border-foxer-orange" />
            </div>
            <div>
              <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">{{ $t('admin.role') }}</label>
              <select v-model="newUser.role" class="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white outline-none focus:border-foxer-orange">
                <option value="customer">{{ $t('admin.client_role') }}</option>
                <option value="admin">{{ $t('admin.admin_role') }}</option>
              </select>
            </div>
            <button type="submit" :disabled="creatingUser" class="w-full py-3 bg-gradient-to-r from-foxer-orange to-orange-600 hover:from-orange-500 hover:to-red-600 text-white rounded-xl font-bold shadow-lg shadow-foxer-orange/20 transition-all disabled:opacity-50">
              {{ creatingUser ? $t('admin.creating') : $t('admin.create_user_btn') }}
            </button>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useToast } from 'vue-toastification'
import api from '../../api'

import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const toast = useToast()
const users = ref([])
const loading = ref(true)
const selectedUser = ref(null)
const showCreateModal = ref(false)
const creatingUser = ref(false)

const searchQuery = ref('')
const selectedRole = ref('all')

// Pagination
const currentPage = ref(1)
const perPage = 15

const newUser = ref({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  role: 'customer'
})

const fetchUsers = async () => {
  loading.value = true
  try {
    const res = await api.get('/admin/users')
    if (res.data.status === 'success') {
      users.value = res.data.data || []
    }
  } catch (error) {
    console.error('Error fetching users:', error)
    toast.error(t('admin.load_error_users'))
  } finally {
    loading.value = false
  }
}

const toggleUserStatus = async (userId) => {
  try {
    const res = await api.patch(`/admin/users/${userId}/status`)
    if (res.data.status === 'success') {
      const userIndex = users.value.findIndex(u => u.id === userId)
      if (userIndex !== -1) {
        users.value[userIndex].isActive = !users.value[userIndex].isActive
      }
      toast.success(t('admin.user_status_changed'))
    }
  } catch (error) {
    console.error('Error toggling user status', error)
    toast.error(t('admin.status_change_error'))
  }
}

const createUser = async () => {
  creatingUser.value = true
  try {
    const res = await api.post('/admin/users', newUser.value)
    if (res.data.status === 'success') {
      toast.success(t('admin.user_created'))
      showCreateModal.value = false
      newUser.value = { firstName: '', lastName: '', email: '', password: '', role: 'customer' }
      fetchUsers()
    } else {
      toast.error(res.data.message || t('admin.create_error'))
    }
  } catch (error) {
    console.error(error)
    toast.error(error.response?.data?.message || t('admin.create_error'))
  } finally {
    creatingUser.value = false
  }
}

const viewUser = (user) => {
  selectedUser.value = user
}

const filteredUsers = computed(() => {
  currentPage.value = 1
  return users.value.filter(u => {
    if (selectedRole.value !== 'all' && u.role?.toLowerCase() !== selectedRole.value.toLowerCase()) {
      return false
    }
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase()
      const fullName = `${u.firstName || ''} ${u.lastName || ''}`.toLowerCase()
      const email = (u.email || '').toLowerCase()
      if (!fullName.includes(q) && !email.includes(q)) {
        return false
      }
    }
    return true
  })
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredUsers.value.length / perPage)))
const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * perPage
  return filteredUsers.value.slice(start, start + perPage)
})

onMounted(() => {
  fetchUsers()
})
</script>
