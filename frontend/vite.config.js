import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Permite que el servidor acepte conexiones desde cualquier IP
    port: 5173,      // Puerto en el que correrá el servidor
    strictPort: true // Garante que se usará ese puerto y fallará si está ocupado
  },
  build: {
    rollupOptions: {
      input: 'src/App.jsx' // Entrada principal para el build
    }
  }
});
