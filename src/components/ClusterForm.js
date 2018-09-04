import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

import { Field } from 'redux-form'
import Grid from '@material-ui/core/Grid'

import TextField from './TextField'
import Select from './Select'

import validators from '../utils/validators'

const styles = theme => ({
  root: {
    width: '99%'
  },
})

class ClusterForm extends React.Component {

  render() {
    const { classes, awsConfig } = this.props

    const awsInstances = awsConfig.instances || []
    const awsRegions = awsConfig.regions || []
    const awsDomains = (awsConfig.domains || {}).HostedZones || []

    const regionOptions = awsRegions.map(awsRegion => ({
      title: `${ awsRegion.name } - ${ awsRegion.code }`,
      value: awsRegion.code,
    }))

    const domainOptions = awsDomains.map(awsDomain => ({
      title: awsDomain.Name,
      value: awsDomain.Name,
    }))

    return (
      <div className={classes.root}>

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
              validate={ validators.required }
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
            />

          </Grid>

        </Grid>

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
            />
          </Grid>

          <Grid
            item
            xs={12}
            md={6}
          >
            
          </Grid>

        </Grid>

        
      </div>
    )
  }
}

ClusterForm.propTypes = {
  classes: PropTypes.object.isRequired,
  awsConfig: PropTypes.object.isRequired,
}

export default withStyles(styles)(ClusterForm)