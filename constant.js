import config from 'config'

export const TABLE_NAME = config.get('db.table')
export const INSERT_NUMBER = config.get('number.insert')
export const INITIAL_NUMBER = config.get('number.random.initial')
export const INCREMENTAL_NUMBER = config.get('number.random.dml')
