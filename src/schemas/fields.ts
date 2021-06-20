import {ParamSchema, Location} from 'express-validator';

const generateIDValidator = (location: Location, title: string) : ParamSchema => {
    return {
        in: [location],
        errorMessage: `${title} is wrong`,
        isString: true,
        trim: true,
        notEmpty: true,
        matches: {
            options: /^[0-9a-fA-F]{24}$/s,
            bail: true
        },
    }
};

const generateNameValidator = (location: Location, title: string) : ParamSchema => {
    return {
        in: [location],
        errorMessage: `${title} is wrong`,
        isString: true,
        trim: true,
        notEmpty: true
    }
};

export { generateIDValidator, generateNameValidator }