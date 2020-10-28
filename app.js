var express = require('express');
var bodyParser = require('body-parser');
var port = process.env.PORT || 8010;

var fugaLogin = require('./src/queries/fuga/login').login;
var getDownloadURL = require('./src/queries/fuga/loadTrendFileURL').getDownloadURL;
var fileDownload = require('./src/helpers/downloadFile').downloadFile;
var loadJson = require('./src/helpers/loadJson').loadJson;

var readData = require('./src/queries/pg/queries').readData;
var writeData = require('./src/queries/pg/queries').writeData;

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

let cookie;
let downloadURLs = {
    urls: [],
    dates: [],
    dsps: [],
    created_ats: [],
    updated_ats: []
};
let count;


app.get('/pg/writeData', async function (req, res) {
    let result = await writeData(table, data);
    res.send(result);
})

app.get('/', async function(req, res) {
    let result = await fugaLogin('jaiye', 'Jaiye2019!');
    cookie = result.headers['set-cookie'][0].split(';')[0].substring(12);
    
    result = await getDownloadURL(cookie);
    downloadURLs.urls = result.data.content.map(value => value.download_url);
    downloadURLs.dates = result.data.content.map(value => value.date);
    downloadURLs.created_ats = result.data.content.map(value => value.created_at);
    downloadURLs.updated_ats = result.data.content.map(value => value.updated_ats);
    downloadURLs.dsps = result.data.content.map(value => value.dsp);


    let tsvData = [];

    downloadURLs.urls.forEach((value, index) => {
        fileDownload(value, index).then(function(resolvedData){
            resolvedData.forEach(async (value, tsvIndex) => {
                if(tsvIndex > 0){
                    let data = {
                        salesDate: downloadURLs.dates[index],
                        store: downloadURLs.dsps[index],
                        salesCountry: value[4],
                        upc: value[26],
                        isrc: value[27],
                        salesType: value[5] > 0 ? "Download" : "Stream",
                        quantity: value[5] > 0 ? value[5] : value[6],
                        trackId: value[1],
                        artistId: value[25],
                        labelId: value[0],
                        createdAt: downloadURLs.created_ats[index],
                        updatedAt: downloadURLs.created_ats[index],
                        deletedAt: null
                    };

                    await writeData('analytics', data);
                }
            })
        });



    });

    count = downloadURLs.urls.length;

})

app.listen(port, function(){
    console.log("listening port: ", port);
})







