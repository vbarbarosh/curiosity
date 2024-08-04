const Promise = require('bluebird');
const mysql2 = require('mysql2/promise');

let conn;

async function db(fn)
{
    conn ??= await mysql2.createConnection({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USERNAME,
        database: process.env.DB_DATABASE,
        password: process.env.DB_PASSWORD,
        Promise,
    });
    return Promise.method(fn).call(null, conn);
}

db.end = async function () {
    if (conn) {
        await conn.end();
        conn = null;
    }
};

module.exports = db;
