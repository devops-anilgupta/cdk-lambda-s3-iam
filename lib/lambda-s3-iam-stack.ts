import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { RemovalPolicy } from 'aws-cdk-lib';
import * as path from 'path';

export class LambdaS3IamStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

// Create an IAM role with full access to S3, CloudWatch, and Lambda
const iamRole = new iam.Role(this, 'MyIAMRole', {
  assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
  roleName: 'CDK-IAM-Role-For-Lambda',
});

// Attach managed policies for full access
iamRole.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonS3FullAccess'));
iamRole.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('CloudWatchFullAccess'));
iamRole.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AWSLambda_FullAccess'));


// Create Lambda Function

const lambdaFunction = new lambda.Function(this, 'MyLambdaFunction', {
  functionName: 'lambda-function-for-s3',
  runtime: lambda.Runtime.NODEJS_18_X,
  handler: 'index.handler',
  code: lambda.Code.fromAsset(path.join(__dirname, '../src')),
  role: iamRole,
});

// S3 Bucket
const s3Bucket = new s3.Bucket(this, 'MyS3Bucket', {
  bucketName: 'test-s3-bucket-for-cdk',
  encryption: s3.BucketEncryption.S3_MANAGED,
  removalPolicy: RemovalPolicy.DESTROY,
  autoDeleteObjects: true,
});
 
  }
}
