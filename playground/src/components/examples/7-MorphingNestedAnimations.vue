<template>
    <AnimationsConfig class="flex w-full justify-center" :duration="500">
        <ul
            role="list"
            class="mx-auto grid max-w-2xl grid-cols-1 gap-3 pt-16 sm:grid-cols-2 sm:pt-0 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-8"
        >
            <li v-for="pirate of crew" :key="pirate.id" class="w-full [:has([data-morphing])]:z-10">
                <button
                    v-animate-layout
                    :layout-id="`wrapper-${pirate.id}`"
                    class="flex w-full flex-row rounded-2xl bg-white py-6 px-4 text-gray-900 sm:flex-col sm:py-10 sm:px-8"
                    type="button"
                    @click="activePirate = pirate"
                >
                    <img
                        :layout-id="`avatar-${pirate.id}`"
                        :src="`${baseUrl}img/mugiwara/${pirate.id}.webp`"
                        alt=""
                        class="mx-auto size-20 rounded-full sm:size-40"
                    >
                    <div class="ml-4 flex grow flex-col items-center justify-center self-stretch sm:mt-6 sm:ml-0">
                        <h3
                            :layout-id="`name-${pirate.id}`"
                            class="self-center text-base font-semibold leading-7 tracking-tight text-gray-900"
                        >
                            {{ pirate.name }}
                        </h3>
                        <p :layout-id="`role-${pirate.id}`" class="self-center text-sm leading-6 text-gray-400">
                            {{ pirate.role }}
                        </p>
                    </div>
                </button>
            </li>
        </ul>
        <AnimatedTransition>
            <div
                v-if="activePirate"
                v-animate-fade
                class="fixed inset-0 z-20 bg-black/25"
                @click="activePirate = undefined"
            />
        </AnimatedTransition>
        <AnimatedTransition>
            <div v-if="activePirate" class="pointer-events-none fixed inset-0 z-20 flex items-center justify-center">
                <div
                    v-animate-layout
                    :layout-id="`wrapper-${activePirate.id}`"
                    class="pointer-events-auto relative z-10 m-4 flex flex-col gap-4 rounded-2xl bg-white p-4 text-gray-900 sm:flex-row"
                >
                    <img
                        :layout-id="`avatar-${activePirate.id}`"
                        :src="`${baseUrl}img/mugiwara/${activePirate.id}.webp`"
                        alt=""
                        class="size-32 flex-none self-center rounded-xl object-cover sm:size-52 sm:self-start"
                    >
                    <div class="flex max-w-xl flex-auto flex-col">
                        <h3
                            :layout-id="`name-${activePirate.id}`"
                            class="self-center text-xl font-semibold leading-8 tracking-tight text-gray-900 sm:self-start"
                        >
                            {{ activePirate.name }}
                        </h3>
                        <p
                            :layout-id="`role-${activePirate.id}`"
                            class="self-center text-lg leading-7 text-gray-400 sm:self-start"
                        >
                            {{ activePirate.role }}
                        </p>
                        <div
                            v-animate-fade
                            class="mt-2 grid items-start gap-y-1 [grid-template:'title'_'description'_'title'_'description'_'title'_'description'] sm:mt-4 sm:gap-x-4 sm:gap-y-2 sm:[grid-template:'title_description'_'title_description'_'title_description']"
                        >
                            <div class="flex items-center space-x-2 font-medium">
                                <i-fluent-thumb-like-16-filled class="size-4" />
                                <span>Likes</span>
                            </div>
                            <div class="text-gray-500">
                                {{ activePirate.likes }}.
                            </div>
                            <div class="mt-3 flex items-center space-x-2 font-medium sm:mt-0">
                                <i-fluent-thumb-dislike-16-filled class="size-4" />
                                <span>Dislikes</span>
                            </div>
                            <div class="text-gray-500">
                                {{ activePirate.dislikes }}.
                            </div>
                            <div class="mt-3 flex items-center space-x-2 font-medium sm:mt-0">
                                <i-streamline-sleep-solid class="size-4" />
                                <span>Sleeps</span>
                            </div>
                            <div class="text-gray-500">
                                {{ activePirate.sleeps }}.
                            </div>
                        </div>
                        <ul
                            v-animate-fade
                            role="list"
                            class="right-4 bottom-2 mt-4 flex justify-center gap-x-3 sm:absolute sm:mt-0 sm:justify-end"
                        >
                            <li>
                                <a
                                    :href="activePirate.fandomUrl"
                                    target="_blank"
                                    class="text-gray-400 hover:text-gray-500"
                                >
                                    <span class="sr-only">Fandom</span>
                                    <i-simple-icons-fandom class="h-8 w-6 pb-2" />
                                </a>
                            </li>
                            <li>
                                <a
                                    :href="activePirate.myAnimeListUrl"
                                    target="_blank"
                                    class="text-gray-400 hover:text-gray-500"
                                >
                                    <span class="sr-only">MyAnimeList</span>
                                    <i-simple-icons-myanimelist class="h-8 w-8" />
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </AnimatedTransition>
    </AnimationsConfig>
