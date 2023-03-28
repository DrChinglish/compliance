import { Box, Button, Stack } from '@mui/material'
import React from 'react'
import { Outlet } from 'react-router-dom'
import Paragraphs from '../components/typography/Paragraphs'

type Props = {}

export default function LayoutHomePage({}: Props) {
  return (
    <Box maxWidth='100vw' >
        <Box bgcolor='rgb(1,22,75)' position='absolute' top={0} left={0} right={0} width='100%' justifyContent='space-between' display='flex'>
            <Box py={1} position='relative' left={32}>
                <a href='https://www.zju.edu.cn/'>
                    <Stack direction='row' alignItems='center'>
                        <img alt='浙江大学' src='https://www.zju.edu.cn/_upload/tpl/05/e5/1509/template1509/images/logo.png'/>
                        <Paragraphs type='strong' /*sx={{fontSize:'60px'}}*/ variant='h6' color='white'>嘉兴研究院</Paragraphs>
                    </Stack>
                </a>
            </Box>
            <Stack direction='row' alignItems='center' position='relative' right={32} py={1} spacing={1}>
                <Button variant='contained' >
                    主页
                </Button>
                <Button variant='contained'>
                    能力
                </Button>
                <Button variant='contained'>
                    展示
                </Button>
            </Stack>
        </Box>
        <Box pt='84px'>
          <Outlet/>  
        </Box>
        
    </Box>
  )
}    