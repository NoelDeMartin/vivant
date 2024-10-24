import { arrayRemove } from '@noeldemartin/utils';

import { getSnapshot } from '@vivantjs/core/layout-animations';
import { setElementStyles } from '@vivantjs/core/lib/styles';

import type { AnimatableElement } from './AnimatableElement';

const animations: Record<string, Animation> = {
    freeze(element: AnimatableElement) {
        const bounds = getSnapshot(element)?.bounds ?? element.getBoundingClientRect();

        setElementStyles(element, {
            position: 'fixed',
            width: bounds.width,
            height: bounds.height,
            top: bounds.top,
            left: bounds.left,
        });
    },
};

const activeAnimations: Map<AnimatableElement, Promise<void>[]> = new Map();

export interface AnimationConfig {
    duration?: number;
}

export type Animation = (element: AnimatableElement, config: AnimationConfig) => Promise<void> | void;

export async function playAnimation(
    name: string,
    element: AnimatableElement,
    config: AnimationConfig = {},
): Promise<void> {
    const animation = animations[name];

    if (!animation) {
        return;
    }

    const elementAnimations = activeAnimations.get(element) ?? [];
    const animationPromise = Promise.resolve(animation(element, config));

    elementAnimations.push(animationPromise);
    activeAnimations.set(element, elementAnimations);

    await animationPromise;

    arrayRemove(elementAnimations, animationPromise);

    if (elementAnimations.length === 0) {
        activeAnimations.delete(element);
    }
}

export function defineAnimation(name: string, animation: Animation): void {
    animations[name] = animation;
}

export async function waitAnimations(element: AnimatableElement): Promise<void> {
    await Promise.all(
        Array.from(activeAnimations.entries()).map(([animatedElement, animationPromises]) => {
            if (
                animatedElement !== element &&
                !element.contains(animatedElement) &&
                !animatedElement.contains(element)
            ) {
                return;
            }

            return Promise.all(animationPromises);
        }),
    );
}
