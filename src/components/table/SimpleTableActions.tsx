import * as React from 'react'
import { styled } from '@mui/system';

import {
  IconButton,
  Tooltip,
} from '@mui/material'
import {  IconButtonProps } from '@mui/material/IconButton'

const Root = styled('div')({
  whiteSpace: 'nowrap',
})

interface SimpleTableActionsProps {
  item: {
    [key: string]: string | number | object | boolean
  }
  actions: {
    icon: React.ReactElement<any, any> | React.ComponentType<any>;
    title: string
    handler?: (item: any) => void
    shouldDisplay?: (item: any) => boolean
    getIcon?: (item: any) => Symbol
    getTitle?: (item: any) => string
    disabled?: boolean
    wrapButton?: (button: any, item: any) => any
    style?: { [key: string]: string | number }
  }[]
}

export interface CIIconButtonProps extends IconButtonProps {
  _ci?: string
}


const CIIconButton = ({ _ci, ...rest }: CIIconButtonProps) => {
  return <IconButton {...rest} />;
}

const SimpleTableActions: React.FC<SimpleTableActionsProps> = ({ item, actions }) => {
  return (
    <Root>
      {
        actions
          .filter((action) => {
            if (action.shouldDisplay) return action.shouldDisplay(item)
            return true
          })
          .map((action) => {
            const IconClass = action.getIcon ? action.getIcon(item) : action.icon
            const DynamicIcon = IconClass as React.ComponentType<any>;
            const title = action.getTitle ? action.getTitle(item) : action.title
            const visibility = action.disabled ? action.disabled : false

            const button = (
              <CIIconButton
                _ci={`${item.username}${title}`}
                id={`action_${item.username || item.name}${title}`}
                onClick={(event) => {
                  event.stopPropagation()
                  if (action.handler) {
                    action.handler(item)
                  }
                }}
                disabled={visibility}
                style={action.style}
                size="large"
              >
                <DynamicIcon />
              </CIIconButton>
            )

            return (
              <Tooltip key={title} title={title}>
                { button }
              </Tooltip>
            )
          })
      }
    </Root>
  )
}

export default SimpleTableActions
