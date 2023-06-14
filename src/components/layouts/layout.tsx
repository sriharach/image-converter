import React from 'react'
import Header from './header'
import { Container } from '@mui/material'

interface ChildInterface {
  children: React.ReactNode
}

const Content = ({ children }: ChildInterface) => {
  return (
    <React.Fragment>
      <Header />
      <Container component={'section'}>{children}</Container>
    </React.Fragment>
  )
}

export default Content
