#!/usr/bin/env node

import sade from 'sade'

import type { DevCliOptions } from '@toolbox/config'
import { COMPRESS, ENV, HOST, HOT, PORT } from '@toolbox/config'
import pkg from '../package.json'

const prog = sade('toolbox')

prog.version(pkg.version)

prog
  .command('dev', 'start dev server')
  .option('--compress', 'enable compression', COMPRESS)
  .option('--host, -h <host>', 'port to start dev server', HOST)
  .option('--hot', 'enable hmr', HOT)
  .option('--port, -p <port>', 'port to start dev server', PORT)
  .action(async (args: DevCliOptions): Promise<void> => {
    // eslint-disable-next-line turbo/no-undeclared-env-vars
    process.env.NODE_ENV = ENV.DEVELOPMENT

    const { dev } = await import('./commands/dev')

    run(dev(args))
  })

prog.parse(process.argv)

const catchException = (err: Error) => {
  console.error(err)
  process.exit(1)
}

const run = (p: Promise<unknown>) => {
  p.catch(catchException)
}

process.on('uncaughtException', e => {
  console.error('uncaughtException', e)
})
process.on('unhandledRejection', e => {
  console.info('unhandledRejection:', e)
})
