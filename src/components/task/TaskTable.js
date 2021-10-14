import React from 'react'
import PropTypes from 'prop-types'
import withStyles from '@mui/styles/withStyles'

import SimpleTable from 'components/table/SimpleTable'
import TaskStatusIcon from 'components/status/TaskStatusIcon'
import TaskActionIcon from 'components/status/TaskActionIcon'

import { actionNameTranslator } from '../../utils/translators'

const styles = (theme) => ({
  root: {
    padding: theme.spacing(2),
  },
  dateTime: {
    whiteSpace: 'nowrap',
  },
  button: {
    marginRight: theme.spacing(2),
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
    marginRight: theme.spacing(2),
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
        <TaskActionIcon
          action={task.action.split('.')[1]}
          actionLabel={actionNameTranslator(task.action)}
        />
      ),
      status: (
        <TaskStatusIcon
          error={task.error}
          status={task.status}
        />
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
