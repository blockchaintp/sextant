import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

import { Field } from 'redux-form'
import Grid from '@material-ui/core/Grid'
import Divider from '@material-ui/core/Divider'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import FormHelperText from '@material-ui/core/FormHelperText'

import TextField from './TextField'
import Select from './Select'
import MultipleCheckbox from './MultipleCheckbox'
import Radio from './Radio'
import PrivateKeyDialog from './PrivateKeyDialog'

import validators from '../utils/validators'
import awsUtils from '../utils/aws'

const styles = theme => ({
  root: {
    marginTop: '10px',
    width: '99%'
  },
  divider: {
    marginTop: '20px',
    marginBottom: '20px',
  },
  button: {
    margin: theme.spacing.unit,
  },
  errorList: {
    color: '#f44336'
  },
  margin: {
    margin: theme.spacing.unit,
  },
  smallText: {
    fontSize: '0.7em'
  },
  alignRight: {
    textAlign: 'right',
  },
})

class ClusterForm extends React.Component {

  render() {
    const { classes, awsConfig, onRegionChange } = this.props

    const awsInstances = awsConfig.instances || []
    const awsRegions = awsConfig.regions || []
    const awsDomains = (awsConfig.domains || {}).HostedZones || []
    const awsZones = this.props.awsZones || []
    const masterCount = this.props.formValues.master_count || 1
    const nodeCount = this.props.formValues.node_count || 1

    const regionOptions = awsRegions.map(awsRegion => ({
      title: awsUtils.getRegionTitle(awsRegion),
      value: awsRegion.code,
    }))

    const instanceOptions = awsInstances.map(awsInstance => ({
      title: awsUtils.getInstanceTitle(awsInstance),
      value: awsInstance.apiName,
    }))

    const domainOptions = awsUtils.getRoute53Domains(awsConfig.domains).map(domain => ({
      title: domain,
      value: domain,
    }))

    const masterCountOptions = [1,3,5].map(count => ({
      title: count,
      value: count,
    }))

    const zoneOptions = awsZones.map(zone => ({
      title: zone,
      value: zone,
    }))

    const topologyOptions = ['public', 'private'].map(topology => ({
      title: topology,
      value: topology,
    }))

    const masterZoneValidateMessage = `(min 1, max ${masterCount})`
    const nodeZoneValidateMessage = nodeCount < zoneOptions.length ? 
      `(min 1, max ${nodeCount})` :
      `(min 1)`

    return (
      <div className={classes.root}>

        <PrivateKeyDialog
          open={ this.props.privateKeyWindowOpen }
          value={ this.props.privateKeyValue }
          onCopy={ this.props.onPrivateKeyCopied }
          onClose={ this.props.onPrivateKeyWindowClosed }
        />
        
        <Typography
          variant='subheading'
        >
          Name & Domain
        </Typography>

        <Grid
          container
          spacing={ 24 }
        >
          <Grid
            item
            xs={12}
            md={6}
          >
            <Field
              name="name"
              type="text"
              component={ TextField }
              label="Cluster Name"
              description="Used as a subdomain for the cluster"
              validate={ validators.cluster.name }
              disabled={ this.props.submitting }
            />
          </Grid>

          <Grid
            item
            xs={12}
            md={6}
          >
            <Field
              name="domain"
              component={ Select }
              options={ domainOptions }
              label="Route53 Domain"
              description="Choose a domain under Route53 management"
              validate={ validators.required }
              disabled={ this.props.submitting }
            />

          </Grid>

        </Grid>

        <Divider className={ classes.divider } />

        <Typography
          variant='subheading'
        >
          Cluster Size
        </Typography>

        <Grid
          container
          spacing={ 24 }
        >
          <Grid
            item
            xs={12}
            md={6}
          >
            <Field
              name="master_count"
              component={ Select }
              options={ masterCountOptions }
              label="Masters"
              description="The number of k8s masters in the cluster"
              validate={ validators.required }
              disabled={ this.props.submitting }
            />
          </Grid>

          <Grid
            item
            xs={12}
            md={6}
          >
            <Field
              name="node_count"
              type="number"
              parse={value => isNaN(parseInt(value)) ? value : parseInt(value)}
              component={ TextField }
              label="Nodes"
              description="The number of k8s nodes in the cluster"
              validate={ validators.cluster.node_count }
              disabled={ this.props.submitting }
            />
          </Grid>

        </Grid>

        <Divider className={ classes.divider } />

        <Typography
          variant='subheading'
        >
          Instance Types
        </Typography>

        <Grid
          container
          spacing={ 24 }
        >
          <Grid
            item
            xs={12}
            md={6}
          >
            <Field
              name="master_size"
              component={ Select }
              options={ instanceOptions }
              label="Master Instance Size"
              description="The EC2 instance type for the master"
              validate={ validators.required }
              disabled={ this.props.submitting }
            />
          </Grid>

          <Grid
            item
            xs={12}
            md={6}
          >
            <Field
              name="node_size"
              component={ Select }
              options={ instanceOptions }
              label="Node Instance Size"
              description="The EC2 instance type for the nodes"
              validate={ validators.required }
              disabled={ this.props.submitting }
            />
          </Grid>

        </Grid>

        <Divider className={ classes.divider } />

        <Typography
          variant='subheading'
        >
          Region
        </Typography>

        <Grid
          container
          spacing={ 24 }
        >
          <Grid
            item
            xs={12}
            md={6}
          >
            <Field
              name="region"
              component={ Select }
              options={ regionOptions }
              label="AWS Region"
              description="The EC2 region your cluster will be deployed to"
              validate={ validators.required }
              disabled={ this.props.submitting }
              onChange={ onRegionChange }
            />
          </Grid>

          <Grid
            item
            xs={12}
            md={6}
          >
            
          </Grid>

        </Grid>

        <Divider className={ classes.divider } />

        <Typography
          variant='subheading'
        >
          Zones
        </Typography>

        <Grid
          container
          spacing={ 24 }
        >
          <Grid
            item
            xs={12}
            md={6}
          >

            <Field
              name="master_zones"
              component={ MultipleCheckbox }
              options={ zoneOptions }
              label="Masters"
              description={`The EC2 zones your nodes will be deployed to ${masterZoneValidateMessage}`}
              validate={ validators.cluster.master_zones }
              disabled={ this.props.submitting }
            />
            
          </Grid>

          <Grid
            item
            xs={12}
            md={6}
          >

            
            <Field
              name="node_zones"
              component={ MultipleCheckbox }
              options={ zoneOptions }
              label="Nodes"
              description={`The EC2 zones your nodes will be deployed to ${nodeZoneValidateMessage}`}
              validate={ validators.cluster.node_zones }
              disabled={ this.props.submitting }
            />
            
          </Grid>

        </Grid>


        <Divider className={ classes.divider } />

        <Typography
          variant='subheading'
        >
          Networking
        </Typography>

        <Grid
          container
          spacing={ 24 }
        >
          <Grid
            item
            xs={12}
            md={6}
          >
            <Field
              name="network_cidr"
              type="text"
              component={ TextField }
              label="Network CIDR"
              description="The network CIDR range for the cluster"
              validate={ validators.cluster.network_cidr }
              disabled={ this.props.submitting }
            />
          </Grid>

          <Grid
            item
            xs={12}
            md={6}
          >
            <Field
              name="subnet_mask"
              type="number"
              parse={value => isNaN(parseInt(value)) ? value : parseInt(value)}
              component={ TextField }
              label="Subnet Mask"
              description="The subnet mask for each zone within the cluster"
              validate={ validators.cluster.subnet_mask }
              disabled={ this.props.submitting }
            />
          </Grid>

        </Grid>

        <Divider className={ classes.divider } />

        <Typography
          variant='subheading'
        >
          Access Credentials
        </Typography>

        <Grid
          container
          spacing={ 24 }
        >
          <Grid
            item
            xs={12}
          >

            
            <Field
              name="public_key"
              type="text"
              component={ TextField }
              inputProps={{
                multiline: true,
                rows: 5,
                className: classes.smallText,
              }}
              label="Public Key"
              description="An RSA public key that will be added to nodes in the cluster - paste an existing public key or create a new public/private keypair by clicking the button below"
              validate={ validators.cluster.public_key }
              disabled={ this.props.submitting }
            />

            <div className={ classes.alignRight }>

              <Button
                variant="contained"
                size="small"
                className={ classes.button }
                onClick={ () => this.props.onCreatePrivateKeypair() }
                disabled={ this.props.submitting }
              >
                Generate Keypair
              </Button>
            </div>
            
          </Grid>

        </Grid>

        {
          this.props.showSyncFormErrors && this.props.syncFormErrors.length > 0 ? (
            <div>
              <Divider className={ classes.divider } />

              <FormHelperText error>
                The form has errors - please correct them before re-submitting:
              </FormHelperText>

              <ul className={ classes.errorList }>
                { 
                  this.props.syncFormErrors.map((errorString, i) => (
                    <li key={ i }>
                      <FormHelperText error>
                        { errorString }
                      </FormHelperText>
                    </li>
                  ))
                }
              </ul>
            </div>
          ) : null
        }

        {
          this.props.asyncFormError ? (
            <div>
              <Divider className={ classes.divider } />

              <FormHelperText error>
                { this.props.asyncFormError }
              </FormHelperText>

            </div>
          ) : null
        }

        <Divider className={ classes.divider } />

        <div>
          <Button
            variant="contained"
            className={ classes.button }
            onClick={ () => this.props.onCancel() }
            disabled={ this.props.submitting }
          >
            Cancel
          </Button>
          <Button
            color="primary"
            variant="contained"
            className={ classes.button }
            onClick={ () => this.props.onSubmit() }
            disabled={ this.props.submitting }
          >
            { this.props.saveTitle || 'Save' }
          </Button>
        </div>
        
      </div>
    )
  }
}

ClusterForm.propTypes = {
  classes: PropTypes.object.isRequired,
  awsConfig: PropTypes.object.isRequired,
}

export default withStyles(styles)(ClusterForm)

// for when we want to put topology back as a user option
// for now we fix to public
/*
  
        <Divider className={ classes.divider } />

        <Typography
          variant='subheading'
        >
          Topology
        </Typography>

        <Grid
          container
          spacing={ 24 }
        >
          <Grid
            item
            xs={12}
          >

            
            <Field
              name="topology"
              component={ Radio }
              options={ topologyOptions }
              label="Cluster Topology"
              description={`Choose whether your nodes are publically accesible or not - a bastion node will be created for private clusters`}
              disabled={ this.props.submitting }
            />
            
          </Grid>

        </Grid>
  
*/