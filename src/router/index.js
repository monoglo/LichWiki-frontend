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
    path: '/create/article',
    name: 'CreateArticlePage',
    component: () => import('../views/CreateArticlePage.vue')
  },
  {
    path: '/user/:user_name',
    name: 'UserPage',
    component: () => import('../views/UserPage.vue')
  },
  {
    path: '/article/:category_name/:article_name',
    name: 'ArticlePage',
    component: () => import('../views/ArticlePage.vue')
  },
  {
    path: '/article/:category_name/:article_name/source',
    name: 'ArticleSourcePage',
    component: () => import('../views/ArticleSourcePage.vue')
  },
  {
    path: '/article/:category_name/:article_name/edit',
    name: 'ArticleEditPage',
    component: () => import('../views/ArticleEditPage.vue')
  },
  {
    path: '/article/:category_name/:article_name/history',
    name: 'ArticleHistoryList',
    component: () => import('../views/ArticleHistoryList.vue')
  },
  {
    path: '/article/:category_name/:article_name/history/:article_history_id',
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
