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
const withCSS = require('@symph/joy-css')
module.exports = withCSS()
```

Create a CSS file `style.css`

```css
.example {
  font-size: 50px;
}
```

Create a page file `pages/index.js`

```js
import "../style.css"

export default () => <div className="example">Hello World!</div>
```

### With CSS modules

```js
// joy.config.js
const withCSS = require('@symph/joy-css')
module.exports = withCSS({
  cssModules: true
})
```

Create a CSS file `style.css`

```css
.example {
  font-size: 50px;
}
```

Create a page file `pages/index.js`

```js
import css from "../style.css"

export default () => <div className={css.example}>Hello World!</div>
```

### With CSS modules and options

You can also pass a list of options to the `css-loader` by passing an object called `cssLoaderOptions`.

For instance, [to enable locally scoped CSS modules](https://github.com/css-modules/css-modules/blob/master/docs/local-scope.md#css-modules--local-scope), you can write:

```js
// joy.config.js
const withCSS = require('@symph/joy-css')
module.exports = withCSS({
  cssModules: true,
  cssLoaderOptions: {
    importLoaders: 1,
    localIdentName: "[local]___[hash:base64:5]",
  }
})
```

Create a CSS file `styles.css`

```css
.example {
  font-size: 50px;
}
```

Create a page file `pages/index.js` that imports your stylesheet and uses the hashed class name from the stylesheet

```js
import css from "../style.css"

const Component = props => {
  return (
    <div className={css.backdrop}>
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
const withCSS = require('@symph/joy-css')
module.exports = withCSS()
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

Create a CSS file `style.css` the CSS here is using the css-variables postcss plugin.

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
const withCSS = require('@symph/joy-css')
module.exports = withCSS({
  webpack(config, options) {
    return config
  }
})
```
