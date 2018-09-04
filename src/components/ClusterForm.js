import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

import { Field } from 'redux-form'
import Grid from '@material-ui/core/Grid'
import Divider from '@material-ui/core/Divider'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'

import TextField from './TextField'
import Select from './Select'
import MultipleCheckbox from './MultipleCheckbox'

import validators from '../utils/validators'
import awsUtils from '../utils/aws'

const validateClusterName = validators.wrapper([
  validators.required,
  validators.domain,
])

const validateWorkerNodes = validators.wrapper([
  validators.required,
  validators.numeric,
  validators.integer,
  validators.unsigned,
  validators.minValue(2),
  validators.maxValue(128),
])

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
})

class ClusterForm extends React.Component {

  render() {
    const { classes, awsConfig } = this.props

    const awsInstances = awsConfig.instances || []
    const awsRegions = awsConfig.regions || []
    const awsDomains = (awsConfig.domains || {}).HostedZones || []
    const awsZones = this.props.awsZones || []

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

    const masterSizeOptions = [1,3,5].map(count => ({
      title: count,
      value: count,
    }))

    const zoneOptions = awsZones.map(zone => ({
      title: zone,
      value: zone,
    }))

    return (
      <div className={classes.root}>

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
              validate={ validateClusterName }
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
              name="master_size"
              component={ Select }
              options={ masterSizeOptions }
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
              name="worker_size"
              type="number"
              component={ TextField }
              label="Nodes"
              description="The number of k8s nodes in the cluster"
              validate={ validateWorkerNodes }
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
              name="master_type"
              component={ Select }
              options={ instanceOptions }
              label="Master Instance Type"
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
              name="node_type"
              component={ Select }
              options={ instanceOptions }
              label="Node Instance Type"
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
              label="Master Zones"
              description="The EC2 zones your masters will be deployed to"
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
              name="node_zones"
              component={ MultipleCheckbox }
              options={ zoneOptions }
              label="Node Zones"
              description="The EC2 zones your nodes will be deployed to"
              validate={ validators.required }
              disabled={ this.props.submitting }
            />
            
          </Grid>

        </Grid>

        <Divider className={ classes.divider } />

        <div>
          <Button
            variant="raised"
            className={ classes.button }
            onClick={ () => this.props.onCancel() }
            disabled={ this.props.submitting }
          >
            Cancel
          </Button>
          <Button
            color="primary"
            variant="raised"
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