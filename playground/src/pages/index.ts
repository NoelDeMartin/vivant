import { createRouter, createWebHistory } from 'vue-router';
import { toString } from '@noeldemartin/utils';

import { examplePages } from '@/lib/examples';

import Home from './Home.vue';
import Example from './Example.vue';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            name: 'home',
            path: '/',
            component: Home,
        },
        {
            name: 'example',
            path: '/:example',
            component: Example,
            props: (route) => {
                const example = examplePages[toString(route.params.example)]?.example;

                return { example };
            },
            beforeEnter: (route) => {
                if (!(toString(route.params.example) in examplePages)) {
                    return { name: 'home' };
                }

                return true;
            },
        },
    ],
});

export default router;
