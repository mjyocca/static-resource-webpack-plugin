[![Latest Stable Version](https://img.shields.io/npm/v/static-resource-webpack-plugin.svg)](https://www.npmjs.com/package/static-resource-webpack-plugin)
[![NPM Downloads](https://img.shields.io/npm/dm/static-resource-webpack-plugin.svg)](https://www.npmjs.com/package/static-resource-webpack-plugin)
[![License](https://img.shields.io/github/license/mjyocca/static-resource-webpack-plugin.svg)](https://github.com/mjyocca/static-resource-webpack-plugin)

# Static Resource Webpack Plugin

This is a [Webpack](https://webpack.js.org/) plugin that watches your configured output path in your static resource directory of your [Salesforce](https://developer.salesforce.com/docs/atlas.en-us.sfdx_dev.meta/sfdx_dev/sfdx_dev_source_file_format.htm) SFDX project and automatically creates the necessary MetaData XML files in order to deploy/push to a Salesforce Org.

If there is already a `.resource-meta.xml` for an item in the directory w/ the corresponding name, it is ignored. 

Once created, the plugin doesn't overwrite the previously created file. To reset the resulted xml file, delete manually and re-run your webpack build.

# Requirements
* Node and npm installed on your machine
* Your SFDX Project is in source format

# Install

```bash
npm i static-resource-webpack-plugin --save-dev
```

# Configuration

<h3>Step 1: Require the Plugin into your Webpack config file</h3>

**webpack.config.js**

```js
const StaticResourcePlugin = require('static-resource-webpack-plugin')
```

<h3>Step 2: Create a new instance of the Plugin</h3>

#### Then pass in a object w/ property name _staticResPath_

**webpack.config.js**

```js
const path = require('path')
const StaticResourcePlugin = require('static-resource-webpack-plugin')

module.exports = {
    entry: './src/index.js',
    output: {
        filename: '[name].bundle.js',
        path: './force-app/main/default/staticresources',
    },
    plugins: [
        new StaticResourcePlugin()
    ],
}
```

## Options

|        Name         |     Type     |   Default   | Required | Description                                                        |
| :----------------:  | :----------: | :---------: | :------: | :----------------------------------------------------------------- |
| **`staticResPath`** |  `{String}`  | `./force-app/main/default/staticresources` |  `false`  | path to your static resource directory                             |
| **`cacheControl`**  | `{String}`   | `Public`    | `false`  | Sets default cacheControl to `Public` or `Private`   |
| **`excludeList`**       |  `{Array}`   | `undefined` | `false`  | List of file names to ignore and not create an equivalent file for |


```js
{
    staticResPath: '', // set the path to the folder to watch and create xml files for
    exclude: [''], // list of files/directories to exclude and not create a xml file for
    cacheControl: 'Private'
}
```

## Example

_Project Structure_ (Before)

```bash
** Project **
├── src
│   ├── app
│   │   ├── index.js
├── force-app
│   ├── main
│   │   ├── default
│   │   │   ├── staticresources
│   │   │   │   ├── dist
│   │   │   │   │   ├── vendor.bundle.js
│   │   │   │   │   ├── main.bundle.js
├── README.md
├── package.json
└── .gitignore
```


**webpack.config.js**

```js
new StaticResourcePlugin({
    staticResPath: path.resolve("./force-app/main/default/staticresources")
})
```

Resulting File(s)

**dist.resource-meta.xml**

```xml
<?xml version="1.0" encoding="utf-8" standalone="yes"?>
<StaticResource xmlns="http://soap.sforce.com/2006/04/metadata">
  <cacheControl>Public</cacheControl>
  <contentType>application/zip</contentType>
</StaticResource>
```

_Project Structure_ (After)

```bash
** Project **
├── src
│   ├── app
│   │   ├── index.js
├── force-app
│   ├── main
│   │   ├── default
│   │   │   ├── staticresources
│   │   │   │   ├── dist
│   │   │   │   │   ├── vendor.bundle.js
│   │   │   │   │   ├── main.bundle.js
│   │   │   │   │   dist.resource-meta.xml /* created xml file */ 
├── README.md
├── package.json
└── .gitignore
```