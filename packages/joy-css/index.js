const cssLoaderConfig = require('./css-loader-config')

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

        const cssLoader = cssLoaderConfig(webpackConfig, options, nextConfig, {
          cssModules,
          cssLoaderOptions,
          postcssLoaderOptions,
          extractCSSPlugin
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
