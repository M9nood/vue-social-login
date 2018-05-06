import Vue from 'vue'
import Router from 'vue-router'
import auth from '@/auth'

import Home from '@/pages/Home'
import Auth from '@/pages/Auth'
import Dashboard from '@/pages/Dashboard'

Vue.use(Router)

var routes = [
  { path: '/home', name: 'home', component: Home },
  { path: '/auth', name: 'auth', component: Auth, meta: { guestOnly: true } },
  { path: '/dashboard', name: 'dashboard', component: Dashboard, meta: { requireAuth: true } },
  { path: '*', redirect: '/auth' }
]

const router = new Router({
  mode: 'history',
  routes
})

router.beforeEach((to, from, next) => {
  let currentUser = auth.user()
  let requireAuth = to.matched.some(record => record.meta.requireAuth)
  let guestOnly = to.matched.some(record => record.meta.guestOnly)

  if (requireAuth && !currentUser) next('auth')
  else if (guestOnly && currentUser) next('dashboard')
  else next()
})

export default router
