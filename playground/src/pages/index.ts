import { createRouter, createWebHistory } from 'vue-router';
import { after, toString } from '@noeldemartin/utils';

import { examplePages } from '@/lib/examples';

import Home from './Home.vue';
import Example from './Example.vue';
import { PAGE_TRANSITION_DURATION } from '@/lib/constants';

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

let firstNavigation = true;
let isNavigating = false;

router.beforeEach(async () => {
    if (firstNavigation) {
        firstNavigation = false;

        return;
    }

    if (isNavigating) {
        await after({ ms: PAGE_TRANSITION_DURATION + 100 });
    }

    isNavigating = true;

    after({ ms: PAGE_TRANSITION_DURATION + 100 }).then(() => (isNavigating = false));
});

export default router;
