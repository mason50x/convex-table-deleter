import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig(({ isPreview }) => ({
  plugins: [react(), tailwindcss()],
  // The dev server needs SPA fallback (only index.html exists in the source),
  // but `vite preview` should behave like the static host the prerendered
  // dist/ is deployed to: real files per page, 404 for anything else.
  appType: isPreview ? 'mpa' : 'spa',
}));
