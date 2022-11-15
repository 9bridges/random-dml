import { faker } from '@faker-js/faker'
import { knexClient } from './knex.js'
import { TABLE_NAME } from './constant.js'

const run = async () => {
    try {
        for (const k of Array(10000).keys()) {
            await knexClient(TABLE_NAME).insert({
                id: k,
                name: faker.datatype.string(100),
            })
            await knexClient(TABLE_NAME).where('id', k).del()
        }
        console.log('Done.')
        process.exit(0)
    } catch (error) {
        console.error(error)
        process.exit(1)
    } finally {
        // close knex instance
        await knexClient.destroy()
    }
}

run()
