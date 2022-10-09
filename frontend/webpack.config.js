const { Tune } = require("@mui/icons-material");
const path = require("path");
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')
const webpack = require("webpack");

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "../backend/dataappentry/static/frontend"),
    filename: "[name].js",
  },
  resolve:{
    fallback:{
      "stream":require.resolve("stream-browserify"),
    }
  }
  ,
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.(scss|css)$/,
        exclude: /node_modules/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader',
          ]
      },
      {
        test: /\.(png|jpg|gif|mp4)$/,
        exclude: /node_modules/, 
        use: [{
          loader: 'url-loader',
          // loader: 'file-loader',
          options: {
            esModule: false,
            name: 'images/[name].[ext]',
            limit: 10240
          }
        }]
      },
      {
        test: /\.(svg)$/,
        exclude: /node_modules/, 
        use: [{
          loader: 'url-loader',
        }]
      },
      
      {
        test: /\.(htm|html)$/,
        loader: 'html-loader'
      },
      
    ],
  },
  optimization: {
    minimize: true,
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        // This has effect on the react lib size
        NODE_ENV: JSON.stringify("development"),
      },
    }),
    new NodePolyfillPlugin()
  ],
};
