//Library for MySQL ; if needed: npm install mysql2
const mysql = require('mysql2/promise');

//Database connection
let connection = null;

async function query(sql, params) {
    //Singleton DB connection
    //lines 12-17 are database connection ; await says don't go onto connection.execute until connected to database (lines 6-11)
    if (null === connection) { //check if database connection already created before starting new one
        console.log('connection here');
        connection = await mysql.createConnection({
            host: "****",
            user: "****",
            password: "****",
            database: '****'
        });
    }
    //runs sql query ; await says "im not gonna run this return until lines 6-11 are done"
    const [results,] = await connection.execute(sql, params);

    return results;
}
//allows us to use the method in this script outside of this script
module.exports = {
    query
}