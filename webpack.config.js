const webpack = require('webpack');
const pjson = require('./package.json');
const path = require('path');

const thisYear = new Date().getFullYear();
const copyright
  = thisYear === 2016 ?
      'Copyright (C) 2016 Kaito Yamada' :
      `Copyright (C) 2016 - ${thisYear} Kaito Yamada`;
const banner =
`goslings-client.js ${pjson.version}
https://github.com/kaitoy/goslings-client
MIT licensed

${copyright}`;

module.exports = {
  entry: ['babel-polyfill', './src/js/index.js'],
  output: {
    filename: 'goslings-client.js',
    path: path.join(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.webpack.js', '.web.js', '.js'],
    modules: [
      path.join(__dirname, 'src'),
      'node_modules',
    ],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        enforce: 'pre',
        exclude: /node_modules/,
        loader: 'eslint-loader',
        options: {
          configFile: './.eslintrc',
          failOnError: true,
        },
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ['env'],
        },
      },
    ],
  },
  plugins: [
    new webpack.BannerPlugin({
      banner,
      raw: false,
      entryOnly: true,
    }),
  ],
};
