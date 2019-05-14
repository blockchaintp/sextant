import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import SimpleTable from 'components/table/SimpleTable'

const fields = [{
  title: 'Name',
  name: 'name,'
}, {
  title: 'Value',
  name: 'value',
}]

const styles = theme => {
  return {}
}

class DeploymentSummary extends React.Component {
  
  render() {
    const { 
      classes,
      data,
    } = this.props

    return (
      <div>
        {
          data.map((row, i) => {
            return (
              <Typography key={ i }>
                { row.title }: <strong>{ row.value }</strong>
              </Typography>
            )
          })
        }
      </div>
    )

    console.log('--------------------------------------------')
    console.dir(data)

    return null

    const tableData = data.map(item => {

      const ret = {
        id: item.title,
        title: item.title,
        name: item.title,
      }
      if(item.value.constructor === Array) {
        ret.value = (
          <ul>
            {
              item.value.map((row, i) => {
                return (
                  <ul key={ i }>{ row }</ul>
                )
              })
            }
          </ul>
        )
      }
      else {
        ret.value = item.value
      }

      return ret
    })

    return (
      <SimpleTable
        data={ tableData }
        fields={ fields }
      />
    )
  }
}

DeploymentSummary.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(DeploymentSummary)