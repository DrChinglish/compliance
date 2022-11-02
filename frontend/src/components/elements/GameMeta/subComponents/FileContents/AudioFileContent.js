import React, { Component } from 'react'
import { Stack, Box, Paper, Button } from '@mui/material';
import ReactAplayer from 'react-aplayer';
import urlmapping from '../../../../../urlMapping.json'
import Titles from '../../../../typography/Titles';
import { Container } from '@mui/system';
import Paragraphs from '../../../../typography/Paragraphs';
import LoadingProgress from '../LoadingProgress';
import FileContentLayout from './FileContentLayout'
export default class AudioFileContent extends Component {

  constructor(props){
    super(props)
    this.state={
      loading:true,
      audioname:props.audio.content.info.title??'',
      url:props.audio.url??'',
      artist:props.audio.content.info.performer??'',
      cover:`data:image/png;base64,${props.audio.content.coverimg}`??'none'
    }
  }

   static getDerivedStateFromProps(props,state){
      if(props.audio.content.info.title!=state.audioname){
        // console.log(props)
        return{audioname:props.audio.content.info.title,
          url:props.audio.url,
          artist:props.audio.content.info.performer,
          loading:true,
          cover:`data:image/png;base64,${props.audio.content.coverimg}`
        }
      }
      return false
   } 

  render() {
    // console.log(this.state.audioname)
    let url = urlmapping.host+urlmapping.apibase.other+this.state.url
    let props = {
        theme: '#F57F17',
        lrcType: 3,
        audio: [
          {
            name: this.state.audioname,
            artist: this.state.artist,
            url: url,
            cover: this.state.cover,
            // lrc: 'https://moeplayer.b0.upaiyun.com/aplayer/hikarunara.lrc',
            theme: '#ebd0c2'
          }
        ]
      };
      if(this.state.loading){
        this.ap?.list.clear()
        this.ap?.list.add(props.audio[0])
      }
    return (
        <FileContentLayout title={this.state.audioname}>
            <Container sx={{width:'100%',display:this.state.loading?'none':'inline', height:'150px'}}>
              <ReactAplayer onInit={(ap)=>{this.ap=ap;this.setState({loading:true})}} {...props} onSeeked={()=>{console.log('seeked')}} onSeeking={()=>console.log('seeking')}
                onCanplay={()=>{console.log('ok');if(this.state.loading)this.setState({loading:false})}}/>
              {/* <Button variant='contained' onClick={()=>this.ap.seek(10)}>seek</Button> */}
            </Container>
            <Container sx={{width:'100%',display:this.state.loading?'block':'none', height:'150px'}}>
              <LoadingProgress label='音频文件加载中...'/>
            </Container>
            <Titles>识别结果</Titles>
            <Box sx={{height:'60%',width:'100%'}}>
              <Paper elevation={8} sx={{pl:2,py:2,height:'100%'}}>
                <Paragraphs sx={{overflowY:'scroll',maxHeight:'100%'}}>{}</Paragraphs>
              </Paper>
            </Box>
        </FileContentLayout>

    )
  }
}
