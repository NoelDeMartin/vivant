<template>
    <div class="flex w-full flex-col items-center space-y-2">
        <button type="button" class="self-center rounded-lg bg-white p-2 text-gray-700" @click="big = !big">
            Toggle: {{ big ? 'Big' : 'Small' }}
        </button>
        <div
            v-animate-layout
            class="bg-vue flex items-center justify-center rounded font-semibold tracking-wider text-white"
            :class="big ? 'h-40 self-stretch' : 'size-40'"
        >
            <span>Some text</span>
        </div>
    </div>
</template>

<script lang="ts">
import { md } from '@/lib/markdown';

export const title = 'Layout Animations (with scale correction)';
export const description = md`
The \`v-animate-layout\` directive also supports scale correction for nested children.
`;
</script>

<script setup lang="ts">
import { ref } from 'vue';

const big = ref(false);
</script>
