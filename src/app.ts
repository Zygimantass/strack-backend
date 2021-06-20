import express from 'express';
import cors from 'cors';
import {nodeRouter} from './routes/node.route';

const app = express();
app.use(cors());
// parse data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Define all routes
app.use('/node', nodeRouter);
export {app}