/* eslint-disable max-len */
import * as React from 'react'
import PropTypes from 'prop-types'
import withStyles from '@mui/styles/withStyles'

import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import TableSortLabel from '@mui/material/TableSortLabel'
import Tooltip from '@mui/material/Tooltip'

import { TableCellProps } from '@mui/material/TableCell'
import { TableRowProps } from '@mui/material/TableRow'

export type TableProps = {
  classes: {
    [key: string]: string,
  },
  data: any[],
  fields: any[],
  getActions: Function,
  onRowClick: Function,
  pagination: boolean,
  hideHeader: boolean,
  hideHeaderIfEmpty: boolean,
  withSorting: boolean,
  [key: string]: unknown,
}

export type TableState = {
  page: number,
  rowsPerPage: number,
  order: "asc" | "desc",
  orderBy: string,
}

interface CustomTableCellProps extends TableCellProps {
  _ci?: string
  hover?: boolean
}

interface CustomTableRowProps extends TableRowProps {
  _ci?: string
}

const CustomTableCell = ({ _ci, ...rest }: CustomTableCellProps) => {
  return <TableCell {...rest} />;
}

const CustomTableRow = ({ _ci, ...rest }: CustomTableCellProps) => {
  return <TableCell {...rest} />;
}

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

function desc<T>(a: T, b: T, orderBy: keyof T): number {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function stableSort(array: any[], compareFunc: Function) {
  const stabilizedThis = array.map((element, index) => [element, index]);
  stabilizedThis.sort((a, b) => {
    const order = compareFunc(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((element) => element[0]);
}

function getCompareFunc(order: string, orderBy: keyof {}) {
  return order === 'desc' ? (a: number, b: number) => desc(a, b, orderBy) : (a: number, b: number) => -desc(a, b, orderBy);
}

class SimpleTable extends React.Component<TableProps, TableState> {
  constructor(props: TableProps, context: unknown) {
    super(props, context);
    this.state = {
      page: 0,
      rowsPerPage: 25,
      order: 'asc',
      orderBy: 'name',
    };
  }

  handleChangePage = (event: unknown, page: number) => {
    this.setState({ page })
  }

  handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): void => {
    const rowsPerPage = parseInt(event.target.value)
    this.setState({ rowsPerPage })
  }

  handleRequestSort = (event: React.MouseEvent<HTMLTextAreaElement | HTMLInputElement>, property: string) => {
    const orderBy = property;
    let order: "asc" | "desc" = 'desc';
    // eslint-disable-next-line react/destructuring-assignment
    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }
    this.setState({ order, orderBy });
  };

  createSortHandler = (property: string) => (event: React.MouseEvent<HTMLTextAreaElement | HTMLInputElement>) => {
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
              (!hideHeader && (!hideHeaderIfEmpty || Object.keys(data).length > 0)) && (
                <TableHead>
                  <TableRow>
                    {
                      fields.map((field, i) => {
                        const tooltipPlacement = field.numeric ? 'bottom-end' : 'bottom-start'
                        const content = withSorting ? (
                          <Tooltip
                            title="Sort"
                            placement={tooltipPlacement}
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
            <TableBody id="tableBody">
              { stableSort(data, getCompareFunc(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((dataRow) => (
                  <CustomTableRow
                    hover
                    onClick={(event) => {
                      if (!onRowClick) return
                      onRowClick(event, dataRow.id)
                    }}
                    tabIndex={-1}
                    key={dataRow.id}
                    _ci={dataRow.username || dataRow.name}
                    id={`tableRow_${dataRow.username || dataRow.name}`}
                  >
                    {
                      fields.map((field, i) => (
                        <CustomTableCell
                          _ci={`${dataRow.username || dataRow.name}${dataRow[field.name]}`}
                          id={`tableCell_${dataRow.username || dataRow.name}${dataRow[field.name]}`}
                          key={i}
                          align={field.numeric ? 'right' : 'left'}
                          className={classes.autoCell}
                        >
                          {dataRow[field.name] || (dataRow.deploymentData ? dataRow.deploymentData[field.name] : null)}
                        </CustomTableCell>
                      ))
                    }
                    {
                      getActions ? (
                        <TableCell align="right">
                          { getActions(dataRow) }
                        </TableCell>
                      ) : null
                    }
                  </CustomTableRow>
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
              onPageChange={this.handleChangePage}
              onRowsPerPageChange={this.handleChangeRowsPerPage}
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
