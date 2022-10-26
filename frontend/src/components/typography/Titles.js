import React from 'react'
import { Typography } from '@mui/material'
export default function Titles({
  variant:variant,
  children:children,
  ...rest
}) {
    let prop={}
    switch(variant){
        case 'left':prop={variant:'h5', fontWeight:'bold'};break;
        case 'large':prop={variant:'h4',align:'center', fontWeight:'bold'};break;
        case 'iconlabel':prop={align:'center', fontWeight:'bold'};break;
        default:prop={variant:'h5',align:'center', fontWeight:'bold'}
    }
  return (
    <Typography {...rest} {...prop}>{children}</Typography>
  )
}
