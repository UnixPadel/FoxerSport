<template>
  <div class="space-y-6 max-w-7xl mx-auto pb-12">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-white/10">
      <div class="flex items-center gap-4">
        <router-link to="/admin/campaigns" class="p-2 bg-gray-100 dark:bg-slate-800 text-gray-500 hover:text-foxer-orange rounded-xl transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </router-link>
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ isNew ? $t('admin.new_campaign', 'Nouvelle Campagne') : $t('admin.edit_campaign', 'Modifier la campagne') }}</h1>
          <p class="text-sm text-gray-500 mt-1">{{ $t('admin.campaign_desc', 'Créez votre communication personnalisée') }}</p>
        </div>
      </div>
      
      <div class="flex items-center gap-3 w-full sm:w-auto">
        <button @click="saveCampaign" :disabled="saving" class="flex-1 sm:flex-none px-6 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
          <svg v-if="saving" class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
          {{ $t('admin.save', 'Enregistrer') }}
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <!-- Left Column: Settings -->
      <div class="lg:col-span-1 space-y-6">
        <!-- Paramètres Généraux -->
        <div class="glass-card p-6 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900">
          <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-4">{{ $t('admin.settings', 'Paramètres') }}</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ $t('admin.campaign_name_star', 'Nom de la campagne *') }}</label>
              <input v-model="campaign.name" type="text" class="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-foxer-orange outline-none transition-shadow" :placeholder="$t('admin.campaign_name_placeholder', 'Ex: Soldes d\'Hiver')">
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ $t('admin.channel_star', 'Canal de diffusion *') }}</label>
              <select v-model="campaign.type" class="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-foxer-orange outline-none transition-shadow">
                <option value="email">{{ $t('admin.channel_email_only', 'Email Uniquement') }}</option>
                <option value="whatsapp">{{ $t('admin.channel_wa_only', 'WhatsApp Uniquement') }}</option>
                <option value="mixed">{{ $t('admin.channel_mixed', 'Email + WhatsApp') }}</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Audience -->
        <div class="glass-card p-6 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900">
          <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-4">{{ $t('admin.target_audience', 'Audience Cible') }}</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ $t('admin.who_receives', 'Qui doit recevoir cette campagne ?') }}</label>
              <div class="flex flex-col gap-2">
                <label class="flex items-center gap-3 p-3 border border-gray-200 dark:border-slate-700 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors" :class="{'bg-orange-50 border-foxer-orange dark:bg-orange-500/10 dark:border-orange-500': campaign.targetType === 'all'}">
                  <input type="radio" v-model="campaign.targetType" value="all" class="text-foxer-orange focus:ring-foxer-orange w-4 h-4">
                  <span class="text-sm font-medium text-gray-900 dark:text-white">{{ $t('admin.all_active_clients', 'Tous les clients actifs') }}</span>
                </label>
                <label class="flex items-center gap-3 p-3 border border-gray-200 dark:border-slate-700 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors" :class="{'bg-orange-50 border-foxer-orange dark:bg-orange-500/10 dark:border-orange-500': campaign.targetType === 'specific'}">
                  <input type="radio" v-model="campaign.targetType" value="specific" class="text-foxer-orange focus:ring-foxer-orange w-4 h-4">
                  <span class="text-sm font-medium text-gray-900 dark:text-white">{{ $t('admin.manual_selection', 'Sélection manuelle') }} ({{ campaign.targetIds.length }} sélectionnés)</span>
                </label>
              </div>
            </div>

            <!-- Specific Selection Visual -->
            <div v-if="campaign.targetType === 'specific'" class="mt-4 border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-slate-800">
              <div class="p-3 border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50">
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  </div>
                  <input v-model="userSearchQuery" type="text" class="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-foxer-orange outline-none transition-shadow" :placeholder="$t('admin.search_client', 'Chercher un client par nom ou email...')">
                </div>
              </div>
              <div class="max-h-64 overflow-y-auto">
                <div v-if="loadingUsers" class="p-4 text-center text-gray-500 text-sm">{{ $t('admin.loading_clients', 'Chargement des clients...') }}</div>
                <div v-else-if="filteredUsers.length === 0" class="p-4 text-center text-gray-500 text-sm">{{ $t('admin.no_client_found', 'Aucun client trouvé pour cette recherche') }}</div>
                <div v-else class="divide-y divide-gray-100 dark:divide-slate-700/50">
                  <label v-for="user in filteredUsers" :key="user.id" class="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors">
                    <input type="checkbox" :value="user.id" v-model="campaign.targetIds" class="text-foxer-orange focus:ring-foxer-orange rounded w-4 h-4">
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-medium text-gray-900 dark:text-white truncate">{{ user.firstName || 'Sans' }} {{ user.lastName || 'Nom' }}</p>
                      <p class="text-xs text-gray-500 truncate">{{ user.email }}</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- WhatsApp Editor -->
        <div v-if="['whatsapp', 'mixed'].includes(campaign.type)" class="glass-card p-6 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900">
          <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            {{ $t('admin.wa_message', 'Message WhatsApp') }}
          </h2>
          <div>
            <textarea v-model="campaign.waMessage" rows="5" class="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 outline-none transition-shadow" :placeholder="$t('admin.wa_placeholder', 'Bonjour {{firstName}}, profitez de nos soldes...')"></textarea>
            <p class="text-xs text-gray-500 mt-2">{{ $t('admin.wa_tip', 'Astuce: Utilisez *texte* pour mettre en gras, _texte_ pour l\'italique.') }}</p>
          </div>
        </div>
        
        <!-- Tester l'email -->
        <div v-if="['email', 'mixed'].includes(campaign.type)" class="glass-card p-6 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900">
          <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-4">{{ $t('admin.send_test', 'Envoyer un Test') }}</h2>
          <div class="space-y-3">
            <input v-model="testEmailAddress" type="email" class="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-foxer-orange outline-none transition-shadow" :placeholder="$t('admin.your_email', 'Votre adresse email...')">
            <button @click="sendTestEmail" :disabled="testingEmail" class="w-full px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:hover:bg-blue-500/20 font-bold rounded-xl transition-colors flex items-center justify-center gap-2">
              <svg v-if="testingEmail" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              {{ $t('admin.send_test_email', 'Envoyer l\'email de test') }}
            </button>
          </div>
        </div>

      </div>

      <!-- Right Column: Email Editor Pro -->
      <div v-if="['email', 'mixed'].includes(campaign.type)" class="lg:col-span-2 space-y-6">
        <div class="glass-card p-6 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900 h-full flex flex-col min-h-[800px]">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <h2 class="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              {{ $t('admin.email_editor', 'Éditeur d\'Email Pro') }}
            </h2>
            
            <div class="flex items-center gap-3 w-full sm:w-auto">
              <!-- Load Template Button -->
              <button @click="loadStarterTemplate" class="px-3 py-1.5 text-xs font-bold bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg transition-colors flex items-center gap-1.5">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                {{ $t('admin.template_pro', 'Template Pro') }}
              </button>
              
              <div class="flex-1">
                <input v-model="campaign.subject" type="text" class="w-full px-4 py-1.5 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-foxer-orange outline-none text-sm" :placeholder="$t('admin.email_subject_placeholder', 'Objet de l\'email...')">
              </div>
            </div>
          </div>
          
          <!-- Unlayer Editor Container -->
          <div class="flex-1 border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden bg-white">
            <EmailEditor 
              ref="emailEditorRef" 
              class="w-full h-full min-h-[700px]"
              v-on:load="editorLoaded" 
              v-on:ready="editorReady"
              :options="editorOptions"
            />
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { useI18n } from 'vue-i18n';
import api from '@/api';
import { EmailEditor } from 'vue-email-editor';

