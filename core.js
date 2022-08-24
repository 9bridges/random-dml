import { faker } from '@faker-js/faker'

import { knexClient } from './knex.js'
import { generateRandomRow } from './helper.js'
import {
    TABLE_NAME,
    INSERT_NUMBER,
    INITIAL_NUMBER,
    INCREMENTAL_NUMBER,
} from './constant.js'

export const batchInsert = async (number = INSERT_NUMBER) => {
    try {
        await knexClient.batchInsert(
            TABLE_NAME,
            [...Array(number).keys()].map((n) => ({
                id: n + 1,
                ...generateRandomRow(COLUMN_INFO),
            }))
        )
    } catch (error) {
        return Promise.reject(error)
    }
}

export const batchUpdate = async () => {}
export const batchDelete = async () => {}

export const randomDML = async (
    initial = INITIAL_NUMBER,
    increment = INCREMENTAL_NUMBER
) => {
    let init = initial
    try {
        // Check empty table first
        const [{ count: rowCount }] = await knexClient(TABLE_NAME).count({
            count: '*',
        })

        if (rowCount === 0) {
            // Insert a certain number of records
            await knexClient.batchInsert(
                TABLE_NAME,
                [...Array(init).keys()].map((n) => ({
                    id: n + 1,
                    name: faker.name.firstName(),
                }))
            )
        } else {
            init = rowCount
        }

        // Perform random DML operations
        await Promise.all(
            [...Array(increment).keys()].map(async () => {
                const randomNumber = Math.floor(Math.random() * init) + 1
                const randomOperation = Math.floor(Math.random() * 3)

                try {
                    switch (randomOperation) {
                        case 0:
                            // INSERT
                            init += 1
                            return await knexClient(TABLE_NAME).insert({
                                id: init,
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
                } catch (error) {
                    console.error(error)
                }
            })
        )
    } catch (error) {
        return Promise.reject(error)
    }
}
