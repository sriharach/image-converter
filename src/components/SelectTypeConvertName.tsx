import { EHeaderStoreState, useHeaderStore } from '@/zustand/header'
import { useTypeName } from '../zustand/type-converter'
import { MenuItem, Select, SelectChangeEvent } from '@mui/material'
import React, { useMemo } from 'react'

const SelectTypeConvertName = () => {
  const { setTypeConvertName, type_convert_name } = useTypeName(
    (state) => state,
  )
  const { text } = useHeaderStore((state) => state)

  const actionMenuType = useMemo(() => {
    let menuTypes: { name: string; value: string }[] = []

    switch (text) {
      case EHeaderStoreState.IMAGE:
        menuTypes = [
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
        break
      case EHeaderStoreState.VIDEO:
        break

      case EHeaderStoreState.FILE:
        menuTypes = [
          {
            name: 'pdf',
            value: 'pdf',
          },
        ]
        break

      default:
        break
    }

    return menuTypes
  }, [text])

  const handleOnChange = (_type: SelectChangeEvent<string>) =>
    setTypeConvertName(_type.target.value)

  return (
    <Select
      sx={{
        backgroundColor: 'primary.light',
        color: '#fff',
        width: '120px',
      }}
      defaultValue={type_convert_name}
      value={type_convert_name}
      onChange={handleOnChange}
    >
      {actionMenuType.map((item) => (
        <MenuItem key={item.name} value={item.value}>
          {item.name.toUpperCase()}
        </MenuItem>
      ))}
    </Select>
  )
}

export default SelectTypeConvertName
