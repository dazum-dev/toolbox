export * from './constants'
export { getOptions } from './config'
import { defaultConfig } from './config'
import type { DevCliOptions, DevServer, DevServerClient, ENV, Proxy, ToolboxOptions } from './types'
import { deepMerge } from './utils'

export { DevCliOptions, DevServer, DevServerClient, ENV as E_ENV, Proxy, ToolboxOptions }

export default function defineConfig(options: ToolboxOptions) {
  return deepMerge<ToolboxOptions>(defaultConfig, options)
}
