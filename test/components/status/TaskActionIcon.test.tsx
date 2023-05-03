/**
 * @jest-environment jsdom
 */

import * as React from 'react'
import { render, screen } from '@testing-library/react'
import TaskActionIcon from '../../../src/components/status/TaskActionIcon'
import '@testing-library/jest-dom'

describe('TaskActionIcon', () => {
  test('renders create action icon with correct label', () => {
    render(<TaskActionIcon action="create" actionLabel="Create Task" />)
    expect(screen.getByText('Create Task')).toBeInTheDocument()
  })

  test('renders update action icon with correct label', () => {
    render(<TaskActionIcon action="update" actionLabel="Update Task" />)
    expect(screen.getByText('Update Task')).toBeInTheDocument()
  })

  test('renders delete action icon with correct label', () => {
    render(<TaskActionIcon action="delete" actionLabel="Delete Task" />)
    expect(screen.getByText('Delete Task')).toBeInTheDocument()
  })
})
