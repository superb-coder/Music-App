var axios = require('axios');

module.exports = {
    getDownloadURL: async function(cookie){
        let config = {
            method: 'get',
            url: 'https://next.fugamusic.com/api/v1/trends_file_reports?status=READY&page=0&size=234',
            headers: { 
                'Cookie': `connect.sid=${cookie}`
            }
        };
        return await axios(config);
    }
}