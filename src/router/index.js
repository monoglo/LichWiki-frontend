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
    path: '/message',
    name: 'MessageCenterPage',
    component: () => import('../views/user/MessageCenterPage.vue')
  },
  {
    path: '/create/article',
    name: 'CreateArticlePage',
    component: () => import('../views/create/CreateArticlePage.vue')
  },
  {
    path: '/user/:user_name',
    name: 'UserPage',
    component: () => import('../views/user/UserPage.vue')
  },
  {
    path: '/subject',
    name: 'SubjectListPage',
    component: () => import('../views/subject/SubjectListPage.vue')
  },
  {
    path: '/article/:category_name',
    name: 'ArticleListPage',
    component: () => import('../views/article/ArticleListPage.vue')
  },
  {
    path: '/article/:category_name/:article_name',
    name: 'ArticlePage',
    component: () => import('../views/article/ArticlePage.vue')
  },
  {
    path: '/article/:category_name/:article_name/source',
    name: 'ArticleSourcePage',
    component: () => import('../views/article/ArticleSourcePage.vue')
  },
  {
    path: '/article/:category_name/:article_name/edit',
    name: 'ArticleEditPage',
    component: () => import('../views/article/ArticleEditPage.vue')
  },
  {
    path: '/article/:category_name/:article_name/history',
    name: 'ArticleHistoryList',
    component: () => import('../views/article/ArticleHistoryList.vue')
  },
  {
    path: '/article/:category_name/:article_name/history/:article_history_id',
    name: 'ArticleHistoryPage',
    component: () => import('../views/article/ArticleHistoryPage.vue')
  },
  {
    path: '/article/:category_name/:article_name/history/:article_history_id/source',
    name: 'ArticleHistorySourcePage',
    component: () => import('../views/article/ArticleHistorySourcePage.vue')
  },
  {
    path: '/model/:category_name/:model_name',
    name: 'ModelDetailPage',
    component: () => import('../views/model/ModelDetailPage.vue')
  },
  {
    path: '/create/model',
    name: 'CreateModelPage',
    component: () => import('../views/create/CreateModelPage.vue')
  }
]

const router = new VueRouter({
  mode: process.env.IS_ELECTRON ? 'hash' : 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
