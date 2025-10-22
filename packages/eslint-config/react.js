import nxPlugin from '@nx/eslint-plugin'

import base from './base'

export default [
  ...base,
  ...nxPlugin.configs['flat/react'],
  {
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
]
