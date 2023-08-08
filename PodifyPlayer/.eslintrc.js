module.exports = {
  root: true,
  extends: '@react-native',
  rules: {
    // 'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    'prettier/prettier': ['error', {endOfLine: 'auto'}],
    'react/react-in-jsx-scope': 'off',
    'react/self-closing-comp': 'off',
    'react-native/no-inline-styles': 'off',
  },
};
