const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MinifyPlugin = require('babel-minify-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './source/javascript/index.js',
  output: {
    path: __dirname,
    filename: './build/index.js',
  },
  context: __dirname,
  plugins: [
    new HtmlWebpackPlugin({
      title: 'TDC Dækningskort',
      filename: './build/index.html',
      template: './source/index.ejs',
    }),
    new MinifyPlugin(),
    new CopyWebpackPlugin([
      {
        from: path.join(__dirname, '/static'),
        to: path.join(__dirname, 'build/static'),
      },
    ]),
  ],
  module: {
    loaders: [
      {
        test: /\.(png|jpg)$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'url-loader',
      },
      {
        test: /\.css$/,
        exclude: /(node_modules|bower_components)/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              minimize: true,
            },
          },
        ],
      },
      {
        test: /\.js$/,
        exclude: [
          /(node_modules|bower_components|leaflet)/,
        ],
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env'],
            plugins: ['transform-runtime'],
          },
        },
      },
    ],
  },
};
