import mongoose from 'mongoose';
import {MongoMemoryServer} from 'mongodb-memory-server';

const mongodb = new MongoMemoryServer();

const connect = async () => {
    const uri = await mongodb.getUri();
    await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
}

const stop = async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongodb.stop();
}

const clear = async () => {
    const collections = mongoose.connection.collections;

    for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany({});
    }
}

export {connect, stop, clear}