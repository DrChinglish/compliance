import { Typography, TypographyProps } from '@mui/material'
import React from 'react'

type ParagraphsVariant = 'strong'|'center'|string

type Props = {
  type?: ParagraphsVariant,
  children?:React.ReactNode,
  
} & TypographyProps

export default function Paragraphs({type,children,...rest}:Props) {
    let prop={}
    switch(type){
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
