import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

import SimpleTable from 'components/table/SimpleTable'
import TaskStatusIcon from 'components/status/TaskStatusIcon'
import TaskActionIcon from 'components/status/TaskActionIcon'

import { actionNameTranslator } from '../../utils/translators'

const styles = (theme) => ({
  root: {
    padding: theme.spacing.unit * 2,
  },
  dateTime: {
    whiteSpace: 'nowrap',
  },
  button: {
    marginRight: theme.spacing.unit * 2,
  },
  errorContainer: {
    maxWidth: '200px',
  },
  errorText: {
    color: theme.palette.error.main,
  },
  statusContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'left',
  },
  statusIcon: {
    marginRight: theme.spacing.unit * 2,
  },
})

const fields = [{
  title: 'Started',
  name: 'started_at',
}, {
  title: 'Action',
  name: 'action',
}, {
  title: 'Status',
  name: 'status',
}]

class TaskTable extends React.Component {
  render() {
    const {
      classes,
      data,
    } = this.props

    const tableData = data.map((task) => ({
      id: task.id,
      started_at: (
        <span className={classes.dateTime}>
          { new Date(task.started_at).toLocaleString() }
        </span>
      ),
      action: (
        <div className={classes.statusContainer}>
          <div className={classes.statusIcon}>
            <TaskActionIcon
              action={task.action.split('.')[1]}
            />
          </div>
          <div>
            { actionNameTranslator(task.action) }
          </div>
        </div>
      ),
      status: (
        <div className={classes.statusContainer}>
          <div className={classes.statusIcon}>
            <TaskStatusIcon
              status={task.status}
            />
          </div>
          <div>
            { !task.error && task.status }
            {
                task.error && (
                  <div className={classes.errorContainer}>
                    <span className={classes.errorText}>
                      { task.error }
                    </span>
                  </div>
                )
              }
          </div>
        </div>
      ),
    }))

    return (
      <SimpleTable
        data={tableData}
        fields={fields}
      />
    )
  }
}

TaskTable.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(TaskTable)
