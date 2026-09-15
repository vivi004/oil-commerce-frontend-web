const { FlatCompat } = require('@eslint/eslintrc');
const js = require('@eslint/js');

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

module.exports = [
  {
    ignores: ['dist/**', 'node_modules/**', 'oil-commerce-frontend-web/**', '.angular/**'],
  },
  ...compat.config({
    overrides: [
      {
        files: ['src/**/*.ts'],
        extends: [
          'eslint:recommended',
          'plugin:@typescript-eslint/recommended',
          'plugin:@angular-eslint/recommended',
          'plugin:@angular-eslint/template/process-inline-templates',
          'prettier',
        ],
        rules: {
          '@angular-eslint/component-class-suffix': ['error', { suffixes: ['Component', 'App'] }],
          '@angular-eslint/directive-selector': [
            'error',
            { type: 'attribute', prefix: 'app', style: 'camelCase' },
          ],
          '@angular-eslint/component-selector': [
            'error',
            { type: 'element', prefix: 'app', style: 'kebab-case' },
          ],
          '@typescript-eslint/explicit-function-return-type': 'off',
          '@typescript-eslint/no-explicit-any': 'warn',
          '@typescript-eslint/no-unused-vars': [
            'error',
            { argsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_', varsIgnorePattern: '^_' },
          ],
          'no-console': ['warn', { allow: ['warn', 'error'] }],
        },
      },
      {
        files: ['src/**/*.html'],
        extends: [
          'plugin:@angular-eslint/template/recommended',
        ],
        rules: {
          '@angular-eslint/template/click-events-have-key-events': 'off',
          '@angular-eslint/template/interactive-supports-focus': 'off',
          '@angular-eslint/template/no-autofocus': 'off',
          '@angular-eslint/template/label-has-associated-control': 'off',
        },
      },
    ],
  }),
];
