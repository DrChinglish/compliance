import { Box, Typography } from '@mui/material'
import React from 'react'
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import Titles from '../../../typography/Titles';
export default function CheckStatus({
    status:pass,
    ...rest
}) {
    let props={
        fontSize:'4rem'
    }
  return (
    
    <Box >
        <Box display={'inline-flex'} position='relative' fontSize={'60px'}>
            {pass?<DoneIcon {...props} color='success'/>:<CloseIcon  fontSize='inherit' color='error'/>}
        </Box>
        <Titles variant='iconlabel'>审查结论</Titles>
    </Box>
  )
}
