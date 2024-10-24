<template>
    <Transition
        appear
        :enter-from-class="enterFromClass"
        :enter-to-class="enterToClass"
        :leave-from-class="leaveFromClass"
        :leave-to-class="leaveToClass"
        @appear="handleAppear"
        @enter="handleEnter"
        @leave="handleLeave"
    >
        <slot />
    </Transition>
</template>

<script setup lang="ts">
import { after } from '@noeldemartin/utils';
import { computed } from 'vue';
import { isAnimatableElement, playAnimation, recordSnapshot, waitAnimations } from '@vivantjs/core';
import type { AnimatableElement } from '@vivantjs/core';

import { playTransitionHook, setTransitionConfig } from 'vivant/animations/transitions';
import { waitMorphElementLeave } from 'vivant/layout-animations';
import { waitMotionsEnter, waitMotionsLeave } from 'vivant/motion/motions';
import type { TransitionHook } from 'vivant/animations/transitions';

const props = defineProps({
    appear: {
        type: Boolean,
        default: false,
    },
    duration: {
        type: Number,
        default: null,
    },
    enterAnimation: {
        type: String,
        default: '',
    },
    enterAnimations: {
        type: String,
        default: '',
    },
    leaveAnimation: {
        type: String,
        default: '',
    },
    leaveAnimations: {
        type: String,
        default: '',
    },
    enterFromClass: {
        type: String,
        default: undefined,
    },
    enterToClass: {
        type: String,
        default: undefined,
    },
    leaveFromClass: {
        type: String,
        default: undefined,
    },
    leaveToClass: {
        type: String,
        default: undefined,
    },
    onEnter: {
        type: Function,
        default: null,
    },
    onLeave: {
        type: Function,
        default: null,
    },
});
const freezesOnLeave = computed(() =>
    props.leaveAnimation.split(',').concat(props.leaveAnimations.split(',')).includes('freeze'));

async function playAnimations(element: AnimatableElement, animations: string): Promise<void> {
    if (!isAnimatableElement(element)) {
        return;
    }

    await Promise.all(
        animations.split(',').map((name) =>
            playAnimation(name, element, {
                duration: props.duration,
            })),
    );
}

async function recordSnapshotWhenReady(element: AnimatableElement): Promise<void> {
    await after({ ms: 100 });
    await Promise.all([waitMotionsEnter(element), waitAnimations(element)]);

    recordSnapshot(element);
}

function afterEnter(element: Element): void {
    if (!freezesOnLeave.value || !isAnimatableElement(element)) {
        return;
    }

    recordSnapshotWhenReady(element);
}

async function handleAppear(element: Element, done: Function): Promise<void> {
    if (!isAnimatableElement(element)) {
        done();

        return;
    }

    done();
    afterEnter(element);
    setTransitionConfig(element, { ignoreInitial: !props.appear });
}

async function handleEnter(element: Element, done: Function): Promise<void> {
    if (!isAnimatableElement(element)) {
        done();

        return;
    }

    await Promise.all([
        playTransitionHook(element, {
            hook: props.onEnter as TransitionHook,
            fromClass: props.enterFromClass,
            toClass: props.enterToClass,
        }),
        playAnimations(element, props.enterAnimation),
        playAnimations(element, props.enterAnimations),
    ]);

    done();
    afterEnter(element);
    setTransitionConfig(element, { ignoreInitial: false });
}

async function handleLeave(element: Element, done: Function): Promise<void> {
    if (!isAnimatableElement(element)) {
        done();

        return;
    }

    await Promise.all([
        waitMorphElementLeave(element),
        waitMotionsLeave(element),
        playTransitionHook(element, {
            hook: props.onLeave as TransitionHook,
            fromClass: props.leaveFromClass,
            toClass: props.leaveToClass,
        }),
        playAnimations(element, props.leaveAnimation),
        playAnimations(element, props.leaveAnimations),
    ]);

    done();
}
</script>
