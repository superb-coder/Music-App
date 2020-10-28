const { getDownloadURL } = require('../src/queries/fuga/loadTrendFileURL');

const assert = require('chai').assert;
const login = require('../src/queries/fuga/login').login;


describe('App', function (){
    it('App should return hello', function(){
        let result = fugaLogin('jaiye','Jaiye2019!');
        assert.typeOf(result, 'string');
    });
});

describe('App', function (){
    it('App should return hello', function(){
        let result = getDownloadURL('s%3A5bCZjQkeoo8BCg9SrtP91ahL_alm6yA9.gxHY%2BmXgEJneNxEqYDr3OtJP1%2FPV1BUMZy%2BPcNVA2qA');
        assert.typeOf(result, 'string');
    });
});

describe('App', function (){
    it('App should return hello', function(){
        const url = "https://vault.fuga.com/vault/download/?wait=1&domain=icarus-production&token=AAABwAAAAUAAAACAAAAAgPr3WLWvvxWSXxAuQMOxJjtR6F24QaJVHnQ6POKRM3P8vEPOCD%2B%2BysH4k2msiWUuLJdrH%2BdNDQvYXOWobmw9ED0C8qfsUKps0ZKVTVlYfQBLTzmzLhdBvM3QK0JTUBqaSZGnG7PAjDSPG0i%2FW7Ys2WAMPvNigZGKur2k354X2vyu5Yx%2F2W21novqcFJyOgeDUj9adoOjGHLvRY0hS5NZVJ%2BpHHaEaOORAnDvRudzKxdhgTmbbqZM7u2VFwWlbK356A%2FdYvqzF1WD87m68GToGEA7t7wLUU6BUO52J1e%2B%2BAHJgnt61xdkmjbD0hhPkkKlfB9a49TAgxYZfbOSjpqgDuP4TKwvHPrIM5SExSqoJ1DXrDfJzAho0vXV%2B%2B21lJxbnMFXU6ODNX4maVQQ3ceynb4%2BKXykSesQK3l5JOMO%2BVCFENgLWVKI%2BmrewfjYfkmuZxQbEYd5NA%2BfoJKAPqYvUSRbMS98pqax0V73ly7UzV2cHPvxS7D%2F76S6bNklTBPMP9vdyAMnF1fIBkfnO9PST5x2AkaNBK8F8Zoua6ue3c2FOtiGQ%2F9uEWoTeninAH4abLz2ym5%2FjWyuTiPOEJdFRrlllpJ5OWxAXWx8fOnvtiaj8CAvw8qZ3oxM9DN3b3QSxy5%2FK%2Fbve5HQO0FrTJrtxD8OOD4bjcbf5rBiqcWv8W2pct0iRn2l7245xuTzFQI6OBqMtDlcOJrrBsSvXHGM1YKpT6hVkU7Y1BuqrqFMP0JCQx09l8a5yxzrkR9C7hgNBQ%3D%3D";
        let result = fileDownload(url);
        assert.typeOf(result, 'string');
    });
});




app.get('/fuga/convertJson', async function(req, res) {
    let result = await loadJson(5);
    console.log(result[1][0]);
})

app.get('/pg/readData', async function(req, res){
    const table = 'stats';
    const field = 'artistId';
    const condition = 'ety_lgRNs3lleu';
    let result = await readData(table, field, condition); 
    res.send(result);
})