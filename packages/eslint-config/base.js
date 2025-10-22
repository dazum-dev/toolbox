import js from '@eslint/js'
import nx from '@nx/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import globals from 'globals'

import prettierPlugin from 'eslint-plugin-prettier/recommended'

export default [
  js.configs.recommended,
  { plugins: { '@nx': nx } },
  ...nx.configs['flat/base'],
  ...nx.configs['flat/javascript'],
  ...nx.configs['flat/typescript'],
  {
    languageOptions: {
      parser: tsParser,
      globals: {
        ...globals.node,
      },
    },
    // rules: {
    //   '@nx/enforce-module-boundaries': 'error',
    // },
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
          allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?[jt]s$'],
          depConstraints: [
            {
              sourceTag: 'scope:config',
              onlyDependOnLibsWithTags: ['type:config'],
            },
            {
              sourceTag: 'scope:plugin',
              onlyDependOnLibsWithTags: ['scope:config', 'type:config'],
            },
            {
              sourceTag: 'scope:dev',
              onlyDependOnLibsWithTags: ['scope:plugin', 'scope:config', 'type:config'],
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
