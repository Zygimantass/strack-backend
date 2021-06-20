import redis from 'redis';
import util from 'util';

const REDIS_HOST = process.env.REDIS_HOST;
const REDIS_OPTIONS = {
    host: REDIS_HOST,
};

const subscriber = redis.createClient(REDIS_OPTIONS);
const publisher = redis.createClient(REDIS_OPTIONS);
const cache = redis.createClient(REDIS_OPTIONS);

subscriber.on('ready', () => {
    console.log('Redis subscriber ready');
});

publisher.on('ready', () => {
    console.log('Redis publisher ready');
});

cache.on('ready', () => {
    console.log('Cache is ready');
})

subscriber.on('error', e => {
    console.log(`Subsriber: ${e}`);
});

publisher.on('error', e => {
    console.log(`Publisher: ${e}`);
});

cache.on('error', e => {
    console.log(`Cache: ${e}`);
})

publisher.on('warning', warning => {
    console.log(`Publisher: ${warning}`);
});

subscriber.on('warning', warning => {
    console.log(`Subsriber: ${warning}`);
});

cache.on('warning', warning => {
    console.log(`Cache: ${warning}`);
});

const cacheGet = util.promisify(cache.get).bind(cache);
const cacheSet = cache.set.bind(cache);

export {subscriber, publisher, cacheGet, cacheSet};

