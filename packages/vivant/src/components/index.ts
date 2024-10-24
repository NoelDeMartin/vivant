import { stringMatch } from '@noeldemartin/utils';
import type { Component } from 'vue';

export default Object.entries(
    import.meta.glob(['./*.vue'], { eager: true }) as Record<string, { default: Component }>,
).reduce(
    (components, [fileName, { default: component }]) => {
        const matches = stringMatch<2>(fileName, /.*?([^/]+)\.vue/);

        if (matches) {
            components[matches[1]] = component;
        }

        return components;
    },
    {} as Record<string, Component>,
);
