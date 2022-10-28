import React from 'react'
import { CircularProgress, Box, Typography } from '@mui/material'
import  {
  CircularProgressProps,
} from '@mui/material/CircularProgress';
import CheckIndicatorLayout from './CheckIndicatorLayout'

interface LabelCircularProgressProps{
  title: string,
  value: number,
}

export default function LabelCircularProgress(
  props:CircularProgressProps & LabelCircularProgressProps,...rest:any
) {
  return (
    <CheckIndicatorLayout label={props.title}>
            <CircularProgress variant="determinate" {...props} size={60} />
            <Box
                sx={{
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                }}
            >
                <Typography variant="caption" component="div" color="text.secondary">
                {`${Math.round(props.value)}%`}
                </Typography>
            </Box>
    </CheckIndicatorLayout>
    
  )
}
