<template>
    <AnimationsConfig class="isolate flex max-h-[80vh] w-full justify-center overflow-y-auto" :duration="500">
        <ul
            role="list"
            class="mx-auto grid max-w-2xl grid-cols-1 gap-6 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-8"
        >
            <li v-for="pirate of crew" :key="pirate.id" class="[:has([data-morphing])]:z-10">
                <button
                    v-animate-layout
                    :layout-id="`wrapper-${pirate.id}`"
                    class="flex flex-col rounded-2xl bg-white py-10 px-8 text-gray-900"
                    type="button"
                    @click="activePirate = pirate"
                >
                    <img
                        :layout-id="`avatar-${pirate.id}`"
                        :src="`/img/mugiwara/${pirate.id}.webp`"
                        alt=""
                        class="mx-auto size-40 rounded-full"
                    >
                    <h3
                        :layout-id="`name-${pirate.id}`"
                        class="mt-6 self-center text-base font-semibold leading-7 tracking-tight"
                    >
                        {{ pirate.name }}
                    </h3>
                    <p :layout-id="`role-${pirate.id}`" class="self-center text-sm leading-6 text-gray-400">
                        {{ pirate.role }}
                    </p>
                </button>
            </li>
        </ul>
        <AnimatedTransition>
            <div
                v-if="activePirate"
                v-animate-fade
                class="absolute inset-0 bg-black/25"
                @click="activePirate = undefined"
            />
        </AnimatedTransition>
        <AnimatedTransition>
            <div v-if="activePirate" class="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div
                    v-animate-layout
                    :layout-id="`wrapper-${activePirate.id}`"
                    class="pointer-events-auto relative z-10 m-4 flex flex-col gap-4 rounded-2xl bg-white p-4 text-gray-900 sm:flex-row"
                >
                    <img
                        :layout-id="`avatar-${activePirate.id}`"
                        :src="`/img/mugiwara/${activePirate.id}.webp`"
                        alt=""
                        class="aspect-square w-52 flex-none self-center rounded-xl object-cover sm:self-start"
                    >
                    <div class="flex max-w-xl flex-auto flex-col">
                        <h3
                            :layout-id="`name-${activePirate.id}`"
                            class="self-center text-lg font-semibold leading-8 tracking-tight text-gray-900 sm:self-start"
                        >
                            {{ activePirate.name }}
                        </h3>
                        <p
                            :layout-id="`role-${activePirate.id}`"
                            class="self-center text-base leading-7 text-gray-500 sm:self-start"
                        >
                            {{ activePirate.role }}
                        </p>
                        <table v-animate-fade class="my-1">
                            <tbody>
                                <tr>
                                    <th>
                                        <div class="flex items-center space-x-2 py-2 pr-2">
                                            <i-fluent-thumb-like-16-filled class="size-4" />
                                            <span>Likes</span>
                                        </div>
                                    </th>
                                    <td class="p-2">
                                        {{ activePirate.likes }}.
                                    </td>
                                </tr>
                                <tr>
                                    <th>
                                        <div class="flex items-center space-x-2 py-2 pr-2">
                                            <i-fluent-thumb-dislike-16-filled class="size-4" />
                                            <span>Dislikes</span>
                                        </div>
                                    </th>
                                    <td class="p-2">
                                        {{ activePirate.dislikes }}.
                                    </td>
                                </tr>
                                <tr>
                                    <th>
                                        <div class="flex items-center space-x-2 py-2 pr-2">
                                            <i-streamline-sleep-solid class="size-4" />
                                            <span>Sleeps</span>
                                        </div>
                                    </th>
                                    <td class="p-2">
                                        {{ activePirate.sleeps }}.
                                    </td>
                                </tr>
                            </tbody>
                        </table>
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
export const footer = md`Example inspired by [Emil Kowalski](https://x.com/emilkowalski_/status/1775202396844535887)`;
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
