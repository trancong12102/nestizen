// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';

export default [
  ...tseslint.config(
    eslint.configs.recommended,
    ...tseslint.configs.recommendedTypeChecked,
    {
      languageOptions: {
        parserOptions: {
          project: ['./tsconfig.eslint.json', './packages/*/tsconfig.json'],
          tsconfigRootDir: import.meta.dirname,
        },
      },
    },
    {
      ignores: [
        '**/*.js',
        '**/*.mjs',
        '**/*.cjs',
        '**/base/*.base.ts',
        '**/graphql-types/index.ts',
      ],
    },
    {
      rules: {
        '@typescript-eslint/no-unsafe-return': 'off',
        '@typescript-eslint/no-unsafe-call': 'off',
      },
    },
  ),
  eslintConfigPrettier,
];
