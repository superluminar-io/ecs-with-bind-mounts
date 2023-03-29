import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as BindMounts from '../lib/bind-mounts-stack';

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new BindMounts.BindMountsStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
