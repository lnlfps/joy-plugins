# @symph/joy + LESS

在`@symph/joy`项目中使用`.less`样式，需要添加本插件。需要添加本插件。可使用不同的配置，创建多个插件实例，来处理不同模块下的样式。

## 安装

```
npm install --save @symph/joy-less
```

或者

```
yarn add @symph/joy-less
```

## 使用方法

开发模式时，使用webpack `style-loader`插件将样式打包到chunk代码中，以便实现热更新，即在修改样式后，不用刷新浏览器就可看到修改后的效果。

> `style-loader`加载样式有个副作用，因为css样式是在js输出界面标签元素后，才注入到页面中的，所以开始会有一瞬间，html标签是没有样式的，界面可能会闪烁一下，这个问题在生产包里不可见的，也不会影响调试，请放心使用。

打生产包时，使用`mini-css-extract-plugin`来提取所有的样式到`.joy/static/styles/style.css`中，以便提高加载效率，这个文件的引用会自动添加到`_document.js`文档中，在初始请求的返回的html文档中，会包含该样式的引用。

### 关闭 CSS modules

如果不使用css modules, 在`.less`文件中定义的样式，都是全局的，任何地方都可以使用其定义的样式。

在项目中创建 `joy.config.js` 配置文件。

```javascript
// joy.config.js
const withLess = require('@symph/joy-less')

module.exports = {
  plugins: [
    withLess()
  ]
}
```

创建一个LESS文件 `src/style.less`

```css
.example {
  font-size: 50px;
}
```

创建界面组件 `src/index.js`，并使用样式。

```javascript
import "../style.less"

export default () => <div className="example">Hello World!</div>
```

### 启用 CSS modules

如果开启css modules，`.less`文件中定义的样式名称，将只在这个less文件中可见，不会和其他less文件中定义同名样式冲突。外部使用这些样式时，需要通过`import`的方式来导入这个less文

```javascript
// joy.config.js
const withLess = require('@symph/joy-less')
module.exports = {
  plugins: [
    withLess({cssModules: true})
  ]
}
```

创建LESS文件 `style.less`

```css
.example {
  font-size: 50px;
}
```

创建界面组件 `src/index.js`，并使用样式。

```javascript
import styles from "../style.less"

export default () => <div className={styles.example}>Hello World!</div>
```

### 启动CSS modules和自定义配置

你依然可以传递定义配置给`css-loader`，请使用`cssLoaderOptions`配置项。

例如, [创建带域名称的样式](https://github.com/css-modules/css-modules/blob/master/docs/local-scope.md#css-modules--local-scope)，代码如下:

```javascript
// joy.config.js
const withLess = require('@symph/joy-less')
module.exports = {
  plugins: [
    withLess({
      cssModules: true,
      cssLoaderOptions: {
        localIdentName: "[local]___[hash:base64:5]",
      }
    })
  ]
}
```

创建LESS样式文件 `styles.less`。

```css
.example {
  font-size: 50px;
}
```


创建界面组件 `src/index.js`，并使用带有域名和hash的样式名称。

```javascript
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

如果你将其导出为静态页面，样式变量`styles.example`将转化为对应的字符串样式名称，例如：`<div class="index_examole__f2ae1">`。

`css-loader`支持的配置参数列表，请查阅 [css-loader README](https://github.com/webpack-contrib/css-loader#options).


### PostCSS 

在项目中创建 `joy.config.js` 配置文件

```javascript
// joy.config.js
const withLess = require('@symph/joy-less')
module.exports = {
  plugins: [
    withLess()
  ]
}
```

在项目中创建PostCSS的配置文件 `postcss.config.js`，并添加`postcss-css-variables`插件来支持css变量。

```javascript
module.exports = {
  plugins: {
    // Illustrational
    'postcss-css-variables': {}
  }
}
```

创建样式文件 `src/style.less`，此时`.less`文件中可使用`postcss-css-variables`插件提供的功能了。

```css
:root {
  --some-color: red;
}

.example {
  /* red */
  color: var(--some-color);
}
```

如果`postcss.config.js`文件不存在，`postcss-loader`将不会生效，也不会添加到loader链中。

### 加载不同模块的样式

在项目中创建 `joy.config.js` 配置文件

```javascript
const withLESS = require('@symph/joy-css')
const path = require('path')

module.exports = {
  plugins: [
    // 处理应用内的样式
    withLESS({
      cssModules: true,
      ruleOptions: {
        exclude: [
          path.resolve(__dirname, './node_modules/')
        ]
      }
    }),
    // 处理node_module中的样式
    withLESS({
      cssModules: false,
      ruleOptions: {
        include: [
          path.resolve(__dirname, './node_modules/')
        ]
      }
    })
  ]
}
```

## 自定义配置

你可以添加自定义的配置来定义如何加载和使用less样式。

```javascript
// joy.config.js
const withLess = require('@symph/joy-less')
module.exports = {
  plugins: [
    withLess({cssModules: true})
  ]
}
```

### cssModules

type: bool, default: false

是否开启CSS modules，使用参考：[to enable locally scoped CSS modules](https://github.com/css-modules/css-modules/blob/master/docs/local-scope.md#css-modules--local-scope).


### extractCSSPlugin

type: `mini-css-extract-plugin`, default: 

```javascript
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const {CLIENT_STATIC_FILES_PATH}  = require('@symph/joy/constants')

extractCSSPlugin = new MiniCssExtractPlugin({
  filename: `${CLIENT_STATIC_FILES_PATH}/styles/[name].${dev ? '' : '[hash]'}.css`,
  chunkFilename: `${CLIENT_STATIC_FILES_PATH}/styles/style.[hash].css` //提取后的样式文件
})
```

如果这个值为空，插件将提供一个默认配置。

### cssLoaderOptions

type: object, default: 

```javascript
{
  modules: cssModules,
  minimize: !dev,
  sourceMap: dev,
  importLoaders: loaders.length + (postcssLoader ? 1 : 0),
  localIdentName: '[name]_[local]_[hash:base64:5]'
}
```

可选配置项, 请查阅[webpack `css-loader` README](https://github.com/webpack-contrib/css-loader#options).

### postcssLoaderOptions

type: object, default: 

```javascript
{
  config:{
    path: 'postcss.config.js'
  }
}
```
可选配置项, 请查阅[`postcss-loader` README](https://github.com/postcss/postcss-loader#options).

### lessLoaderOptions

type: object, default: 
```javascript
{
  javascriptEnabled: true
}
```

可选配置项，请查阅[webpack `less-loader` README](https://github.com/webpack-contrib/less-loader).

### ruleOptions

type: object, default:

```javascript
{
  test: /\.less$/,
}
```

可用配置项，请查阅[webpackConfig.module.rules](https://webpack.js.org/configuration/module/#rule)。
