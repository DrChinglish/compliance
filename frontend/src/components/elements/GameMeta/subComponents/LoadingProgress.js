import React from 'react'
import { CircularProgress, Typography } from '@mui/material'
import Paragraphs from '../../../typography/Paragraphs'

export default function LoadingProgress({
  label:label
}) {
  return (
    <div style={{height:'100%',width:'100%',display:'flex',alignItems:"center",justifyContent:'center'}}>
        <CircularProgress/>
        <Typography variant='caption'>{label}</Typography>
    </div>
  )
}
