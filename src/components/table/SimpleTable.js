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
import TableSortLabel from '@material-ui/core/TableSortLabel'
import Tooltip from '@material-ui/core/Tooltip'

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

function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function stableSort(array, compareFunc) {
  const stabilizedThis = array.map((element, index) => [element, index]);
  stabilizedThis.sort((a, b) => {
    const order = compareFunc(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((element) => element[0]);
}

function getCompareFunc(order, orderBy) {
  return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

class SimpleTable extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      page: 0,
      rowsPerPage: 25,
      order: 'asc',
      orderBy: 'name',
    };
  }

  handleChangePage = (event, page) => {
    this.setState({ page })
  }

  handleChangeRowsPerPage = (event) => {
    this.setState({ rowsPerPage: event.target.value })
  }

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = 'desc';
    // eslint-disable-next-line react/destructuring-assignment
    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }
    this.setState({ order, orderBy });
  };

  createSortHandler = (property) => (event) => {
    this.handleRequestSort(event, property);
  };

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
      withSorting = true,
    } = this.props

    const {
      rowsPerPage,
      page,
      order,
      orderBy,

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
                      fields.map((field, i) => {

                        const content = withSorting ? (
                          <Tooltip
                            title="Sort"
                            placement={field.numeric ? 'bottom-end' : 'bottom-start'}
                            enterDelay={300}
                          >
                            <TableSortLabel
                              active={orderBy === field.name}
                              direction={order}
                              onClick={this.createSortHandler(field.name)}
                            >
                              {field.title}
                            </TableSortLabel>
                          </Tooltip>
                        ) : (
                          <div>{field.title}</div>
                        )
                        return (
                          <TableCell
                            key={i}
                            align={field.numeric ? 'right' : 'left'}
                            sortDirection={orderBy === field.name ? order : false}
                          >
                            {content}
                          </TableCell>
                        )
                      })
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
              { stableSort(data, getCompareFunc(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((dataRow) => (
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
