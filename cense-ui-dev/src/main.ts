import './assets/main.css'
import 'https://kit.fontawesome.com/e5ed75a2a1.js'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import App from './App.vue'
import router from './router'
import vSelect from 'vs-vue3-select'
import Toast from 'vue-toastification'
import type { PluginOptions } from 'vue-toastification'
import 'vue-toastification/dist/index.css'

const app = createApp(App)
const pinia = createPinia()

pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(router)
app.component('VSelect', vSelect)
const toastOptions: PluginOptions = {
  timeout: 3000,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: 'button',
  icon: true,
}
app.use(Toast, toastOptions)

app.mount('#app')
