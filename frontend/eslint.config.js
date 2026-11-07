// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginVue from 'eslint-plugin-vue';
import vuetify from 'eslint-plugin-vuetify';

import globals from 'globals';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  // Global ignores: an ignores-only block applies to every config, so the build output in dist/ isn't linted.
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      '.github/**',
      'coverage/**',
      'public/**',
      '.eslintrc.js',
      '.eslintrc-auto-import.json',
      'eslint.config.js',
    ],
  },
  {
    files: ['**/*.vue', '**/*.ts', '**/*.js'],
    plugins: {
      vuetify,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        __APP_VERSION__: 'readonly', // injected by Vite's define (vite.config.mts)
      },
      parserOptions: {
        parser: tseslint.parser, // TypeScript inside .vue <script lang="ts"> blocks
        extraFileExtensions: ['.vue'],
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      ...vuetify.configs.base.rules,
      ...vuetify.configs.recommended.rules,
      'vue/multi-word-component-names': 'off',
    },
  },
);
