module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: [
    'plugin:@typescript-eslint/eslint-recommended',
    'airbnb-base',
    'airbnb-typescript/base',
    'plugin:prettier/recommended',
  ],
  ignorePatterns: ['__test__/*', '__tests__/*'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
  },
  plugins: ['@typescript-eslint', '@typescript-eslint/tslint', 'prettier'],
  rules: {
    '@typescript-eslint/indent': 'off',
    'max-len': ['error', { code: 120 }],
    'prettier/prettier': 'error',
  },
  settings: {},
};
