import React from 'react'
import {useDropzone} from 'react-dropzone'
import RootRef from '@material-ui/core/RootRef'

const DropZone = ({
  children,
  onDrop,
  multiple = false,
  accept,
}) => {
  const {getRootProps, getInputProps} = useDropzone({
    multiple,
    onDrop,
    accept,
  })
  const {ref, ...rootProps} = getRootProps()

  return (
    <RootRef rootRef={ref}>
      <div {...rootProps}>
        <input {...getInputProps()} />
        { children }
      </div>
    </RootRef>
  )
}

export default DropZone