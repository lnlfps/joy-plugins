const ExtractTextPlugin = require('extract-text-webpack-plugin')
const cssLoaderConfig = require('./css-loader-config')
const commonsChunkConfig = require('./commons-chunk-config')

module.exports = (pluginOptions = {}) => {
  return (nextConfig = {}) => {
    return Object.assign({}, nextConfig, {
      webpack(webpackConfig, options) {

        if (typeof pluginOptions === 'function') {
          pluginOptions = pluginOptions(options, webpackConfig, nextConfig)
        }
        let {
          isDefault = false,
          cssModules,
          extractCSSPlugin,
          cssLoaderOptions,
          postcssLoaderOptions,
          ruleOptions
        } = pluginOptions;

        const {dev, isServer} = options
        // Support the user providing their own instance of ExtractTextPlugin.
        // If extractCSSPlugin is not defined we pass the same instance of ExtractTextPlugin to all css related modules
        // So that they compile to the same file in production
        extractCSSPlugin = extractCSSPlugin || nextConfig.extractCSSPlugin || options.extractCSSPlugin

        if (!extractCSSPlugin) {
          extractCSSPlugin = new ExtractTextPlugin({
            filename: 'static/style.css',
            allChunks: true
          })
          webpackConfig.plugins.push(extractCSSPlugin)
          options.extractCSSPlugin = extractCSSPlugin
          if (!isServer) {
            webpackConfig = commonsChunkConfig(webpackConfig)
          }
        }

        let cssLoader = cssLoaderConfig(webpackConfig, extractCSSPlugin, {
          cssModules,
          cssLoaderOptions,
          postcssLoaderOptions,
          dev,
          isServer
        })
        if (isDefault) {
          options.defaultLoaders.css = cssLoader
        }

        const rule = Object.assign(
          {},
          {
            test: /\.css$/,
            use: cssLoader,
          },
          ruleOptions)
        webpackConfig.module.rules.push(rule)

        if (typeof nextConfig.webpack === 'function') {
          return nextConfig.webpack(webpackConfig, options)
        }

        return webpackConfig
      }
    })
  }
}
