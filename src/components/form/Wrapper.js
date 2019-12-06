import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import { Formik, Field, FieldArray } from 'formik'
import dotty from 'dotty'

import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import FormHelperText from '@material-ui/core/FormHelperText'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Divider from '@material-ui/core/Divider'

import AddIcon from '@material-ui/icons/Add'
import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Delete'

import SimpleTable from 'components/table/SimpleTable'
import SimpleTableDeleteDialog from 'components/table/SimpleTableDeleteDialog'
import SimpleTableHeader from 'components/table/SimpleTableHeader'
import SimpleTableActions from 'components/table/SimpleTableActions'

import Sortable from 'components/dragdrop/Sortable'
import Draggable from 'components/dragdrop/Draggable'

import utils from './utils'
import Validate from './validate'

const styles = theme => {
  return {
    errorContainer: {
      marginTop: theme.spacing.unit * 2,
    },
    errorText: {
      color: theme.palette.error.main,
    },
    button: {
      marginRight: theme.spacing.unit * 2,
    },
    listTableTitle: {
      color: theme.palette.text.secondary,
      flex: 'flexGrow'
    },
    listTable: {
      marginTop: theme.spacing.unit * 2,
      marginBottom: theme.spacing.unit * 2,
    },
    divider: {
      marginTop: '20px',
      marginBottom: '20px',
    },
    addButtonContainer: {
      marginTop: theme.spacing.unit * 2,
    },
    listTableHeader: {
      paddingLeft: '0px',
      display:"flex"
    },
  }
}

class FormListDialogInner extends React.Component {
  render() {
    const {
      open,
      onCancel,
      onSave,
      schema,
      initialValues,
      title,
      classes,
    } = this.props

    return (
      <Dialog
        open={ open }
        onClose={ onCancel }
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{ title }</DialogTitle>
        <DialogContent>
          <FormWrapper
            schema={ schema }
            initialValues={ initialValues }
            onSubmit={ onSave }
            renderButtons={
              ({
                handleSubmit,
              }) => {
                return (
                  <React.Fragment>
                    <Button
                      className={ classes.button }
                      type="button"
                      variant="contained"
                      onClick={ onCancel }
                    >
                      Cancel
                    </Button>
                    <Button
                      className={ classes.button }
                      type="button"
                      variant="contained"
                      color="primary"
                      disabled={ false }
                      onClick={ handleSubmit }
                    >
                      Save
                    </Button>
                  </React.Fragment>
                )
              }
            }
          />
        </DialogContent>
      </Dialog>
    )
  }
}

const FormListDialog = withStyles(styles)(FormListDialogInner)

class FormListInner extends React.Component {

  state = {
    editOpen: false,
    editItem: null,
    deleteConfirmOpen: false,
    deleteConfirmItem: null,
  }

  constructor(props) {
    super(props)
    this.onAdd = this.add.bind(this)
    this.onEdit = this.edit.bind(this)
    this.onCancel = this.cancel.bind(this)
    this.onSave = this.save.bind(this)
    this.onDelete = this.delete.bind(this)
    this.onSwap = this.swap.bind(this)
  }

  add() {
    this.setState({
      editOpen: true,
      editItem: null,
    })
  }

  edit(item) {
    this.setState({
      editOpen: true,
      editItem: item,
    })
  }

  cancel() {
    this.setState({
      editOpen: false,
      editItem: null,
    })
  }

  delete(id) {
    const arrayHelpers = this.props.arrayHelpers
    arrayHelpers.remove(id)
  }

  save(values) {
    const arrayHelpers = this.props.arrayHelpers
    const editItem = this.state.editItem

    if(editItem) {
      arrayHelpers.replace(editItem.id, values)
    }
    else {
      arrayHelpers.push(values)
    }
    this.setState({
      editOpen: false,
      editItem: null,
    })
  }

  swap(fromIndex, toIndex) {
    const arrayHelpers = this.props.arrayHelpers
    arrayHelpers.swap(fromIndex, toIndex)
  }

  openDeleteDialog(item) {
    this.setState({
      deleteConfirmOpen: true,
      deleteConfirmItem: item,
    })
  }

  closeDeleteDialog() {
    this.setState({
      deleteConfirmOpen: false,
    })
  }

