import { stringMatch } from '@noeldemartin/utils';
import type { Directive } from 'vue';

import presets from 'vivant/motion/presets';
import { vivantDirective } from 'vivant/directives/animate';

const coreDirectives = Object.entries(
    import.meta.glob(['./*.ts'], { eager: true }) as Record<string, { default: Directive }>,
).reduce(
    (directives, [fileName, { default: directive }]) => {
        const matches = stringMatch<2>(fileName, /.*?([^/]+)\.ts/);

        if (matches) {
            directives[matches[1]] = directive;
        }

        return directives;
    },
    {} as Record<string, Directive>,
);

const presetDirectives = Object.entries(presets).reduce(
    (directives, [name, preset]) => {
        directives[`animate-${name}`] = vivantDirective(preset, true);

        return directives;
    },
    {} as Record<string, Directive>,
);

export default { ...coreDirectives, ...presetDirectives };
