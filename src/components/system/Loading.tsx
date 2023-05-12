import React from 'react'
import { styled } from '@mui/system';
import {
  CircularProgress,
  Typography,
} from '@mui/material'
import { convertLength } from '@mui/material/styles/cssUtils';

const Wrapper = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
})

const StyledContainer = styled('div')({
  maxWidth: '50%',
})

const StyledItem = styled('div')({
  textAlign: 'center',
  display: 'inline-block',
})

interface LoadingProps {
  color?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning'
  message?: string
}

const Loading: React.FC<LoadingProps> = ({ color, message }) => {
  return (
    <Wrapper>
      <StyledContainer>
        <StyledItem>
          <CircularProgress
            color={color}
          />
          {
            message && (
              <Typography
                variant="subtitle1"
                color={color}
              >
                { message }
              </Typography>
            )
          }
        </StyledItem>

      </StyledContainer>
    </Wrapper>
  )
}

export default Loading
