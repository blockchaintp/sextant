import React from 'react'
import PropTypes from 'prop-types'

import withStyles from '@mui/styles/withStyles';
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'

const styles = () => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  container: {
    maxWidth: '50%',
  },
  item: {
    textAlign: 'center',
    display: 'inline-block',
  },
})

class Loading extends React.Component {
  render() {
    const {
      classes,
      color,
      message,
    } = this.props

    return (
      <div className={classes.root}>
        <div className={classes.container}>
          <div className={classes.item}>
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
          </div>

        </div>
      </div>
    )
  }
}

Loading.propTypes = {
  classes: PropTypes.object.isRequired,
  color: PropTypes.string,
  message: PropTypes.string,
}

Loading.defaultProps = {
  color: 'primary',
  message: 'loading',
}

export default withStyles(styles)(Loading)
