const Compute = require('@google-cloud/compute');
const cacheGet = require('./redis.helper').cacheGet;
const cacheSet = require('./redis.helper').cacheSet;

const compute = new Compute();

export async function getGoogleCloudZones() {
    const cacheValue = await cacheGet('cache:locations:gcp');
    if (cacheValue) {
        return JSON.parse(cacheValue);
    }
    let [zones, _] = await compute.getZones();
    let parsedZones = zones.map(zone => zone.name);
    cacheSet('cache:locations:gcp', JSON.stringify(parsedZones), 'EX', 60 * 30);
    return parsedZones;
}

