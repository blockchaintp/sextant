import React from 'react'
import PropTypes from 'prop-types'
import Button from '@mui/material/Button'

class NotFound extends React.Component {
  constructor(props) {
    super(props)
    this.visitHome = () => props.navigateTo('home')
  }

  render() {
    return (
      <div>
        <div>page not found</div>
        <Button
          variant="contained"
          color="primary"
          onClick={this.visitHome}
        >
          Home
        </Button>
      </div>
    )
  }
}

NotFound.propTypes = {
  navigateTo: PropTypes.func.isRequired,
}

export default NotFound
