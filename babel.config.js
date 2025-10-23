module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          extensions: [
            '.ios.js',
            '.android.js',
            '.js',
            '.jsx',
            '.json',
            '.tsx',
            '.ts',
            '.svg',
          ],
          alias: {
            '@components': './src/components',
            '@screens': './src/screens',
            '@navigation': './src/navigation',
            '@assets': './assets',
            '@utils': './src/utils',
            '@constants': './src/constants',
            '@config': './src/config',
            '@theme': './src/theme',
            '@store': './src/store',
          },
        },
      ],
    ],
  };
};
