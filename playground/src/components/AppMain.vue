<template>
    <main class="flex w-full grow flex-col" :class="{ 'overflow-hidden': example }">
        <RouterView v-slot="{ Component, route }">
            <AnimatedTransition
                v-if="Component"
                enter-animation="horizontalSlideIn"
                leave-animations="freeze,horizontalSlideOut"
                :duration="PAGE_TRANSITION_DURATION"
            >
                <component :is="Component" :key="route.path" />
            </AnimatedTransition>
        </RouterView>
    </main>
</template>

<script setup lang="ts">
import { PAGE_TRANSITION_DURATION } from '@/lib/constants';
import { useCurrentExample } from '@/lib/examples';

const example = useCurrentExample();
</script>
