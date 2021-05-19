module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  plugins: ['react', '@typescript-eslint'],
  rules: {
    'no-console': ['error', { allow: ['warn', 'error'] }],
    'prefer-const': ['error', { destructuring: 'all' }],
    '@typescript-eslint/explicit-module-boundary-types': [
      'error',
      {
        allowDirectConstAssertionInArrowFunctions: true,
        allowTypedFunctionExpressions: true,
      },
    ],
    '@typescript-eslint/ban-ts-comment': 'off',
    'react/prop-types': 'off',
  },
}
