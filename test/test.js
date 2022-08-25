import chai from 'chai'

import { knexClient, knexInspector } from '../knex.js'
import { TABLE_NAME } from '../constant.js'
import { getPrimaryKey, generateRandomRow } from '../helper.js'

// describe('Array', function () {
//     describe('#indexOf()', function () {
//         it('should return -1 when the value is not present', function () {
//             chai.expect([1, 2, 3].indexOf(4)).to.equal(-1)
//         })
//     })
// })

before(async function () {
    global.COLUMN_INFO = await knexInspector.columnInfo(TABLE_NAME)
})

describe('Helper Function', function () {
    describe('#getColumnInfo()', function () {
        it('should be an array', function () {
            chai.expect(global.COLUMN_INFO).to.be.an('array')
        })
    })
    describe('#generateRandomRow()', function () {
        it('should be an object', function () {
            const randomRow = generateRandomRow()
            chai.expect(randomRow).to.be.an('object')
        })
    })
    describe('#getPrimaryKey()', function () {
        it('should be an object', function () {
            const pk = getPrimaryKey()
            chai.expect(pk).to.be.an('object')
        })
    })
})

after(async function () {
    await knexClient.destroy()
})
