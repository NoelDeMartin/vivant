<template>
    <div
        class="flex flex-1 transition-opacity duration-[300ms]"
        :aria-hidden="example ? undefined : 'true'"
        :class="{
            'pointer-events-none h-0 w-0 opacity-0': !example,
            'h-auto overflow-hidden opacity-100': example,
            'justify-start': direction === 'backwards',
            'justify-end': direction === 'forward',
        }"
    >
        <AfterImage :wait="400">
            <RouterLink
                v-if="example"
                v-slot="{ href }"
                :to="{ name: 'example', params: { example: example.slug } }"
                custom
            >
                <a
                    :href="href"
                    class="flex h-7 items-center overflow-hidden text-sm text-gray-500 hover:text-gray-800"
                    @click.prevent="navigateToExample()"
                >
                    <i-zondicons-arrow-left v-if="direction === 'backwards'" class="mr-1.5 h-3 w-3 shrink-0" />
                    <AnimatedTransition
                        enter-animation="verticalSlideIn"
                        leave-animations="freeze,verticalSlideOut"
                        :duration="300"
                    >
                        <span :key="example.slug" class="truncate">
                            {{ example.title }}
                        </span>
                    </AnimatedTransition>
                    <i-zondicons-arrow-right v-if="direction === 'forward'" class="ml-1.5 h-3 w-3 shrink-0" />
                </a>
            </RouterLink>
        </AfterImage>
    </div>
</template>

<script setup lang="ts">
import { after } from '@noeldemartin/utils';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import { animationsDirection } from '@/lib/animations';
import { PAGE_TRANSITION_DURATION } from '@/lib/constants';
import { watchKeyboardShortcut } from '@/lib/keyboard';
import type { Example } from '@/lib/examples';

function navigateToExample() {
    if (!props.example || isNavigating.value) {
        return;
    }

    animationsDirection.value = props.direction;

    router.push({
        name: 'example',
        params: { example: props.example.slug },
    });
}

const props = defineProps({
    direction: {
        type: String as () => 'forward' | 'backwards',
        required: true,
    },
    example: {
        type: Object as () => Example,
        default: null,
    },
});
const router = useRouter();
const isNavigating = ref(false);

router.beforeEach(() => void (isNavigating.value = true));
router.afterEach(() => void after({ ms: PAGE_TRANSITION_DURATION }).then(() => (isNavigating.value = false)));

watchKeyboardShortcut(props.direction === 'forward' ? 'ArrowRight' : 'ArrowLeft', () => navigateToExample());
</script>
