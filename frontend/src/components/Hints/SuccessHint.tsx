import { Box, Container, Stack } from '@mui/material'
import React from 'react'
import DoneIcon from '@mui/icons-material/Done';
import Titles from '../typography/Titles';
type Props = {
  label?:string
}

export default function SuccessHint(props: Props) {
  return (
    <Box flexGrow={1} display='flex' justifyContent='center' alignItems='center'>
        <Stack spacing={1} display='flex' justifyContent='center' alignItems='center' height='100%'>
          <DoneIcon sx={{fontSize:'120px'}}/>
          {props.label && 
          <Titles variant='medium' center>{props.label}</Titles>}
        </Stack>
    </Box>
  )
}