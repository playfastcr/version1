import react from '@vitejs/plugin-react';
import reactRefresh from '@vitejs/plugin-react-refresh';
import { defineConfig } from 'vite';

import { aliasConfiguration } from './vite-option.configuration';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), reactRefresh()],
  resolve: { alias: aliasConfiguration },
  // esbuild: {
  //   jsxInject: `import React from 'react';`,
  // },
  envDir: 'environment',
});
