import { defineAnimation } from '@vivantjs/core';
import type { Animation } from '@vivantjs/core';
import type { Plugin } from 'vue';

import components from './components';
import directives from './directives';

export interface Options {
    animations?: Record<string, Animation>;
}

export default function vivant(options: Options = {}): Plugin {
    return {
        install(app) {
            Object.entries(directives).forEach(([name, directive]) => app.directive(name, directive));
            Object.entries(components).forEach(([name, component]) => app.component(name, component));
            Object.entries(options.animations ?? {}).forEach(([name, animation]) => defineAnimation(name, animation));
        },
    } as Plugin;
}
