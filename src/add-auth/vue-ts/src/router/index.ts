import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue';

// https://github.com/okta/okta-vue/issues/38
/*
import OktaVuePlugin from '@okta/okta-vue';

Vue.use(Router);
Vue.use(OktaVuePlugin, {
  issuer: '<%= issuer %>',
  clientId: '<%= clientId %>',
  redirectUri: window.location.origin + '/callback'
});
*/

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
  },
  //{ path: '/callback', component: OktaVuePlugin.handleCallback() },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
