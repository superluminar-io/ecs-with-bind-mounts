import {
  Stack,
  StackProps,
  aws_ec2 as ec2,
  aws_ecs as ecs,
  aws_logs as logs,
  aws_ssm as ssm,
} from 'aws-cdk-lib';
import { Construct } from 'constructs';

export class BindMountsStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(
      this,
      'Vpc',
      {
        maxAzs: 1,
      },
    );
    // The code that defines your stack goes here
    new ecs.Cluster(
      this,
      'Cluster',
      {
        vpc,
      },
    );

    const logGroup = new logs.LogGroup(
      this,
      'LogGroup',
      {
        retention: logs.RetentionDays.ONE_DAY,
      },
    );
    const taskDef = new ecs.FargateTaskDefinition(
      this,
      'TaskDef',
      {
        cpu: 256,
        memoryLimitMiB: 512,
      },
    );

    const mainContainerId = 'Main';
    const main = taskDef.addContainer(
      mainContainerId,
      {
        essential: true,
        image: ecs.ContainerImage.fromAsset('main/'),
        logging: new ecs.AwsLogDriver(
          {
            streamPrefix: 'main',
            logGroup: logGroup,
          },
        ),
      },
    );

    const volumeName = 'config';
    taskDef.addVolume({
      name: volumeName,
      host: {},
    });
    main.addMountPoints(
      {
        containerPath: '/etc/awsconfig',
        readOnly: true,
        sourceVolume: volumeName,
      },
    );

    const sidecar = taskDef.addContainer(
      'Sidecar',
      {
        essential: false,
        image: ecs.ContainerImage.fromAsset('sidecar/'),
        logging: new ecs.AwsLogDriver(
          {
            streamPrefix: 'sidecar',
            logGroup: logGroup,
          },
        ),
      },
    );
    sidecar.addVolumesFrom(
      {
        readOnly: false,
        sourceContainer: mainContainerId,
      },
    );

    main.addContainerDependencies(
      {
        container: sidecar,
        condition: ecs.ContainerDependencyCondition.SUCCESS,
      },
    );

    ssm.StringParameter.fromStringParameterName(
      this,
      'ApplicationParameters',
      '/super/fancy/parameters',
    ).grantRead(
      taskDef.taskRole,
    );
  }
}
