<template>
    <div class="flex grow flex-col items-center overflow-hidden pt-2">
        <h2
            class="self-center text-balance text-center text-2xl font-semibold tracking-wide text-slate-900 md:text-3xl"
        >
            {{ example.title }}
        </h2>
        <AnimatedTransition>
            <div
                v-if="showMobileDescription"
                v-animate-fade
                class="fixed inset-0 z-20 bg-black/25 md:hidden"
                @click="showMobileDescription = false"
            />
        </AnimatedTransition>
        <AnimatedTransition>
            <MarkdownText
                v-if="example.description && showMobileDescription"
                v-animate
                :enter="isMobile && { transform: 'translateY(0%)', transition: { type: 'spring' } }"
                :leave="isMobile && { transform: 'translateY(100%)', transition: { type: 'spring' } }"
                :initial="isMobile && { transform: 'translateY(100%)', transition: { type: 'spring' } }"
                :duration="600"
                class="prose-p:text-gray-500 fixed right-0 -bottom-4 left-0 z-20 mt-2 max-w-[800px] rounded-t-2xl bg-white p-4 pb-8 shadow md:static md:z-0 md:block md:bg-none md:p-0 md:shadow-none"
            >
                {{ example.description }}
            </MarkdownText>
        </AnimatedTransition>
        <div
            class="relative isolate mt-4 flex grow self-stretch overflow-hidden rounded-lg bg-slate-700 text-white md:h-auto"
        >
            <div class="absolute top-4 right-4 z-10 flex space-x-3">
                <button
                    v-if="example.description"
                    type="button"
                    class="flex size-12 items-center justify-center rounded-lg bg-[#485466] hover:bg-[#5c6777] md:hidden"
                    title="Show description"
                    @click="showMobileDescription = true"
                >
                    <span class="sr-only">Show description</span>
                    <i-zondicons-information-solid class="h-6 w-6 text-white/50" />
                </button>
                <a
                    :href="example.sourceUrl"
                    target="_blank"
                    class="flex size-12 items-center justify-center rounded-lg bg-[#485466] hover:bg-[#5c6777]"
                    title="View source"
                >
                    <span class="sr-only">View source</span>
                    <i-zondicons-code class="h-6 w-6 text-white/50" />
                </a>
                <button
                    ref="$reloadButton"
                    type="button"
                    class="flex size-12 items-center justify-center rounded-lg bg-[#485466] hover:bg-[#5c6777]"
                    title="Reload"
                    @click="reload()"
                >
                    <span class="sr-only">Reload</span>
                    <i-zondicons-reload class="h-6 w-6 text-white/50" />
                </button>
            </div>
            <div class="flex grow flex-col items-center overflow-auto p-4 [&_>_*]:my-auto">
                <component :is="example.component" v-if="show" />
            </div>
        </div>
        <footer class="pt-2 sm:pt-4">
            <MarkdownText v-if="example.footer" class="prose-p:text-gray-500 text-xs md:text-sm">
                {{ example.footer }}
            </MarkdownText>
        </footer>
    </div>
</template>

<script setup lang="ts">
import { animateStyles } from 'vivant';
import { nextTick, ref, useTemplateRef } from 'vue';

import type { Example } from '@/lib/examples';

function reload() {
    const icon = $reloadButton.value?.querySelector('svg');

    icon && animateStyles(icon, { rotate: 360 }, { duration: 600 });

    show.value = false;

    nextTick(() => (show.value = true));
}

defineProps({
    example: { type: Object as () => Example, required: true },
});

const $reloadButton = useTemplateRef<HTMLElement>('$reloadButton');
const isMobile = window.innerWidth <= 768;
const showMobileDescription = ref(!isMobile);
const show = ref(true);
</script>
