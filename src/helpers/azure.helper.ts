import {EnvironmentCredential} from '@azure/identity';
import {ComputeManagementClient} from '@azure/arm-compute';
import {cacheGet, cacheSet} from './redis.helper';

const SUBSCRIPTION_ID = process.env.AZURE_SUBSCRIPTION_ID!;

const credentials =  new EnvironmentCredential();

const client = new ComputeManagementClient(credentials, SUBSCRIPTION_ID);

const getAzureZones = async () => {
    const cacheValue = await cacheGet('cache:locations:azure');
    if (cacheValue) {
        return JSON.parse(cacheValue);
    }
    let data = await client.resourceSkus.list();
    let parsedData = data.map(resource => {
        if (resource && resource.name === 'Classic' && resource.locations) {
            return resource.locations[0];
        }
    });
    parsedData = parsedData.filter(item => item);
    cacheSet('cache:locations:azure', JSON.stringify(parsedData), 'EX', 60 * 60 * 48);
    return parsedData;
}

export {getAzureZones};
