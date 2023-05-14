import React from 'react'
import { styled } from '@mui/system'

import SimpleTable from '../../components/table/SimpleTable'
import TaskStatusIcon from '../../components/status/TaskStatusIcon'
import TaskActionIcon, { Action } from '../../components/status/TaskActionIcon'

import { actionNameTranslator } from '../../utils/translators'

const DateTime = styled('span')({
  whiteSpace: 'nowrap',
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

interface TaskTableProps {
  data: {
    id: string
    started_at: string
    action: any
    status: "created" | "running" | "finished" | "error"
    error: string
  }[]
}

const TaskTable: React.FC<TaskTableProps> = ({ data }) => {

  console.log("data", data)

  const tableData = data.map((task) => ({
    id: task.id,
    started_at: (
      <DateTime>
        { new Date(task.started_at).toLocaleString() }
      </DateTime>
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

export default TaskTable
