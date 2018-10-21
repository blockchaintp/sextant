import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TablePagination from '@material-ui/core/TablePagination'
import TableRow from '@material-ui/core/TableRow'
import TableSortLabel from '@material-ui/core/TableSortLabel'

const styles = theme => ({
  tableRow: {
    height: '30px',
  },
  tableCell: {
    padding: '2px'
  }
})

class GenericTableSimple extends React.Component {

  render() {
    const { 
      classes,
      fields,
      data,
      noHeader,
    } = this.props

    return (
      <Table padding={ this.props.padding || 'default' }>
        {
          noHeader ? null : (
            <TableHead>
              <TableRow className={ classes.tableRow }>
                {
                  fields.map((field, i) => {
                    return (
                      <TableCell key={ i } className={ classes.tableCell }>
                        { field.title }
                      </TableCell>
                    )
                  })
                }
              </TableRow>
            </TableHead>
          )
        }
        <TableBody>
          {
            data.map((dataRow, i) => {
              return (
                <TableRow className={ classes.tableRow }
                  hover
                  key={ i }
                >
                  {
                    fields.map((field, i) => {
                      return (
                        <TableCell key={ i } className={ classes.tableCell }>
                          { dataRow[field.name] }
                        </TableCell>
                      )
                    })
                  }
                </TableRow>
              )
            })
          }
        </TableBody>
      </Table>
    )
  }
}

GenericTableSimple.propTypes = {
  classes: PropTypes.object.isRequired,
}


export default withStyles(styles)(GenericTableSimple)