import React from 'react'
import Titles from '../typography/Titles'
import { Box, Stack } from '@mui/material'
type Props = {
    children?:React.ReactNode
    startActions?:React.ReactNode,
    endActions?:React.ReactNode,
    center?:boolean
}

export default function TitleAction({center=false, ...props}: Props) {

  let justify = 'flex-start'
  if(center||(props.startActions && props.endActions)){
    justify = 'center'
  }
  else if(props.startActions){
    justify = 'flex-end'
  }

  return (
    <Stack justifyContent={justify} alignItems='center' direction='row' position='relative'>
        <Box flexGrow={1}>
          {props.children}
        </Box>
          {props.startActions &&
            <Stack direction='row' spacing={2} position='absolute' left={0} >
              {props.startActions}
            </Stack>
          }
          {props.endActions &&
            <Stack direction='row' spacing={2} position='absolute' right={0} >
              {props.endActions}
            </Stack>
          }
    </Stack>
  )
}