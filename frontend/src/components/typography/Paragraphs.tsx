import { Typography } from '@mui/material'
import React from 'react'

type ParagraphsVariant = 'strong'|'center'|string

type Props = {
  variant?: ParagraphsVariant,
  children?:React.ReactNode,
  [key:string]:any
}

export default function Paragraphs({variant,children,...rest}:Props) {
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
