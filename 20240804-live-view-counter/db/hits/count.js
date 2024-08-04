const db = require('..');

async function db_hits_count({path} = {})
{
    if (path) {
        const [[{out}]] = await db(v => v.query('SELECT COUNT(*) AS `out` FROM hits WHERE path = ?', [path]));
        return out;
    }
    const [[{out}]] = await db(v => v.query('SELECT COUNT(*) AS `out` FROM hits'));
    return out || 0;
}

module.exports = db_hits_count;
