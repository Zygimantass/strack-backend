import {Schema, model} from 'mongoose';

/* Node types:
0 - Bitcoin
1 - Elrond */
const NodeType = [0, 1]; 

/* Node status:
0 - alive
1 - stopped
2 - dead
3 - pending
*/
const NodeStatus = [0, 1, 2, 3];

/* Datacenter:
0 - AWS
1 - GCP
*/
const Datacenter = [0, 1];


// Schema for node
const schema = new Schema({
    name: Schema.Types.String,
    location: Schema.Types.String,
    owner_id: Schema.Types.String,
    type: {
        type: Schema.Types.Number,
        enum: NodeType
    },
    status: {
        type: Schema.Types.Number,
        enum: NodeStatus
    },
    datacenter: {
        type: Schema.Types.Number,
        enum: Datacenter
    },
});

// Creates model for category
const Node = model('Node', schema);

export { Node };