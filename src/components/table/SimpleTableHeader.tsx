import React from 'react'
import { styled } from '@mui/system';

import {
  Toolbar,
  Typography,
} from '@mui/material'
import {  TypographyProps } from '@mui/material/Typography'

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

interface SimpleTableHeaderProps {
  title: string
  getTitle?: () => React.ReactNode
  getActions: () => React.ReactNode
  titleVariant?: string
  titleClassname?: string
}

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
