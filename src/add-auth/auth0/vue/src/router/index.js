import { createRouter, createWebHistory } from 'vue-router'
// import { authGuard } from '@auth0/auth0-vue'
import HomeView from '../views/HomeView.vue'

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
  // See https://github.com/auth0/auth0-vue#protect-a-route for how to add a navigation guard
  // Hint: add `beforeEnter: authGuard` to a route to protect it
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
