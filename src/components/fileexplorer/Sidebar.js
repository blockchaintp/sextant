/* eslint-disable no-shadow */
import React, { useMemo } from 'react'
import { styled } from '@mui/system';
import Typography from '@mui/material/Typography'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FolderTree from './FolderTree'

const Wrapper = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  height: '100%',
})

const VolumeSelect = styled('div')({
  flexGrow: 0,
  width: '100%',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
})

const VolumeSelectTitle = styled('div')(({ theme }) => ({
  paddingLeft: theme.spacing(1),
  width: '100px',
  '& span': {
    fontSize: '0.75em',
    color: '#666',
  },
}))

const Folders = styled('div')(({ theme }) => ({
  flexGrow: 1,
  overflowY: 'auto',
  width: '100%',
  borderTop: '1px solid #ccc',
  marginTop: theme.spacing(1),
}))

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  padding: theme.spacing(1),
  width: '100%',
}))

const VolumeSelectControl = styled(Select)({
  fontSize: '0.75em',
})

function ExplorerSidebar({
  explorer,
}) {
  const {
    volume,
    volumes,
    snapshot,
    snapshots,
    onChangeVolume,
    onChangeSnapshot,
  } = explorer

  const changeVolumeSelect = useMemo(() => (volume ? (
    <VolumeSelect>
      <VolumeSelectTitle>
        <Typography variant="caption">volume:</Typography>
      </VolumeSelectTitle>
      <StyledFormControl>
        <VolumeSelectControl
          value={volume.uuid}
          onChange={(ev) => onChangeVolume(ev.target.value)}
        >
          {
              volumes
                .map((v, i) => (
                  <MenuItem
                    key={i}
                    value={v.uuid}
                  >
                    { v.name }
                  </MenuItem>
                ))
            }
        </VolumeSelectControl>
      </StyledFormControl>
    </VolumeSelect>
  ) : null), [
    volume,
    volumes,
  ])

  const changeSnapshotSelect = useMemo(() => {
    if (!snapshots || snapshots.length <= 0) return null
    return (
      <VolumeSelect>
        <VolumeSelectTitle>
          <Typography variant="caption">snapshot:</Typography>
        </VolumeSelectTitle>
        <StyledFormControl>
          <VolumeSelectControl
            value={snapshot ? snapshot.block : 'head'}
            onChange={(ev) => onChangeSnapshot(ev.target.value)}
          >
            <MenuItem
              value="head"
            >
              latest
            </MenuItem>
            {
              snapshots
                .map((s, i) => (
                  <MenuItem
                    key={i}
                    value={s.block}
                  >
                    { s.name }
                  </MenuItem>
                ))
            }
          </VolumeSelectControl>
        </StyledFormControl>
      </VolumeSelect>
    )
  }, [
    snapshots,
    snapshot,
  ])

  return (
    <Wrapper>
      { changeVolumeSelect }
      { changeSnapshotSelect }
      <Folders>
        <FolderTree
          explorer={explorer}
        />
      </Folders>
    </Wrapper>
  )
}

export default ExplorerSidebar
