import * as React from 'react'
import { styled } from '@mui/system'
import {
  Grid,
  Paper,
} from '@mui/material'

import SimpleTable from '../../components/table/SimpleTable'
import SimpleTableHeader from '../../components/table/SimpleTableHeader'

type TimeServiceEntry = {
  publicKey: string;
  // add other properties as needed
};

type DeploymentSettingsDamlTimeServiceProps = {
  timeServiceInfo: TimeServiceEntry[];
};

const Root = styled('div')(({ theme }) => ({
  padding: theme.spacing(2),
}))

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  margin: theme.spacing(2),
}))

const DeploymentSettingsDamlTimeService: React.FC<DeploymentSettingsDamlTimeServiceProps> = ({ timeServiceInfo }) => {
  const getTimeServiceInfo = () => {
    const fields = [{
      title: 'Public Key of Keeper',
      name: 'publicKey',
    }, {
      title: 'Last Clock Update',
      name: 'lastClockUpdate',
    }]

    const data = timeServiceInfo.map((entry: TimeServiceEntry) => ({ ...entry, id: entry.publicKey }))

    return (
      <div>
        <SimpleTableHeader
          title="Time Service"
        />
        <SimpleTable
          data={data}
          fields={fields}
        />
      </div>
    )
  }
  return (
    <Root>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <StyledPaper>
            { getTimeServiceInfo() }
          </StyledPaper>
        </Grid>
      </Grid>
    </Root>
  )
}

export default DeploymentSettingsDamlTimeService
