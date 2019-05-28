import Vue from 'vue'
import Router from 'vue-router'
import Page from './views/Page.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [{
    path: '/',
    name: 'page',
    component: Page
  }]
})