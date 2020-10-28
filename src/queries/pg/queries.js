var knex = require('knex')({
    client:'pg',
    version: '10.6',
    connection: {
        "host": "development.crtlunrdtut5.eu-central-1.rds.amazonaws.com",
        "user": "postgres",
        "password": "TAU3YyPU",
        "database": "development",
        "connectTimeout": 90000
    }
});

module.exports = {
    readData: async function(table, field, condition){
        return await knex(table).where(field, condition)
    },
    writeData: async function (table, data){
        return await knex(table).insert(data);
    }
}

