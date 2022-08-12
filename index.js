import knex from 'knex'
import { faker } from '@faker-js/faker'

const knexClient = knex({
    client: 'mysql',
    connection: {
        host: '101.42.116.95',
        port: 3306,
        user: 'jiuqiao',
        password: 'jiuqiao',
        database: 'test',
    },
})

;(async () => {
    let INITIAL_NUMBER = 100
    const INCREMENTAL_NUMBER = 20
    const TABLE_NAME = 'test'

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
