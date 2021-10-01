import React from 'react'
import { useDropzone } from 'react-dropzone'

const DropZone = ({
  children,
  onDrop,
  multiple = false,
  accept,
}) => {
  const { getRootProps, getInputProps } = useDropzone({
    multiple,
    onDrop,
    accept,
  })
  const { ref, ...rootProps } = getRootProps()

  return (
    <>
      <div {...rootProps}>
        <input {...getInputProps()} />
        { children }
      </div>
    </>
  )
}

export default DropZone