  render() {
    const {
      item,
      formProps,
      arrayHelpers,
      classes,
      disabled,
    } = this.props

    const {
      editOpen,
      editItem,
      deleteConfirmOpen,
      deleteConfirmItem,
    } = this.state

    const value = dotty.get(formProps.values, item.id)

    const fields = item.list.table
    const mainField = item.list.mainField

    const data = value.map((item, index) => {
      const ret = fields.reduce((all, field) => {
        const baseRenderValue = field.render ?
          field.render(item) :
          item[field.name]

        let renderValue = baseRenderValue

        if(field.sortable && !disabled) {
          renderValue = (
            <Sortable
              id={ index }
              index={ index }
              reorderDrag={ this.onSwap }
              render={({
                isDragging,
              }) => (
                <div>
                  <Draggable
                    isDragging={ isDragging }
                  >
                    { baseRenderValue }
                  </Draggable>
                </div>
              )}
            />
          )
        }
        all[field.name] = renderValue
        return all
      }, {})
      ret.id = index
      ret.index = index
      ret._item = Object.assign({}, item, {
        id: index,
        index: index,
      })
      return ret
    })

    const disableButton = () => {
      // only for image pull secrets field
      let disabled
      if (item.id === "imagePullSecrets.value" && formProps.values.imagePullSecrets['enabled']) {
        // links add-button's render to radio-button state
        disabled = formProps.values.imagePullSecrets['enabled'] === 'false' ? true : false
      } else if(item.id === "imagePullSecrets.value") {
        // sets initial render of add-button to disabled
        disabled = true
      }
      return disabled
    }

    const addButton = (
      <div className={ classes.addButtonContainer }>
        <Button
          className={ classes.button }
          variant="contained"
          onClick={ this.onAdd }
          size="small"
          disabled= {disableButton()}
        >
          Add
          <AddIcon />
        </Button>
      </div>
    )

    const actions = [{
      title: 'Delete',
      icon: DeleteIcon,
      handler: (data) => this.openDeleteDialog(data._item),
    }, {
      title: 'Edit',
      icon: EditIcon,
      handler: (data) => this.onEdit(data._item),
    }]

    return (
      <div className={ classes.listTable }>
        <SimpleTableHeader
          className={ classes.listTableHeader }
          getTitle={ () => (
            <React.Fragment>
              <Typography noWrap={true} className={ classes.listTableTitle } variant='subtitle1'>{ item.skip ? null : (item.title || item.id) }</Typography>
              <Typography className={ classes.listTableTitle } variant='caption'>{ item.helperText }</Typography>
            </React.Fragment>
          )}
        />
        <SimpleTable
          data={ data }
          fields={ fields }
          getActions={ (item) => {
            if(disabled) return null
            return (
              <SimpleTableActions
                item={ item }
                actions={ actions }
              />
            )
          }}
          hideHeaderIfEmpty
        />
        { disabled ? null : addButton }
        <SimpleTableDeleteDialog
          open={ deleteConfirmOpen }
          title={ deleteConfirmItem ? deleteConfirmItem[mainField] : null }
          onCancel={ () => this.closeDeleteDialog() }
          onConfirm={ () => {
            this.onDelete(deleteConfirmItem.id)
            this.closeDeleteDialog()
          }}
        />

        <FormListDialog
          title={ item.title || item.id }
          schema={ item.list.schema }
          open={ editOpen }
          initialValues={ editItem || {} }
          onCancel={ this.onCancel }
          onSave={ this.onSave }
        />
      </div>
    )
  }
}

const FormList = withStyles(styles)(FormListInner)

class FormWrapperInner extends React.Component {
  state = {
    hasSubmitted: false
  }

  flagSubmitted() {
    this.setState({
      hasSubmitted: true,
    })
  }

