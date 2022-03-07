import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { OktaAuth } from '@okta/okta-auth-js'
import OktaVue, { LoginCallback } from '@okta/okta-vue'

Vue.use(VueRouter)

const oktaAuth = new OktaAuth({
  issuer: '<%= issuer %>',
  clientId: '<%= clientId %>',
  redirectUri: window.location.origin + '/callback',
  scopes: ['openid', 'profile', 'email']
})

Vue.use(OktaVue, { oktaAuth })

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/callback',
    component: LoginCallback
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
