<template>
    <root />
</template>

<script setup lang="ts">
import { Comment, createStaticVNode, getCurrentInstance } from 'vue';
import type { VNode } from 'vue';

const slots = defineSlots<{ default?(): VNode[] }>();
const props = defineProps({
    wait: {
        type: Number,
        default: 100,
    },
});
const instance = getCurrentInstance();
let snapshot: string | undefined;

const root = () => {
    const content = slots.default?.();

    if (!content?.some((node) => node.type !== Comment)) {
        return snapshot && createStaticVNode(snapshot, 1);
    }

    setTimeout(() => {
        const $el = instance?.subTree.el as { nextElementSibling?: Element };

        if (!($el.nextElementSibling instanceof Element)) {
            return;
        }

        snapshot = $el.nextElementSibling?.outerHTML;
    }, props.wait);

    return content;
};
</script>
