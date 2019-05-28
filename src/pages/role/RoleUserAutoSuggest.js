import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'

import AutoComplete from 'components/autocomplete/AutoComplete'

const styles = theme => ({
  highlightText: {
    fontWeight: 500,
    color: '#008800',
  },
  normalText: {
    fontWeight: 300,
  },
})

class RoleUserAutoSuggest extends React.Component {

  render() {
    const {
      classes,
      search,
      users,
      setSearch,
      loadUsers,
      clearUsers,
    } = this.props
    return (
      <AutoComplete
        suggestions={ users }
        getSuggestionValue={ (user) => user }
        loadSuggestions={ loadUsers }
        clearSuggestions={ clearUsers }
        value={ search }
        onChange={ setSearch }
        onClick={ (user) => {} }
        inputProps={{
          placeholder: 'Search for user',
          label: 'User',
        }}
        highlightClasses={{
          highlight: classes.highlightText,
          normal: classes.normalText,
        }}
        renderSuggestion={ ({
          suggestion,
          query,
          getHighlightedText,
          isHighlighted,
        }) => {
          return (
            <ListItem
              selected={ isHighlighted }
              component="div"
            >
              <ListItemText 
                primary={ getHighlightedText(suggestion.username, query) } 
                secondary={ suggestion.permission }
              />
            </ListItem>
          )
        }}
      />
    )
  }
}

RoleUserAutoSuggest.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(RoleUserAutoSuggest)

