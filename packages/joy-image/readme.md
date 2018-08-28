# Image Loader 

Tt's an image loader for @symph/joy, we can require a image in jsx. 


## Installation

```
npm install --save @symph/joy-image
```

or

```
yarn add @symph/joy-image
```


## Usage

```javascript
<img src={require("./logo.jpg")}/>
```


## Configuring

Create a `joy.config.js` in your project

```javascript
// joy.config.js
const withImageLoader = require('@symph/joy-image')

module.exports = {
  plugins: [
    withImageLoader({limit: 8192})
  ]
}
```

### Options 

#### urlLoaderOptions

type: object, default:

```javascript
{
  limit: 8192,
  publicPath: `${assetPrefix}/_joy/static/images/`,
  outputPath: `${isServer ? "../" : ""}static/images/`,
  name: "[name]-[hash].[ext]"
}
```

For details, please see
- [url-loader](https://github.com/webpack-contrib/url-loader)
- [file-loader](https://github.com/webpack-contrib/file-loader)

### ruleOptions

type: object, default:
```javascript
{
  test: /\.(jpe?g|png|svg|gif)$/
}
```

We can used this to custom a rule in [webpackConfig.module.rules](https://webpack.js.org/configuration/module/#rule), such as the properties [test](https://webpack.js.org/configuration/module/#rule-test), [include](https://webpack.js.org/configuration/module/#rule-include), [exclude](https://webpack.js.org/configuration/module/#rule-exclude) and [resource](https://webpack.js.org/configuration/module/#rule-resource) etc.
