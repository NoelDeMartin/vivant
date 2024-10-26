import { URL, fileURLToPath } from 'node:url';

import dts from 'vite-plugin-dts';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        sourcemap: true,
        lib: {
            entry: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
            name: 'vivant',
            fileName: 'vivant',
        },
        rollupOptions: {
            external: ['@noeldemartin/utils', '@vivantjs/core', '@vueuse/motion', 'vue'],
            output: {
                exports: 'named',
                globals: {
                    '@noeldemartin/utils': 'NDMUtils',
                    '@vivantjs/core': 'VivantCore',
                    '@vueuse/motion': 'VueUseMotion',
                    'vue': 'Vue',
                },
            },
        },
    },
    plugins: [
        vue(),
        dts({
            rollupTypes: true,
            tsconfigPath: './tsconfig.json',
            insertTypesEntry: true,
            aliasesExclude: ['@vivantjs/core'],
        }),
    ],
    resolve: {
        alias: {
            vivant: fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
});
