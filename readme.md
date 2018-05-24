# @symph/joy Plugins

## plugins

- [@symph/joy-css](./packages/joy-css)
- [@symph/joy-less](./packages/joy-less)
- [@symph/joy-image](./packages/joy-image)


## Adding a plugin

> :warning: Before adding a plugin in this repository please create an issue to establish if it should be an official plugin or not.

1. Create a directory under the `packages` folder
2. Add `package.json` to the directory with these contents:
```
{
  "name": "@symph/joy-<NAME>",
  "version": "0.0.1",
  "main": "index.js",
  "license": "MIT",
  "repository": "lnlfps/joy-plugins"
}
```

3. Add a `index.js` file with the plugin code
4. Add a `readme.md` explaining what the plugin does, how to install, and how to configure it
5. Submit a pull request
