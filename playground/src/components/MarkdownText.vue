<template>
    <root />
</template>

<script setup lang="ts">
import { computed, h, useAttrs } from 'vue';
import type { VNode } from 'vue';

import { renderMarkdown } from '@/lib/markdown';
import { renderNode } from '@/lib/vue';

const attrs = useAttrs();
const slots = defineSlots<{ default?(): VNode[] }>();
const html = computed(() => {
    if (!slots.default) {
        return '';
    }

    return renderMarkdown(slots.default().map(renderNode).join(''));
});
const root = () =>
    h('div', {
        innerHTML: html.value,
        ...attrs,
        class: [
            attrs.class ?? '',
            'prose prose-green',
            'prose-code:text-pink-600 prose-code:before:[content:""] prose-code:after:[content:""]',
        ].join(' '),
    });

defineOptions({ inheritAttrs: false });
</script>
