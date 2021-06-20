import {Router} from 'express';
import {getNode, createNode, removeNode, getNodes, getLocation} from '../controllers/node.controller';
import {getNodeSchema, createNodeSchema} from '../schemas/node.schema';
import {checkAuth} from '../middleware/authentication.middleware';

const nodeRouter = Router();

nodeRouter.get('/:id', getNodeSchema, checkAuth, getNode);
nodeRouter.get('/', checkAuth, getNodes);
nodeRouter.delete('/:id', checkAuth, removeNode);
nodeRouter.post('/', createNodeSchema, checkAuth, createNode);
nodeRouter.get('/location/:provider', getLocation);

export {nodeRouter};