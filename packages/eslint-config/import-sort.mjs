import simpleImportSort from 'eslint-plugin-simple-import-sort';

/**
 * Sorted/grouped imports + exports. Composed into both base and Next presets.
 *
 * Custom groups (top → bottom, separated by blank lines):
 *   1. Side-effect imports — `import './globals.css'`
 *   2. Node builtins — `node:path`, `node:fs`
 *   3. External npm packages — `react`, `@mui/...`
 *   4. Workspace packages — `@template/*` (internal monorepo packages)
 *   5. App-aliased imports — `@/...` (only meaningful inside apps)
 *   6. Parent relative — `../`
 *   7. Sibling relative — `./`
 *   8. Style imports
 */
export default {
  plugins: { 'simple-import-sort': simpleImportSort },
  rules: {
    'simple-import-sort/imports': [
      'error',
      {
        groups: [
          ['^\\u0000'],
          ['^node:'],
          ['^@?\\w'],
          ['^@template/'],
          ['^@/'],
          ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
          ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
          ['^.+\\.s?css$'],
        ],
      },
    ],
    'simple-import-sort/exports': 'error',
  },
};
