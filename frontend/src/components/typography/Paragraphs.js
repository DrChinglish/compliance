import { Typography } from '@mui/material'
import React from 'react'

export default function Paragraphs(props) {
    let prop={}
    switch(props.variant){
        case 'strong':prop = {fontWeight:'bold'};break;
        default:prop = {}
    }
  return (
    <Typography {...prop}> 
        {props.children}
    </Typography>
  )
}
