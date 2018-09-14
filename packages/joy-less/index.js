
const cssLoaderConfig = require('@symph/joy-css/css-loader-config')

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

        const lessLoader = cssLoaderConfig(webpackConfig, options, joyConfig, {
          cssModules,
          cssLoaderOptions,
          postcssLoaderOptions,
          extractCSSPlugin,
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
