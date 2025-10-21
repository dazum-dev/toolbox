export type DevCliOptions = {
  compress: boolean
  env: 'development' | 'production'
  host: string
  port: number
}

export type Proxy = {
  target: string
  changeOrigin: boolean
  secure: boolean
}

export type DevServerClient = {
  overlay: boolean
  progress: boolean
  logging: string
}

export type DevServer = {
  compress: boolean
  port: number
  host: string
  // historyApiFallback: boolean
  hot: boolean
  https: boolean
  proxy: Record<string, Proxy>
  client: DevServerClient
}

export type ToolboxOptions = {
  alias: Record<string, string>
  devServer: DevServer
  env: Record<string, string>
  mode: string
  output: {
    path: string
    filename: string
  }
  root: string
  ssr: boolean
}

export enum ENV {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
}
