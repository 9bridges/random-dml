import config from 'config'

export const TABLE_NAME = config.get('db.table')
export const INSERT_NUMBER = config.get('number.dml.total')
export const CHUNK_SIZE = config.get('number.dml.chunkSize')
export const INITIAL_NUMBER = config.get('number.random.initial')
export const INCREMENTAL_NUMBER = config.get('number.random.dml')
