const path = require('path');

module.exports = {
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'scss',
      patterns: [path.resolve(__dirname, './src/styles/globals.scss')],
    },
  },
  configureWebpack: {
    resolve: {
      symlinks: false,
    },
  },
};
