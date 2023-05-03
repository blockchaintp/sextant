/**
 * @jest-environment jsdom
 */

import * as React from 'react'
import { render, screen } from '@testing-library/react'
import TaskStatusIcon from '../../../src/components/status/TaskStatusIcon'
import '@testing-library/jest-dom'

describe('TaskStatusIcon', () => {
  test('renders running status icon', () => {
    render(<TaskStatusIcon status="running" error="" />)
    expect(screen.getByText('running')).toBeInTheDocument()
  })

  test('renders created status icon', () => {
    render(<TaskStatusIcon status="created" error="" />)
    expect(screen.getByText('created')).toBeInTheDocument()
  })

  test('renders error status icon', () => {
    const errorMsg = 'An error occurred'
    render(<TaskStatusIcon status="error" error={errorMsg} />)
    expect(screen.getByText('error')).toBeInTheDocument()
  })

  test('renders finished status icon', () => {
    render(<TaskStatusIcon status="finished" error="" />)
    expect(screen.getByText('finished')).toBeInTheDocument()
  })
})
