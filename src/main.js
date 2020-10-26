import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入全局样式表
import './assets/css/globe.css'
// 引入treetable 第三方插件
import TreeTable from 'vue-table-with-tree-grid'
import axios from 'axios'
// axios.defaults.baseURL = 'http://timemeetyou.com:8889/api/private/v1/'
// 已经失效
// axios.defaults.baseURL = 'http://47.115.124.102:8888/api/private/v1/'
axios.defaults.baseURL = 'http://119.23.53.78:8888/api/private/v1/'

// 添加请求拦截器
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config;
})
Vue.prototype.$http = axios

Vue.config.productionTip = false
// 使用treetable 第三方插件，注册为全局组件
Vue.component('tree-table',TreeTable)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
