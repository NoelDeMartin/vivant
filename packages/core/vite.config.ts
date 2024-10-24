import { URL, fileURLToPath } from 'node:url';

import dts from 'vite-plugin-dts';
import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        sourcemap: true,
        lib: {
            entry: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
            name: '@vivantjs/core',
            fileName: 'vivantjs-core',
        },
        rollupOptions: {
            external: ['@noeldemartin/utils'],
            output: {
                globals: {
                    '@noeldemartin/utils': 'NDMUtils',
                },
            },
        },
    },
    plugins: [
        dts({
            rollupTypes: true,
            tsconfigPath: './tsconfig.json',
            insertTypesEntry: true,
        }),
    ],
    resolve: {
        alias: {
            '@vivantjs/core': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
});
