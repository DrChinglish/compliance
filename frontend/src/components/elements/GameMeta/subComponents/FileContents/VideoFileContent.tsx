import React, { Component } from 'react'
import ReactPlayer from 'react-player/lazy'
import { getStaticResources } from '../../../../../utils/APIs'

interface FileMeta{
  content: object,
  ext: string,
  id: number,
  name: string,
  size:string,
  type:'text'|'image'|'audio'|'video'|'other'| undefined,
  url:string
}

type Props = {
  video: FileMeta
}

type State = {}

export default class VideoFileContent extends Component<Props, State> {
  state = {}
  
  render() {
    console.log(ReactPlayer.canPlay(getStaticResources(this.props.video.url)))
    return (
        <div style={{width:'100%',height:'400px'}}>
            <ReactPlayer config={{file:{attributes:{src:undefined}}}} 
            onError={(e,data)=>console.log(e,data)} url={[getStaticResources(this.props.video.url)]} controls height='100%' width='100%'/>
        </div>
    )
  }
}
