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
        // Check empty table first
        const [{ count: rowCount }] = await knexClient(TABLE_NAME).count({
            count: '*',
        })

        if (rowCount > 0) {
            await knexClient(TABLE_NAME).truncate()
            // NOTE: truncate sink tables if needed
        }

        await knexClient.batchInsert(
            TABLE_NAME,
            [...Array(number).keys()].map((n) => ({
                id: n + 1,
                ...generateRandomRow(),
            }))
        )
    } catch (error) {
        return Promise.reject(error)
    }
}

export const batchUpdate = async () => {
    try {
        await knexClient(TABLE_NAME).update(generateRandomRow())
    } catch (error) {
        return Promise.reject(error)
    }
}

export const batchDelete = async () => {
    try {
        await knexClient(TABLE_NAME).delete()
    } catch (error) {
        return Promise.reject(error)
    }
}

export const randomDML = async (
    initial = INITIAL_NUMBER,
    increment = INCREMENTAL_NUMBER
) => {
    let init = initial
    try {
        // Batch insert
        await batchInsert(init)

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
                                ...generateRandomRow(),
                            })
                        case 1:
                            // UPDATE
                            return await knexClient(TABLE_NAME)
                                .update(generateRandomRow())
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
