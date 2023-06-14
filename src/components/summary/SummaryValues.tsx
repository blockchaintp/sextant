import React from 'react'
import { styled } from '@mui/system';

import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'

const RightAlignedTypography = styled(Typography)(({ theme }) => ({
  textAlign: 'right',
  paddingRight: theme.spacing(2),
}))

const formatSummaryValues = (value: string | string[]) => {
  if (Array.isArray(value)) {
    return value.map((item) => (
      <Tooltip title={item} key={item}>
        <Typography noWrap={true}>
          {item}
        </Typography>
      </Tooltip>
    ))
  }
  return ([
    <Typography key={value}>
      {value}
    </Typography>,
  ])
}

interface SummaryValuesProps {
  data: {
    title: string,
    value: string | Array<string>,
  }[]
}

const SummaryValues: React.FC<SummaryValuesProps> = ({ data }) => {

  const parts = data.reduce((all, row) => all.concat([
    <Grid
      key={row.title}
      item
      xs={6}
    >
      <RightAlignedTypography>
        <strong>
          {row.title}
          :
        </strong>
      </RightAlignedTypography>
    </Grid>,
    <Grid
      key={row.title}
      item
      xs={6}
    >
      {formatSummaryValues(row.value)}
    </Grid>,
  ]), [])

  return (
    <Grid
      container
      direction="row"
      spacing={1}
    >
      {parts}
    </Grid>
  )
}

export default SummaryValues
