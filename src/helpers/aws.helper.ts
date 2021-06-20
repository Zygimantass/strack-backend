import EC2, {DescribeRegionsResult} from 'aws-sdk/clients/ec2';
import {cacheGet, cacheSet} from './redis.helper';

const REGION = 'us-east-1';

const ec2client = new EC2({region: REGION});

const getAwsZones = async () => {
    const cacheValue = await cacheGet('cache:locations:aws');
    if (cacheValue) {
        return JSON.parse(cacheValue);
    }
    let data = <DescribeRegionsResult>await ec2client.describeRegions().promise();
    let parsedData = data.Regions?.map(region => region.RegionName);
    cacheSet('cache:locations:aws', JSON.stringify(parsedData), 'EX', 60 * 30);
    return parsedData;
}   

export {getAwsZones};