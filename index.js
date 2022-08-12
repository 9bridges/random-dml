import knex from 'knex'
import { faker } from '@faker-js/faker'

const INITIAL_NUMBER = 100
const INCREMENTAL_NUMBER = 100

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
    try {
        const res = await knexClient.batchInsert(
            'test',
            [...Array(INITIAL_NUMBER).keys()].map((n) => ({
                id: n + 1,
                name: faker.name.firstName(),
            }))
        )
        console.info(res)
    } catch (error) {
        console.error(error)
    }
})()
