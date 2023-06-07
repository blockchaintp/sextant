import React from 'react'
import { styled } from '@mui/system';

import {
  Toolbar,
  Typography,
} from '@mui/material'
import {  ToolbarProps } from '@mui/material/Toolbar'
import {  TypographyProps } from '@mui/material/Typography'

type SimpleTableHeaderProps = ToolbarProps & {
  getTitle?: () => React.ReactNode
  getActions?: () => React.ReactNode
  title?: string
  titleVariant?: string
  titleClassname?: string
  sx?: React.CSSProperties
}

const ToolbarRoot = styled(Toolbar)(({ theme }) => ({
  paddingRight: theme.spacing(1),
}))

const Spacer = styled('div')({
  flex: '1 1 100%',
})

const Actions = styled('div')({
  display: 'flex',
  justifyContent: 'right',
  alignItems: 'flex-end',
})

const SimpleTableHeader: React.FC<SimpleTableHeaderProps> = ({
  title,
  getTitle,
  getActions,
  titleVariant,
  titleClassname,
}) => {

  return (
    <ToolbarRoot>
      <div>
        {
          getTitle ? (
            getTitle()
          ) : (
            <Typography noWrap className={titleClassname} variant={titleVariant as TypographyProps['variant'] || 'h6'}
            >{ title }</Typography>
          )
        }
      </div>
      <Spacer />
      <Actions>
        {
          getActions ? getActions() : null
        }
      </Actions>
    </ToolbarRoot>
  )
}

export default SimpleTableHeader
