import { watch } from 'vue';
import type { AnimatableElement } from '@vivantjs/core';
import type { MotionVariants, MotionInstance as VueUseMotionInstance } from '@vueuse/motion';
import type { Ref } from 'vue';

const motions: Map<AnimatableElement, MotionInstance> = new Map();

export type MotionInstance = VueUseMotionInstance<never, MotionVariants<never>>;

export function getAllMotions(): Map<AnimatableElement, MotionInstance> {
    return Object.freeze(motions);
}

export function getMotion(element: AnimatableElement): MotionInstance | undefined {
    return motions.get(element);
}

export function registerMotion(element: AnimatableElement, motion: MotionInstance): void {
    motions.set(element, motion);
}

export function removeMotion(element: AnimatableElement): void {
    motions.delete(element);
}

export async function waitMotionsEnter(element: Element): Promise<void> {
    await Promise.all(
        Array.from(getAllMotions().entries()).map(([motionElement, motionInstance]) => {
            if (motionElement !== element && !element.contains(motionElement) && !motionElement.contains(element)) {
                return;
            }

            const isAnimating = motionInstance.isAnimating as Ref<boolean>;

            if (!isAnimating.value) {
                return;
            }

            return new Promise<void>((resolve) => {
                const { stop } = watch(isAnimating, (isStillAnimating, _) => {
                    if (isStillAnimating) {
                        return;
                    }

                    resolve();
                    stop();
                });
            });
        }),
    );
}

export async function waitMotionsLeave(element: AnimatableElement): Promise<void> {
    await Promise.all(
        Array.from(getAllMotions().entries()).map(([motionElement, motionInstance]) => {
            if (motionElement !== element && !element.contains(motionElement)) {
                return;
            }

            return new Promise<void>((resolve) => motionInstance.leave(() => resolve()));
        }),
    );
}
