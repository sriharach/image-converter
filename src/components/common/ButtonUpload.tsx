import { Button } from '@mui/material'
import React, { FC } from 'react'

interface ButtonUploadI {
  disabled?: boolean
  style?: React.CSSProperties
  startIcon?: React.ReactNode
  text?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  accept?: string
}

const ButtonUpload: FC<ButtonUploadI> = (props) => {
  const {
    disabled,
    startIcon,
    style,
    text = 'Upload',
    onChange,
    accept,
  } = props
  return (
    <Button
      disabled={disabled}
      sx={{
        ...style,
        height: '60px',
        width: '248px',
        textTransform: 'none',
        fontSize: 18,
      }}
      variant='outlined'
      component='label'
      startIcon={startIcon}
    >
      <span>{text}</span>
      <input hidden accept={accept} multiple type='file' onChange={onChange} />
    </Button>
  )
}

export default ButtonUpload
