import React from 'react'
import { CircularProgress } from '@mui/material'
export default function LoadingProgress() {
  return (
    <div style={{height:'100%',width:'100%',display:'flex',alignItems:"center",justifyContent:'center'}}>
        <CircularProgress/>
    </div>
  )
}
