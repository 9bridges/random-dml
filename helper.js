import { faker } from '@faker-js/faker'

export const generateRandomRow = () =>
    global.COLUMN_INFO.reduce((acc, column) => {
        const { name, data_type, is_primary_key, default_value } = column
        if (is_primary_key) return acc
        // if (default_value) return acc

        let value
        switch (data_type) {
            case 'int':
            case 'decimal':
            case 'numeric':
                const { numeric_precision, numeric_scale } = column
                value = faker.datatype.number({
                    max: 10 ** numeric_precision,
                    precision: 1 / 10 ** numeric_scale,
                })
                break
            case 'varchar':
            case 'char':
            case 'text':
            case 'mediumtext':
                const { max_length } = column
                // 10 is default length
                value = faker.datatype.string(max_length < 10 ? max_length : 10)
                break
        }

        return {
            ...acc,
            [name]: value,
        }
    }, {})

export const getPrimaryKey = () =>
    global.COLUMN_INFO.find((column) => column.is_primary_key)
