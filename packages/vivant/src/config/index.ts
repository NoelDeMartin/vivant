import { isAnimatableElement } from '@vivantjs/core';
import type { AnimatableElement, AnimationConfig } from '@vivantjs/core';

import { getAllMotions } from 'vivant/motion/motions';
import { applyVariantsConfig } from 'vivant/motion/utils';

const configs: Map<Element, AnimationConfig> = new Map();

export function getConfig(element: AnimatableElement): AnimationConfig | undefined {
    for (const [configElement, config] of configs.entries()) {
        if (configElement !== element && !configElement.contains(element)) {
            continue;
        }

        return config;
    }
}

export function registerConfig(element: Element, config: AnimationConfig): void {
    configs.set(element, config);

    for (const [motionElement, motionInstance] of getAllMotions().entries()) {
        if (!isAnimatableElement(element) || !element.contains(motionElement)) {
            continue;
        }

        applyVariantsConfig(config, motionInstance.variants);
    }
}

export function removeConfig(element: Element): void {
    configs.delete(element);
}
