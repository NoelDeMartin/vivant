import { computed, onMounted, readonly, ref } from 'vue';
import { required, stringMatch, stringToSlug } from '@noeldemartin/utils';
import { useRoute, useRouter } from 'vue-router';
import type { Component, ComputedRef, DeepReadonly, Ref } from 'vue';

interface ExamplePage {
    slug: string;
    example: Example;
}

const examples = Object.entries(
    import.meta.glob(['@/components/examples/*.vue'], { eager: true }) as Record<
        string,
        { default: Component; title?: string; slug?: string; description?: string; footer?: string }
    >,
).map(([fileName, { default: component, title, slug, description, footer }]) => {
    title ??= required(stringMatch<2>(fileName, /.*?([^/]+)\.vue/)?.[1]);

    const example: Example = {
        title,
        sourceUrl: `https://github.com/NoelDeMartin/vivant/blob/main/playground${fileName}`,
        slug: slug ?? stringToSlug(title),
        description,
        footer,
        component,
    };

    return example;
});

export interface Example {
    title: string;
    slug: string;
    description?: string;
    footer?: string;
    sourceUrl: string;
    component: Component;
}

export const examplePages = examples.reduce(
    (examplesMap, example) => {
        examplesMap[example.slug] = {
            example,
            slug: example.slug,
        };

        return examplesMap;
    },
    {} as Record<string, ExamplePage>,
);

export function useCurrentExample(): ComputedRef<Example | undefined> {
    const route = useRoute();

    return computed(() => {
        if (!route.params.example || Array.isArray(route.params.example)) {
            return;
        }

        return examplePages[route.params.example]?.example;
    });
}

export function useExamplesReady(): DeepReadonly<Ref<boolean>> {
    const router = useRouter();
    const routerReady = ref(false);

    onMounted(() => router.isReady().then(() => (routerReady.value = true)));

    return readonly(routerReady);
}

export function useExamplesNavigation(): ComputedRef<{ previous?: Example; next?: Example }> {
    const example = useCurrentExample();

    return computed(() => {
        if (!example.value) {
            return {};
        }

        return {
            previous: examples[(examples.indexOf(example.value) + examples.length - 1) % examples.length],
            next: examples[(examples.indexOf(example.value) + 1) % examples.length],
        };
    });
}

export default examples;
