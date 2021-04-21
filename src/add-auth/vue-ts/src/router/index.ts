import Vue from 'vue';
import Router from 'vue-router';
import Home from '../views/Home.vue';
import { OktaAuth } from '@okta/okta-auth-js';
import OktaVue, { LoginCallback } from '@okta/okta-vue';

Vue.use(Router)

const oktaAuth = new OktaAuth({
  issuer: '<%= issuer %>',
  clientId: '<%= clientId %>',
  redirectUri: window.location.origin + '/callback'
})

Vue.use(OktaVue, { oktaAuth })

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
    },
    {
      path: '/callback',
      component: LoginCallback
    }
  ]
})

export default router;
