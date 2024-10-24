<template>
    <header v-if="examplesReady" class="flex pt-4 text-center">
        <AppHeaderLink :example="examplesNavigation.previous" direction="backwards" />
        <div class="flex flex-col items-center" :class="example ? 'mt-0' : 'mt-20'">
            <AnimatedTransition
                enter-animation="verticalSlideIn"
                leave-animations="freeze,verticalSlideOut"
                :duration="300"
            >
                <FerrisWheel v-if="!example" class="size-40" />
            </AnimatedTransition>
            <h1 v-animate-layout class="mx-2 font-semibold tracking-tight" :class="example ? 'text-xl' : 'text-5xl'">
                <RouterLink
                    v-if="example"
                    to="/"
                    class="bg-ferris-gradient bg-clip-text text-transparent hover:border-b-2 hover:border-[#5c913b]"
                    @click="animationsDirection = 'backwards'"
                >
                    Vivant Playground
                </RouterLink>
                <span v-else class="bg-ferris-gradient bg-clip-text text-transparent"> Vivant Playground </span>
            </h1>
        </div>
        <AppHeaderLink :example="examplesNavigation.next" direction="forward" />
    </header>
</template>

<script setup lang="ts">
import { animationsDirection } from '@/lib/animations';
import { useCurrentExample, useExamplesNavigation, useExamplesReady } from '@/lib/examples';
import FerrisWheel from './FerrisWheel.vue';

const example = useCurrentExample();
const examplesReady = useExamplesReady();
const examplesNavigation = useExamplesNavigation();
</script>

<style scoped>
.bg-ferris-gradient {
    background-image: linear-gradient(to right, #3b94d9, #5c913b, #744eaa, #be1931);
    background-size: 200% 100%;
    animation: ferrisBackground 8s linear infinite;
}

@keyframes ferrisBackground {
    0% {
        background-position: 0% 0%;
    }
    50% {
        background-position: 100% 0%;
    }
    100% {
        background-position: 0% 0%;
    }
}
</style>
