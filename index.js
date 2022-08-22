import config from 'config'
import minimist from 'minimist'
import knex from 'knex'
import schemaInspector from 'knex-schema-inspector'
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
const knexInspector = schemaInspector.default(knexClient)

const TABLE_NAME = config.get('db.table')

const batchInsert = async () => {
    const NUMBER = config.get('number.insert')
    try {
        await knexClient.batchInsert(
            TABLE_NAME,
            [...Array(NUMBER).keys()].map((n) => ({
                id: n + 1,
                name: faker.name.firstName(),
            }))
        )
    } catch (error) {
        return Promise.reject(error)
    }
}

const batchUpdate = async () => {}
const batchDelete = async () => {}

const randomDML = async () => {
    let INITIAL_NUMBER = config.get('number.random.initial')
    const INCREMENTAL_NUMBER = config.get('number.random.dml')

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
    } catch (error) {
        return Promise.reject(error)
    }
}

;(async () => {
    const argv = minimist(process.argv.slice(2))
    try {
        switch (argv.o) {
            case 'i':
                console.log('Performing batch insert...')
                await batchInsert()
                break
            case 'u':
                console.log('Performing batch update...')
                await batchUpdate()
                break
            case 'd':
                console.log('Performing batch delete...')
                await batchDelete()
                break
            default:
                console.log('Performing random dml...')
                await randomDML()
                break
        }
        console.log('Done.')
        process.exit(0)
    } catch (error) {
        console.error(error)
        process.exit(1)
    }
})()
