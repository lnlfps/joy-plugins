const ExtractTextPlugin = require('extract-text-webpack-plugin')
const cssLoaderConfig = require('@symph/joy-css/css-loader-config')
const commonsChunkConfig = require('@symph/joy-css/commons-chunk-config')

module.exports = (nextConfig = {}) => {
    return Object.assign({}, nextConfig, {
        webpack(config, options) {
            if (!options.defaultLoaders) {
                throw new Error(
                    'This plugin is not compatible with Next.js versions below 5.0.0 https://err.sh/next-plugins/upgrade'
                )
            }

            const {dev, isServer} = options
            const {
                cssModules,
                cssLoaderOptions,
                lessLoaderOptions = {},
                cssRuleOptions
            } = nextConfig
            // Support the user providing their own instance of ExtractTextPlugin.
            // If extractCSSPlugin is not defined we pass the same instance of ExtractTextPlugin to all css related modules
            // So that they compile to the same file in production
            let extractCSSPlugin =
                nextConfig.extractCSSPlugin || options.extractCSSPlugin

            if (!extractCSSPlugin) {
                extractCSSPlugin = new ExtractTextPlugin({
                    filename: 'static/style.css',
                    allChunks: true
                })
                config.plugins.push(extractCSSPlugin)
                options.extractCSSPlugin = extractCSSPlugin
                if (!isServer) {
                    config = commonsChunkConfig(config, /\.less$/)
                }
            }

            options.defaultLoaders.less = cssLoaderConfig(config, extractCSSPlugin, {
                cssModules,
                cssLoaderOptions,
                dev,
                isServer,
                loaders: [
                    {
                        loader: 'less-loader',
                        options: lessLoaderOptions
                    }
                ]
            })

            const rule = Object.assign(
                {},
                {
                    test: /\.(less)$/,
                    use: options.defaultLoaders.less
                },
                cssRuleOptions)
            config.module.rules.push(rule)

            if (typeof nextConfig.webpack === 'function') {
                return nextConfig.webpack(config, options)
            }

            return config
        }
    })
}
