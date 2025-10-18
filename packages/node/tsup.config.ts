import { defineConfig } from 'tsup'

export default defineConfig({
  bundle: true,
  dts: true,
  entry: ['src/index.ts'],
  format: ['esm'],
  splitting: false,
  sourcemap: false,
  clean: true,
  external: ['react', 'react-dom'],
  tsconfig: 'tsconfig.json',
  outDir: 'dist',
  target: 'node22',
})
