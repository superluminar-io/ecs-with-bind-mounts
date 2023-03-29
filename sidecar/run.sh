#!/usr/bin/env bash

aws ssm get-parameter --name /super/fancy/parameters --query 'Parameter.Value' > /etc/awsconfig/appconfig.json
