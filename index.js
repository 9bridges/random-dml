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
let COLUMN_INFO

const generateRandomRow = () =>
    COLUMN_INFO.reduce((acc, column) => {
        const { name, data_type, is_primary_key, default_value } = column
        if (is_primary_key) return acc
        if (default_value) return acc

        let value
        switch (data_type) {
            case 'int':
                value = faker.datatype.number()
            case 'varchar':
                const { max_length } = column
                // 10 is default length
                value = faker.datatype.string(max_length < 10 ? max_length : 10)
        }

        return {
            ...acc,
            [name]: value,
        }
    }, {})

const batchInsert = async () => {
    const NUMBER = config.get('number.insert')
    try {
        await knexClient.batchInsert(
            TABLE_NAME,
            [...Array(NUMBER).keys()].map((n) => ({
                id: n + 1,
                ...generateRandomRow(),
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
        // Check empty table first
        const [{ count: rowCount }] = await knexClient(TABLE_NAME).count({
            count: '*',
        })

        if (rowCount === 0) {
            // Insert a certain number of records
            await knexClient.batchInsert(
                TABLE_NAME,
                [...Array(INITIAL_NUMBER).keys()].map((n) => ({
                    id: n + 1,
                    name: faker.name.firstName(),
                }))
            )
        } else {
            INITIAL_NUMBER = rowCount
        }

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
    const { o, t } = minimist(process.argv.slice(2))
    try {
        COLUMN_INFO = await knexInspector.columnInfo(TABLE_NAME)

        if (o) {
            switch (o) {
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
            }
        } else if (t) {
            switch (t) {
                case 'row':
                    console.log('TEST: Generating a random row...')
                    const row = await generateRandomRow()
                    console.log(row)
                    break
            }
        } else {
            console.log('Performing random dml...')
            await randomDML()
        }

        console.log('Done.')
        process.exit(0)
    } catch (error) {
        console.error(error)
        process.exit(1)
    }
})()
