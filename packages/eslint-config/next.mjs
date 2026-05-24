import { FlatCompat } from '@eslint/eslintrc';
import { defineConfig, globalIgnores } from 'eslint/config';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import importSort from './import-sort.mjs';

/**
 * ESLint preset for Next.js apps. Adapts the legacy `eslint-config-next`
 * package (eslintrc format) into Flat Config via `FlatCompat`, then layers
 * the shared import-sort block on top.
 *
 * If you upgrade to `eslint-config-next@^16`, you can switch to the
 * native flat-config exports (`eslint-config-next/core-web-vitals.js`
 * and `eslint-config-next/typescript.js`) and drop `FlatCompat`.
 */
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

export default defineConfig([
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  importSort,
  {
    rules: {
      // Match the repo convention: a leading `_` marks an intentionally
      // unused parameter or variable. Keep in sync with the base preset.
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
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts']),
]);