</template>

<script lang="ts">
import { md } from '@/lib/markdown';

export const title = 'Morphing (with nested animations)';
export const description = md`
    You can combine \`v-animate-layout\` and \`v-animate\` to orchestrate complex animations.
`;
export const footer = md`
Example inspired by [Emil Kowalski](https://x.com/emilkowalski_/status/1775202396844535887)
`;
</script>

<script setup lang="ts">
import { ref } from 'vue';

interface Pirate {
    id: string;
    name: string;
    laugh?: string;
    role: string;
    likes: string;
    dislikes: string;
    sleeps: string;
    fandomUrl: string;
    myAnimeListUrl: string;
}

const activePirate = ref<Pirate>();
const baseUrl = import.meta.env.BASE_URL;
const crew: Pirate[] = [
    {
        id: 'luffy',
        name: 'Monkey D. Luffy',
        role: 'Captain',
        likes: 'All kinds of meat',
        dislikes: 'Cherry pie from a "certain place"',
        sleeps: 'No set time (~5 hours)',
        fandomUrl: 'https://onepiece.fandom.com/wiki/Monkey_D._Luffy',
        myAnimeListUrl: 'https://myanimelist.net/character/40/Luffy_Monkey_D',
    },
    {
        id: 'zoro',
        name: 'Roronoa Zoro',
        role: 'Swordsman',
        likes: 'White rice, Sea Beast meat, and likes that complements sake',
        dislikes: 'Chocolate (It\'s too sweet)',
        sleeps: '4 am to 7 am (3 hours) (+naps)',
        fandomUrl: 'https://onepiece.fandom.com/wiki/Roronoa_Zoro',
        myAnimeListUrl: 'https://myanimelist.net/character/62/Zoro_Roronoa',
    },
    {
        id: 'nami',
        name: 'Nami',
        role: 'Navigator',
        likes: 'Mainly tangerines and other kinds of fruits',
        dislikes: 'Orangette (Prefers actual fruit)',
        sleeps: '11 pm to 7 am (8 hours)',
        fandomUrl: 'https://onepiece.fandom.com/wiki/Nami',
        myAnimeListUrl: 'https://myanimelist.net/character/723/Nami',
    },
    {
        id: 'usopp',
        name: 'Usopp',
        role: 'Sniper',
        likes: 'Pike from an autumn island and other fish of the season',
        dislikes: 'Mushrooms (Got sick once)',
        sleeps: '1 am to 8 am (7 hours)',
        fandomUrl: 'https://onepiece.fandom.com/wiki/Usopp',
        myAnimeListUrl: 'https://myanimelist.net/character/724/Usopp',
    },
    {
        id: 'sanji',
        name: 'Sanji',
        role: 'Cook',
        likes: 'Spicy sealikes pasta and likes that complements black tea',
        dislikes: 'Konjac (Not nutritious)',
        sleeps: '12 am to 5 am (5 hours)',
        fandomUrl: 'https://onepiece.fandom.com/wiki/Sanji',
        myAnimeListUrl: 'https://myanimelist.net/character/305/Sanji',
    },
];
</script>
