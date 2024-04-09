import { createRouter, createWebHistory } from 'vue-router'
import PinsView from '@/views/PinsView';
import SettingView from '@/views/SettingView'

const routes = [
  {
    path: '/',
    redirect: {name: 'pins'},
  },
  {
    path: '/pins',
    name: 'pins',
    component: PinsView,
  },
  {
    path: '/settings',
    name: 'settings',
    component: SettingView,
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
