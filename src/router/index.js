import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/test',
    name: 'Test',
    component: () => import('../views/Test.vue')
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/About.vue')
  },
  {
    path: '/page/:category_name/:article_name',
    name: 'ArticlePage',
    component: () => import('../views/ArticlePage.vue')
  },
  {
    path: '/page/:category_name/:article_name/source',
    name: 'ArticlePageSource',
    component: () => import('../views/ArticleSource.vue')
  },
  {
    path: '/page/:category_name/:article_name/history',
    name: 'ArticleHistoryList',
    component: () => import('../views/ArticleHistoryList.vue')
  },
  {
    path: '/page/:category_name/:article_name/history/:article_history_id',
    name: 'ArticleHistoryPage',
    component: () => import('../views/ArticleHistoryPage.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
