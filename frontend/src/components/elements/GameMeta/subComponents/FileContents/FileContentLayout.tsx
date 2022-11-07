import React from 'react'
import { Divider, Stack } from '@mui/material'
import Titles from '../../../../typography/Titles'
type FileContentProps = {
    title:string,
    children?:React.ReactNode
}

export default function FileContentLayout(props: FileContentProps) {
  return (
    <Stack spacing={2} sx={{p:2,height:'100%'}} justifyContent="spcae-between" alignItems="center">
        <Titles>{props.title}</Titles>
        <Divider flexItem/>
        {props.children}
    </Stack>
  )
}