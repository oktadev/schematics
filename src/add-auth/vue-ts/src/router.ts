import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import OktaVuePlugin from '@okta/okta-vue';

Vue.use(Router);
Vue.use(OktaVuePlugin, {
  issuer: '<%= issuer %>',
  client_id: '<%= clientId %>',
  redirect_uri: window.location.origin + '/callback'
});

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
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
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue'),
    },
    { path: '/callback', component: OktaVuePlugin.handleCallback() },
  ],
});

router.beforeEach(Vue.prototype.$auth.authRedirectGuard());

export default router;
