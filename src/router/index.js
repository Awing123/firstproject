import Vue from 'vue'
import VueRouter from 'vue-router'
import recommend from '../views/recommend.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'recommend',
    component: recommend
  },
  {
    path: '/hotRank',
    name: 'hotRank',
    component: () => import('../views/hotRank.vue')
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('../views/search.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
