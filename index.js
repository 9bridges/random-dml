import config from 'config'
import knex from 'knex'
import { faker } from '@faker-js/faker'

const knexClient = knex({
    client: config.get('db.client'),
    connection: {
        host: config.get('db.host'),
        port: config.get('db.port'),
        user: config.get('db.user'),
        password: config.get('db.password'),
        database: config.get('db.database'),
    },
})

;(async () => {
    let INITIAL_NUMBER = config.get('number.random.initial')
    const INCREMENTAL_NUMBER = config.get('number.random.dml')
    const TABLE_NAME = config.get('db.table')

    try {
        // Insert a certain number of records
        await knexClient.batchInsert(
            TABLE_NAME,
            [...Array(INITIAL_NUMBER).keys()].map((n) => ({
                id: n + 1,
                name: faker.name.firstName(),
            }))
        )

        // Perform random DML operations
        await Promise.all(
            [...Array(INCREMENTAL_NUMBER).keys()].map(async () => {
                const randomNumber =
                    Math.floor(Math.random() * INITIAL_NUMBER) + 1
                const randomOperation = Math.floor(Math.random() * 3)

                switch (randomOperation) {
                    case 0:
                        // INSERT
                        INITIAL_NUMBER += 1
                        return await knexClient(TABLE_NAME).insert({
                            id: INITIAL_NUMBER,
                            name: faker.name.firstName(),
                        })
                    case 1:
                        // UPDATE
                        return await knexClient(TABLE_NAME)
                            .update({
                                name: `${faker.name.firstName()}（已改）`,
                            })
                            .where({ id: randomNumber })
                    case 2:
                        // DELETE
                        return await knexClient(TABLE_NAME)
                            .delete()
                            .where({ id: randomNumber })
                }
            })
        )

        process.exit(0)
    } catch (error) {
        console.error(error)
        process.exit(1)
    }
})()
