<template>
    <button
        ref="$button"
        type="button"
        class="flex flex-col items-center pt-24 pb-4 md:pt-6"
        @click="scroll()"
    >
        <p>Scroll down!</p>
        <i-zondicons-arrow-down class="mt-2 size-5 animate-bounce" />
    </button>
    <AnimationsConfig class="flex flex-col space-y-4 self-stretch p-4" :duration="600">
        <FadeUp
            v-for="i in 100"
            :key="i"
            class="bg-vue flex h-20 items-center justify-center rounded p-2 text-lg font-semibold"
        >
            Item #{{ i }}
        </FadeUp>
    </AnimationsConfig>
</template>

<script lang="ts">
import { md } from '@/lib/markdown';

export const title = 'Element Variants';
export const description = md`
    With \`v-animate\`, you can also use the \`variant\` property to change the active variant declaratively.
`;
export const footer = md`
Example inspired by [Sam Selikoff](https://www.youtube.com/watch?v=GIIuG5_kyow)
`;
</script>

<script setup lang="ts">
import { useTemplateRef } from 'vue';

const $button = useTemplateRef('$button');

function scroll() {
    $button.value?.parentElement?.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
}
</script>
