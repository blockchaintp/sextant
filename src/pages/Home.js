import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

const styles = theme => ({
 
})

class Home extends React.Component {

  constructor(props) {
    super(props)

    const {
      navigateTo,
    } = this.props

    this.visitContent = () => navigateTo('content')
  }

  render() {

    const {
      counter,
    } = this.props

    return (
      <div>
        <div>logged in</div>
      </div>
      
    )
  }
}

Home.propTypes = {
  classes: PropTypes.object.isRequired,
  navigateTo: PropTypes.func.isRequired,
}

export default withStyles(styles)(Home)