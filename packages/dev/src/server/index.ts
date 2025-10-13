import { createServer } from 'node:http'
import type { AddressInfo } from 'node:net'

import { App } from '@tinyhttp/app'
import { cookieParser } from '@tinyhttp/cookie-parser'
import { lruSend } from 'lru-send'
import { json, urlencoded } from 'milliparsec'

import compression from 'compression'
import { black, bold, cyan, green } from 'kolorist'
import sirv from 'sirv'
import { WebSocketServer } from 'ws'

import { getServerAddresses } from '../lib/net'
import type { DevServer, ToolboxOptions } from '../types'

import pkg from '../../package.json'
import { getCompressionConfig } from './middlewares/compress'
import { initSocket } from './socket'

const onListen =
  (addr: Pick<AddressInfo, 'port'>, options: Pick<DevServer, 'https' | 'host'>): (() => void) =>
  (): void => {
    const addresses = getServerAddresses(addr, options)

    const local = `Local:   ${cyan(addresses[0] as string)}`
    const network = `Network: ${addresses[1]}`
    const version = `TOOLBOX v${pkg.version}`

    console.clear()
    console.log(`\n  👩‍🚀 ${green(version)}\n`)
    console.log(`${bold(green('➜'))} ${bold(black(local))}`)
    console.log(`${bold(green('➜'))} ${bold(black(network))}`)
  }

export type TinyApp = App & { restart: () => Promise<void>; stop: () => void }

export const startServer = async (options: ToolboxOptions): Promise<TinyApp> => {
  const { devServer, output } = options
  const { compress, host, hot, https, port } = devServer

  const app: TinyApp = new App() as TinyApp

  // Create HTTP server instance
  // @ts-expect-error server type incompatibility
  const server = createServer(app.handler.bind(app))
  let wss: WebSocketServer

  app.use(sirv(output.path, { dev: true, single: false }))
  app.use(json())
  app.use(urlencoded())
  // @ts-expect-error Argument of type is not assignable to parameter of type:
  app.use(lruSend())
  app.use(cookieParser())

  if (compress) {
    const compressionConfig = getCompressionConfig()

    // @ts-expect-error Argument of type is not assignable to parameter of type:
    app.use(compression(compressionConfig))
  }

  if (hot) {
    wss = initSocket(server)
  }

  server.listen(port, host, onListen({ port }, { host, https }))

  // Add method to stop the server
  app.stop = () => {
    if (server) {
      wss?.close?.()
      server.close()
    }
  }

  // Add method to restart the server
  app.restart = async () => {
    app.stop()

    server.listen(port, host, onListen({ port }, { host, https }))
  }

  return app
}
