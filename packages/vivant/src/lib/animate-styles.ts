import {
    useMotion,
    useMotionControls,
    useMotionFeatures,
    useMotionTransitions,
    useMotionVariants,
} from '@vueuse/motion';
import { objectOnly } from '@noeldemartin/utils';
import { reactive, watch } from 'vue';
import type { AnimatableElement, AnimationConfig } from '@vivantjs/core';
import type { MotionInstance, MotionProperties, MotionVariants, TransitionDefinition } from '@vueuse/motion';
import type { Reactive } from 'vue';

import { getConfig } from 'vivant/config';

type CustomUpdate = (progress: number) => void;

const initialValues: MotionProperties = {
    x: 0,
    y: 0,
    rotate: 0,
    opacity: 1,
};

type CustomMotionInstance = MotionInstance<'initial', MotionVariants<'initial'>>;

function useCustomMotion(target: AnimatableElement, onUpdate: CustomUpdate): CustomMotionInstance {
    // This method is very similar to useMotion() from @vueuse/motion, but using 'custom' instead of other values.

    const variants = { initial: { custom: 0 } };
    const motionProperties = useCustomMotionProperties(onUpdate);
    const { variant, state } = useMotionVariants(variants);
    const controls = useMotionControls<'initial', MotionVariants<'initial'>>(
        motionProperties,
        variants,
        useMotionTransitions(),
    );

    const instance: CustomMotionInstance = {
        target,
        variant,
        variants,
        state,
        motionProperties,
        ...controls,
    };

    useMotionFeatures(instance);

    return instance;
}

function useCustomMotionProperties(onUpdate: (progress: number) => void): Reactive<MotionProperties> {
    let progress = 0;
    const properties = reactive<MotionProperties>({});

    watch(
        properties,
        (newValue) => {
            if (!('custom' in newValue) || progress === newValue.custom) {
                return;
            }

            progress = newValue.custom ?? 0;

            onUpdate(progress);
        },
        {
            immediate: true,
            deep: true,
        },
    );

    return properties;
}

export interface AnimateStylesConfig extends AnimationConfig {
    type?: 'spring' | 'inertia' | 'keyframe' | 'tween';
    initial?: MotionProperties;
    transition?: TransitionDefinition;
}

export default async function animateStyles(
    element: AnimatableElement,
    update: MotionProperties | CustomUpdate,
    config: AnimateStylesConfig = {},
): Promise<void> {
    const isCustomUpdate = typeof update === 'function';
    const { initial, transition, ...transitionProps } = {
        ...getConfig(element),
        ...config,
    };
    const { apply, stop } = isCustomUpdate
        ? useCustomMotion(element, update)
        : useMotion(element, {
            initial: {
                ...objectOnly(initialValues, Object.keys(update) as Array<keyof MotionProperties>),
                ...initial,
            },
        });

    await apply(
        isCustomUpdate
            ? { transition: transition ?? transitionProps, custom: 1 }
            : { transition: transition ?? transitionProps, ...update },
    );

    stop();
}

declare module '@vueuse/motion' {
    export interface TransformProperties {
        custom?: number;
    }
}
