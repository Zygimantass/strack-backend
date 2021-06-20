import redis from 'redis';

const REDIS_HOST = process.env.REDIS_HOST;
const REDIS_OPTIONS = {
    host: REDIS_HOST,
};

const subscriber = redis.createClient(REDIS_OPTIONS);
const publisher = redis.createClient(REDIS_OPTIONS);

subscriber.on('ready', () => {
    console.log('Redis subscriber ready');
});

publisher.on('ready', () => {
    console.log('Redis publisher ready');
});

subscriber.on('error', e => {
    console.log(`Subsriber: ${e}`);
});

publisher.on('error', e => {
    console.log(`Publisher: ${e}`);
});

publisher.on('warning', warning => {
    console.log(`Publisher: ${warning}`);
});

subscriber.on('warning', warning => {
    console.log(`Subsriber: ${warning}`);
})

export {subscriber, publisher};

