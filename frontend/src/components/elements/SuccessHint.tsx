import { Box } from '@mui/material'
import React from 'react'
import DoneIcon from '@mui/icons-material/Done';
type Props = {}

export default function SuccessHint({}: Props) {
  return (
    <Box display='flex' justifyContent='center' alignItems='center' height='100%' width='100%'>
        <DoneIcon sx={{fontSize:'120px'}}/>
    </Box>
  )
}