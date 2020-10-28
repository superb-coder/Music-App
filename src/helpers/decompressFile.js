const gunzip = require('gunzip-file');
module.exports = {
    decompressFile: function (zipFilename, filename){
        gunzip(zipFilename, filename, () => {
            console.log('gunzip done');
        })
    }
}