module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'prettier',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:prettier/recommended',
    'plugin:testing-library/react',
  ],
  plugins: ['react-hooks', 'testing-library', '@typescript-eslint'],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    browser: true,
    node: true,
    es6: true,
    jest: true,
  },
  rules: {
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        ignoreRestSiblings: true,
        argsIgnorePattern: '^_',
      },
    ],
    'prettier/prettier': [
      'warn',
      {
        singleQuote: true,
        semi: false,
        arrowParens: 'avoid',
        printWidth: 90,
      },
    ],
    // Errors
    '@typescript-eslint/no-explicit-any': 2,
    '@typescript-eslint/no-var-requires': 2,
    'react-hooks/rules-of-hooks': 2,
    'react-hooks/exhaustive-deps': 2,
    'testing-library/await-async-query': 'error',
    'testing-library/no-await-sync-query': 'error',
    'testing-library/no-debugging-utils': 'warn',
    'testing-library/no-dom-import': 'off',
    // Allowed
    'react/jsx-uses-react': 0,
    'react/react-in-jsx-scope': 0,
    '@typescript-eslint/no-non-null-assertion': 0,
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/explicit-member-accessibility': 0,
    '@typescript-eslint/no-empty-function': 0,
    '@typescript-eslint/camelcase': 0,
    '@typescript-eslint/explicit-module-boundary-types': 0,
    '@typescript-eslint/ban-ts-ignore': 0,
    '@typescript-eslint/ban-ts-comment': 0,
    'react/prop-types': 0,
    'react/no-unescaped-entities': 0,
    'react/display-name': 0,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
}
