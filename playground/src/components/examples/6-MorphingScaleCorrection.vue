<template>
    <div class="flex w-full flex-col items-center space-y-2">
        <button type="button" class="self-center rounded-lg bg-white p-2 text-gray-700" @click="big = !big">
            Toggle: {{ big ? 'Big' : 'Small' }}
        </button>
        <div
            v-if="big"
            v-animate-layout
            layout-id="square"
            class="bg-vue flex h-40 items-center justify-center self-stretch rounded text-center font-semibold tracking-wider text-white"
        >
            <span layout-id="text">Some text</span>
        </div>
        <div
            v-else
            v-animate-layout
            layout-id="square"
            class="bg-vue flex size-40 items-center justify-center rounded text-center font-semibold tracking-wider text-white"
        >
            <span layout-id="text">Some text</span>
        </div>
    </div>
</template>

<script lang="ts">
import { md } from '@/lib/markdown';

export const title = 'Morphing (with scale correction)';
export const description = md`
    You can also use the \`layout-id\` attribute in nested elements that are shared between two animated layouts.
`;
</script>

<script setup lang="ts">
import { ref } from 'vue';

const big = ref(false);
</script>
