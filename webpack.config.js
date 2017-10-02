const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MinifyPlugin = require('babel-minify-webpack-plugin');

module.exports = {
  entry: './source/javascript/index.js',
  output: {
    path: __dirname,
    filename: './build/bundle.js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'TDC Daekningskort',
      filename: './build/index.html',
      template: './source/index.ejs',
    }),
    new FaviconsWebpackPlugin({
      logo: './source/icons/favicon.png',
      prefix: './build/icons-[hash]/',
      emitStats: false,
      statsFilename: 'iconstats-[hash].json',
      persistentCache: true,
      inject: true,
      background: '#fff',
      title: 'Webpack App',

      icons: {
        android: false,
        appleIcon: false,
        appleStartup: false,
        coast: false,
        favicons: true,
        firefox: false,
        opengraph: false,
        twitter: false,
        yandex: false,
        windows: false,
      },
    }),
    new MinifyPlugin(),
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
        exclude: /(node_modules|bower_components|leaflet)/,
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
