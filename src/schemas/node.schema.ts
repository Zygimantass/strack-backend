import {checkSchema} from 'express-validator';
import {generateIDValidator, generateNameValidator} from './fields';

const getNodeSchema = checkSchema({
    id: generateIDValidator('params', 'ID')
});

const createNodeSchema = checkSchema({
    name: generateNameValidator('body')
});

export { getNodeSchema, createNodeSchema }