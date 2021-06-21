import {Node} from '../models/node.model';
import {Request, Response} from 'express';
import {validationResult} from 'express-validator';
import {ErrorMessage} from '../messages/errors.message';
import {publisher, subscriber} from '../helpers/redis.helper';
import * as gcpHelper from '../helpers/google.helper';
import {getAwsZones} from '../helpers/aws.helper'; 
import {getAzureZones} from '../helpers/azure.helper';
import crypto from 'crypto';

const getLocation = async (req: Request, res: Response) => {
    /* Check if no validation errors occured */
    const err = validationResult(req);
    if (!err.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: err.mapped()

        });
    }
    const provider: number = parseInt(req.params.provider);
    switch(provider) {
        case 0:
            return res.json({
                success: true,
                data: await getAwsZones()
            });
        case 1:
            return res.json({
                success: true,
                data: await gcpHelper.getGoogleCloudZones()
            });
        case 2:
            return res.json({
                success: true,
                data: await getAzureZones()
            });
        default:
            return res.json({
                success: false
            });

    }
}

/* Gets information about the node, then id is specified */
const getNode = async (req: Request, res: Response) => {
    /* Check if no validation errors occured */
    const err = validationResult(req);
    if (!err.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: err.mapped()

        });
    }
    const id: string = req.params.id;
    const owner_id: string = res.locals.user.user_id;
    /* get node */
    const node = await Node.findOne({_id: id, owner_id}).catch(() => false);
    
    // Check if an error has occured
    if (node === false) {
        return res.status(500).json({
            success: false,
            message: ErrorMessage.ERROR_DURING_DATABASE_OPERATION
        });
    } else if (!node) {
        return res.status(404).json({
            success: false,
            message: ErrorMessage.ERROR_NOT_FOUND.replace('{0}', 'node')
        });
    } else {
        return res.json({
            success: true,
            data: node
        });
    }
};

/* Creates new node */
const createNode = async (req: Request, res: Response) => {
    /* Check if no validation errors occured */
    const err = validationResult(req);
    if (!err.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: err.mapped()

        });
    }
    const name: string = req.body.name;
    const datacenter: number = req.body.datacenter;
    const type: number = req.body.type;
    const location: string = req.body.location;
    const owner_id: string = res.locals.user.user_id;
    const nodeStatus = 3;
    const username = crypto.randomBytes(5).toString('hex');
    const password = crypto.randomBytes(10).toString('hex');

    const newNode = new Node({
        name,
        datacenter,
        type,
        location,
        status: nodeStatus,
        owner_id,
        graphana_username: username,
        graphana_password: password
    });
    const status = await newNode.save().catch((e: any) => false);
    if (!status) {
        return res.status(500).json({
            success: false,
            message: ErrorMessage.ERROR_DURING_DATABASE_OPERATION
        });
    }
    publisher.publish("node:create", JSON.stringify({
        name: name,
        datacenter: datacenter,
        type: type,
        location: location,
        graphana_username: username,
        graphana_password: password,
        node_id: newNode._id
    }));
    return res.status(201).json({
        success: true,
        id: newNode._id
    });
}

/* Get all nodes belonging to the specific user */
const getNodes = async (req: Request, res: Response) => {
    const err = validationResult(req);
    if (!err.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: err.mapped()

        });
    }
    const owner_id: string = res.locals.user.user_id;
    const data = await Node.find({owner_id}).catch(() => false);

    // Check if an error has occured
    if (data === false) {
        return res.status(500).json({
            success: false,
            message: ErrorMessage.ERROR_DURING_DATABASE_OPERATION
        });
    } 
    
    return res.json({
        success: true,
        data
    });
}

/* Remove node */
const removeNode = async (req: Request, res: Response) => {
    const err = validationResult(req);
    if (!err.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: err.mapped()

        });
    }

    const id : string = req.params.id;
    const owner_id: string = res.locals.user.user_id;

    const status = await Node.deleteOne({_id: id, owner_id}).catch(() => false);

    if (status === false) {
        return res.status(500).json({
            success: false,
            message: ErrorMessage.ERROR_DURING_DATABASE_OPERATION
        });
    }

    return res.json({
        success: true
    });
}

subscriber.on('message', async (channel, message) => {
    const parsedMessage = JSON.parse(message);
    if (parsedMessage.node_id) {
        return;
    }
    let node = await Node.findById(parsedMessage.node_id);
    if (parsedMessage.status) {
        node.status = 0;
    } else {
        node.status = 2;
    }
    node.agent_name = parsedMessage.agent_name;
    node.agent_password = parsedMessage.agent_password;
    await node.save();
});

subscriber.subscribe('node:create:status');



export {getNode, getNodes, createNode, removeNode, getLocation};