import Vue from 'vue'
import VueRouter from 'vue-router'
// 路由懒加载
const Login = () => import('../components/Login.vue')
const Home = () => import('../components/Home.vue')
const Welcome = () => import('../components/Welcome.vue')
const Users  = () => import('../components/user/Users.vue')
const Rights = () => import('../components/power/Rights.vue')
const Roles = () => import('../components/power/Roles.vue')
const Cate = () => import('../components/goods/Cate.vue')
const Params = () => import('../components/goods/Params.vue')
const List = () => import('../components/goods/List.vue')
const Add = () => import('../components/goods/Add.vue')
const OrderList = () => import('../components/order/List.vue')
const Report = () => import('../components/report/Report.vue')
Vue.use(VueRouter)

const routes = [{
    path: "/",
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: '/',
    children: [{
        path: '/',
        component: Welcome
      },
      {
        path: '/users',
        component: Users
      },
      {
        path:'/rights',
        component:Rights
      },
      {
        path:'/roles',
        component:Roles
      },
      {
        path:'/categories',
        component:Cate
      },
      {
        path:'/params',
        component:Params
      },
      {
        path:'/goods',
        component:List
      },
      {
        path:'/goods/add',
        component:Add
      },
      {
        path:'/orders',
        component:OrderList
      },
      {
        path:'/reports',
        component:Report
      }
    ]
  },

]

const router = new VueRouter({
  // mode:'history',
  routes
})

// 添加路由导航守卫
router.beforeEach((to, from, next) => {
  // to 表示将要跳转得路径
  // from 表示从哪个路径跳转而来
  // next 是一个函数，表示放行
  if (to.path === '/login') return next();
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router