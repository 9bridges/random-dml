import { knexClient } from './knex.js'
import { generateRandomRow } from './helper.js'
import {
    TABLE_NAME,
    INSERT_NUMBER,
    CHUNK_SIZE,
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
            await batchDelete()
            // NOTE: truncate might be faster
        }

        await knexClient.batchInsert(
            TABLE_NAME,
            [...Array(number).keys()].map((n) => generateRandomRow(n + 1)),
            CHUNK_SIZE
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
    let i = 0
    let u = 0
    let d = 0
    try {
        // Batch insert
        await batchInsert(initial)
        console.info(`Initial batch inserted: ${initial}`)

        // Perform random DML operations
        await Promise.all(
            [...Array(increment).keys()].map(() => {
                const randomNumber = Math.floor(Math.random() * initial) + 1
                const randomOperation = Math.floor(Math.random() * 3)

                try {
                    switch (randomOperation) {
                        case 0:
                            // INSERT
                            i += 1
                            return knexClient(TABLE_NAME).insert(
                                generateRandomRow(initial + i)
                            )
                        case 1:
                            // UPDATE
                            u += 1
                            return knexClient(TABLE_NAME)
                                .update(generateRandomRow())
                                .where({ id: randomNumber })
                        case 2:
                            // DELETE
                            d += 1
                            return knexClient(TABLE_NAME)
                                .delete()
                                .where({ id: randomNumber })
                    }
                } catch (error) {
                    console.error(error)
                }
            })
        )

        console.info(`DML Inserted: ${i}`)
        console.info(`DML Updated: ${u}`)
        console.info(`DML Deleted: ${d}`)
    } catch (error) {
        return Promise.reject(error)
    }
}
