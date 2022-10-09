import { faker } from '@faker-js/faker'

export const generateRandomRow = (index) => ({
    ID: index + 1,
    VARCHAR2_18: faker.datatype.string(18),
    VARCHAR2_36: faker.datatype.string(36),
    VARCHAR2_100: faker.datatype.string(100),
    VARCHAR2_150: faker.datatype.string(150),
    VARCHAR2_255: faker.datatype.string(255),
    NUMBER_10: faker.datatype.number({ max: 10 ** 10 }),
    NUMBER_20: faker.datatype.number({ max: 10 ** 20 }),
    NUMBER_25: faker.datatype.number({ max: 10 ** 25 }),
    NUMBER_32: faker.datatype.number({ max: 10 ** 32 }),
    NUMBER_35: faker.datatype.number({ max: 10 ** 35 }),
    CHAR_1: faker.datatype.string(1),
    TCLOB: faker.datatype.string(4000),
})
