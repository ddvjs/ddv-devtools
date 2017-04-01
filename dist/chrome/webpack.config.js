'use strict'
/* global __dirname:true */
const path = require('path')
const webpack = require('webpack')
const alias = require('../alias')

var bubleOptions = {
  target: process.env.NODE_ENV === 'production' ? null : { chrome: 52 },
  objectAssign: 'Object.assign'
}

module.exports = {
  entry: {
    popups: '@popups',
    devtools: '@devtools',
    ddvtools: '@ddvtools',
    background: '@background',
    backgroundDevtools: '@backgroundDevtools',
    hook: '@content/hook.js',
    detector: '@content/detector.js'
  },
  output: {
    path: path.resolve(__dirname, './build'),
    filename: '[name].js'
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'buble-loader',
        exclude: /node_modules|vue\/dist|vuex\/dist/,
        options: bubleOptions
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          preserveWhitespace: false,
          buble: bubleOptions
        }
      },
      {
        test: /\.(png|woff2)$/,
        loader: 'url-loader?limit=0'
      }
    ]
  },
  performance: {
    hints: false
  },
  devtool: process.env.NODE_ENV !== 'production'
    ? '#inline-source-map'
    : false
}

if (process.env.NODE_ENV === 'production') {
  module.exports.plugins = [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ]
}
