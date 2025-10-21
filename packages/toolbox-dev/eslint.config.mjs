import baseConfig from '@toolbox/eslint-config/base.js'

export default [
  ...baseConfig,
  {
    files: ['**/*.json'],
    rules: {
      '@nx/dependency-checks': [
        'error',
        {
          ignoredDependencies: [
            '@tinyhttp/app',
            '@tinyhttp/cookie-parser',
            '@toolbox/config',
            'chokidar',
            'compression',
            'kolorist',
            'lru-send',
            'milliparsec',
            'sade',
            'sirv',
            'ws',
          ],
          ignoredFiles: [
            '{projectRoot}/eslint.config.{js,cjs,mjs,ts,cts,mts}',
            '{projectRoot}/rollup.config.{js,ts,mjs,mts,cjs,cts}',
          ],
        },
      ],
    },
    languageOptions: {
      parser: await import('jsonc-eslint-parser'),
    },
  },
  {
    ignores: ['dist/**/*.{js,jsx,ts,tsx}', '.rollup.cache/**'],
  },
]
