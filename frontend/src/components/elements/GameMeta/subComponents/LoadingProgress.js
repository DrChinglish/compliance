import React from 'react'
import { CircularProgress, Box, Typography } from '@mui/material'
import Paragraphs from '../../../typography/Paragraphs'
import CheckIndicatorLayout from './CheckListContents/CheckIndicators/CheckIndicatorLayout'

export default function LoadingProgress({
  label:label
}) {
  return (
    <Box display='flex' justifyContent='center' alignItems='center' height='100%' width='100%'>
      <CircularProgress/>
    </Box>
    
  )
}
