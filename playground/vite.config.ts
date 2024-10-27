import { URL, fileURLToPath } from 'node:url';

import components from 'unplugin-vue-components/vite';
import icons from 'unplugin-icons/vite';
import iconsResolver from 'unplugin-icons/resolver';
import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

const isProduction = process.env.NODE_ENV === 'production';
const basePath = isProduction ? '/vivant/' : undefined;

export default defineConfig({
    base: basePath,
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
        VitePWA({
            registerType: 'autoUpdate',
            manifest: {
                name: 'Vivant Playground',
                short_name: 'Vivant Playground',
                description: 'Make your applications feel alive',
                theme_color: '#ffffff',
                icons: [
                    {
                        src: 'web-app-manifest-192x192',
                        sizes: '192x192',
                        type: 'image/png',
                    },
                    {
                        src: 'web-app-manifest-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                    },
                ],
            },
            workbox: {
                additionalManifestEntries: [
                    '/apple-touch-icon.png',
                    '/favicon-48x48.png',
                    '/favicon.ico',
                    '/favicon.svg',
                ],
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
