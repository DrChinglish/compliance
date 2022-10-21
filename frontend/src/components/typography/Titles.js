import React from 'react'
import { Typography } from '@mui/material'
export default function Titles(props) {
    let content
    switch(props.variant){
        case 'large':content = <Typography align='center' variant='h4' fontWeight='bold'>
          {props.children}</Typography>
        default: content = <Typography align='center' variant='h5' fontWeight='bold'>
        {props.children}</Typography>
    }
  return (
    content
  )
}
