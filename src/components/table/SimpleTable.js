/* eslint-disable max-len */
import React from 'react'
import { styled } from '@mui/system';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Tooltip,
} from '@mui/material'

const Root = styled('div')({
  width: '100%',
})

const Wrapper = styled('div')({
  overflowX: 'auto',
})

const StyledTableCell = styled(TableCell)({
  width: 'auto',
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
      <Root>
        <Wrapper>
          <Table>
            {
              (!hideHeader && (!hideHeaderIfEmpty || data.length > 0)) && (
                <TableHead>
                  <TableRow>
                    {
                      fields.map((field) => {
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
                            key={field.title}
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
                  <TableRow
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
                      fields.map((field) => (
                        <StyledTableCell
                          _ci={`${dataRow.username || dataRow.name}${dataRow[field.name]}`}
                          id={`tableCell_${dataRow.username || dataRow.name}${dataRow[field.name]}`}
                          key={`${dataRow.username || dataRow.name}${dataRow[field.name]}`}
                          align={field.numeric ? 'right' : 'left'}
                        >
                          {dataRow[field.name] || (dataRow.deploymentData ? dataRow.deploymentData[field.name] : null)}
                        </StyledTableCell>
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
        </Wrapper>
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
      </Root>
    );
  }
}

export default SimpleTable
