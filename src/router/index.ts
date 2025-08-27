import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('@/views/HomeView.vue')
    },
    {
      path: '/materials',
      name: 'Materials',
      component: () => import('@/views/MaterialsView.vue')
    },
    {
      path: '/materials/:id',
      name: 'MaterialDetail',
      component: () => import('@/views/MaterialDetailView.vue'),
      props: true
    },
    {
      path: '/admin',
      name: 'Admin',
      component: () => import('@/views/AdminView.vue')
    },
    {
      path: '/aurora-demo',
      name: 'AuroraDemo',
      component: () => import('@/components/AuroraDemo.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/views/NotFoundView.vue')
    }
  ]
})

export default router