import React, { Component } from 'react'
import { Stack, Box, Paper, ToggleButtonGroup, ToggleButton, IconButton } from '@mui/material';
import ReactAplayer from 'react-aplayer';
import urlmapping from '../../../../../urlMapping.json'
import RefreshIcon from '@mui/icons-material/Refresh';
import Titles from '../../../../typography/Titles';
import { Container } from '@mui/system';
import Paragraphs from '../../../../typography/Paragraphs';
import LoadingProgress from '../LoadingProgress';
import FileContentLayout from './FileContentLayout'
import ActionHint from '../../../../Hints/ActionHint'
import HightlightedText from '../../../../typography/HightlightedText'
import { processAudio } from '../../../../../utils/APIs';
import EmptyHint from '../../../../Hints/EmptyHint';
export default class AudioFileContent extends Component {

  constructor(props){
    super(props)
    this.state={
      loading:true,
      audioname:props.audio.content.info.title??'',
      url:props.audio.url??'',
      artist:props.audio.content.info.performer??'',
      cover:`data:image/png;base64,${props.audio.content.coverimg}`??'none',
      resultState:'null',
      textlists:{senstive_characters:[],english_word:[]},
      activeContent:'senstive_characters'
    }
  }
  
  handleClickLoadResult=()=>{
    this.setState({resultState:'loading'})
    processAudio(this.props.pid,this.props.audio.id)
    .then(res=>{
      this.setState({
        textlists:{
          senstive_characters:res.senstive_characters.fulltext,
          english_word:res.english_word.fulltext
        },
        resultState:'loaded'
      })
      console.log(res)
    })
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

   handleActiveContentChange=(e,value)=>{
    this.setState({
      activeContent:value
    })
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
      let content
      switch(this.state.resultState){
        case 'null':content = <ActionHint text='点击加载识别结果' extra={
          <IconButton onClick={this.handleClickLoadResult}><RefreshIcon/></IconButton>
        }/>;break;
        case 'loading':content  = <LoadingProgress/>;break;
        case 'loaded':content = <Paragraphs sx={{overflowY:'auto',maxHeight:'100%'}}>
          <HightlightedText textlist={this.state.textlists[this.state.activeContent]}/>
          </Paragraphs>
        ;break;
        default: content = <EmptyHint text='没有内容可以显示'/>
      }
    return (
        <FileContentLayout title={this.state.audioname}>
            <Container sx={{width:'100%',display:this.state.loading?'none':'inline', height:'150px'}}>
              <ReactAplayer onInit={(ap)=>{this.ap=ap;this.setState({loading:true})}} {...props} 
              onSeeked={()=>{console.log('seeked')}} onSeeking={()=>console.log('seeking')}
                onCanplay={()=>{console.log('ok');if(this.state.loading)this.setState({loading:false})}}/>
              {/* <Button variant='contained' onClick={()=>this.ap.seek(10)}>seek</Button> */}
            </Container>
            <Container sx={{width:'100%',display:this.state.loading?'block':'none', height:'150px'}}>
              <LoadingProgress label='音频文件加载中...'/>
            </Container>
            <Titles>识别结果</Titles>
            <Box sx={{height:'60%',width:'100%'}}>
              <Paper elevation={8} sx={{p:2,height:'100%'}}>
                {content}
              </Paper>
              
            </Box>
            <ToggleButtonGroup exclusive value={this.state.activeContent} onChange={this.handleActiveContentChange} 
              aria-label="outlined primary button group">
                <ToggleButton value="senstive_characters">敏感词检测</ToggleButton>
                <ToggleButton value="english_word">英文检测</ToggleButton>
            </ToggleButtonGroup>
        </FileContentLayout>

    )
  }
}
