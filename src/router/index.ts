/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

import Index from '@/pages/index.vue'
// Composables
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Index
    },
  ]
})

export default router