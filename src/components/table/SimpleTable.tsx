import * as React from 'react'
import { styled } from '@mui/system'
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
import { TableCellProps } from '@mui/material/TableCell'
import { TableRowProps } from '@mui/material/TableRow'

export type SimpleTableProps = {
  data: any[],
  fields: any[],
  getActions?: Function,
  onRowClick?: Function,
  pagination?: boolean,
  hideHeader?: boolean,
  hideHeaderIfEmpty?: boolean,
  withSorting?: boolean
}

export interface CustomTableCellProps extends TableCellProps {
  _ci?: string
  hover?: boolean
}

export interface CustomTableRowProps extends TableRowProps {
  _ci?: string
}

const CustomTableCell = ({ _ci, ...rest }: CustomTableCellProps) => {
  return <TableCell {...rest} />
}

const CustomTableRow = ({ _ci, ...rest }: CustomTableRowProps) => {
  return <TableRow {...rest} />
}

const TableWrapper = styled('div')({
  width: '100%',
  overflowX: 'auto',
})

const AutoCell = styled(TableCell)({
  width: 'auto',
})

function desc<T>(a: T, b: T, orderBy: keyof T): number {
    if (b[orderBy] < a[orderBy]) {
      return -1
    }
    if (b[orderBy] > a[orderBy]) {
      return 1
    }
    return 0
  }

function stableSort(array: any[], compareFunc: Function) {
    const stabilizedThis = array.map((element, index) => [element, index])
    stabilizedThis.sort((a, b) => {
      const order = compareFunc(a[0], b[0])
      if (order !== 0) return order
      return a[1] - b[1]
    })
    return stabilizedThis.map((element) => element[0])
  }

  function getCompareFunc<T>(order: string, orderBy: keyof T) {
    return order === 'desc' ? (a: T, b: T) => desc(a, b, orderBy) : (a: T, b: T) => -desc(a, b, orderBy)
  }

const SimpleTable: React.FC<SimpleTableProps> = (props) => {
  const {
    data,
    fields,
    getActions,
    onRowClick,
    pagination,
    hideHeader,
    hideHeaderIfEmpty,
    withSorting = true,
  } = props

  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(25)
  const [order, setOrder] = React.useState<"asc" | "desc">('asc')
  const [orderBy, setOrderBy] = React.useState('name')

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): void => {
    const newRowsPerPage = parseInt(event.target.value)
    setRowsPerPage(newRowsPerPage)
  }

  const handleRequestSort = (event: React.MouseEvent<HTMLTextAreaElement | HTMLInputElement>, property: string) => {
    const newOrderBy = property
    let newOrder: "asc" | "desc" = 'desc'
    if (orderBy === property && order === 'desc') {
      newOrder = 'asc'
    }
    setOrder(newOrder)
    setOrderBy(newOrderBy)
  }

  const createSortHandler = (property: string) => (event: React.MouseEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    handleRequestSort(event, property)
  }

  return (
    <div>
      <TableWrapper>
        <Table>
          {
            (!hideHeader && (!hideHeaderIfEmpty || Object.keys(data).length > 0)) && (
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
                            onClick={createSortHandler(field.name)}
                          >
                            {field.title}
                          </TableSortLabel>
                        </Tooltip>
                      ) : (
                        <div>{field.title}</div>
                      )
                      return (
                        <TableCell
                          key={field.name}
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
            {stableSort(data, getCompareFunc(order, orderBy))
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
                        key={`${dataRow.username || dataRow.name}${dataRow[field.name]}`}
                        align={field.numeric ? 'right' : 'left'}
                      >
                        {dataRow[field.name] || (dataRow.deploymentData ? dataRow.deploymentData[field.name] : null)}
                      </CustomTableCell>
                    ))
                  }
                  {
                    getActions ? (
                      <CustomTableCell align="right">
                        {getActions(dataRow)}
                      </CustomTableCell>
                    ) : null
                  }
                </CustomTableRow>
              ))}
          </TableBody>
        </Table>
      </TableWrapper>
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
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        )
      }
    </div>
    )
}

export default SimpleTable
