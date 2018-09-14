const findUp = require('find-up')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const BuildManifestPlugin = require('./build-manifest-plugin-webpack')
const {CLIENT_STATIC_FILES_PATH}  = require('@symph/joy/constants')

module.exports = (
  webpackConfig, context, nextConfig,
  {cssModules = false, cssLoaderOptions = {}, postcssLoaderOptions = {}, loaders = [], extractCSSPlugin}
) => {
  let { dev, isServer} = context

  // Support the user providing their own instance of ExtractTextPlugin.
  // If extractCSSPlugin is not defined we pass the same instance of ExtractTextPlugin to all css related modules
  // So that they compile to the same file in production
  extractCSSPlugin = extractCSSPlugin || nextConfig.extractCSSPlugin || context.extractCSSPlugin
  if (!isServer && !extractCSSPlugin && !dev) {
    extractCSSPlugin = new MiniCssExtractPlugin({
      filename: `${CLIENT_STATIC_FILES_PATH}/styles/[name].${dev ? '' : '[hash]'}.css`,
      chunkFilename: `${CLIENT_STATIC_FILES_PATH}/styles/style.[hash].css`
    })
    webpackConfig.plugins.push(extractCSSPlugin)
    context.extractCSSPlugin = extractCSSPlugin

    webpackConfig.optimization.splitChunks.cacheGroups.styles = {
      name: 'styles',
      test: /\.(css|less|sass|scss)$/,
      chunks: 'all',
      enforce: true
    }
    if(!isServer){
      webpackConfig.plugins.push(new BuildManifestPlugin())
    }
  }

  // postcss
  const postcssConfig = findUp.sync('postcss.config.js', {
    cwd: webpackConfig.context
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
