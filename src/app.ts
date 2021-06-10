import express from 'express';
import {nodeRouter} from './routes/node.route';

const app = express();

// parse data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Define all routes
app.use('/node', nodeRouter);
export {app}