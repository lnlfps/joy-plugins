const findUp = require('find-up')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")

module.exports = (
  config,
  { cssModules = false, cssLoaderOptions = {}, postcssLoaderOptions = {}, dev, isServer, loaders = [] }
) => {
  const postcssConfig = findUp.sync('postcss.config.js', {
    cwd: config.context
  })
  let postcssLoader

  if (postcssConfig) {
    // Copy the postcss-loader config options first.
    const postcssOptionsConfig = Object.assign(
      {},
      postcssLoaderOptions.config,
      { path: postcssConfig }
    )

    postcssLoader = {
      loader: 'postcss-loader',
      options: Object.assign(
        {},
        postcssLoaderOptions,
        { config: postcssOptionsConfig }
      )
    }
  }

  const cssLoader = {
    loader: isServer ? 'css-loader/locals' : 'css-loader',
    options: Object.assign(
      {},
      {
        modules: cssModules,
        minimize: !dev,
        sourceMap: dev,
        importLoaders: loaders.length + (postcssLoader ? 1 : 0),
        localIdentName: dev ? '[name]_[local]_[hash:base64:5]' : '_[hash:base64:5]'
      },
      cssLoaderOptions
    )
  }

  // When not using css modules we don't transpile on the server
  if (isServer && !cssLoader.options.modules) {
    return ['ignore-loader']
  }

  // When on the server and using css modules we transpile the css
  if (isServer && cssLoader.options.modules) {
    return [cssLoader, postcssLoader, ...loaders].filter(Boolean)
  }

  return [
    dev ? {loader:'style-loader'} : MiniCssExtractPlugin.loader,
    cssLoader, postcssLoader, ...loaders
  ].filter(Boolean)
}
