import { createTheme, ThemeProvider } from '@mui/material'
import { orange, red } from '@mui/material/colors'
import React from 'react'

interface AppThemeProviderInterface {
  children: React.ReactNode
}

const AppThemeProvider = ({ children }: AppThemeProviderInterface) => {
  const theme = createTheme({
    palette: {
      primary: {
        main: orange[800],
        light: orange[700],
        dark: orange[900],
      },
      error: {
        main: red[700],
        light: red[400],
        dark: red[900],
      },
      secondary: {
        main: '#1b1b1b',
        light: '#f2f2f2',
      },
    },
    typography: {
      fontFamily: 'kanit',
      fontSize: 14,
    },
  })

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>
}

export default AppThemeProvider
