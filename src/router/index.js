import Vue from 'vue'
import VueRouter from 'vue-router'
const login = () => import('../components/Login')



Vue.use(VueRouter)

const routes = [
  {
    path:'/',
    redirect:'/login'
  },
  {
    path:'/login',
    component:login
  },
  {
    path:'/home',
    component:() => import('../components/Home'),
    redirect:'/welcome',
    children:[
      {
        path:'/welcome',
        component:() => import('../components/Welcome')
      },
      {
        path:'/users',
        component:() => import('../components/Users')
      }
    ]
  }
]

const router = new VueRouter({
  routes
})


router.beforeEach((to,from,next)=>{
  if(to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if(!tokenStr) return next('/login')
  next()
})

export default router

