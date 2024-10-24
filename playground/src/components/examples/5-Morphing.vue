<template>
    <ul class="isolate flex items-center space-x-4">
        <li v-for="item of items" :key="item">
            <button type="button" class="relative py-3 px-4" @click="active = item">
                <div
                    v-if="active === item"
                    v-animate-layout
                    layout-id="highlight"
                    class="bg-vue absolute inset-0 rounded-lg"
                />
                <span class="relative z-10">{{ item }}</span>
            </button>
        </li>
    </ul>
</template>

<script lang="ts">
import { md } from '@/lib/markdown';

export const title = 'Morphing';
export const description = md`
    Using \`v-animate-layout\`, you can set \`layout-id\` in different elements to morph them
    into one another like [Framer Motion's Shared
    layout animations](https://www.framer.com/motion/layout-animations/#shared-layout-animations).
`;
</script>

<script setup lang="ts">
import { ref } from 'vue';

const items = ['One', 'Two', 'Three', 'Four'];
const active = ref(items[0]);
</script>
