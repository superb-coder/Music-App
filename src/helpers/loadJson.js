const tsv = require('node-tsv-json');
module.exports = {
    loadJson: function (index){
        return new Promise((resolve, reject) => {
            tsv({
                input: `./files/file${index}.tsv`,
                output: `./files/file${index}.json`,
                parseRows: true  
            }, function (error, result) {
                if(error){
                    console.log(error);
                } else {
                    resolve(result);
                }
            }); 
        })
              
    }
}