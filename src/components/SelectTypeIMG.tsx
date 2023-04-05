import { useTypeImage } from '../zustand/type-converter'
import { MenuItem, Select, SelectChangeEvent } from '@mui/material'
import React from 'react'

const SelectTypeIMG = () => {
  const menu = [
    {
      name: 'webp',
      value: 'webp',
    },
    {
      name: 'png',
      value: 'png',
    },
    {
      name: 'jpeg',
      value: 'jpeg',
    },
    {
      name: 'jpg',
      value: 'jpg',
    },
  ]

  const setTypeImage = useTypeImage((state) => state.setTypeImage)

  const handleOnChange = (_type: SelectChangeEvent<string>) =>
    setTypeImage(_type.target.value)

  return (
    <Select
      sx={{
        backgroundColor: 'primary.light',
        color: '#fff',
        width: '120px',
      }}
      defaultValue={'webp'}
      onChange={handleOnChange}
    >
      {menu.map((item) => (
        <MenuItem key={item.name} value={item.value}>
          {item.name.toUpperCase()}
        </MenuItem>
      ))}
    </Select>
  )
}

export default SelectTypeIMG
