import React from 'react'
import { Typography } from '@mui/material'

interface TypographyTitleProps{
  variant?:'left'|'large'|'iconlabel'|'medium'|string,
  children?:React.ReactNode,
  center?:boolean,
  [key:string]:any
}

export default function Titles(props:TypographyTitleProps) {
    let prop={}
    let {center,children,variant,...rest} = props 
    switch(variant){
        case 'left':prop={variant:'h5', fontWeight:'bold'};break;
        case 'large':prop={variant:'h4',align:'center', fontWeight:'bold'};break;
        case 'iconlabel':prop={align:'center', fontWeight:'bold'};break;
        case 'medium':prop={variant:'h6', fontWeight:600};break;
        default:prop={variant:'h5',align:'center', fontWeight:'bold'}
    }
  return (
    <Typography textAlign={center?'center':undefined} {...rest} {...prop}>{children}</Typography>
  )
}
