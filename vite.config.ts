import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
// @ts-ignore
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
    plugins: [vue(), dts({ rollupTypes: true })],
    build: {
        lib: {
            // @ts-ignore
            entry: resolve(__dirname, 'src/components/index.ts'),
            name: 'vue-popper-utilities',
            fileName: 'vue-popper-utilities',
        },
        rollupOptions: {
            external: ['vue'],
            output: {
                globals: {
                    vue: 'Vue',
                },
            },
        },
    },
});
