import React from 'react'
import {useDropzone} from 'react-dropzone'
import RootRef from '@material-ui/core/RootRef'

const DropZone = ({
  children,
  onDrop,
}) => {
  const {getRootProps, getInputProps} = useDropzone({onDrop})
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