  getItem(item, formProps) {
    if(typeof(item) == 'string') {
      return (
        <Typography
          variant='subtitle1'
        >
          { item }
        </Typography>
      )
    }

    const {
      exists,
    } = this.props

    const isNew = this.props.dbId

    const disableField = () => {
      let disabled = false

      if(item.editable && typeof(item.editable.new) == 'boolean') {
        if(item.editable.new && exists) {
          disabled = true
        }
        else if(!item.editable.new && !exists) {
          disabled = true
        }
      }

      return disabled
    }

    const error = dotty.get(formProps.errors, item.id)
    const touched = dotty.get(formProps.touched, item.id)

    const renderComponent = (item) => {
      if (item.id === 'daml.postgres.secret' && formProps.values.aws.db.create === 'false'){
        return (
          <Field
            dbId={isNew}
            name={ item.id }
            component={ utils.getComponent(item.component) }
            item={ item }
            disabled={ disableField() }
            error={ error }
            touched={ touched }
            formProps={ formProps }
          />
        )
      } else if (item.id === 'daml.postgres.secret') {
          return ''
      }
      return (
        <Field
          dbId={isNew}
          name={ item.id }
          component={ utils.getComponent(item.component) }
          item={ item }
          disabled={ disableField() }
          error={ error }
          touched={ touched }
          formProps={ formProps }
        />
      )
    }

    return item.list ? (
      <FieldArray
        name={ item.id }
        render={arrayHelpers => (
          <FormList
            item={ item }
            formProps={ formProps }
            arrayHelpers={ arrayHelpers }
            disabled={ disableField() }
          />
        )}
      />
    ) : (
      renderComponent(item)
    )
  }

  // leave up to the user to put fields into columns
  // that divide nicely into 12
  getRow(row, formProps, i) {

    const {
      classes,
    } = this.props

    if(typeof(row) === 'string') {
      return (
        <Grid item xs={ 12 } key={ i }>
          <Divider className={ classes.divider } />

          {
            row !== '-' && (
              <Typography
                variant='subtitle1'
              >
                { row }
              </Typography>
            )
          }

        </Grid>
      )
    }

    else if (row.constructor === Array) {
      const colSize = Math.floor(12 / row.length)
      return row.map((item, i) => (
        <Grid item xs={ 12 } sm={ colSize } key={ i }>
          { this.getItem(item, formProps) }
        </Grid>
      ))
    }
    else {
      return (
        <Grid item xs={12} key={ i }>
          { this.getItem(row, formProps) }
        </Grid>
      )
    }
  }

  render() {
    const {
      schema,
      initialValues,
      spacing,
      renderButtons,
      onSubmit,
      error,
      classes,
      validate,
    } = this.props
    
    let isInitialValid = false

    const validationSchema = Validate(schema)

    try {
      isInitialValid = validationSchema.validateSync(initialValues)
    } catch(e) {

    }

    return (
      <Formik
        initialValues={ initialValues }
        validationSchema={ validationSchema }
        isInitialValid={ isInitialValid }
        onSubmit={ (values) => {
          const processedValues = utils.processValues(schema, values)
          onSubmit(processedValues)
        }}
        validate={ validate }
      >
        {
          ({
            handleSubmit,
            isValid,
            values,
            errors,
            touched,
          }) => {

            const formProps = {
              errors,
              touched,
              values,
            }

            const submitWrapper = () => {
              this.flagSubmitted()
              handleSubmit()
            }

            const flatErrors = utils.flattenErrors(errors, utils.flattenSchema(schema))

            return (
              <form onSubmit={ submitWrapper }>
                <Grid container spacing={ spacing || 24 }>
                  {
                    schema.map((item, i) => this.getRow(item, formProps, i))
                  }
                  {
                    renderButtons && (
                      <React.Fragment>
                        <Grid item xs={12}></Grid>
                        <Grid item xs={12}></Grid>
                        <Grid item xs={12}>
                          {
                            renderButtons({
                              isValid,
                              values,
                              handleSubmit: submitWrapper,
                              errors,
                            })
                          }
                        </Grid>
                      </React.Fragment>
                    )
                  }
                  {
                    error && (
                      <FormHelperText
                        name='errorHelperText'
                        error={ true }
                      >
                        { error }
                      </FormHelperText>
                    )
                  }
                </Grid>
                {
                  this.state.hasSubmitted && Object.keys(errors).length > 0 && (
                    <div className={ classes.errorContainer }>
                      <Typography className={ classes.errorText }>
                        There are errors in the form:
                      </Typography>
                      <ul className={ classes.errorText }>
                        {
                          Object.keys(flatErrors).map((key, i) => {
                            return (
                              <li key={ i }>
                                <Typography className={ classes.errorText }>
                                  { key }: { flatErrors[key] }
                                </Typography>
                              </li>
                            )
                          })
                        }
                      </ul>
                    </div>
                  )
                }
              </form>
            )
          }
        }
      </Formik>
    )
  }
}

const FormWrapper = withStyles(styles)(FormWrapperInner)

export default FormWrapper
