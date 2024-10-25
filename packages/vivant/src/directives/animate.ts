import { isObject, noop, tap, uuid } from '@noeldemartin/utils';
import { MotionDirective, useMotion } from '@vueuse/motion';
import { ref, toRaw, unref } from 'vue';
import type { AnimatableElement } from '@vivantjs/core';
import type { Directive, DirectiveBinding, ObjectDirective, Ref, VNode } from 'vue';
import type { MotionInstanceBindings, MotionVariants } from '@vueuse/motion';

import { applyVariantsConfig, hasTransitionDuration } from 'vivant/motion/utils';
import { getConfig } from 'vivant/config';
import { getNodeProps, overrideDirectiveHook } from 'vivant/lib/utils';
import { getMotion, registerMotion, removeMotion } from 'vivant/motion/motions';
import { getTransitionConfig } from 'vivant/animations/transitions';

const motionState: MotionInstanceBindings<string, MotionVariants<never>> = {};
const transitionKeys = ['delay', 'duration'] as const;
const directivePropsKeys = [
    'initial',
    'enter',
    'leave',
    'visible',
    'visible-once',
    'visibleOnce',
    'hovered',
    'tapped',
    'focused',
    ...transitionKeys,
] as const;

function registerAnimatedElement(
    element: AnimatableElement,
    binding: DirectiveBinding,
    node: VNode,
    variants?: MotionVariants<never>,
    isPreset?: boolean,
) {
    // We default to uuid() instead of node.key because it was causing some unintended duplicated ids
    // with "_default0", not sure why.
    const key = binding.value && typeof binding.value === 'string' ? binding.value : uuid();
    const variantsObject = isPreset ? structuredClone(toRaw(variants) || {}) : variants || {};
    const variantsRef = ref(variantsObject) as Ref<MotionVariants<never>>;
    const motionOptions = {
        eventListeners: true,
        lifeCycleHooks: true,
        syncVariants: true,
        visibilityHooks: false,
    };

    if (typeof binding.value === 'object') {
        variantsRef.value = binding.value;
    }

    motionState[key]?.stop();

    resolveVariants(node, variantsRef);

    // Add contextual config, for example from <VivantConfig> or v-animations-config.
    resolveConfig(element, unref(variantsRef));

    // Ignore initial if transition demands it.
    if (getTransitionConfig(element)?.ignoreInitial) {
        delete variantsRef.value.initial;
    }

    motionState[key] = tap(useMotion(element, variantsRef, motionOptions), (motionInstance) => {
        // Register instance to keep track of all instances, even if they have the same key.
        registerMotion(element, motionInstance);

        // Update initial variant if set.
        updateVariant(element, node);

        element.motionInstance = motionInstance;
    });
}

function resolveVariants(node: VNode, variantsRef: Ref<MotionVariants<never>>) {
    // This method is pretty much the same as in @vueuse/motion, but adding the shorthands to a couple more variants.
    // See https://github.com/vueuse/motion/pull/184#issuecomment-2406633851

    const props = getNodeProps(node);

    if (!props) {
        return;
    }

    if (isObject(props.variants)) {
        variantsRef.value = {
            ...variantsRef.value,
            ...props.variants,
        };
    }

    for (let key of directivePropsKeys) {
        if (!props?.[key]) {
            continue;
        }

        if (transitionKeys.includes(key) && typeof props[key] === 'number') {
            for (const variantKey of ['enter', 'leave', 'visible', 'visibleOnce'] as const) {
                const variantConfig = variantsRef.value[variantKey];

                if (!variantConfig) {
                    continue;
                }

                const transition = (variantConfig.transition ??= {});

                if (key === 'duration' && !hasTransitionDuration(transition)) {
                    continue;
                }

                // @ts-expect-error `duration` does not exist on `inertia` type transitions
                transition[key] = props[key];
            }

            continue;
        }

        if (isObject(props[key])) {
            const prop = props[key];

            if (key === 'visible-once') {
                key = 'visibleOnce';
            }

            variantsRef.value[key as keyof MotionVariants<never>] = prop;
        }
    }
}

function updateVariant(element: AnimatableElement, node: VNode): void {
    const motion = getMotion(element);
    const props = getNodeProps(node);

    if (motion && props.variant && props.variant !== motion.variant.value) {
        motion.variant.value = props.variant;
    }
}

function resolveConfig(element: AnimatableElement, variants: MotionVariants<never>): void {
    const config = getConfig(element);

    if (!config) {
        return;
    }

    applyVariantsConfig(config, variants);
}

export function vivantDirective<T extends string>(
    variants?: MotionVariants<T>,
    isPreset?: boolean,
): Directive<AnimatableElement> {
    // This method redefines some functionality from the v-motion and preset directives from @vueuse/motion.

    const directive = MotionDirective(variants, isPreset) as ObjectDirective<AnimatableElement>;

    // We move the implementation of the created hook to mounted because the config
    // provided by <AnimationsConfig> or v-animations-config wouldn't be available yet.
    overrideDirectiveHook(directive, 'created', noop);

    overrideDirectiveHook(directive, 'mounted', (baseMounted, ...args) => {
        const [element, binding, node] = args;
        registerAnimatedElement(element, binding, node, variants, isPreset);
        baseMounted(...args);
    });

    overrideDirectiveHook(directive, 'unmounted', (baseUnmounted, ...args) => {
        const [element] = args;
        removeMotion(element);
        baseUnmounted(...args);
    });

    overrideDirectiveHook(directive, 'updated', (baseUpdated, ...args) => {
        const [element, , node] = args;

        baseUpdated(...args);
        updateVariant(element, node);
    });

    return directive;
}

export default vivantDirective();
