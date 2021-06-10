import {Node} from '../models/node.model';
import {Request, Response} from 'express';
import {validationResult} from 'express-validator';
import {ErrorMessage} from '../messages/errors.message';

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

    const newNode = new Node({
        name,
        datacenter,
        type,
        location,
        owner_id
    });
    const status = await newNode.save().catch((e: any) => false);
    if (!status) {
        return res.status(500).json({
            success: false,
            message: ErrorMessage.ERROR_DURING_DATABASE_OPERATION
        });
    }
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

export {getNode, getNodes, createNode, removeNode};