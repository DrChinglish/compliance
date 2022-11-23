import { Backdrop, Box } from '@mui/material'
import React, { useState } from 'react'

type Props = {
    src:string
}

export default function PreviewImage({src}: Props) {
    const [open,setOpen] = useState(false)
  return (
    <Box>
        <Backdrop open={open} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} onClick={()=>setOpen(false)}>
            <img src={src} style={{maxHeight:'100vh',maxWidth:'100vw'}}/>
        </Backdrop>    
        <img src={src} onClick={()=>{setOpen(true)}} style={{cursor:"pointer"}}/>
    </Box>
  )
}