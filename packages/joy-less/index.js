
const cssLoaderConfig = require('@symph/joy-css/css-loader-config')
const commonsChunkConfig = require('@symph/joy-css/commons-chunk-config')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const {CLIENT_STATIC_FILES_PATH}  = require('@symph/joy/constants')

module.exports = (pluginOptions = {}) => {
  return (joyConfig = {}) => {
    return Object.assign({}, joyConfig, {
      webpack(webpackConfig, options) {
        if (typeof pluginOptions === 'function') {
          pluginOptions = pluginOptions(options, webpackConfig, joyConfig)
        }
        let {
          isDefault = false,
          extractCSSPlugin,
          cssModules,
          cssLoaderOptions,
          postcssLoaderOptions,
          lessLoaderOptions,
          ruleOptions
        } = pluginOptions;

        const {dev, isServer} = options

        // Support the user providing their own instance of ExtractTextPlugin.
        // If extractCSSPlugin is not defined we pass the same instance of ExtractTextPlugin to all css related modules
        // So that they compile to the same file in production
        extractCSSPlugin = extractCSSPlugin || joyConfig.extractCSSPlugin || options.extractCSSPlugin

        if (!isServer && !extractCSSPlugin) {
          extractCSSPlugin = new MiniCssExtractPlugin({
            filename: `${CLIENT_STATIC_FILES_PATH}/styles/[name]-${dev ? '' : '[hash]'}.css`,
            chunkFilename: `${CLIENT_STATIC_FILES_PATH}/styles/[id]-${dev ? '' : '[hash]'}.css`
          })
          webpackConfig.plugins.push(extractCSSPlugin)
          options.extractCSSPlugin = extractCSSPlugin
          if (!isServer) {
            webpackConfig = commonsChunkConfig(webpackConfig, /\.less$/)
          }
        }

        const lessLoader = cssLoaderConfig(webpackConfig, {
          cssModules,
          cssLoaderOptions,
          postcssLoaderOptions,
          dev,
          isServer,
          loaders: [
            {
              loader: 'less-loader',
              options: lessLoaderOptions
            }
          ]
        })
        if (isDefault) {
          options.defaultLoaders.less = lessLoader;
        }
        const rule = Object.assign(
          {
            test: /\.(less)$/,
            use: lessLoader
          },
          ruleOptions)
        webpackConfig.module.rules.push(rule)

        if (typeof joyConfig.webpack === 'function') {
          return joyConfig.webpack(webpackConfig, options)
        }

        return webpackConfig
      }
    })
  }
}
