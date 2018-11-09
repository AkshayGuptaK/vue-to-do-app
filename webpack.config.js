'use strict'

const path = require('path')
const { VueLoaderPlugin } = require('vue-loader')

module.exports = {
   module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
        },
        {
          test: /\.vue$/,
          loader: 'vue-loader'
        },
        {
          test: /\.css$/,
          use: [
            'vue-style-loader',
            'css-loader'
          ]
        },
        {
          test: /\.png$/,
          loader: 'url-loader'
        }
      ]
    },
    plugins: [
        new VueLoaderPlugin()
    ]
}
