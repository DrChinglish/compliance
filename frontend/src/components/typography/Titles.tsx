import React from 'react'
import { Typography } from '@mui/material'

interface TypographyTitleProps{
  variant?:string,
  children?:React.ReactNode,
}

export default function Titles(props:TypographyTitleProps,...rest: any[]) {
    let prop={}
    switch(props.variant){
        case 'left':prop={variant:'h5', fontWeight:'bold'};break;
        case 'large':prop={variant:'h4',align:'center', fontWeight:'bold'};break;
        case 'iconlabel':prop={align:'center', fontWeight:'bold'};break;
        default:prop={variant:'h5',align:'center', fontWeight:'bold'}
    }
  return (
    <Typography {...rest} {...prop}>{props.children}</Typography>
  )
}
