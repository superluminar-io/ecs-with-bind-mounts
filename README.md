# ECS with Bind Mounts

This project sets up an ECS Cluster and creates a task definition.

Two containers (main and sidecar) are added to the task definition and a volume
is defined. The sidecar will launch first and pull a parameter from AWS, write
it to a shared volume and then terminate. The main container just reads the
secret from the shared volume, outputs it and then terminates. The main
container depends on the successful termination of the sidecar to make sure the
parameter is available when it launches.

## Prerequisites
In order for this project to work, a parameter must be created in AWS Systems
Manager Parameter Store in the same account where you deploy the project to.
The secret must be named `/super/fancy/parameters`. The example project will
log the parameter to the console, so do not put any sensitive information into
it.

A complete overview over the mechanisms is covered in a 
[blog post](https://superluminar.io/2023/04/13/environment-specific-configuration-files-with-bind-mounts-on-ecs/)