const route = useRoute();
const router = useRouter();
const toast = useToast();
const { t } = useI18n();

const isNew = computed(() => route.params.id === 'new');
const emailEditorRef = ref(null);
const saving = ref(false);

const allUsers = ref([]);
const loadingUsers = ref(false);
const userSearchQuery = ref('');

const filteredUsers = computed(() => {
  if (!userSearchQuery.value) return allUsers.value;
  const query = userSearchQuery.value.toLowerCase();
  return allUsers.value.filter(u => {
    const fullName = `${u.firstName || ''} ${u.lastName || ''}`.toLowerCase();
    const email = (u.email || '').toLowerCase();
    return fullName.includes(query) || email.includes(query);
  });
});

const testEmailAddress = ref('');
const testingEmail = ref(false);

const campaign = ref({
  name: '',
  type: 'email',
  targetType: 'all',
  targetIds: [],
  subject: '',
  waMessage: '',
  emailHtml: '',
  emailJson: null
});

// Editor Configuration
const editorOptions = {
  locale: 'fr',
  appearance: {
    theme: 'light'
  },
  features: {
    textEditor: {
      spellChecker: true,
      tables: true,
    },
    imageEditor: true
  }
};

let editorInstance = null;

const editorLoaded = (instance) => {
  editorInstance = instance;
};

