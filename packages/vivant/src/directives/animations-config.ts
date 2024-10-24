import type { Directive } from 'vue';

import { registerConfig, removeConfig } from 'vivant/config';

export default {
    created(element, { value: config }) {
        registerConfig(element, config);
    },
    unmounted(element) {
        removeConfig(element);
    },
} as Directive;
