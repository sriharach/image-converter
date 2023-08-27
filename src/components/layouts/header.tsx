import { Container, Box, Stack } from '@mui/material'
import React from 'react'
import SelectTypeIMG from '../SelectTypeIMG'
import { useHeaderStore } from '@/zustand/header'

const Header = () => {
  const { text } = useHeaderStore((state) => state)
  return (
    <Box
      component={'header'}
      sx={{
        backgroundColor: 'secondary.main',
        color: '#fff',
        padding: '5.5rem 0px',
      }}
    >
      <Container>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
          }}
        >
          <Box>
            <Box component={'h1'} fontWeight={600}>
              {text}
            </Box>
          </Box>
          <Stack spacing={2}>
            <Box fontSize={18}>Convert type to</Box>
            <Box sx={{ textAlign: 'center' }}>
              <SelectTypeIMG />
            </Box>
          </Stack>
        </Box>
      </Container>
    </Box>
  )
}

export default Header
