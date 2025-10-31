import { promisify } from 'node:util'
import { brotliCompress } from 'node:zlib'

import type { LogLevelOption, ModuleFormat, Plugin, RollupBuild, RollupOutput } from 'rollup'
import { rollup } from 'rollup'

import { default as aliasPlugin } from '@rollup/plugin-alias'
import commonjs from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import gzipPlugin from 'rollup-plugin-gzip'
import summary from 'rollup-plugin-summary'

import { react } from '@toolbox/plugin-react'

import type { ToolboxOptions } from '@toolbox/config'
import { ENV, TS_CONFIG } from '@toolbox/config'

const brotliPromise = promisify(brotliCompress)

const chunksConfig = [
  ['jsx-dev-runtime', 'jsx-runtime'],
  ['node_modules/react', 'react'],
  ['node_modules/react-dom', 'react-dom'],
  ['node_modules/react-.*', 'react-lib'],
  ['node_modules/.*', 'vendor'],
]

export class TiniCompiler {
  bundle: RollupBuild | undefined
  genOutput: RollupOutput | undefined
  tiniConfig: ToolboxOptions

  constructor(tiniConfig: ToolboxOptions) {
    this.tiniConfig = tiniConfig
    this.bundle = undefined
  }

  async compile(file: string, shouldGenerateOnly = false) {
    const input = file
    const config = this.getRollupConfig()
    const output = {
      ...config.output,
      dir: this.tiniConfig.output.path,
    }
    const { cache, logLevel, plugins } = config

    this.bundle = await rollup({ cache, input, logLevel, plugins })
    const operation = shouldGenerateOnly ? this.bundle.generate : this.bundle.write

    this.genOutput = await operation(output)

    return this.genOutput
  }

  getRollupConfig() {
    return {
      cache: this.tiniConfig.mode === ENV.PRODUCTION,
      logLevel: 'silent' as LogLevelOption,
      jsx: {
        mode: 'automatic',
        importSource: 'react',
        jsxImportSource: 'react/jsx-runtime',
      },
      output: this.getOutputOption(),
      plugins: this.getPlugins(),
    }
  }

  getOutputOption() {
    return {
      assetFileNames: '[name][extname]',
      chunkFileNames: '[name].js',
      entryFileNames: '[name].js',
      format: 'es' as ModuleFormat,
      manualChunks(id: string): string | null {
        for (const [reg, chunkName] of chunksConfig) {
          const exp = new RegExp(reg as string, 'g')

          if (exp.test(id)) {
            return chunkName as string
          }
        }

        return null
      },
      sourcemap: (this.tiniConfig.mode === ENV.DEVELOPMENT ? 'inline' : false) as
        | boolean
        | 'inline',
    }
  }

  public getPlugins() {
    // https://www.npmjs.com/package/@rollup/plugin-typescript
    // https://www.npmjs.com/package/rollup-plugin-visualizer
    // https://www.npmjs.com/package/rollup-plugin-copy
    // https://www.npmjs.com/package/rollup-plugin-gzip
    // https://www.npmjs.com/package/rollup-plugin-sass
    // https://www.npmjs.com/package/rollup-plugin-scss
    // https://www.npmjs.com/package/rollup-plugin-workbox
    // https://www.npmjs.com/package/rollup-plugin-styles
    // https://www.npmjs.com/package/rollup-plugin-filesize
    // https://www.npmjs.com/package/rollup-plugin-summary
    // https://www.npmjs.com/package/rollup-plugin-preserve-directives
    // https://www.npmjs.com/package/polished
    return [
      ...this.getBasePlugins(),
      ...(this.tiniConfig.mode === ENV.PRODUCTION ? this.getProductionPlugins() : []),
    ]
  }

  public getBasePlugins(): Plugin<unknown>[] {
    const isDev = this.tiniConfig.mode === ENV.DEVELOPMENT

    // @ts-expect-error type issue
    return [
      replace({
        'process.env.NODE_ENV': JSON.stringify(this.tiniConfig.mode),
        preventAssignment: true,
      }),
      nodeResolve({ extensions: ['.js', '.jsx', '.ts', '.tsx'] }),
      commonjs(),
      react({
        context: this.tiniConfig.root,
        hot: isDev && this.tiniConfig.devServer.hot,
        isDev,
        jsc: {
          loose: false,
          parser: {
            // @ts-expect-error type issue
            defaultExportFrom: true,
            dynamicImport: true,
            importMeta: true,
            jsx: true,
            preserveAllComments: true,
          },
          target: 'es2022',
          transform: {
            constModules: {},
            react: {
              development: isDev,
              runtime: 'automatic',
              useBuiltins: false,
              refresh: isDev,
            },
          },
        },
        minify: this.tiniConfig.mode === ENV.PRODUCTION,
        tsconfigPath: TS_CONFIG,
      }),
      this.tiniConfig.alias ? aliasPlugin({ entries: this.tiniConfig.alias }) : undefined,
    ].filter(Boolean)
  }

  public getProductionPlugins(): Plugin<unknown>[] {
    return [
      summary({
        showBrotliSize: true,
        showGzippedSize: true,
        showMinifiedSize: false,
      }),
      gzipPlugin(),
      gzipPlugin({
        customCompression: (content: string | Buffer) => brotliPromise(Buffer.from(content)),
        fileName: '.br',
      }),
    ]
  }
}
