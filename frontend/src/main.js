import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { MotionPlugin } from '@vueuse/motion'
import VueApexCharts from 'vue3-apexcharts'
import vue3GoogleLogin from 'vue3-google-login'
import App from './App.vue'
import router from './router'
import i18n from './i18n'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'

import './assets/css/tailwind.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(i18n)
app.use(MotionPlugin)
app.use(VueApexCharts)
app.use(Toast)
app.use(vue3GoogleLogin, {
  clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID_HERE'
})

app.mount('#app')
