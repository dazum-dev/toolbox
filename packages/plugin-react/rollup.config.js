import { withNx } from '@nx/rollup/with-nx.js'

export default withNx(
  {
    main: './src/index.ts',
    outputPath: '../../dist/packages/plugin-react',
    tsConfig: './tsconfig.lib.json',
    compiler: 'swc',
    format: ['esm'],
    assets: [{ input: '{projectRoot}', output: '.', glob: '*.md' }],
  },
  {
    // Provide additional rollup configuration here. See: https://rollupjs.org/configuration-options
    // e.g.
    // output: { sourcemap: true },
  },
)
