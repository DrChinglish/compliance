import React, { Component } from 'react'
import { Stack } from '@mui/material';
import ReactAplayer from 'react-aplayer';
import urlmapping from '../../../../urlMapping.json'
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
        <Stack spacing={2} sx={{px:2,height:'100%',py:2}} justifyContent="spcae-between" alignItems="center">
            <ReactAplayer {...props} onCanplay={()=>{console.log('ready')}}/>
        </Stack>

    )
  }
}
