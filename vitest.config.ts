import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@hocs': path.resolve(__dirname, './src/hocs'),
      '@stores': path.resolve(__dirname, './src/stores'),
      '@state': path.resolve(__dirname, './src/state'),
      '@app': path.resolve(__dirname, './src/app'),
      // baseUrl: ./src — bare imports
      utils: path.resolve(__dirname, './src/utils'),
      types: path.resolve(__dirname, './src/types'),
      components: path.resolve(__dirname, './src/components'),
      hooks: path.resolve(__dirname, './src/hooks'),
      stores: path.resolve(__dirname, './src/stores'),
      providers: path.resolve(__dirname, './src/providers'),
      hocs: path.resolve(__dirname, './src/hocs'),
      state: path.resolve(__dirname, './src/state'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.tsx'],
    include: ['src/**/*.test.{ts,tsx}'],
  },
});
