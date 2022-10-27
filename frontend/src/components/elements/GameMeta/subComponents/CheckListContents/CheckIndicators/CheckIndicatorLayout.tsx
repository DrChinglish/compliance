import { Box, Stack } from '@mui/material'
import React from 'react'
import Titles from '../../../../../typography/Titles'
interface CheckIndicatorLayoutProps  {
  children?: React.ReactNode,
  label?:String
}

const CheckIndicatorLayout=(props: CheckIndicatorLayoutProps)=> {
  return (
    <Stack direction='column' height='100%' justifyContent='space-between' alignItems='center'>
      <Box position='relative' display='inline-flex' >
        {props.children}
      </Box>
      <Titles variant='iconlabel'>{props.label}</Titles>
    </Stack>
  )
}

export default CheckIndicatorLayout