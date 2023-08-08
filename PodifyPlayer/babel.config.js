module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          tests: ['./tests/'],
          '@components': './src/components',
          '@utils': './src/utils',
          '@views': './src/views',
          '@ui': './src/ui',
          src: './src',
        },
      },
      ['react-native-reanimated/plugin', {relativeSourceLocation: true}],
    ],
  ],
};
