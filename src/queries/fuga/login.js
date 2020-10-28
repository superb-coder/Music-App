var axios = require('axios');

module.exports = {
    login: async function (username, password){
        let info = {
            "name": username,
            "password": password
        }
        let data = JSON.stringify(info);
    
        let config = {
            method: 'post',
            url: 'https://next.fugamusic.com/api/v1/login',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            data: data
        };
        return await axios(config);
    }
} 


