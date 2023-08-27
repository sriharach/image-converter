import React, { useState, memo } from 'react'
import Layout from './components/layouts/layout'
import { Box, Tab, Tabs, Typography } from '@mui/material'
import ImageConvert from './components/features/ImageConvert'
import { EHeaderStoreState, useHeaderStore } from './zustand/header'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

const App = () => {
  const [value, setValue] = useState(0)
  const { setHeader } = useHeaderStore((state) => state)

  const CustomTabPanelMemo = memo(function CustomTabPanel(
    props: TabPanelProps,
  ) {
    const { children, value, index, ...other } = props

    return (
      <Box
        role='tabpanel'
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </Box>
    )
  })

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setHeader(
      newValue === 0 ? EHeaderStoreState.IMAGE : EHeaderStoreState.VIDEO,
    )
    setValue(newValue)
  }

  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    }
  }

  return (
    <Layout>
      <Box py={3}>
        <Tabs value={value} onChange={handleChange} aria-label='tabs example'>
          <Tab
            sx={{ textTransform: 'none' }}
            label='Image Converter'
            {...a11yProps(1)}
          />
          <Tab
            sx={{ textTransform: 'none' }}
            label='Video Converter'
            {...a11yProps(2)}
          />
        </Tabs>
      </Box>
      <CustomTabPanelMemo value={value} index={0}>
        <ImageConvert />
      </CustomTabPanelMemo>
      <CustomTabPanelMemo value={value} index={1}>
        <></>
      </CustomTabPanelMemo>
    </Layout>
  )
}

export default App
