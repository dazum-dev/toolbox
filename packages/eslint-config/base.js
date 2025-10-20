import js from '@eslint/js'
import nxPlugin from '@nx/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import globals from 'globals'

import prettierPlugin from 'eslint-plugin-prettier/recommended'

export default [
  js.configs.recommended,
  // { plugins: { '@nx': nxPlugin } },
  ...nxPlugin.configs['flat/javascript'],
  ...nxPlugin.configs['flat/typescript'],
  {
    languageOptions: {
      parser: tsParser,
      globals: {
        ...globals.node,
      },
    },
    rules: {
      '@nx/enforce-module-boundaries': 'error',
    },
  },
  {
    ...prettierPlugin,
    rules: {
      'prettier/prettier': [
        'error',
        {
          arrowParens: 'always',
          bracketSameLine: true,
          endOfLine: 'auto',
          jsxSingleQuote: true,
          printWidth: 100,
          semi: false,
          singleQuote: true,
          tabWidth: 2,
          trailingComma: 'all',
          useTabs: false,
        },
      ],
    },
  },
  { ignores: ['!**/*'] },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: [],
          depConstraints: [
            {
              sourceTag: '*',
              onlyDependOnLibsWithTags: ['*'],
            },
          ],
        },
      ],
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {},
  },
  {
    files: ['**/*.js', '**/*.jsx'],
    rules: {},
  },
]
