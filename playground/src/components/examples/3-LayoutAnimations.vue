<template>
    <div class="flex flex-col space-y-2">
        <button
            class="flex w-24 items-center rounded-full bg-white p-1"
            :class="justifyStart ? 'justify-start' : 'justify-end'"
            type="button"
            @click="justifyStart = !justifyStart"
        >
            <div v-animate-layout class="bg-vue size-10 rounded-full" />
        </button>
    </div>
</template>

<script lang="ts">
import { md } from '@/lib/markdown';

export const title = 'Layout Animations';
export const description = md`
    Use \`v-animate-layout\` to animate changes in the layout, like
    [Framer Motion's Layout animations](https://www.framer.com/motion/layout-animations/).
`;
</script>

<script setup lang="ts">
import { ref } from 'vue';

const justifyStart = ref(true);
</script>
