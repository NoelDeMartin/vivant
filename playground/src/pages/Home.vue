<template>
    <div class="flex flex-col items-center">
        <MarkdownText class="md:prose-lg mt-6 text-balance text-center leading-8 text-gray-600">
            [Vivant](https://github.com/NoelDeMartin/vivant) is an animation library for Vue, powered by
            [@vueuse/motion](https://motion.vueuse.org/), and supporting Layout animations like [Framer
            Motion](https://www.framer.com/motion/).

            <br>

            Check out these examples:
        </MarkdownText>
        <ul
            class="mt-2 grid w-full grid-cols-1 gap-4 pb-2 sm:pb-4 md:w-auto md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
            <li v-for="page of examplePages" :key="page.slug">
                <RouterLink
                    :to="page.slug"
                    class="flex h-full w-full items-center justify-center rounded bg-gray-100 py-8 px-4 text-center text-lg leading-relaxed tracking-wide hover:bg-gray-200"
                    @click="animationsDirection = 'forward'"
                >
                    <BalancedText>
                        {{ page.example.title }}
                    </BalancedText>
                </RouterLink>
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { animationsDirection } from '@/lib/animations';
import { examplePages } from '@/lib/examples';
</script>
