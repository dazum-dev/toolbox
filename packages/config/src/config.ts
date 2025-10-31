import { existsSync } from 'node:fs'

import { APP_PATH, COMPRESS, DIST_PATH, ENV, HOST, PORT, TOOLBOX_CONFIG } from './constants'
import { readEnvFile } from './environment'
import { DevCliOptions, ToolboxOptions } from './types'
import { deepMerge } from './utils'

export const defaultConfig: ToolboxOptions = {
  alias: {
    '@/': APP_PATH,
  },
  devServer: {
    compress: COMPRESS,
    port: PORT,
    host: HOST,
    https: false,
    hot: true,
    proxy: {
      // Example
      // '/api': {
      //   target: 'http://localhost:3001',
      //   changeOrigin: true,
      //   secure: false
      // }
    },
    client: {
      overlay: true,
      progress: true,
      logging: 'info',
    },
  },
  env: {},
  mode: ENV.PRODUCTION,
  output: {
    path: DIST_PATH,
    filename: '[name].js',
  },
  root: APP_PATH,
  ssr: false,
}

export const getOptions = async (
  options: DevCliOptions,
  watchFiles: string[],
): Promise<ToolboxOptions> => {
  const env = await readEnvFile(watchFiles)
  const mode = process.env['NODE_ENV'] === ENV.DEVELOPMENT ? ENV.DEVELOPMENT : ENV.PRODUCTION
  const opts = deepMerge<ToolboxOptions>(defaultConfig, {
    // @ts-expect-error optional parameters are passed here
    devServer: {
      compress: options.compress || COMPRESS,
      port: options.port || PORT,
      host: options.host || HOST,
    },
    env,
    mode,
  })

  if (existsSync(TOOLBOX_CONFIG)) {
    watchFiles.push(TOOLBOX_CONFIG)

    const mod = await import(TOOLBOX_CONFIG)
    Object.assign(opts, mod.default)
  }

  return opts
}
