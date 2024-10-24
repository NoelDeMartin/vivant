import { isAnimatableElement } from '@vivantjs/core';
import type { AnimatableElement } from '@vivantjs/core';
import type { Directive } from 'vue';

import {
    layoutAnimatedElementEnter,
    layoutAnimatedElementLeave,
    layoutAnimatedElementUpdated,
} from 'vivant/layout-animations';

function guard(element: Element): element is AnimatableElement {
    if (!isAnimatableElement(element)) {
        // eslint-disable-next-line no-console
        console.warn('v-animate-layout can only be used in HTML and SVG elements');

        return false;
    }

    return true;
}

export default {
    mounted(element, _, node) {
        if (!guard(element)) {
            return;
        }

        layoutAnimatedElementEnter(element, node);
    },
    beforeUpdate(element) {
        if (!guard(element)) {
            return;
        }

        layoutAnimatedElementUpdated(element);
    },
    updated(element) {
        if (!guard(element)) {
            return;
        }

        layoutAnimatedElementUpdated(element);
    },
    beforeUnmount(element) {
        if (!guard(element)) {
            return;
        }

        layoutAnimatedElementLeave(element);
    },
} as Directive;
