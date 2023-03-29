#!/usr/bin/env node
import { App } from 'aws-cdk-lib';
import { BindMountsStack } from '../lib/bind-mounts-stack';

const app = new App();
new BindMountsStack(app, 'BindMountsStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});
