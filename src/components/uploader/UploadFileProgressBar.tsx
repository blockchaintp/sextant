import React from 'react'
import { styled } from '@mui/system';
import {
  LinearProgress,
  Grid,
  Typography,
} from '@mui/material'
import prettyBytes from 'pretty-bytes'

const GridRoot = styled(Grid)(({ theme }) => ({
  marginTop: theme.spacing(1),
}))

interface UploadFileProgressBarProps {
  color: 'primary' | 'secondary'
  filename: string
  size: number
  uploadedBytes: number
  percentDone: number
  remainingTime: number
}

const UploadFileProgressBar: React.FC<UploadFileProgressBarProps> = ({
  color,
  filename,
  size,
  uploadedBytes,
  percentDone,
  remainingTime,
}) => {

    const timeLeftSeconds = Math.round(remainingTime / 1000) + 1
    const timeLeftMinutes = Math.floor(timeLeftSeconds / 60)
    const timeLeftMinutesSeconds = timeLeftSeconds % 60

    const timeLeft = timeLeftSeconds < 60
      ? `${timeLeftSeconds} secs`
      : `${timeLeftMinutes} mins ${timeLeftMinutesSeconds} secs`

  return (
    <GridRoot container spacing={1}>
      <Grid item xs={12}>
        <Typography variant="body2">
          { filename }
          {' '}
          -
          {' '}
          { prettyBytes(size) }
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <LinearProgress
          variant="determinate"
          value={percentDone}
          color={color}
        />
      </Grid>
      <Grid item xs={6}>
        <Typography variant="caption">
          { `${prettyBytes(uploadedBytes)} - ${percentDone}%` }
        </Typography>
      </Grid>
      {
        remainingTime > 0 && (
          <Grid item xs={6} sx={{ textAlign: 'right' }}>
            <Typography variant="caption">
              { timeLeft }
              {' '}
              remaining
            </Typography>
          </Grid>
        )
      }
    </GridRoot>
  )
}

export default UploadFileProgressBar
