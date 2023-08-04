import * as React from 'react';
import { styled } from '@mui/system';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

import Explorer from './Explorer';
import Playground from './Playground';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const VerticalFillContainer = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    width: '100%',
})

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <VerticalFillContainer
      role="tabpanel"
      style={{ display: value === index ? 'flex' : 'none' }}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && children}
    </VerticalFillContainer>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function BasicTabs() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <VerticalFillContainer>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                <Tab label="Explorer" {...a11yProps(0)} />
                <Tab label="Playground" {...a11yProps(1)} />
            </Tabs>
        </Box>
        <Box sx={{ width: '100%', flex: 1, display: 'flex' }}>
            <CustomTabPanel value={value} index={0}>
                <Explorer />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
                <Playground />
            </CustomTabPanel>
        </Box>
    </VerticalFillContainer>
  )
}
