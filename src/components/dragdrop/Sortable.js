import React from 'react'
import { findDOMNode } from 'react-dom'

import {
  DragSource,
  DropTarget,
} from 'react-dnd'

const source = {
  beginDrag(props) {
    return {
      id: props.id,
      index: props.index,
    }
  },
}

const target = {
  hover(props, monitor, component) {
    if (!component) {
      return null
    }
    const dragIndex = monitor.getItem().index
    const hoverIndex = props.index

    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return
    }

    // Determine rectangle on screen
    const hoverBoundingRect = findDOMNode(
      component,
    ).getBoundingClientRect()

    // Get vertical middle
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

    // Determine mouse position
    const clientOffset = monitor.getClientOffset()

    // Get pixels to the top
    const hoverClientY = (clientOffset).y - hoverBoundingRect.top

    // Only perform the move when the mouse has crossed half of the items height
    // When dragging downwards, only move when the cursor is below 50%
    // When dragging upwards, only move when the cursor is above 50%

    // Dragging downwards
    if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
      return
    }

    // Dragging upwards
    if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
      return
    }

    props.reorderDrag(dragIndex, hoverIndex)
    monitor.getItem().index = hoverIndex
  },
  drop(props, monitor, component) {
    if (!component) {
      return null
    }
    if(props.reorderDrop) props.reorderDrop()
  }
}

class Sortable extends React.Component {
  
  render() {
    const {
      isDragging,
      connectDragSource,
      connectDropTarget,
      render,
    } = this.props

    const item = render({
      isDragging,
    })
    
    return connectDragSource(
      connectDropTarget(item),
    )
  }
}

export default DropTarget(
  'sortable',
  target,
  (connect) => ({
    connectDropTarget: connect.dropTarget(),
  })
)(
  DragSource(
    'sortable',
    source,
    (connect, monitor) => ({
      connectDragSource: connect.dragSource(),
      isDragging: monitor.isDragging(),
    })
  )(Sortable)
)