import { defineConfig } from 'tsup'

export default defineConfig({
  bundle: true,
  dts: false,
  minify: true,
  entry: ['src/index.ts'],
  format: ['esm'],
  splitting: true,
  sourcemap: false,
  clean: true,
  tsconfig: 'tsconfig.json',
  outDir: '../../dist/packages/plugin-react',
  target: 'node22',
})
