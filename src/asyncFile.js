const fs = require('fs')

const writeFileAsync = (fileName, data) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(fileName, data, err => {
            if (err) reject(err)
            else resolve()
        })
    })
}

const writeFiles = files => {
    const writeAllFiles = files.map(({ resourceFileName, content }) => writeFileAsync(resourceFileName, content))
    return Promise.all(writeAllFiles).catch(err => {
        console.error(err)
    })
}

module.exports = {
    writeFiles,
}
