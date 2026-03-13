import nextPlugin from 'eslint-config-next'

export default [
  ...nextPlugin,
  {
    ignores: [
      'node_modules/',
      '.next/',
      'dist/',
      'build/',
      '.sst/',
      'coverage/',
      '*.config.js',
      '*.config.mjs',
    ],
  },
  {
    rules: {
      'no-console': 'warn',
      'no-debugger': 'warn',
      'react/no-unescaped-entities': 'off',
      'react-hooks/set-state-in-effect': 'off', // Allow setState in useEffect for mount detection
    },
  },
]
