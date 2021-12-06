# AWS Marketplace configuration

Sextant itself runs under the `default` service account in a cluster. However,
if you have subscribed to it via the AWS Marketplace, certain IAM privileges
need to be assigned to this service account for it to operate correctly.

__NOTE__ it is only necessary to configure your cluster once.

## Step 1

Make sure that your cluster is associated to OIDC ID provider (IdP) in AWS.
If you have not already done this, it may be accomplished via the following
command:

```bash
eksctl utils associate-iam-oidc-provider \
    --cluster <CLUSTER_NAME> \
    --region <REGION_NAME> \
    --approve
```

__NOTE__ if this command fails try `--name` (now deprecated) in place of
`--cluster` or update your version of `eksctl`.

## Step 2

Make sure that your cluster's `default` service account is allowed to set up
metered products. If you have not already done this, it may be accomplished
via the following commands.

First check to see whether you have already created the
`marketplace-register-usage` policy. For example, if you have previous installed
Sextant on another cluster using the same AWS credentials this policy should
already exist.

```bash
aws iam list-policies | grep marketplace-register-usage
```

If this is successful, note the __ARN__ of the policy and go to
[Step 3](#step-3). Otherwise create a file called `policy.json` or similar
containing the following text:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "aws-marketplace:RegisterUsage"
            ],
            "Resource": "*"
        }
    ]
}
```

Then create the `marketplace-register-usage` policy via the following command
and note its __ARN__:

```bash
aws iam create-policy --policy-name "marketplace-register-usage" \
--policy-document file://policy.json
```

## Step 3

Now we need to attach this policy to the `default` service account
using `eksctl`.

```bash
eksctl create iamserviceaccount \
--cluster=<CLUSTER_NAME> --region=<REGION_NAME> \
--name=default --namespace=default \
--attach-policy-arn=<POLICY_ARN> \
--override-existing-serviceaccounts \
--approve
```

__NOTE__ You may specify `--attach-policy-arn` as many times as necessary to
attach any other permissions you require.
