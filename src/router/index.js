import { createRouter, createWebHistory } from 'vue-router'
import RecordView from '@/views/RecordView'

const routes = [
  {
    path: '/',
    name: 'home',
    component: RecordView,
  },

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
