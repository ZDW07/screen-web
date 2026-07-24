import { createApp } from 'vue'
import { setupStore } from './stores/index.ts'
import './utils/screen'
import App from './App.vue'
import { setupRouter } from './router/index.ts'
import '@unocss/reset/normalize.css'
import { setupElementPlus } from '@/plugins/elementPlus'
import './styles/index.less'
import 'virtual:uno.css'
const app = createApp(App)

;(function () {
  setupRouter(app)
  setupStore(app)
  setupElementPlus(app)
})()

app.mount('#app')
