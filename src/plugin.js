const path = require('path')
const { promisify } = require('util')
const fs = require('fs')
const validateOptions = require('schema-utils')
const schema = require('../schema.json')
const { createFileStats, createXMLFiles } = require('./helper')
const { writeFiles } = require('./asyncFile')
const PLUGIN_NAME = 'StaticResourceWebpackPlugin'

const readdirAsync = promisify(fs.readdir);

const defaultPath = './force-app/main/default/staticresources';

class StaticResourceWebpackPlugin {
    constructor(options = {}) {
        // validate
        validateOptions(schema, options, {
            name: PLUGIN_NAME,
            baseDataPath: 'options',
        })
        this.options = options
    }

    apply(compiler) {
        compiler.hooks.afterEmit.tap(PLUGIN_NAME, compilation => {
            const stats = compilation.getStats()

            const {
                staticResPath = defaultPath,
                exclusionList
            } = this.options

            this.readStaticResFolder(staticResPath, exclusionList)
        })
    }

    async readStaticResFolder(resPath, exclude) {
        // get all files from fs path
        const files = await readdirAsync(path.resolve(resPath))
        // create array of stats to create xml files from
        const fileStats = createFileStats(files, exclude)
        // create xml objects to write to the file system
        const filesToCreate = createXMLFiles(fileStats, resPath)
        // write to file system
        await writeFiles(filesToCreate)
    }
}

module.exports = StaticResourceWebpackPlugin
