/* eslint-disable max-len */
import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TablePagination from '@material-ui/core/TablePagination'
import TableRow from '@material-ui/core/TableRow'

const styles = () => ({
  root: {
    width: '100%',
  },
  table: {

  },
  tableWrapper: {
    overflowX: 'auto',
  },
  autoCell: {
    width: 'auto',
  },
})

class SimpleTable extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      page: 0,
      rowsPerPage: 25,
    };
  }

  handleChangePage = (event, page) => {
    this.setState({ page })
  }

  handleChangeRowsPerPage = (event) => {
    this.setState({ rowsPerPage: event.target.value })
  }

  render() {
    const {
      classes,
      data,
      fields,
      getActions,
      onRowClick,
      pagination,
      hideHeader,
      hideHeaderIfEmpty,
    } = this.props

    const {
      rowsPerPage,
      page,
    } = this.state

    return (
      <div className={classes.root}>
        <div className={classes.tableWrapper}>
          <Table className={classes.table}>
            {
              (!hideHeader && (!hideHeaderIfEmpty || data.length > 0)) && (
                <TableHead>
                  <TableRow>
                    {
                      fields.map((field, i) => (
                        <TableCell key={i} align={field.numeric ? 'right' : 'left'}>
                          { field.title }
                        </TableCell>
                      ))
                    }
                    {
                      getActions ? (
                        <TableCell align="right">
                          Actions
                        </TableCell>
                      ) : null
                    }
                  </TableRow>
                </TableHead>
              )
            }
            <TableBody>
              {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((dataRow) => (
                <TableRow
                  hover
                  onClick={(event) => {
                    if (!onRowClick) return
                    onRowClick(event, dataRow.id)
                  }}
                  tabIndex={-1}
                  key={dataRow.id}
                  _ci={dataRow.username || dataRow.name}
                >
                  {
                      fields.map((field, i) => (
                        <TableCell
                          _ci={`${dataRow.username || dataRow.name}${dataRow[field.name]}`}
                          key={i}
                          align={field.numeric ? 'right' : 'left'}
                          className={classes.autoCell}
                        >
                          {dataRow[field.name] || (dataRow.deploymentData ? dataRow.deploymentData[field.name] : null)}
                        </TableCell>
                      ))
                    }
                  {
                      getActions ? (
                        <TableCell align="right">
                          { getActions(dataRow) }
                        </TableCell>
                      ) : null
                    }
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {
          pagination && (data.length >= rowsPerPage) && (
            <TablePagination
              component="div"
              count={data.length}
              rowsPerPage={rowsPerPage}
              page={page}
              backIconButtonProps={{
                'aria-label': 'Previous Page',
              }}
              nextIconButtonProps={{
                'aria-label': 'Next Page',
              }}
              onChangePage={this.handleChangePage}
              onChangeRowsPerPage={this.handleChangeRowsPerPage}
            />
          )
        }
      </div>
    );
  }
}

SimpleTable.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(SimpleTable)
