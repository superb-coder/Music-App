const tsv = require("node-tsv-json");
tsv({
    input: "file.tsv",
    output: "output.json", 
    parseRows: true
}, function (err, result) {
    if (err) {
        console.error(err);
    } else {
        console.log(result);
    }
});