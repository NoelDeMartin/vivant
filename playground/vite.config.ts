import { URL, fileURLToPath } from 'node:url';

import components from 'unplugin-vue-components/vite';
import icons from 'unplugin-icons/vite';
import iconsResolver from 'unplugin-icons/resolver';
import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [
        vue(),
        tailwindcss(),
        components({
            deep: true,
            dts: false,
            resolvers: [iconsResolver()],
            dirs: ['src/components', 'src/pages'],
        }),
        icons({
            iconCustomizer(_, __, props) {
                props['aria-hidden'] = 'true';
            },
        }),
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
            '@vivantjs/core': fileURLToPath(new URL('../packages/core/src', import.meta.url)),
            'vivant': fileURLToPath(new URL('../packages/vivant/src', import.meta.url)),
        },
    },
});
