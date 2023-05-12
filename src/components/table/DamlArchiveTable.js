import React from 'react'
import { styled } from '@mui/system';

import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'

const Wrapper = styled('div')({
  width: '100%',
})

const TableWrapper = styled('div')({
  overflowX: 'auto',
  height: '68vh',
  overflow: 'auto',
})

const AutoTableCell = styled(TableCell)({
  width: 'auto',
  wordWrap: 'break-word',
})

const AutoTypography = styled(Typography)({
  width: 'auto',
  wordWrap: 'break-word',
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
      <Wrapper>
        <TableWrapper>
          <Table>
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
                            <AutoTableCell key={i} align={field.numeric ? 'right' : 'left'}>
                              {dataRow[field.name]}
                            </AutoTableCell>
                          )
                        }
                        dataRow[field.name].sort()
                        return (
                          <AutoTableCell key={i} align={field.numeric ? 'right' : 'left'}>
                            {
                              dataRow[field.name].map((item) => (
                                <AutoTypography key={item} variant="inherit">
                                  {item}
                                </AutoTypography>
                              ))
                            }
                          </AutoTableCell>
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
        </TableWrapper>
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
      </Wrapper>
    );
  }
}
export default DamlArchiveTable
