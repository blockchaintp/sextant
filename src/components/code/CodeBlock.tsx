import * as React from 'react'
import { styled } from '@mui/system'

import Tooltip from '@mui/material/Tooltip'
import Fab from '@mui/material/Fab'
import ClipboardIcon from '@mui/icons-material/FileCopy'

import { CopyToClipboard } from 'react-copy-to-clipboard'

const Root = styled('div')({
  position: 'relative',
})

const CodeBlockWrapper = styled('pre')(({ theme }) => ({
  width: '100%',
  overflowX: 'auto',
  backgroundColor: '#000',
  color: '#fff',
  fontFamily: 'Courier',
  fontSize: '0.8em',
  padding: theme.spacing(1),
  minHeight: '48px',
}))

const ClipboardButton = styled('div')(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(1),
  right: theme.spacing(1),
}))

const StyledFab = styled(Fab)({
  width: '30px',
  height: '30px',
  minHeight: '30px',
})

const StyledClipboardIcon = styled(ClipboardIcon)({
  width: '15px',
  height: '15px',
})

type CodeBlockProps = {
  code: string,
  clipboard: boolean,
  snackbarMessage: (message: string) => void,
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, clipboard, snackbarMessage}) => {

    return (
      <Root>
        {
          clipboard && (
            <ClipboardButton>
              <CopyToClipboard
                text={code}
                onCopy={() => {
                  snackbarMessage('Copied to clipboard')
                }}
              >
                <Tooltip title="Copy to clipboard" placement="top">
                  <StyledFab
                    size="small"
                    color="primary"
                    aria-label="Add"
                  >
                    <StyledClipboardIcon />
                  </StyledFab>
                </Tooltip>
              </CopyToClipboard>
            </ClipboardButton>
          )
        }
        <CodeBlockWrapper>
          <code>
            { code }
          </code>
        </CodeBlockWrapper>
      </Root>

    )
  }

export default CodeBlock
