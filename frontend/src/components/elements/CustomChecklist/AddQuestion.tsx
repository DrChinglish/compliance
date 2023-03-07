import { Box, Container } from '@mui/material'
import React from 'react'
import AddIcon from '@mui/icons-material/Add';
import styled from '@emotion/styled';
import { StyledBox } from './StyledComponent/StyledContainers';

type Props = {
    
}




export default function AddQuestion({}: Props) {
  return (
    <StyledBox variant='hover-pointer' display='flex' justifyContent='center' alignItems='center' height='100px'>
        <AddIcon fontSize='large'/>
    </StyledBox>
  )
}