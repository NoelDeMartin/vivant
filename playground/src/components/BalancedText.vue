<template>
    <template v-for="(line, i) of lines" :key="i">
        {{ line }} <br>
    </template>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { VNode } from 'vue';

import { renderNode } from '@/lib/vue';

const slots = defineSlots<{ default?(): VNode[] }>();
const lines = computed(() => {
    if (!slots.default) {
        return '';
    }

    const text = slots.default().map(renderNode).join('');
    const parenthesesIndex = text.indexOf('(');

    return parenthesesIndex === -1
        ? [text]
        : [text.slice(0, parenthesesIndex - 1).trim(), text.slice(parenthesesIndex).trim()];
});
</script>
