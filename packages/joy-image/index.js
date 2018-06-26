module.exports = (pluginOptions = {}) => {
  return module.exports = (joyConfig = {}) => {
    return Object.assign({}, joyConfig, {
      webpack(webpackConfig, options) {
        const {isServer} = options;

        if (typeof pluginOptions === 'function') {
          pluginOptions = pluginOptions(options, webpackConfig, joyConfig)
        }
        let {
          urlLoaderOptions,
          ruleOptions
        } = pluginOptions;

        const assetPrefix = joyConfig.assetPrefix || "";

        const rule = Object.assign(
          {
            test: /\.(jpe?g|png|svg|gif)$/,
            use: {
              loader: "url-loader",
              options: Object.assign({
                limit: 8192,
                fallback: "file-loader",
                publicPath: `${assetPrefix}/_symphony/static/images/`,
                outputPath: `${isServer ? "../" : ""}static/images/`,
                name: "[name]-[hash].[ext]"
              }, urlLoaderOptions)
            }
          },
          ruleOptions)

        webpackConfig.module.rules.push(rule);

        if (typeof joyConfig.webpack === 'function') {
          return joyConfig.webpack(webpackConfig, options)
        }

        return webpackConfig
      }
    })
  }
}

