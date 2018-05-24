# Image Loader 

Tt's an image loader for symphony-joy, we can require a image in jsx. 


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
<img src={require("logo.jpg")}/>
```


## Configuring

Create a `joy.config.js` in your project

```javascript
// joy.config.js
const withImage = require('@symph/joy-image')
module.exports = withImage()
```
