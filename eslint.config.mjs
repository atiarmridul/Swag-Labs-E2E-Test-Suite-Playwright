import globals from 'globals';
import pluginJs from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import playwrightPlugin from 'eslint-plugin-playwright';

export default [
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
    rules: {
      quotes: ['error', 'single'],
      semi: ['error', 'always'],
      indent: ['error', 2],
      'max-len': ['warn', { code: 100 }],
      'no-console': 'warn',
    },
  },
  pluginJs.configs.recommended,
  ...tsPlugin.configs['flat/recommended'],
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'warn',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-require-imports': 'off',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
  {
    ...playwrightPlugin.configs['flat/recommended'],
    files: ['tests/**/*.{js,mjs,cjs,ts,mts,cts}'],
    rules: {
      ...playwrightPlugin.configs['flat/recommended'].rules,
      'playwright/expect-expect': 'error',
      'playwright/no-conditional-in-test': 'error',
      'playwright/no-focused-test': 'error',
      'playwright/valid-title': 'error',
    },
    settings: {
      playwright: {
        globalAliases: { test: ['it'], expect: ['assert'] },
      },
    },
  },
];
