const cssLoaderConfig = require('./css-loader-config')
const commonsChunkConfig = require('./commons-chunk-config')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const {CLIENT_STATIC_FILES_PATH}  = require('@symph/joy/constants')

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

        if (!isServer && !extractCSSPlugin) {
          extractCSSPlugin = new MiniCssExtractPlugin({
            filename: `${CLIENT_STATIC_FILES_PATH}/styles/[name]-${dev ? '' : '[hash]'}.css`,
            chunkFilename: `${CLIENT_STATIC_FILES_PATH}/styles/[id]-${dev ? '' : '[hash]'}.css`
          })
          webpackConfig.plugins.push(extractCSSPlugin)
          options.extractCSSPlugin = extractCSSPlugin
          if (!isServer) {
            webpackConfig = commonsChunkConfig(webpackConfig)
          }
        }

        const cssLoader = cssLoaderConfig(webpackConfig, {
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
