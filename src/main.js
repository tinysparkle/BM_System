import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入全局样式表
import './assets/css/globe.css'
// 引入treetable 第三方插件
import TreeTable from 'vue-table-with-tree-grid'
// 导入第三方富编辑器
import VueQuillEditor from 'vue-quill-editor'
// 导入富编辑器相关样式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

import axios from 'axios'
// axios.defaults.baseURL = 'http://timemeetyou.com:8889/api/private/v1/'
// 已经失效
// axios.defaults.baseURL = 'http://47.115.124.102:8888/api/private/v1/'
axios.defaults.baseURL = 'http://119.23.53.78:8888/api/private/v1/'

// 请求拦截器
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config;
})
Vue.prototype.$http = axios

Vue.config.productionTip = false
// 使用treetable 第三方插件，注册为全局组件
Vue.component('tree-table',TreeTable)
Vue.use(VueQuillEditor)
// 定义全局过滤器，过滤时间
Vue.filter('dateFormat',oriVal => {
  const dt = new Date(oriVal);
  const y = dt.getFullYear();
  // padStart函数第一个参数表示字符串共2位，不够两位头部补充0
  const m = (dt.getMonth()+1+'').padStart(2,'0');
  const d =( dt.getDay()+'').padStart(2,'0');
  const hh = (dt.getHours()+'').padStart(2,'0');
  const mm = (dt.getMinutes()+'').padStart(2,'0');
  const ss= (dt.getSeconds()+'').padStart(2,'0');

  return `${y}-${m}-${d}-${hh}-${mm}-${ss}`
})
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
