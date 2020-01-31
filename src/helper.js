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

const createFileStats = (files, excludeList) => {
    const { assets, resourceXML } = divideFiles(files)
    return assets
        .filter(file => {
            return (
                resourceXML.includes(
                    `${getBaseFileName(file)}.resource-meta.xml`
                ) === false
            )
        })
        .map(file => {
            const fileProps = getFileInfo(file)
            return { file, ...fileProps }
        })
}

const createXMLFiles = (files, directoryPath) => {
    const xmlList = []
    files.forEach(({ file, resourceFileName, mimeType }) => {
        const mimeTypeProp = mimeType.split('.')[1]
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

        xmlList.push({
            file,
            resourceFileName: `${directoryPath}/${resourceFileName}`,
            content: xml,
        })
    })
    return xmlList
}

module.exports = {
    getFileInfo,
    getBaseFileName,
    createFileStats,
    createXMLFiles,
}
