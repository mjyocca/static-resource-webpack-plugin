const { promises: fs } = require('fs')
const validateOptions = require('schema-utils')
const schema = require('../schema.json')
const { createFileStats, createXMLFiles } = require('./helper')
const { writeFiles } = require('./asyncFile')
const PLUGIN_NAME = 'StaticResourceWebpackPlugin'

class StaticResourceWebpackPlugin {
    constructor(options) {
        // validate
        validateOptions(schema, options, {
            name: PLUGIN_NAME,
            baseDataPath: 'options',
        })
        this.options = options
        this.cache = {}
    }

    apply(compiler) {
        compiler.hooks.afterEmit.tap(PLUGIN_NAME, compilation => {
            const stats = compilation.getStats()
            // will be required to run
            const staticResPath = this.options.staticResPath
            // be a ignore these files type list just in case
            // static resource folder is located somewhere else
            const exclusionList = this.options.exclusionList

            this.readStaticResFolder(staticResPath, exclusionList)
        })
    }

    async readStaticResFolder(resPath, excludeList) {
        // get all files from fs path
        const files = await fs.readdir(resPath)
        // create array of stats to create xml files from
        const fileStats = createFileStats(files, excludeList)
        // create xml objects to write to the file system
        const filesToCreate = createXMLFiles(fileStats, resPath)
        // write to file system
        await writeFiles(filesToCreate)
    }
}

module.exports = StaticResourceWebpackPlugin
