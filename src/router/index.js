import { createRouter, createWebHistory } from 'vue-router';
const router = createRouter({
    history: createWebHistory('/'),
    routes: [
        {
            path: '/',
            name: 'Home',
            component: () => import(/* webpackChunkName: "home" */ '../views/Home/home.vue')
        },
    ]
});
export default router;
