import type { AnimationConfig } from '@vivantjs/core';
import type { Keyframes, MotionVariants, Spring, Transition, Tween } from '@vueuse/motion';

export function applyVariantsConfig(config: AnimationConfig, variants: MotionVariants<never>): void {
    for (const variant of Object.values(variants)) {
        const transition = (variant.transition ??= {});

        if (!hasTransitionDuration(transition)) {
            continue;
        }

        transition.duration ??= config?.duration;
    }
}

export function hasTransitionDuration(transition: Transition): transition is Tween | Spring | Keyframes {
    return !transition.type || transition.type !== 'inertia';
}
