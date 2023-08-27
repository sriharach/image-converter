import React from 'react'
import Header from './header'
import { Box, Container } from '@mui/material'

interface ChildInterface {
  children: React.ReactNode
}

const Content = ({ children }: ChildInterface) => {
  return (
    <React.Fragment>
      <Header />
        <Container component={'main'}>{children}</Container>
        <Box component='footer' />
    </React.Fragment>
  )
}

export default Content
