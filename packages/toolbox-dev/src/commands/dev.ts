import { existsSync, mkdir } from 'node:fs'

import chokidar from 'chokidar'

import type { DevCliOptions } from '@toolbox/config'
import { DIST_PATH, NOOP, getOptions } from '@toolbox/config'

import { startServer } from '../server'

const checkBuildPath = () => {
  const isPathExist = existsSync(DIST_PATH)

  if (!isPathExist) {
    mkdir(DIST_PATH, { recursive: false }, NOOP)
  }
}

export const dev = async (opts: DevCliOptions) => {
  checkBuildPath()

  const watchFiles: string[] = []
  const options = await getOptions(opts, watchFiles)
  const server = await startServer(options)

  const watcher = chokidar.watch(watchFiles, {
    ignored: /(^|[/\\])\../, // ignore dotfiles
    persistent: true,
  })

  watcher.on('change', async (path: string) => {
    console.log(`File ${path} has been changed. Restarting dev server.`)

    await server.restart()
  })
}