const editorReady = () => {
  if (!isNew.value && campaign.value.emailJson) {
    editorInstance.loadDesign(campaign.value.emailJson);
  }

  // Register Custom Image Upload Callback
  editorInstance.registerCallback('image', async function(file, done) {
    const formData = new FormData();
    formData.append('image', file.attachments[0]);

    try {
      const { data } = await api.post('/admin/campaigns/upload-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      // Construct full URL since Unlayer requires absolute URLs
      const baseUrl = api.defaults.baseURL.replace('/api', '');
      done({ progress: 100, url: `${baseUrl}${data.imageUrl}` });
    } catch (error) {
      console.error('Image upload failed', error);
      toast.error(t('admin.upload_image_error', "Erreur lors de l'upload de l'image"));
      done({ progress: 100, url: '' });
    }
  });
};

const loadStarterTemplate = () => {
  if (!editorInstance) return;
  if (!confirm(t('admin.confirm_overwrite_template', "Voulez-vous écraser votre design actuel avec le template professionnel ?"))) return;
  
  // A clean basic template to get started easily
  const basicTemplate = {
    "counters": {
      "u_column": 1,
      "u_row": 1,
      "u_content_text": 1,
      "u_content_image": 1,
      "u_content_button": 1
    },
    "body": {
      "id": "starter-template",
      "rows": [
        {
          "id": "row-header",
          "cells": [1],
          "columns": [
            {
              "id": "col-1",
              "contents": [
                {
                  "id": "img-logo",
                  "type": "image",
                  "values": {
                    "src": { "url": "https://cdn.unlayer.com/assets/1597218650916-xxx.png", "width": 100, "height": 100 },
                    "containerPadding": "20px",
                    "textAlign": "center"
                  }
                },
                {
                  "id": "text-title",
                  "type": "text",
                  "values": {
                    "text": "<h1 style=\"text-align: center;\"><span style=\"font-family: 'Montserrat', sans-serif; font-size: 32px;\">Superbe Offre pour vous !</span></h1>",
                    "containerPadding": "10px"
                  }
                },
                {
                  "id": "text-desc",
                  "type": "text",
                  "values": {
                    "text": "<p style=\"text-align: center;\">Bonjour {{firstName}}, découvrez nos nouveautés de la semaine avec une remise exceptionnelle juste pour vous.</p>",
                    "containerPadding": "10px"
                  }
                },
                {
                  "id": "btn-action",
                  "type": "button",
                  "values": {
                    "text": "<span style=\"font-size: 16px;\">Découvrir l'offre</span>",
                    "href": { "name": "web", "values": { "href": "https://unixpadel.com" } },
                    "buttonColors": { "color": "#FFFFFF", "backgroundColor": "#F97316", "hoverColor": "#FFFFFF", "hoverBackgroundColor": "#EA580C" },
                    "borderRadius": "8px",
                    "containerPadding": "20px",
                    "textAlign": "center"
                  }
                }
              ],
              "values": { "backgroundColor": "", "padding": "0px", "border": {} }
            }
          ],
          "values": {
            "displayCondition": null,
            "columns": false,
            "backgroundColor": "",
            "columnsBackgroundColor": "",
            "backgroundImage": {
              "url": "",
              "fullWidth": true,
              "repeat": "no-repeat",
              "size": "custom",
              "position": "center"
            },
            "padding": "0px",
            "hideDesktop": false,
            "hideMobile": false,
            "noStackMobile": false
          }
        }
      ],
      "values": {
        "backgroundColor": "#F9FAFB",
        "linkStyle": {
          "body": true,
          "linkColor": "#0000ee",
          "linkHoverColor": "#0000ee",
          "linkUnderline": true,
          "linkHoverUnderline": true
        },
        "fontFamily": {
          "label": "Arial",
          "value": "arial,helvetica,sans-serif"
        }
      }
    }
  };
  
  editorInstance.loadDesign(basicTemplate);
  toast.success(t('admin.template_loaded', 'Template professionnel chargé !'));
};

const fetchUsers = async () => {
  loadingUsers.value = true;
  try {
    const { data } = await api.get('/admin/users?limit=1000'); // Fetch up to 1000 users for the campaign selection
    allUsers.value = data.data || data.users || data; 
  } catch (error) {
    console.error('Failed to load users:', error);
  } finally {
    loadingUsers.value = false;
  }
};

const loadCampaign = async () => {
  if (isNew.value) return;
  try {
    const { data } = await api.get(`/admin/campaigns/${route.params.id}`);
    campaign.value = { ...data };
    
    if (editorInstance && data.emailJson) {
      editorInstance.loadDesign(data.emailJson);
    }
  } catch (error) {
    toast.error(t('admin.load_error', 'Erreur de chargement'));
    router.push('/admin/campaigns');
  }
};

const extractEditorData = async () => {
  if (!emailEditorRef.value?.editor) return { html: '', design: null };
  return new Promise((resolve) => {
    emailEditorRef.value.editor.exportHtml((data) => {
      resolve({ html: data.html, design: data.design });
    });
  });
};

const sendTestEmail = async () => {
  if (!testEmailAddress.value) {
    return toast.error(t('admin.require_email', "Veuillez saisir votre adresse email pour le test."));
  }
  
  testingEmail.value = true;
  try {
    const { html } = await extractEditorData();
    await api.post('/admin/campaigns/test', {
      emailHtml: html,
      testEmail: testEmailAddress.value,
      subject: campaign.value.subject
    });
    toast.success(t('admin.test_email_sent', "Email de test envoyé avec succès !"));
  } catch (error) {
    toast.error(error.response?.data?.message || t('admin.test_email_error', "Erreur lors de l'envoi du test."));
  } finally {
    testingEmail.value = false;
  }
};

const saveCampaign = async () => {
  if (!campaign.value.name) {
    return toast.error(t('admin.require_campaign_name', 'Veuillez donner un nom à la campagne'));
  }

  saving.value = true;
  
  // Clean up IDs if not specific
  if (campaign.value.targetType !== 'specific') {
    campaign.value.targetIds = [];
  }

  try {
    if (['email', 'mixed'].includes(campaign.value.type)) {
      const { html, design } = await extractEditorData();
      campaign.value.emailHtml = html;
      campaign.value.emailJson = design;
    }

    if (isNew.value) {
      const { data } = await api.post('/admin/campaigns', campaign.value);
      toast.success(t('admin.campaign_created', 'Campagne créée avec succès'));
      router.push(`/admin/campaigns/${data.id}`);
    } else {
      await api.put(`/admin/campaigns/${route.params.id}`, campaign.value);
      toast.success(t('admin.campaign_saved', 'Campagne sauvegardée'));
    }
  } catch (error) {
    console.error(error);
    toast.error(t('admin.save_error', 'Erreur lors de la sauvegarde'));
  } finally {
    saving.value = false;
  }
};

onMounted(() => {
  fetchUsers();
  loadCampaign();
});
</script>
