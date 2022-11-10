import React, { Component } from 'react'
import ReactPlayer from 'react-player/lazy'
import { ImageList } from '@mui/material'
import { getStaticResources } from '../../../../../utils/APIs'
import { FileMeta, VideoFrameMeta } from '../../../../../Interfaces'
import FileContentLayout from './FileContentLayout'
import Titles from '../../../../typography/Titles'
import VideoFrameItem from './Elements/VideoFrameItem'


type Props = {
  video: FileMeta
}

type State = {}

export default class VideoFileContent extends Component<Props, State> {
  state = {}
  
  render() {
    //console.log(ReactPlayer.canPlay(getStaticResources(this.props.video.url)))
    return (
      <FileContentLayout title={this.props.video.name}>
        <div style={{width:'100%',height:'400px'}}>
          <ReactPlayer config={{file:{attributes:{src:undefined}}}} 
          onError={(e,data)=>console.log(e,data)} url={[getStaticResources(this.props.video.url)]} controls height='100%' width='100%'/>
        </div>
        <br/>
        <Titles>识别结果</Titles>
        <ImageList sx={{width:'100%',height:'auto'}}>
          {itemData.map((item)=>(
            <VideoFrameItem frame={item as VideoFrameMeta}/>
          ))}
        </ImageList>
      </FileContentLayout>
       
    )
  }
}

const itemData = [
  {
    src: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
    label: 'Breakfast',
    timestamp: '@bkristastucchio',
  },
  {
    src: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
    label: 'Burger',
    timestamp: '@rollelflex_graphy726',
  },
  {
    src: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45',
    label: 'Camera',
    timestamp: '@helloimnik',
  },
  {
    src: 'https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c',
    label: 'Coffee',
    timestamp: '@nolanissac',
  }
]