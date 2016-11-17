const webpack = require('webpack');
const pjson = require('./package.json');

const thisYear = new Date().getFullYear();
const copyright
  = thisYear === 2016 ?
      'Copyright (C) 2016 Kaito Yamada' :
      `Copyright (C) 2016 - ${thisYear} Kaito Yamada`;

module.exports = {
  entry: './src/js/index.js',
  output: {
    filename: 'goslings-client.js',
    path: './dist',
  },
  resolve: {
    extensions: ['', '.webpack.js', '.web.js', '.js'],
  },
  module: {
    preLoaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint',
      },
    ],
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['es2015'],
          plugins: ['syntax-async-functions', 'transform-regenerator'],
        },
      },
    ],
  },
  eslint: {
    configFile: './.eslintrc',
    failOnError: true,
  },
  plugins: [
    new webpack.BannerPlugin(
      'goslings-client.js ' + pjson.version + '\n' +
      'https://github.com/kaitoy/goslings-client\n' +
      'MIT licensed\n\n' +
      copyright,
      {
        raw: false,
        entryOnly: true,
      }
    ),
  ],
};
