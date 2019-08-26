import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import ButtonBase from '@material-ui/core/ButtonBase'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  card: {
    display: 'flex',
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
  },
  titles: {
    flex: '1 0 auto',
  },
  icon: {
    width: 60,
  },
  summary: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
  },
});

function HorizontalCard(props) {
  const {
    classes,
    theme,
    optionIcon,
    optionTitle,
    optionVersion,
    versionSummary,
    onClick
  } = props;

  return (
    <Card className={classes.card}>
      <ButtonBase
        onClick={ () => onClick(optionVersion) }
      >
        <CardContent>
          <img src={optionIcon} className={ classes.icon } />
        </CardContent>
      </ButtonBase>
      <div className={classes.details}>
        <CardContent className={classes.titles}>
          <div className={classes.row}>
            <Typography component="h5" variant="h5">
              {optionTitle}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              {optionVersion}
            </Typography>
          </div>
          <Typography >
            {versionSummary}
          </Typography>
        </CardContent>
      </div>
    </Card>
  );
}

HorizontalCard.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(HorizontalCard);
