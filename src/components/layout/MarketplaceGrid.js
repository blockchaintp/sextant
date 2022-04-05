import React from 'react';

import withStyles from '@mui/styles/withStyles';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography';

import MarketplaceCard from 'components/layout/MarketplaceCard';

const styles = () => ({});

class MarketplaceGrid extends React.Component {
  state = {};

  clickItem = (item) => {
    const { openPage } = this.props;

    if (item.items) {
      if (item.handler) {
        item.handler();
      }
      return;
    }

    if (typeof item.handler === 'string') {
      openPage(item.handler);
    } else if (typeof item.handler === 'function') {
      item.handler();
    } else {
      throw new Error(`unknown AppBarMenu item handler for ${item.title}`);
    }
  };

  render() {
    const {
      classes, theme, items,
    } = this.props;

    // returns an array of divs. Each div contains dialog content for a deployment version
    const getDeploymentCards = (deploymentTypes) => {
      const cards = [];
      deploymentTypes.forEach((deployment, i) => {
        const { versions } = deployment;
        versions.forEach((version) => {
          cards.push(
            <Grid item sm={12} md={6} lg={4} xl={3} key={i}>
              <MarketplaceCard
                classes={classes}
                theme={theme}
                optionIcon={version.icon || '/large-logo-outline-roundel.svg'}
                optionTitle={version.title}
                optionVersion={version.version}
                versionSummary={version.description}
                onClick={() => this.clickItem(version)}
              />
            </Grid>,
          );
        });
      });
      return cards;
    };

    const deploymentCards = getDeploymentCards(items);

    return (
      <>
        <Toolbar>
          <Typography variant="h6">
            Deployment Charts
          </Typography>
        </Toolbar>
        <Box p={2}>
          <Grid container spacing={{ xs: 2, md: 3 }}>
            {deploymentCards}
          </Grid>
        </Box>
      </>
    );
  }
}

export default withStyles(styles)(MarketplaceGrid);
