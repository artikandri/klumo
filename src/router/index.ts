import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue';
import SearchView from '@/views/SearchView.vue';
import NotFoundView from '@/views/NotFoundView.vue';


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/search/:query',
      name: 'search',
      component: SearchView
    },
    {
      path: '/collections/:query',
      name: 'collections',
      component: SearchView
    },
    {
      path: "/:catchAll(.*)",
      name: "NotFound",
      component: NotFoundView
    }
  ]
})

export default router
