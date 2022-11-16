import React, { Component, createRef } from 'react'
import ReactPlayer from 'react-player/lazy'
import { ImageList } from '@mui/material'
import { getStaticResources } from '../../../../../utils/APIs'
import { FileMeta, VideoFrameMeta } from '../../../../../Interfaces'
import FileContentLayout from './FileContentLayout'
import Titles from '../../../../typography/Titles'
import VideoFrameItem from './Elements/VideoFrameItem'
import { formatTime } from '../../../../../utils/util'

const USE_LEGACY_VIDEO = true

type Props = {
  video: FileMeta,
  keyframes:VideoFrameMeta[]
}

type State = {}

export default class VideoFileContent extends Component<Props, State> {
  state = {
    keyframes:[]
  }
  videoref: React.RefObject<HTMLVideoElement>

  constructor(props){
    super(props)
    this.videoref=createRef()
  }
  componentDidMount(): void {
    this.setState({
      keyframes:this.props.keyframes
    })
    
  }

  seekVideo=(timestamp:string|number)=>{
    let time = formatTime(timestamp)
    console.log(time)
    this.videoref.current!.currentTime=100 
  }

  render() {
    let video=USE_LEGACY_VIDEO?
    <video controls style={{height:'100%',width:'100%'}} ref={this.videoref}>
      <source src={getStaticResources(this.props.video.url)}/>
    </video>
    :
    <ReactPlayer config={{file:{attributes:{src:undefined}}}} 
          onError={(e,data)=>console.log(e,data)} url={[getStaticResources(this.props.video.url)]} 
          controls height='100%' width='100%'/>
    //console.log(ReactPlayer.canPlay(getStaticResources(this.props.video.url)))
    return (
      <FileContentLayout title={this.props.video.name}>
        <div style={{width:'100%',height:'400px'}}>
          {video}
        </div>
        <br/>
        <Titles>识别结果</Titles>
        <ImageList sx={{width:'100%',height:'auto'}}>
          {(this.state.keyframes??itemData).map((item)=>(
            <VideoFrameItem frame={item as VideoFrameMeta} handleSeek={this.seekVideo}/>
          ))}
        </ImageList>
      </FileContentLayout>
       
    )
  }
}

const itemData = [
  {
    id:1,
    src: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
    description: 'Breakfast',
    timestamp: '@bkristastucchio',
  },
  { 
    id:2,
    src: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
    description: 'Burger',
    timestamp: '@rollelflex_graphy726',
  },
  { 
    id:3,
    src: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45',
    description: 'Camera',
    timestamp: '@helloimnik',
  },
  { 
    id:4,
    src: 'https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c',
    description: 'Coffee',
    timestamp: '@nolanissac',
  }
]