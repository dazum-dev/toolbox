import nxPlugin from '@nx/eslint-plugin'

import base from './packages/eslint-config/base.js'

export default [...base, { plugins: { '@nx': nxPlugin } }]
