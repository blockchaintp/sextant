import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ButtonBase from '@material-ui/core/ButtonBase'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

const styles = () => ({
  card: {
    display: 'flex',
  },
  titles: {
    display: 'flex',
    flex: '1 0 auto',
    alignItems: 'flex-start',
    flexDirection: 'column',
  },
  icon: {
    width: 100,
  },
});

function HorizontalCard(props) {
  const {
    classes,
    optionIcon,
    optionTitle,
    optionVersion,
    versionSummary,
    onClick,
  } = props;

  return (
    <Card className={classes.card}>
      <ButtonBase
        onClick={() => onClick(optionVersion)}
      >
        <CardContent>
          <img src={optionIcon} alt="" className={classes.icon} />
        </CardContent>
        <div>
          <CardContent className={classes.titles}>
            <Typography component="h5" variant="h5">
              {optionTitle}
            </Typography>
            <Typography variant="subtitle1" align="left" color="textSecondary">
              {optionVersion}
            </Typography>
            <Typography align="left">
              {versionSummary}
            </Typography>
          </CardContent>
        </div>
      </ButtonBase>
    </Card>
  );
}

HorizontalCard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(HorizontalCard);
