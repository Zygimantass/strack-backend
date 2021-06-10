import {ErrorMessage} from '../src/messages/errors.message';

// id that fails to match the regex
const invalidId = '60a504068f1479002d94saaa';
// id that matches regex, but is not present in the database
const validId = '60a504068f1479002d944ab7';

const generateIdNotValid = (title: string, location: string, param: string) => {
    return {
        [param]: {
            value: invalidId,
            msg: `${title} is wrong`,
            location,
            param
        }
    }
} 

const generateIdDoesNotExist = (title: string, location: string, param: string) => {
    return {
        [param]: {
            value: validId,
            location,
            msg: ErrorMessage.ERROR_NOT_FOUND.replace('{0}', title),
            param
        }
    }
}

export {
    validId,
    invalidId,
    generateIdNotValid,
    generateIdDoesNotExist
};