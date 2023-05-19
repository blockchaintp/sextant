import * as React from 'react'
import { styled } from '@mui/system'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material'

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

interface DamlArchiveTableProps{
  data: {
    id: string
    [key: string]: string | string[]
  }[]
  fields: {
    name: string
    title: string
    numeric?: boolean
  }[]
  getActions?: (dataRow: any) => React.ReactNode
  onRowClick?: (event: React.MouseEvent<HTMLTableRowElement, MouseEvent>, id: string) => void
  pagination?: boolean
  hideHeader?: boolean
  hideHeaderIfEmpty?: []
}

const DamlArchiveTable: React.FC<DamlArchiveTableProps> = ({
  data,
  fields,
  getActions,
  onRowClick,
  pagination,
  hideHeader,
  hideHeaderIfEmpty,
}) => {
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(25)

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
  }

  return (
    <Wrapper>
      <TableWrapper>
        <Table>
          {
            (!hideHeader && (!hideHeaderIfEmpty || data.length > 0)) && (
              <TableHead>
                <TableRow>
                  {
                    fields.map((field) => (
                      <TableCell key={field.title} align={field.numeric ? 'right' : 'left'}>
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
              >
                {
                    fields.map((field) => {
                      if (typeof (dataRow[field.name]) === 'string') {
                        return (
                          <AutoTableCell key={field.name} align={field.numeric ? 'right' : 'left'}>
                            {dataRow[field.name]}
                          </AutoTableCell>
                        )
                      }
                      if (Array.isArray(dataRow[field.name])) {
                        (dataRow[field.name] as string[]).sort();
                      }
                      return (
                        <AutoTableCell key={field.name} align={field.numeric ? 'right' : 'left'}>
                          {
                            (Array.isArray(dataRow[field.name])) &&
                            (dataRow[field.name]as string[]).map((item: string) => (
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
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        )
      }
    </Wrapper>
  )
}

export default DamlArchiveTable
