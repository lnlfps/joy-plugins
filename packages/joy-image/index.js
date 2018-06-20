module.exports = (symphonyConfig = {}) => {
  return Object.assign({}, symphonyConfig, {
    webpack(config, options) {
      let { dev } = options;
      if (!options.defaultLoaders) {
        throw new Error(
          'This plugin is not compatible with Symphony.js'
        )
      }
      config.module.rules.push({
        test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              publicPath: '/_symphony/static/images',
              outputPath: 'static/images',
              name: dev ? "[name]-[hash].[ext]" : "[hash].[ext]"
            }
          }
        ]
      });

      if (typeof symphonyConfig.webpack === 'function') {
        return symphonyConfig.webpack(config, options)
      }

      return config
    }
  })
};
