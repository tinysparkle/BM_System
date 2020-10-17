import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/globe.css'

import axios from 'axios'
axios.defaults.baseURL = 'http://timemeetyou.com:8889/api/private/v1/'
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
