import { defineConfig } from 'vite';
import Unocss from 'unocss/vite';
import {
  presetUno,
  presetAttributify,
  transformerCompileClass,
  transformerVariantGroup,
  transformerDirectives,
} from 'unocss';
import React from '@vitejs/plugin-react';
import LibTypes from 'vite-plugin-lib-types';
import { dependencies, peerDependencies } from './package.json';

export default defineConfig({
  build: {
    target: 'ES2018',
    lib: {
      entry: './src/index.tsx',
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: [
        ...Object.keys(dependencies),
        ...Object.keys(peerDependencies),
        /style\.css$/,
      ],
    },
  },
  plugins: [
    React({ jsxRuntime: 'classic' }),
    LibTypes(),
    Unocss({
      presets: [presetUno(), presetAttributify()],
      transformers: [
        transformerCompileClass(),
        transformerVariantGroup(),
        transformerDirectives(),
      ],
    }),
  ],
});
