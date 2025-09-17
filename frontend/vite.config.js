import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/', // importante para que los assets se sirvan desde la raíz
  build: {
    outDir: 'dist',
  },
});
