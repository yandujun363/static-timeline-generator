import js from '@eslint/js';
import globals from 'globals';

export default [
  {
    ignores: ['_site/**', 'node_modules/**', 'package-lock.json'],
  },
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    files: ['src/js/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },
];
