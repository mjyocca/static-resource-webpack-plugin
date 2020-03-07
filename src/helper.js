const path = require('path')
const xmlBuilder = require('xmlbuilder')
const contentTypeIndex = require('./mimeType')

const getFileInfo = fileName => {
    const mimeType = getFileExt(fileName)
    const baseFileName = fileName.replace(mimeType, '')
    const resourceFileName = `${baseFileName}.resource-meta.xml`
    return {
        mimeType,
        resourceFileName,
    }
}

const getFileExt = fileName => {
    const ext = path.extname(fileName).toLowerCase()
    return ext ? ext : '.application'
}

const getBaseFileName = fileName => {
    return fileName.replace(path.extname(fileName), '')
}

const divideFiles = files => {
    return files.reduce(
        (acc, file) => {
            if (file.endsWith('.resource-meta.xml')) {
                acc.resourceXML.push(file)
            } else {
                acc.assets.push(file)
            }
            return acc
        },
        { assets: new Array(), resourceXML: new Array() }
    )
}

const excludeFile = (list, fileName) => {
    let doExclude = false
    if (list && Array.isArray(list)) {
        doExclude = list.includes(fileName)
    }
    return doExclude
}

const createFileStats = (files, exclude) => {
    const { assets, resourceXML } = divideFiles(files)
    return assets
        .filter(file => {
            return (
                !excludeFile(
                    resourceXML,
                    `${getBaseFileName(file)}.resource-meta.xml`
                ) && !excludeFile(exclude, file)
            )
        })
        .map(file => {
            const fileProps = getFileInfo(file)
            return { file, ...fileProps }
        })
}

const createXMLFiles = (files, directoryPath) => {
    return files.map(({ file, resourceFileName, mimeType }) => {
        const mimeTypeProp = mimeType.substring(1);
        let xml = xmlBuilder
            .create('StaticResource', {
                encoding: 'utf-8',
                version: '1.0',
                standalone: true,
            })
            .att('xmlns', 'http://soap.sforce.com/2006/04/metadata')
            .ele('cacheControl', 'Public')
            .up()
            .ele('contentType', contentTypeIndex[mimeTypeProp])
            .up()

        xml.end({ pretty: true })
        xml = xml.doc().toString({ pretty: true })

        return {
            file,
            resourceFileName: `${directoryPath}/${resourceFileName}`,
            content: xml,
        }
    })
}

module.exports = {
    getFileInfo,
    getBaseFileName,
    createFileStats,
    createXMLFiles,
}
