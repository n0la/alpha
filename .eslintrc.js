module.exports = {
  root: true,

  env: {
    node: true,
  },

  extends: [
    require.resolve('eslint-config-standard'),
    'plugin:import/warnings',
  ],

  rules: {
    // fixes eslint crashes when parsing indents
    camelcase: 1,
    'no-undef': 0,
    'no-prototype-builtins': 0,
    'no-use-before-define': 0,
    'no-unused-vars': 0,
    'standard/no-callback-literal': 0,
    quotes: ['error', 'single', { avoidEscape: true, allowTemplateLiterals: true }],

    'generator-star-spacing': 'off',
    'comma-dangle': [
      'error',
      'always-multiline',
    ],
  },

  parserOptions: {
    ecmaVersion: 2020,
  },
}
