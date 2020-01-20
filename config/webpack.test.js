const webpack = require('webpack')
const merge = require('webpack-merge')
const ErrorOverlayPlugin = require('error-overlay-webpack-plugin')

const common = require('./webpack.common')

module.exports = merge(common, {
  mode: 'production',
  devtool: 'cheap-module-source-map', 
  optimization: {
    minimize: false
  },
  plugins: [
    new webpack.DefinePlugin({ 'process.env.NODE_ENV': JSON.stringify('production') }),
    new ErrorOverlayPlugin(),
  ],
})