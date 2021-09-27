module.exports = {
  root: true,
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaVersion: 12
  },
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: ['standardize'],
  rules: {
    'unicorn/prefer-spread': 'off'
  },
  overrides: [
    {
      files: ['**/*.test.{j,t}s?(x)', '**/__tests__/**/*.[jt]s?(x)', 'tests/**/*.js'],
      extends: ['plugin:jest/recommended', 'plugin:jest/style'],
      rules: {
        'import/first': 0
      }
    }
  ]
}
