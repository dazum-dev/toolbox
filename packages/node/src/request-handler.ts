import { createReadStream, promises as fs } from 'node:fs'
import { basename } from 'node:path'
import { pipeline } from 'node:stream'

import type { AsyncHandler, Request, Response } from '@tinyhttp/app'

import type { ToolboxOptions } from '@toolbox/config'
import { CLIENT_LIB, IS_TYPESCRIPT } from '@toolbox/config'

async function sendStreamableResponse(path: string, res: Response) {
  const stream = createReadStream(path, { encoding: 'utf-8' })
  res.writeHead(200, { 'Content-Type': 'application/javascript' })
  pipeline(stream, res, err => {
    if (err) {
      console.error(err)

      if (!res.headersSent) {
        res.status(500).send('Internal Server Error')
      }
    }
  })
}

const checkClientResources = async (req: Request, res: Response) => {
  const resource = basename(req.path, '.js')
  const clientPath = (CLIENT_LIB as Record<string, string>)[resource]

  if (!clientPath) {
    return Promise.resolve()
  }

  try {
    await fs.access(clientPath, fs.constants.R_OK)
    return sendStreamableResponse(clientPath, res)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_error) {
    return Promise.resolve()
  }
}

export const toolboxRequestHandler = (options: ToolboxOptions): AsyncHandler => {
  const ext = IS_TYPESCRIPT ? '.tsx' : '.jsx'

  // @ts-expect-error type issue
  return async (req: Request, res: Response) => {
    try {
      await checkClientResources(req, res)

      return res.send('ok')

      // @ts-expect-error catch clause
    } catch (error: { message: string }) {
      console.error('[tiniRequestHandler] Error: ', error?.message)

      res.status(500).send('Internal Server Error')
    }
  }
}
