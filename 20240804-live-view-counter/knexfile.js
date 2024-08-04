require('dotenv/config');

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
    client: 'mysql2',
    connection: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USERNAME,
        database: process.env.DB_DATABASE,
        password: process.env.DB_PASSWORD,
    },
    migrations: {
        tableName: 'migrations',
        directory: 'db/migrations',
        // https://github.com/knex/knex/issues/6012
        getNewMigrationName: function (name) {
            return `${now_fs()}-${name}.js`;
        },
    },
};

/**
 * 20240804_155317
 */
function now_fs()
{
    return new Date().toJSON().replace('T', '_').replace(/[-:]/g, '').substring(0, 15)
}
