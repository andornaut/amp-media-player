const { FlatCompat } = require('@eslint/eslintrc');
const js = require('@eslint/js');
const globals = require('globals');
const path = require('path');

// Side-effect import: patches ESLint's linter to process scripts in HTML files
require('eslint-plugin-html');

const compat = new FlatCompat({
  baseDirectory: path.resolve(__dirname),
  recommendedConfig: js.configs.recommended,
});

module.exports = [
  { ignores: ['dist/**', 'node_modules/**'] },
  ...compat.extends('airbnb'),
  ...compat.extends('airbnb/hooks'),
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        navigator: true,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      import: require('eslint-plugin-import'),
      react: require('eslint-plugin-react'),
      'react-hooks': require('eslint-plugin-react-hooks'),
    },
    rules: {
      'class-methods-use-this': 0,
      'guard-for-in': 0,
      // Allow const x => y => x * y;
      'implicit-arrow-linebreak': 0,
      'import/no-extraneous-dependencies': [
        'error',
        { devDependencies: ['build.mjs', 'eslint.config.js'] },
      ],
      'import/order': [
        'error',
        {
          groups: [
            ['builtin', 'external'],
            ['internal', 'parent', 'sibling', 'index'],
          ],
          'newlines-between': 'always',
          alphabetize: { order: 'asc' },
        },
      ],
      'import/prefer-default-export': 0,
      'max-len': ['error', { code: 120 }],
      'no-continue': 0,
      // Improve literacy of reduce() functions
      'no-param-reassign': 0,
      'no-restricted-syntax': ['error', 'WithStatement'],
      // Prefix symbols with underscore to denote private visibility
      'no-underscore-dangle': 0,
      'no-unused-expressions': ['error', { allowTaggedTemplates: true }],
      // Required for including regex in string attribute values
      'no-useless-escape': 0,
      'react/function-component-definition': 0,
      'react/prop-types': 0,
      'react/react-in-jsx-scope': 0,
      'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
      'react/no-array-index-key': 0,
      'jsx-a11y/media-has-caption': 0,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  {
    files: ['eslint.config.js'],
    rules: {
      'global-require': 0,
    },
  },
  {
    files: ['build.mjs'],
    languageOptions: {
      ecmaVersion: 2022,
      globals: {
        ...globals.node,
      },
      sourceType: 'module',
    },
    rules: {
      'no-console': 0,
    },
  },
];
