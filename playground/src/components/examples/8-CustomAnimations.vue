<template>
    <AnimationsConfig class="flex grow flex-col self-stretch" :duration="600">
        <AnimatedTransition leave-animation="freeze" enter-from-class="max-h-0">
            <div
                v-if="!show"
                v-animate
                class="flex grow items-center justify-center"
                :enter="{ opacity: 1, y: 0, transition: { delay: 300 } }"
                :initial="{ opacity: 0, y: -30 }"
                :leave="{ opacity: 0, y: -30, transition: { duration: 300 } }"
            >
                <div
                    class="flex h-52 w-[500px] items-center justify-center rounded bg-yellow-300 text-2xl font-semibold text-yellow-700"
                >
                    Empty state
                </div>
            </div>
        </AnimatedTransition>
        <div class="flex flex-col has-[.completed-tasks-wrapper:not(.absolute)]:grow">
            <button
                v-animate-layout
                type="button"
                class="flex items-center self-start rounded-lg bg-white p-2 pr-4 text-gray-700"
                @click="show = !show"
            >
                <i-zondicons-cheveron-right
                    class="mr-1 size-6 transition-transform duration-500"
                    :class="{ 'rotate-90': show }"
                />
                <span>Toggle</span>
            </button>
            <AnimatedTransition
                enter-from-class="absolute bottom-0 h-0"
                leave-to-class="absolute bottom-0 h-0"
                @enter="toggleList($event)"
                @leave="toggleList($event)"
            >
                <div v-if="show" class="completed-tasks-wrapper overflow-hidden">
                    <ul class="mt-4 space-y-2">
                        <li
                            v-for="i in 30"
                            :key="i"
                            class="bg-vue flex h-20 items-center justify-center rounded p-2 text-lg font-semibold"
                        >
                            Item #{{ i }}
                        </li>
                    </ul>
                </div>
            </AnimatedTransition>
        </div>
        <div class="mt-4 flex h-10 items-center justify-center rounded bg-red-200 p-2 font-medium text-red-700">
            Footer
        </div>
    </AnimationsConfig>
</template>

<script lang="ts">
import { md } from '@/lib/markdown';

export const title = 'Custom Animations';
export const description = md`
    Some animations are too complicated to implement declaratively, and you'll need to write some code.
    In those situations, you can hook into the lifecycle of the built-in animations and use the underlying
    utilities to access to full power of the library. Some examples are \`getSnapshot()\` or \`animateStyles()\`.
`;
export const footer = md`
Example extracted from my app [Focus](https://focus.noeldemartin.com)
`;
</script>

<script setup lang="ts">
import { animateStyles } from 'vivant';
import { getPreviousSnapshot, getSnapshot } from '@vivantjs/core';
import { ref } from 'vue';
import { required, toString } from '@noeldemartin/utils';
import { resetElementStyles } from '@vivantjs/core/lib/styles';
import type { AnimatableElement } from '@vivantjs/core';

// Note: You can also find more custom animations in playground/src/lib/animations.ts

const show = ref(false);

function getComputedSize(element: HTMLElement, property: keyof CSSStyleDeclaration): number {
    return parseInt(toString(getComputedStyle(element)[property]));
}

async function toggleList($wrapper: AnimatableElement): Promise<void> {
    const $list = required($wrapper.firstElementChild as HTMLElement);
    const $footer = required($wrapper.parentElement?.nextElementSibling as HTMLElement);
    const $example = required($wrapper.parentElement?.parentElement?.parentElement as HTMLElement);
    const first = required(getPreviousSnapshot($wrapper)).bounds;
    const last = required(getSnapshot($wrapper)).bounds;
    const isGrowing = last.height > first.height;
    const visibleListHeight = Math.abs(first.top - last.top);
    const examplePadding = getComputedSize($example, 'paddingBottom');
    const footerOffset = $footer.clientHeight + examplePadding + getComputedSize($footer, 'marginTop');
    const listMarginTop = getComputedSize($list, 'marginTop');

    $wrapper.style.position = 'absolute';
    $wrapper.style.width = `${Math.max(first.width, last.width)}px`;
    $wrapper.style.height = '1px';
    $wrapper.style.bottom = '0';
    $wrapper.style.transformOrigin = 'bottom';
    $wrapper.style.willChange = 'transform';

    $list.style.marginTop = '0';
    $list.style.transformOrigin = 'top';
    $list.style.willChange = 'transform';

    $footer.style.willChange = 'transform';

    if (isGrowing) {
        $footer.style.position = 'absolute';
        $footer.style.bottom = `${examplePadding}px`;
        $footer.style.left = `${examplePadding}px`;
        $footer.style.right = `${examplePadding}px`;
    }

    // For some reason, the animation flickers in Firefox without this :/.
    if (isGrowing && navigator.userAgent.includes('Firefox')) {
        $list.classList.add('[&_li]:opacity-[0.98]');
    }

    await animateStyles($wrapper, (progress) => {
        progress = isGrowing ? progress : 1 - progress;

        const progressInverse = 1 - progress;
        const wrapperScale = progress * visibleListHeight;
        const wrapperTranslate = progressInverse * -footerOffset;
        const listScale = 1 / wrapperScale;
        const listTranslate = progressInverse * -visibleListHeight - wrapperTranslate + listMarginTop;
        const footerTranslate = progress * footerOffset;

        $wrapper.style.transform = `translateY(${wrapperTranslate}px) scaleY(${wrapperScale})`;
        $list.style.transform = `scaleY(${listScale}) translateY(${listTranslate}px)`;
        $footer.style.transform = `translateY(${footerTranslate}px)`;
    });

    resetElementStyles($wrapper);
    resetElementStyles($list);
    resetElementStyles($footer);
}
</script>
