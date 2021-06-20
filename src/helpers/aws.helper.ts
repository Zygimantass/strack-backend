import EC2, {DescribeRegionsResult} from 'aws-sdk/clients/ec2';

const REGION = 'us-east-1';

const ec2client = new EC2({region: REGION});

const getAwsZones = async () => {
    let data = <DescribeRegionsResult>await ec2client.describeRegions().promise();
    let parsedData = data.Regions?.map(region => region.RegionName);
    return parsedData;
}   

export {getAwsZones};