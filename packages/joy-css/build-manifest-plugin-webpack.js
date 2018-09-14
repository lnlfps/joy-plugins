// @flow
const { RawSource } = require('webpack-sources')
const {BUILD_MANIFEST, ROUTE_NAME_REGEX, IS_BUNDLED_PAGE_REGEX, CLIENT_STATIC_FILES_RUNTIME_MAIN} = require('@symph/joy/constants')

// This plugin creates a build-manifest.json for all assets that are being output
// It has a mapping of "entry" filename to real filename. Because the real filename can be hashed in production
module.exports = class BuildManifestPluginWebpack {
  apply (compiler) {
    compiler.hooks.emit.tapAsync('NextJsBuildManifest', (compilation, callback) => {
      const {chunks} = compilation
      let originAssetMap = {};
      if(compilation.assets[BUILD_MANIFEST]){
        originAssetMap = JSON.parse(compilation.assets[BUILD_MANIFEST].source())
      }
      const assetMap = Object.assign({files: []}, originAssetMap)

      const stylesChunk = chunks.find((c) => c.name === 'styles')

      // const stylesJsFiles = stylesChunk && stylesChunk.files.length > 0 ? stylesChunk.files.filter((file) => /\.js$/.test(file)) : []
      assetMap.files.push(...stylesChunk.files)

      compilation.assets[BUILD_MANIFEST] = new RawSource(JSON.stringify(assetMap, null, 2))
      callback()
    })
  }
}
