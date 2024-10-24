<template>
    <div
        ref="$root"
        v-animate
        :variant="isVisible ? 'visible' : 'hidden'"
        :variants="{
            hidden: { opacity: 0, y: 15, transition: { delay: 300 } },
            visible: { opacity: 1, y: 0, transition: { delay: 300 } },
        }"
    >
        <slot />
    </div>
</template>

<script setup lang="ts">
import { ref, useTemplateRef, watchEffect } from 'vue';

const $root = useTemplateRef('$root');
const isVisible = ref(false);
const observer = new IntersectionObserver((entries) => void (isVisible.value ||= !!entries[0]?.isIntersecting));

watchEffect(() => {
    if (!$root.value) {
        return;
    }

    observer.observe($root.value);
});
</script>
