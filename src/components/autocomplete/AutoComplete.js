import React from 'react'
import PropTypes from 'prop-types'
import Autosuggest from 'react-autosuggest'
import match from 'autosuggest-highlight/match'
import parse from 'autosuggest-highlight/parse'

import { withStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Paper from '@material-ui/core/Paper'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'

const renderInputComponent = ({
  classes,
  inputRef = () => {},
  ref,
  ...other,
}) => {
  return (
    <TextField
      fullWidth
      InputProps={{
        inputRef: node => {
          ref(node)
          inputRef(node)
        },
        classes: {
          input: classes.input,
        },
      }}
      {...other}
    />
  )
}

const styles = theme => ({
  container: {
    flexGrow: 1,
    position: 'relative',
  },
  suggestionsContainerOpen: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing.unit,
    left: 0,
    right: 0,
  },
  suggestion: {
    display: 'block',
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: 'none',
  },
  margin: {
    margin: theme.spacing.unit,
  },
  listItem: {
    cursor: 'pointer',
  },
  highlightText: {
    fontWeight: 500,
    color: '#880000',
  },
  normalText: {
    fontWeight: 300,
  },
})

class AutoComplete extends React.Component {

  getHighlightedText = (value, query) => {
    const {
      classes,
      highlightClasses,
    } = this.props

    const highlightClass = highlightClasses && highlightClasses.highlight ?
      highlightClasses.highlight :
      classes.highlightText

    const normalClass = highlightClasses && highlightClasses.normal ?
      highlightClasses.normal :
      classes.normalText

    const parts = parse(value, match(value, query))

    return (
      <span>
        {
          parts.map((part, index) => {
            return part.highlight ? (
              <span key={ index } className={ highlightClass }>
                { part.text }
              </span>
            ) : (
              <strong key={ index } className={ normalClass }>
                { part.text }
              </strong>
            )
          })
        }
      </span>
    )
  }

  renderSuggestion = (suggestion, { query, isHighlighted }) => {
    const {
      classes,
      renderSuggestion,
      getSuggestionValue,
    } = this.props

    return renderSuggestion ?
      renderSuggestion({
        suggestion,
        query,
        getHighlightedText: this.getHighlightedText,
        isHighlighted,
      }) : (
        <ListItem
          selected={ isHighlighted }
          component="div"
          className={ classes.listItem }
        >
          <ListItemText primary={ this.getHighlightedText(getSuggestionValue(suggestion), query) } />
        </ListItem>
      )
  }

  changeHandler = (event, { newValue }) => {
    this.props.onChange(newValue)
  }

  suggestionsFetchRequested = ({ value }) => {
    this.props.loadSuggestions(value)
  }

  suggestionsClearRequested = () => {
    this.props.clearSuggestions()
  }

  suggestionSelected = (event, { suggestion }) => {
    this.props.onClick(suggestion)
  }

  render() {
    const {
      classes,
      suggestions,
      inputProps,
      getSuggestionValue,
      value,
    } = this.props

    const autosuggestProps = {
      renderInputComponent,
      suggestions,
      onSuggestionsFetchRequested: this.suggestionsFetchRequested,
      onSuggestionsClearRequested: this.suggestionsClearRequested,
      onSuggestionSelected: this.suggestionSelected,
      renderSuggestion: this.renderSuggestion,
      getSuggestionValue,
    }

    return (
      <Autosuggest
        {...autosuggestProps}
        inputProps={{
          classes,
          value,
          onChange: this.changeHandler,
          ...inputProps,
        }}
        theme={{
          container: classes.container,
          suggestionsContainerOpen: classes.suggestionsContainerOpen,
          suggestionsList: classes.suggestionsList,
          suggestion: classes.suggestion,
        }}
        renderSuggestionsContainer={options => (
          <Paper {...options.containerProps} square>
            { options.children }
          </Paper>
        )}
      />
    )
  }
}

AutoComplete.propTypes = {
  classes: PropTypes.object.isRequired,
  suggestions: PropTypes.array.isRequired,
  renderSuggestion: PropTypes.func,
  getSuggestionValue: PropTypes.func.isRequired,
  loadSuggestions: PropTypes.func.isRequired,
  clearSuggestions: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  highlightClasses: PropTypes.object,
}

export default withStyles(styles)(AutoComplete)
