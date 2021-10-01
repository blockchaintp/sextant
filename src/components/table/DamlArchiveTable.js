import React from 'react'
import PropTypes from 'prop-types'
import withStyles from '@mui/styles/withStyles';

import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'

const styles = () => ({
  root: {
    width: '100%',
  },
  tableWrapper: {
    overflowX: 'auto',
    height: '68vh',
    overflow: 'auto',
  },
  autoCell: {
    width: 'auto',
    wordWrap: 'break-word',
  },
})

class DamlArchiveTable extends React.Component {
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
              {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((dataRow, index) => (
                <TableRow
                  hover
                  onClick={(event) => {
                    if (!onRowClick) return
                    onRowClick(event, dataRow.id)
                  }}
                  tabIndex={-1}
                  key={index}
                >
                  {
                      fields.map((field, i) => {
                        if (typeof (dataRow[field.name]) === 'string') {
                          return (
                            <TableCell key={i} align={field.numeric ? 'right' : 'left'} className={classes.autoCell}>
                              {dataRow[field.name]}
                            </TableCell>
                          )
                        }
                        dataRow[field.name].sort()
                        return (
                          <TableCell key={i} align={field.numeric ? 'right' : 'left'} className={classes.autoCell}>
                            {
                              dataRow[field.name].map((item) => (
                                <Typography key={item} variant="inherit" className={classes.autoCell}>
                                  {item}
                                </Typography>
                              ))
                            }
                          </TableCell>
                        )
                      })
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
          pagination && (
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
              onPageChange={this.handleChangePage}
              onRowsPerPageChange={this.handleChangeRowsPerPage}
            />
          )
        }
      </div>
    );
  }
}

DamlArchiveTable.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(DamlArchiveTable)
