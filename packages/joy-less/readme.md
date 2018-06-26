# @symph/joy + CSS

Import `.css` files in your @symph/joy project

## Installation

```
npm install --save @symph/joy-css
```

or

```
yarn add @symph/joy-css
```

## Usage

The stylesheet is compiled to `.joy/static/style.css`. You have to include it into the page using a custom [`_document.js`](https://github.com/lnlfps/symph-joy#custom-document). The file will be served from `/_symphony/static/style.css`

```js
// ./pages/_document.js
import Document, { Head, Main, JoyScript } from '@symph/joy/document'

export default class MyDocument extends Document {
  render() {
    return (
      <html>
        <Head>
          <link rel="stylesheet" href="/_symphony/static/style.css" />
        </Head>
        <body>
          <Main />
          <JoyScript />
        </body>
      </html>
    )
  }
}
```

### Without CSS modules

Create a `joy.config.js` in your project

```js
// joy.config.js
const withLess = require('@symph/joy-less')

module.exports = {
  plugins: [
    withLess()
  ]
}
```

Create a CSS file `style.less`

```css
.example {
  font-size: 50px;
}
```

Create a page file `src/index.js`

```js
import "../style.less"

export default () => <div className="example">Hello World!</div>
```

### With CSS modules

```js
// joy.config.js
const withLess = require('@symph/joy-less')
module.exports = {
  plugins: [
    withLess({cssModules: true})
  ]
}
```

Create a CSS file `style.less`

```css
.example {
  font-size: 50px;
}
```

Create a page file `src/index.js`

```js
import styles from "../style.less"

export default () => <div className={styles.example}>Hello World!</div>
```

### With CSS modules and options

You can also pass a list of options to the `css-loader` by passing an object called `cssLoaderOptions`.

For instance, [to enable locally scoped CSS modules](https://github.com/css-modules/css-modules/blob/master/docs/local-scope.md#css-modules--local-scope), you can write:

```js
// joy.config.js
const withLess = require('@symph/joy-less')
module.exports = {
  plugins: [
    withLess({
      cssModules: true,
      cssLoaderOptions: {
        importLoaders: 1,
        localIdentName: "[local]___[hash:base64:5]",
      }
    })
  ]
}
```

Create a CSS file `styles.less`

```css
.example {
  font-size: 50px;
}
```

Create a page file `src/index.js` that imports your stylesheet and uses the hashed class name from the stylesheet

```js
import styles from "../style.less"

const Component = props => {
  return (
    <div className={styles.example}>
      ...
    </div>
  )
}

export default Component
```

Your exported HTML will then reflect locally scoped CSS class names.

For a list of supported options, [refer to the webpack `css-loader` README](https://github.com/webpack-contrib/css-loader#options).

```js
// ./pages/_document.js
import Document, { Head, Main, JoyScript } from '@symph/joy/document'

export default class MyDocument extends Document {
  render() {
    return (
      <html>
        <Head>
          <link rel="stylesheet" href="/_symphony/static/style.css" />
        </Head>
        <body>
          <Main />
          <JoyScript />
        </body>
      </html>
    )
  }
}
```


### PostCSS plugins

Create a `joy.config.js` in your project

```js
// joy.config.js
const withLess = require('@symph/joy-less')
module.exports = {
  plugins: [
    withLess()
  ]
}
```

Create a `postcss.config.js`

```js
module.exports = {
  plugins: {
    // Illustrational
    'postcss-css-variables': {}
  }
}
```

Create a CSS file `style.less` the CSS here is using the css-variables postcss plugin.

```css
:root {
  --some-color: red;
}

.example {
  /* red */
  color: var(--some-color);
}
```

When `postcss.config.js` is not found `postcss-loader` will not be added and will not cause overhead.

### Configuring

Optionally you can add your custom @symph/joy configuration as parameter

```js
// joy.config.js
const withLess = require('@symph/joy-less')
module.exports = {
  plugins: [
    withLess({cssModules: true})
  ]
}
```

### Options 

##### cssModules

type: bool, default: false

enable locally scoped CSS modules, [to enable locally scoped CSS modules](https://github.com/css-modules/css-modules/blob/master/docs/local-scope.md#css-modules--local-scope).


#### extractCSSPlugin

type: [extract-text-webpack-plugin](https://github.com/webpack-contrib/extract-text-webpack-plugin), default: 

```js
const ExtractTextPlugin = require('extract-text-webpack-plugin')

extractCSSPlugin = new ExtractTextPlugin({
  filename: 'static/style.css',
  allChunks: true
})
```
Is instance of [extract-text-webpack-plugin](https://github.com/webpack-contrib/extract-text-webpack-plugin), if the value is null, a default item will be created by plugin.

#### cssLoaderOptions

type: object, default: 

```js
{
  modules: cssModules,
  minimize: !dev,
  sourceMap: dev,
  importLoaders: loaders.length + (postcssLoader ? 1 : 0),
  localIdentName: '[name]_[local]_[hash:base64:5]'
}
```

For a list of supported options, [refer to the webpack `css-loader` README](https://github.com/webpack-contrib/css-loader#options).

#### postcssLoaderOptions

type: object, default: 

```js
{
  config:{
    path: 'postcss.config.js'
  }
}
```
For a list of supported options, [refer to the `postcss-loader` README](https://github.com/postcss/postcss-loader#options).

#### lessLoaderOptions

type: object, default: null

For details, [refer to the webpack `less-loader` README](https://github.com/webpack-contrib/less-loader).

### ruleOptions

type: object, default:
```javascript
{
  test: /\.less$/,
}
```

We can used this to custom a rule in [webpackConfig.module.rules](https://webpack.js.org/configuration/module/#rule), such as the properties [test](https://webpack.js.org/configuration/module/#rule-test), [include](https://webpack.js.org/configuration/module/#rule-include), [exclude](https://webpack.js.org/configuration/module/#rule-exclude) and [resource](https://webpack.js.org/configuration/module/#rule-resource) etc.