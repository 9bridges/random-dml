import config from 'config'
import knex from 'knex'

export const knexClient = knex({
    client: config.get('db.client'),
    connection: {
        host: config.get('db.host'),
        port: config.get('db.port'),
        user: config.get('db.user'),
        password: config.get('db.password'),
        database: config.get('db.database'),
    },
})
