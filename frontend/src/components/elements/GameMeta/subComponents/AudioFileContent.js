import React, { Component } from 'react'
import { Stack, Box, Paper } from '@mui/material';
import ReactAplayer from 'react-aplayer';
import urlmapping from '../../../../urlMapping.json'
import Titles from '../../../typography/Titles';
import { Container } from '@mui/system';
import Paragraphs from '../../../typography/Paragraphs';
export default class AudioFileContent extends Component {
  render() {
    //console.log(this.props.audio)
    let url = urlmapping.host+urlmapping.apibase.other+this.props.audio.url
    const props = {
        theme: '#F57F17',
        lrcType: 3,
        audio: [
          {
            name: this.props.audio.name,
            // artist: 'Goose house',
            url: url,
            // cover: 'https://moeplayer.b0.upaiyun.com/aplayer/hikarunara.jpg',
            // lrc: 'https://moeplayer.b0.upaiyun.com/aplayer/hikarunara.lrc',
            theme: '#ebd0c2'
          }
        ]
      };
    return (
        <Stack spacing={2} sx={{p:2,height:'100%'}} justifyContent="spcae-between" alignItems="center">
            <Titles>音频文件</Titles>
            
            <Container sx={{width:'100%'}}>
              <ReactAplayer {...props} onCanplay={()=>{console.log('ready')}}/>
            </Container>
            <Titles>识别结果</Titles>
            <Box sx={{height:'60%',width:'100%'}}>
              <Paper elevation={8} sx={{pl:2,py:2,height:'100%'}}>
                <Paragraphs sx={{overflowY:'scroll',maxHeight:'100%'}}>{}</Paragraphs>
              </Paper>
            </Box>
        </Stack>

    )
  }
}
