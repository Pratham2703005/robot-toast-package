/// <reference types="node" />
import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  test: {
    environment: 'jsdom',
    include: ['tests/**/*.test.ts'],
    globals: false,
    // During tests, resolve the package's own name back to its source so
    // self-references in `src/react/index.ts` hit the live code rather than
    // anything installed in node_modules.
    alias: {
      'robot-toast': path.resolve(__dirname, 'src/index.ts'),
    },
  },
});
