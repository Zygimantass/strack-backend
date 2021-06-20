const Compute = require('@google-cloud/compute');

const compute = new Compute();

export async function getGoogleCloudZones() {
    let [zones, _] = await compute.getZones();
    let parsedZones = zones.map(zone => zone.name);
    return parsedZones;
}

