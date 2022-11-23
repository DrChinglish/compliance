import { IconButton, ImageListItem, ImageListItemBar, Backdrop } from '@mui/material'
import React, { forwardRef, useState } from 'react'
import { VideoFrameMeta } from '../../../../../../Interfaces'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { getStaticResources } from '../../../../../../utils/APIs';
import { formatTime } from '../../../../../../utils/util';
import PreviewImage from '../../../../PreviewImage';
type Props = {
    frame:VideoFrameMeta,
    handleSeek:(timestamp:string|number)=>void
}

export default function VideoFrameItem(props: Props) {
    let {frame}=props
    //console.log(props)
    let imagesrc = getStaticResources(frame.src)
    const handleClickInfo=(e)=>{
        
    }

    const handleClickSeek=()=>{
       props.handleSeek(frame.timestamp)
    }

    return (
    <ImageListItem key={frame.id}>
        <PreviewImage src={imagesrc!}/>
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

