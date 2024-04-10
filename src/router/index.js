import { createRouter, createWebHistory } from 'vue-router'
import PinsView from '@/views/PinsView';
import PinChatView from '@/views/PinChatView.vue';
import SettingView from '@/views/SettingView';

const routes = [
    {
        path: '/',
        redirect: { name: 'pins' },
    },
    {
        path: '/pins',
        name: 'pins',
        component: PinsView,
    },
    {
        path: '/pins/:id',
        name: 'pins-chat',
        component: PinChatView,
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

export default router;
