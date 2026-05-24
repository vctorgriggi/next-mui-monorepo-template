import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

import importSort from './import-sort.mjs';

/**
 * Base ESLint preset for non-Next packages (libraries, tooling).
 * Apps should use `@template/eslint-config/next` instead.
 */
export default defineConfig([
  globalIgnores([
    '**/dist/**',
    '**/.turbo/**',
    '**/node_modules/**',
    '**/coverage/**',
  ]),
  js.configs.recommended,
  ...tseslint.configs.recommended,
  importSort,
  {
    languageOptions: {
      globals: { ...globals.node, ...globals.es2022 },
    },
    rules: {
      // Match the convention used across the repo: a leading `_` marks
      // an intentionally unused parameter or variable (e.g. a typed
      // placeholder in a compile-time check).
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
    },
  },
]);
