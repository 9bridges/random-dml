import minimist from 'minimist'

import { knexInspector } from './knex.js'
import { batchInsert, batchUpdate, batchDelete, randomDML } from './core.js'
import { generateRandomRow, getPrimaryKey } from './helper.js'
import { TABLE_NAME } from './constant.js'

const run = async () => {
    const { o, t } = minimist(process.argv.slice(2))
    try {
        // async init
        global.COLUMN_INFO = await knexInspector.columnInfo(TABLE_NAME)

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
                case 'pk':
                    console.log('TEST: Looking for the primary key...')
                    const primaryKey = getPrimaryKey()
                    console.log(primaryKey)
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
}

run()
