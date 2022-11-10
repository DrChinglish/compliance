import { IconButton, ImageListItem, ImageListItemBar, Backdrop } from '@mui/material'
import React, { useState } from 'react'
import { VideoFrameMeta } from '../../../../../../Interfaces'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
type Props = {
    frame:VideoFrameMeta
}



export default function VideoFrameItem(props: Props) {
    let {frame}=props
    const [showBigImage,setShowBigImage]=useState(false)
    const handleClickImage=()=>{
        setShowBigImage(true)    
    }
    const handleClickInfo=(e)=>{
        
    }
    const handleCloseBig = ()=>{
        setShowBigImage(false)
    }
    return (
    <ImageListItem key={frame.src}>
        <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={showBigImage}
        onClick={handleCloseBig}>
            <img src={frame.src} alt='big_image' style={{maxWidth:'100vw',maxHeight:'100vh',padding:24}}/>
        </Backdrop>
        <img src={frame.src} loading='lazy' alt={frame.label} style={{cursor:'pointer'}} 
        onClick={handleClickImage}/>
        <ImageListItemBar sx={{alignItems:'center'}} actionIcon={
            <IconButton onClick={handleClickInfo}>
                <InfoOutlinedIcon/>
            </IconButton>
        } actionPosition='right' 
         title={frame.label} subtitle={<span>{frame.timestamp}</span>} position='below'/>
    </ImageListItem>
  )
}