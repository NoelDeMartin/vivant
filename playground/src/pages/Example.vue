<template>
    <div class="flex grow flex-col items-center overflow-hidden pt-2">
        <h2 class="self-center text-3xl font-semibold tracking-wide text-slate-900">
            {{ example.title }}
        </h2>
        <MarkdownText v-if="example.description" class="prose-p:text-gray-500 mt-2 max-w-[800px]">
            {{ example.description }}
        </MarkdownText>
        <div class="relative isolate mt-4 flex grow self-stretch overflow-hidden rounded-lg bg-slate-700 text-white">
            <div class="absolute top-4 right-4 z-10 flex space-x-3">
                <a
                    :href="example.sourceUrl"
                    target="_blank"
                    class="flex size-12 items-center justify-center rounded-lg bg-white/10 hover:bg-white/20"
                    title="View source"
                >
                    <span class="sr-only">View source</span>
                    <i-zondicons-code class="h-6 w-6 text-white/50" />
                </a>
                <button
                    ref="$reloadButton"
                    type="button"
                    class="flex size-12 items-center justify-center rounded-lg bg-white/10 hover:bg-white/20"
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
        <footer>
            <MarkdownText v-if="example.footer" class="prose-sm prose-p:text-gray-500 pt-1">
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
const show = ref(true);
</script>
