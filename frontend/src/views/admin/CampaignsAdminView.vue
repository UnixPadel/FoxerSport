<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ $t('admin.campaigns_title', 'Campagnes Marketing') }}</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{ $t('admin.campaigns_subtitle', 'Gérez vos envois Email et WhatsApp') }}</p>
      </div>
      <router-link to="/admin/campaigns/new" class="inline-flex items-center gap-2 px-6 py-3 bg-foxer-orange hover:bg-orange-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-orange-500/30">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
        {{ $t('admin.new_campaign', 'Nouvelle Campagne') }}
      </router-link>
    </div>

    <!-- Campaigns List -->
    <div class="glass-card rounded-2xl border border-gray-200 dark:border-white/10 overflow-hidden bg-white dark:bg-slate-900 shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse text-sm">
          <thead>
            <tr class="bg-gray-50 dark:bg-slate-800/50 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider font-bold">
              <th class="p-4 pl-6">{{ $t('admin.campaign_name', 'Nom de la campagne') }}</th>
              <th class="p-4">{{ $t('admin.type', 'Type') }}</th>
              <th class="p-4">{{ $t('admin.target', 'Cible') }}</th>
              <th class="p-4">{{ $t('admin.status', 'Statut') }}</th>
              <th class="p-4">{{ $t('admin.created_at', 'Date de création') }}</th>
              <th class="p-4 pr-6 text-right">{{ $t('admin.actions', 'Actions') }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-white/5">
            <tr v-if="loading" v-for="i in 3" :key="i" class="animate-pulse">
              <td class="p-4 pl-6"><div class="h-5 bg-gray-200 dark:bg-slate-700 rounded w-48"></div></td>
              <td class="p-4"><div class="h-5 bg-gray-200 dark:bg-slate-700 rounded w-24"></div></td>
              <td class="p-4"><div class="h-5 bg-gray-200 dark:bg-slate-700 rounded w-24"></div></td>
              <td class="p-4"><div class="h-5 bg-gray-200 dark:bg-slate-700 rounded-full w-20"></div></td>
              <td class="p-4"><div class="h-5 bg-gray-200 dark:bg-slate-700 rounded w-32"></div></td>
              <td class="p-4 pr-6"><div class="h-8 bg-gray-200 dark:bg-slate-700 rounded w-24 ml-auto"></div></td>
            </tr>

            <tr v-else-if="campaigns.length === 0">
              <td colspan="6" class="p-12 text-center text-gray-500">
                <div class="w-16 h-16 mx-auto bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                  <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>
                </div>
                <p class="text-lg font-medium text-gray-900 dark:text-white">{{ $t('admin.no_campaigns', 'Aucune campagne') }}</p>
                <p class="text-sm mt-1">{{ $t('admin.create_first_campaign', 'Créez votre première campagne marketing pour commencer à communiquer avec vos clients.') }}</p>
              </td>
            </tr>

            <tr v-else v-for="campaign in campaigns" :key="campaign.id" class="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors group">
              <td class="p-4 pl-6">
                <div class="font-bold text-gray-900 dark:text-white">{{ campaign.name }}</div>
                <div class="text-xs text-gray-500 mt-1 truncate max-w-xs">{{ campaign.subject || $t('admin.no_subject', 'Sans objet') }}</div>
              </td>
              <td class="p-4">
                <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider" :class="getTypeColor(campaign.type)">
                  <svg v-if="campaign.type === 'email' || campaign.type === 'mixed'" class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  <svg v-if="campaign.type === 'whatsapp' || campaign.type === 'mixed'" class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  {{ campaign.type === 'mixed' ? 'Email + WA' : campaign.type }}
                </span>
              </td>
              <td class="p-4 text-gray-700 dark:text-gray-300">
                {{ campaign.targetType === 'all' ? $t('admin.all_clients', 'Tous les clients') : $t('admin.targeted_clients', { count: campaign._count?.targetIds || 0 }, '{count} clients ciblés') }}
              </td>
              <td class="p-4">
                <span class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border" :class="getStatusColor(campaign.status)">
                  {{ getStatusText(campaign.status) }}
                </span>
              </td>
              <td class="p-4 text-gray-500 dark:text-gray-400">
                {{ new Date(campaign.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }) }}
              </td>
              <td class="p-4 pr-6 transition-colors whitespace-nowrap">
                <div class="flex flex-nowrap items-center justify-end gap-2">
                  <button v-if="campaign.status === 'draft'" @click="sendCampaign(campaign)" class="p-2 text-white bg-foxer-orange hover:bg-orange-600 rounded-lg shadow-sm transition-colors" :title="$t('admin.send_now', 'Envoyer maintenant')">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                  </button>
                  <router-link :to="`/admin/campaigns/${campaign.id}`" class="p-2 text-gray-500 hover:text-foxer-orange bg-gray-100 dark:bg-slate-800 rounded-lg transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                  </router-link>
                  <button @click="deleteCampaign(campaign.id)" class="p-2 text-gray-500 hover:text-red-500 bg-gray-100 dark:bg-slate-800 rounded-lg transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
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
import { useToast } from 'vue-toastification';
import { useI18n } from 'vue-i18n';
import api from '@/api';

