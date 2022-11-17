import { IconButton, ImageListItem, ImageListItemBar, Backdrop } from '@mui/material'
import React, { forwardRef, useState } from 'react'
import { VideoFrameMeta } from '../../../../../../Interfaces'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { getStaticResources } from '../../../../../../utils/APIs';
import { formatTime } from '../../../../../../utils/util';
type Props = {
    frame:VideoFrameMeta,
    handleSeek:(timestamp:string|number)=>void
}



export default function VideoFrameItem(props: Props) {
    let {frame}=props
    let imagesrc = getStaticResources(frame.src)
    const [showBigImage,setShowBigImage]=useState(false)
    const handleClickImage=()=>{
        setShowBigImage(true)    
    }

    const handleClickInfo=(e)=>{
        
    }

    const handleClickSeek=()=>{
       props.handleSeek(frame.timestamp)
    }

    const handleCloseBig = ()=>{
        setShowBigImage(false)
    }
    return (
    <ImageListItem key={frame.id}>
        <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={showBigImage}
        onClick={handleCloseBig}>
            <img src={imagesrc} alt='big_image' style={{maxWidth:'100vw',maxHeight:'100vh',padding:24}}/>
        </Backdrop>
        <img src={imagesrc} loading='lazy' alt={frame.description} style={{cursor:'pointer'}} 
        onClick={handleClickImage}/>
        <ImageListItemBar sx={{alignItems:'center'}} actionIcon={
            <React.Fragment>
                <IconButton onClick={handleClickInfo}>
                    <InfoOutlinedIcon/>
                </IconButton>
                <IconButton onClick={handleClickSeek}>
                    <LocationOnIcon/>
                </IconButton>
            </React.Fragment>
            
        } actionPosition='right' 
         title={frame.description} subtitle={<span>{frame.timestamp}</span>} position='below'/>
    </ImageListItem>
  )
}

