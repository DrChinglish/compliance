import React from 'react'
import Titles from '../typography/Titles'
import { Stack } from '@mui/material'
type Props = {
    children?:React.ReactNode
    actions?:React.ReactNode
}

export default function TitleAction(props: Props) {
  return (
    <Stack justifyContent='space-between' alignItems='center' direction='row'>
        {props.children}
        <Stack direction='row' justifyContent='flex-end' spacing={2}>
            {props.actions}
        </Stack>
    </Stack>
  )
}