const toast = useToast();
const { t } = useI18n();
const campaigns = ref([]);
const loading = ref(true);

const fetchCampaigns = async () => {
  loading.value = true;
  try {
    const { data } = await api.get('/admin/campaigns');
    campaigns.value = data;
  } catch (error) {
    toast.error(t('admin.load_campaigns_error', 'Erreur lors du chargement des campagnes'));
  } finally {
    loading.value = false;
  }
};

const deleteCampaign = async (id) => {
  if (!confirm(t('admin.confirm_delete_campaign', 'Êtes-vous sûr de vouloir supprimer cette campagne ?'))) return;
  try {
    await api.delete(`/admin/campaigns/${id}`);
    toast.success(t('admin.campaign_deleted', 'Campagne supprimée'));
    fetchCampaigns();
  } catch (error) {
    toast.error(t('admin.delete_error', 'Erreur lors de la suppression'));
  }
};

const sendCampaign = async (campaign) => {
  if (!confirm(t('admin.confirm_send_campaign', { name: campaign.name }, 'Confirmer l\'envoi de la campagne "{name}" ? Cette action est irréversible.'))) return;
  try {
    await api.post(`/admin/campaigns/${campaign.id}/send`);
    toast.success(t('admin.campaign_sending', 'Envoi de la campagne en cours !'));
    fetchCampaigns();
  } catch (error) {
    toast.error(error.response?.data?.message || t('admin.send_error', 'Erreur lors de l\'envoi'));
  }
};

const getTypeColor = (type) => {
  switch (type) {
    case 'email': return 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400';
    case 'whatsapp': return 'bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400';
    case 'mixed': return 'bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400';
    default: return 'bg-gray-50 text-gray-600 dark:bg-gray-500/10 dark:text-gray-400';
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case 'draft': return 'bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-500/10 dark:text-gray-400 dark:border-gray-500/20';
    case 'sending': return 'bg-yellow-50 text-yellow-600 border-yellow-200 dark:bg-yellow-500/10 dark:text-yellow-400 dark:border-yellow-500/20';
    case 'completed': return 'bg-green-50 text-green-600 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20';
    case 'failed': return 'bg-red-50 text-red-600 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20';
    default: return '';
  }
};

const getStatusText = (status) => {
  const map = { draft: t('admin.draft', 'Brouillon'), sending: t('admin.sending', 'En cours'), completed: t('admin.completed', 'Terminé'), failed: t('admin.failed', 'Échoué') };
  return map[status] || status;
};

onMounted(() => {
  fetchCampaigns();
});
</script>
