<template>
    <AnimationsConfig class="flex flex-col space-y-2" :duration="700">
        <button type="button" class="self-center rounded-lg bg-white p-2 text-gray-700" @click="show = !show">
            Toggle: {{ show ? 'Visible' : 'Hidden' }}
        </button>
        <div class="mt-10 size-40">
            <AnimatedTransition>
                <div
                    v-if="show"
                    v-animate
                    :initial="{ opacity: 0 }"
                    :enter="{ opacity: 1 }"
                    :leave="{ opacity: 0 }"
                    class="bg-vue h-full w-full rounded-full"
                />
            </AnimatedTransition>
        </div>
    </AnimationsConfig>
</template>

<script lang="ts">
import { md } from '@/lib/markdown';

export const title = 'Element Animations';
export const description = md`
    Use \`v-animate\` to animate element properties. It uses \`v-motion\` from
    [@vueuse/motion](https://motion.vueuse.org/features/directive-usage) under the hood,
    but it comes with some additional features. For example, wrap it with \`<AnimatedTransition>\`
    to animate \`leave\` transitions automatically, or put it inside \`<AnimationsConfig>\` to
    set animation options for all the descendants (including nested components!).
`;
</script>

<script setup lang="ts">
import { ref } from 'vue';

const show = ref(true);
</script>
