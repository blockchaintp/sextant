import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@mui/styles/withStyles';
import Card from '@mui/material/Card';
import Avatar from '@mui/material/Avatar';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import Typography from '@mui/material/Typography';

const styles = (theme) => ({
  cardHeader: {
    width: '100%',
    alignItems: 'flex-start',
    borderBottom: `1px solid${theme.palette.grey[300]}`,
  },
  cardActionArea: {
    minHeight: '220px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'baseline',
  },
});

function MarketplaceCard(props) {
  const {
    classes,
    optionIcon,
    optionTitle,
    optionVersion,
    versionSummary,
    onClick,
    theme,
  } = props;

  return (
    <Card className={classes.card} variant="outlined" _ci={optionTitle.replace(/\s+/g, '')}>
      <CardActionArea
        className={classes.cardActionArea}
        onClick={() => onClick(optionVersion)}
      >
        <CardHeader
          className={classes.cardHeader}
          avatar={(
            <Avatar
              alt={optionTitle}
              src={optionIcon}
              aria-label="logo"
              variant="square"
              imgProps={{
                sx: {
                  objectFit: 'contain',
                },
              }}
            />
          )}
          title={optionTitle}
          subheader={optionVersion}
          subheaderTypographyProps={theme.typography.caption}
        />
        <CardContent className={classes.titles}>
          <Typography align="left" variant="body2" sx={{ color: 'text.secondary' }}>
            {versionSummary}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

MarketplaceCard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(MarketplaceCard);
