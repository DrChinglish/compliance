import { Box, Stack } from '@mui/material'
import React from 'react'
import DoneIcon from '@mui/icons-material/Done';
import Titles from '../typography/Titles';
type Props = {
  label?:string
}

export default function SuccessHint(props: Props) {
  return (
    <Box display='flex' justifyContent='center' alignItems='center' height='100%' width='100%'>
        <Stack spacing={1}>
          <DoneIcon sx={{fontSize:'120px'}}/>
          {props.label && 
          <Titles variant='medium'>{props.label}</Titles>}
        </Stack>
        
    </Box>
  )
}