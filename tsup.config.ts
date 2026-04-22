/// <reference types="node" />
import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index:  'src/index.ts',
    robots: 'src/robots/index.ts',
    react:  'src/react/index.ts',
  },
  format: ['cjs', 'esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  minify: true,
  treeshake: true,
  splitting: false,
  outDir: 'dist',
  // react: external peer dep.
  // robot-toast: self-reference so react/index.ts doesn't re-bundle core.
  external: ['react', 'robot-toast'],
})
