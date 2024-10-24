<template>
    <div v-animations-config="config">
        <slot />
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { objectWithoutEmpty } from '@noeldemartin/utils';

const props = defineProps({
    duration: {
        type: Number,
        default: null,
    },
});
const config = computed(() => objectWithoutEmpty({ duration: props.duration }));
</script>
