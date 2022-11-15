import chai from 'chai'

import { knexClient } from '../knex.js'
import { TABLE_NAME } from '../constant.js'
import { generateRandomRow } from '../helper.js'

// describe('Array', function () {
//     describe('#indexOf()', function () {
//         it('should return -1 when the value is not present', function () {
//             chai.expect([1, 2, 3].indexOf(4)).to.equal(-1)
//         })
//     })
// })

before(async function () {
    global.COLUMN_INFO = await knexClient(TABLE_NAME).columnInfo()
})

describe('Helper Function', function () {
    describe('#getColumnInfo()', function () {
        it('should be an object', function () {
            chai.expect(global.COLUMN_INFO).to.be.an('object')
        })
    })
    describe('#generateRandomRow()', function () {
        it('should be an object', function () {
            const randomRow = generateRandomRow()
            chai.expect(randomRow).to.be.an('object')
        })
    })
})

after(async function () {
    await knexClient.destroy()
})
