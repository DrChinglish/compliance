import { Typography } from '@mui/material'
import React from 'react'

export default function Paragraphs({
  variant:variant,
  children:children,
  ...rest
}) {
    let prop={}
    switch(variant){
        case 'strong':prop = {fontWeight:'bold'};break;
        case 'center':prop = {align:'center'};break;
        default:prop = {}
    }
  return (
    <Typography {...prop} {...rest}> 
        {children}
    </Typography>
  )
}
