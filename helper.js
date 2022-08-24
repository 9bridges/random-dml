import { faker } from '@faker-js/faker'

export const generateRandomRow = (columnInfo) => {
    return columnInfo.reduce((acc, column) => {
        const { name, data_type, is_primary_key, default_value } = column
        if (is_primary_key) return acc
        if (default_value) return acc

        let value
        switch (data_type) {
            case 'int':
                value = faker.datatype.number()
            case 'varchar':
                const { max_length } = column
                // 10 is default length
                value = faker.datatype.string(max_length < 10 ? max_length : 10)
        }

        return {
            ...acc,
            [name]: value,
        }
    }, {})
}
