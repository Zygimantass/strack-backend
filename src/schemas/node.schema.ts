import {checkSchema} from 'express-validator';
import {generateIDValidator, generateNameValidator} from './fields';
import {NodeType, Datacenter} from '../models/node.model';
import {getAzureZones} from '../helpers/azure.helper';
import {getAwsZones} from '../helpers/aws.helper';
import * as gcpHelper from '../helpers/google.helper';
import { ErrorMessage } from '../messages/errors.message';

const validateLocation = async (location: string, { req }: any) => {
    let locations;
    switch (parseInt(req.body.datacenter)) {
        case 0:
            locations = await getAwsZones();
            break;
        case 1:
            locations = await gcpHelper.getGoogleCloudZones();
            break;
        case 2:
            locations = await getAzureZones();
            break;
        default:
            throw new Error(ErrorMessage.ERROR_NOT_FOUND.replace('{0}', 'datacenter'));
    }
    return locations.includes(location);
}

const getNodeSchema = checkSchema({
    id: generateIDValidator('params', 'ID')
});

const getLocationSchema = checkSchema({
    provider: {
        in: 'params',
        isInt: {
            options: {
                min: Datacenter[0],
                max: Datacenter[Datacenter.length - 1]
            }
        }
    }
});

const createNodeSchema = checkSchema({
    name: generateNameValidator('body', 'name'),
    type: {
        in: 'body',
        isInt: {
            options: {
                min: NodeType[0],
                max: NodeType[NodeType.length - 1]
            }
        },
    },
    datacenter: {
        in: 'body',
        isInt: {
            options: {
                min: Datacenter[0],
                max: Datacenter[Datacenter.length - 1]
            }
        },
    },
    location: {
        in: 'body',
        custom: {
            options: validateLocation
        }
    }
});


const removeNodeSchema = checkSchema({
    id: generateIDValidator('params', 'ID')
});

export { getNodeSchema, createNodeSchema, removeNodeSchema, getLocationSchema }