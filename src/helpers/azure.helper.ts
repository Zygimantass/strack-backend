import {EnvironmentCredential} from '@azure/identity';
import {ComputeManagementClient} from '@azure/arm-compute';

const SUBSCRIPTION_ID = process.env.AZURE_SUBSCRIPTION_ID!;

const credentials =  new EnvironmentCredential();

const client = new ComputeManagementClient(credentials, SUBSCRIPTION_ID);

const getAzureZones = async () => {
    let data = await client.resourceSkus.list();
    let parsedData = data.map(resource => {
        if (resource && resource.name === 'Classic' && resource.locations) {
            return resource.locations[0];
        }
    });
    parsedData = parsedData.filter(item => item);
    return parsedData;
}

export {getAzureZones};
