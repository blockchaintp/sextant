/* eslint-disable react/destructuring-assignment */
import React from 'react'
import PropTypes from 'prop-types'
import Autosuggest from 'react-autosuggest'
import match from 'autosuggest-highlight/match'
import parse from 'autosuggest-highlight/parse'
import TextField from '@mui/material/TextField'
import Paper from '@mui/material/Paper'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'

const renderInputComponent = ({
  classes,
  inputRef = () => {},
  ref,
  ...other
}) => (
  <TextField
    fullWidth
    InputProps={{
      inputRef: (node) => {
        ref(node)
        inputRef(node)
      },
    }}
    {...other}
  />
)

const containerStyles = {
  flexGrow: 1,
  position: 'relative',
}
const suggestionsContainerOpenStyles = {
  position: 'absolute',
  zIndex: 2,
  marginTop: 1,
  left: 0,
  right: 0,
}
const suggestionStyles = {
  display: 'block',
}
const suggestionsListStyles = {
  margin: 0,
  padding: 0,
  listStyleType: 'none',
}
const listItemStyles = {
  cursor: 'pointer',
}
const highlightTextStyles = {
  fontWeight: 500,
  color: '#880000',
}
const normalTextStyles = {
  fontWeight: 300,
}

class AutoComplete extends React.Component {
  getHighlightedText = (value, query) => {
    const {
      highlightClasses,
    } = this.props

    const highlightClass = highlightClasses && highlightClasses.highlight
      ? highlightClasses.highlight
      : highlightTextStyles

    const normalClass = highlightClasses && highlightClasses.normal
      ? highlightClasses.normal
      : normalTextStyles

    const parts = parse(value, match(value, query))

    return (
      <span>
        {
          parts.map((part, index) => (part.highlight ? (
            <span key={index} className={highlightClass}>
              { part.text }
            </span>
          ) : (
            <strong key={index} className={normalClass}>
              { part.text }
            </strong>
          )))
        }
      </span>
    )
  }

  renderSuggestion = (suggestion, { query, isHighlighted }) => {
    const {
      renderSuggestion,
      getSuggestionValue,
    } = this.props

    return renderSuggestion
      ? renderSuggestion({
        suggestion,
        query,
        getHighlightedText: this.getHighlightedText,
        isHighlighted,
      }) : (
        <ListItemButton
          component="div"
          className={listItemStyles}
        >
          <ListItemText primary={this.getHighlightedText(getSuggestionValue(suggestion), query)} />
        </ListItemButton>
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

  render() {
    const {
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
          value,
          onChange: this.changeHandler,
          ...inputProps,
        }}
        theme={{
          container: containerStyles,
          suggestionsContainerOpen: suggestionsContainerOpenStyles,
          suggestionsList: suggestionsListStyles,
          suggestion: suggestionStyles,
        }}
        renderSuggestionsContainer={(options) => (
          <Paper {...options.containerProps} square>
            { options.children }
          </Paper>
        )}
      />
    )
  }
}

AutoComplete.propTypes = {
  suggestions: PropTypes.array.isRequired,
  renderSuggestion: PropTypes.func,
  getSuggestionValue: PropTypes.func.isRequired,
  loadSuggestions: PropTypes.func.isRequired,
  clearSuggestions: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  highlightClasses: PropTypes.object,
}

AutoComplete.defaultProps = {
  renderSuggestion: PropTypes.func,
  highlightClasses: PropTypes.object,
}

export default AutoComplete
