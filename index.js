import minimist from 'minimist'

import { knexClient, knexInspector } from './knex.js'
import { batchInsert, batchUpdate, batchDelete, randomDML } from './core.js'
import { TABLE_NAME, INSERT_NUMBER } from './constant.js'

const run = async () => {
    const { o } = minimist(process.argv.slice(2))
    try {
        // global.COLUMN_INFO = await knexInspector.columnInfo(TABLE_NAME)

        // pk check
        const primaryKey = await knexInspector.primary(TABLE_NAME)
        if (!primaryKey) throw new Error('No primary key found. Exitting...')

        if (o) {
            switch (o) {
                case 'i':
                    console.log(
                        `Performing batch insert of ${INSERT_NUMBER} rows...`
                    )
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
        } else {
            console.log('Performing random dml...')
            await randomDML()
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
