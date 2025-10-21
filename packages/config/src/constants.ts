import { existsSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export const CWD = process.cwd()

export const PORT = 9000
export const HOST = '0.0.0.0'
export const COMPRESS = true
export const HOT = true

export const ENV = {
  DEVELOPMENT: 'development',
  PRODUCTION: 'production',
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const NOOP = () => {}
export const DIST_PATH = resolve(CWD, '.toolbox')

export const PUBLIC_PATH = resolve(CWD, 'public')
export const TOOLBOX_CONFIG = resolve(CWD, 'toolbox.config.js')
export const APP_PATH = resolve(CWD, 'app')
export const TS_CONFIG = resolve(CWD, 'tsconfig.json')
export const NODE_ENV = process.env['NODE_ENV'] || ENV.PRODUCTION
export const IS_PROD = NODE_ENV === ENV.PRODUCTION
export const EXTS = ['.js', '.jsx', '.ts', '.tsx']

export const ROOT = resolve(APP_PATH, 'root')
export const ENTRY_CLIENT = join(APP_PATH, 'entry.client')
export const ENTRY_SERVER = join(APP_PATH, 'entry.server')

export const IS_TYPESCRIPT = existsSync(join(CWD, 'tsconfig.json'))

export const CLIENT_LIB = {
  client: join(__dirname, './lib/client', 'client.js'),
  hmr: join(__dirname, './lib/client', 'hmr.js'),
  refresh: join(__dirname, './lib/client', 'refresh.js'),
}
