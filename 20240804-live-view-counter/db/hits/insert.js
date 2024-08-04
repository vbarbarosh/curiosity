const db = require('..');

async function db_hits_insert({path} = {})
{
    await db(v => v.execute('INSERT INTO hits SET path = ?', [path]));
}

module.exports = db_hits_insert;
