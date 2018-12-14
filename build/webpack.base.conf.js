'use strict'
const path = require('path')
const utils = require('./utils')
const config = require('../config')
const HtmlWebpackPlugin = require('html-webpack-plugin')

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

const createLintingRule = () => ({
  test: /\.(js|vue)$/,
  loader: 'eslint-loader',
  enforce: 'pre',
  include: [resolve('src')],
  options: {
    formatter: require('eslint-friendly-formatter'),
    emitWarning: !config.dev.showEslintErrorsInOverlay
  }
})
const timesTamp = Date.now();
module.exports = {
  context: path.resolve(__dirname, '../'),
  entry: {
    app: ["babel-polyfill", "./src/main.js"]
  },
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src'),
    }
  },
  module: {
    rules: [
      ...(config.dev.useEslint ? [createLintingRule()] : []),
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src')],
        query: {
          plugins: process.env.NODE_ENV == 'production' ? ["transform-remove-console"] : []
        }
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[ext]?[hash]')
        }
      }
    ]
  },
  plugins: (()=>{
    var pugList = ['helps/help',
                   'helps/settingpermission', 
                   'helps/customizepay',
                   'helps/customizemoney', 
                   'index', 
                   'complate', 
                   'failure'];
    var result = [];
    pugList.forEach(pug=>{
      result.push(
        new HtmlWebpackPlugin({
          filename: `${pug}.html`,
          template: `!!pug-loader!${pug}.pug`,
          inject: false,      
          minify:{
            minifyCSS:true,
            minifyJS:true
          },
          injectExtras: {           
            variable:{
              times_tamp: timesTamp,
              url: process.env.NODE_ENV === 'development' ? 
                   require('../config/dev.env').RESUEST_HOST || '' : 
                   require('../config/prod.env').RESUEST_HOST || ''
            }
          }
        })
      );
    });
    return result;
  })(),
  node: {
    // prevent webpack from injecting useless setImmediate polyfill because Vue
    // source contains it (although only uses it if it's native).
    setImmediate: false,
    // prevent webpack from injecting mocks to Node native modules
    // that does not make sense for the client
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  },
  
}
