import { Box, ListItemButton, ListItemIcon, ListItemText, List, Paper, Grid, Divider, Typography, CircularProgress, Stack, ListItem } from '@mui/material'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {FixedSizeList} from 'react-window'
import urlmapping from "../../../urlMapping.json"

import EmptyHint from './subComponents/EmptyHint';
import ListItemFile from './subComponents/ListItemFile';
import TextFileContent from './subComponents/TextFileContent';
import './GameFileList.css'
import LoadingProgress from './subComponents/LoadingProgress';
import ImageFileContent from './subComponents/ImageFileContent'

export default class GameFileList extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
       selected: -1,
       fileList: this.props.fileList,
       loading:false
    }
  }

  generateSuggestion=(type,items)=>{
    let title
    console.log(type,items)
    switch(type){
      case 'senstive_characters':title="发现敏感词";break;
      case 'traditional_characters':title="发现违规繁体字";break;
      case 'english_word':title="发现违规英文单词";break;
    }
    let display=''
    for(let i in items){
      if(i!=0){
        display+=', '
      }
      display+=items[i]
    }
    let des = `共发现${items.length}个违规项，包括${display}等。`
    return {title:title,description:des,seriousness:'high'}
  }

  handleClick=(e,value)=>{
    //TODO: add backend interaction here
    this.setState({
      selected: value,
      loading:true
    })
    let fetchAPI =`/${this.state.fileList[value].id}/`
    switch(this.props.variant){
      case 'text':fetchAPI = urlmapping.apibase.game+`/api/projects/${this.props.pid}/texts/${this.state.fileList[value].id}/process_doc`;break;
      case 'image':fetchAPI = urlmapping.apibase.game+`/api/projects/${this.props.pid}/images/${this.state.fileList[value].id}/process_img`;break;
    }
    fetch(fetchAPI,{
      method:'GET',
      mode:'cors'
    }).then((res)=>{
      return res.json()
    }).then((res)=>{
      console.log(res)
      let suggs=[]
      if(res.senstive_characters.count>0){
        let sugg = this.generateSuggestion('senstive_characters',res.senstive_characters.senstive_item)
        sugg.id = suggs.length
        suggs.push(sugg)
      }
      if(res.traditional_characters.count>0){
        let sugg = this.generateSuggestion('traditional_characters',res.traditional_characters.traditional_item)
        sugg.id = suggs.length
        suggs.push(sugg)
      }
      if(res.english_word.count>0){
        let sugg = this.generateSuggestion('english_word',res.english_word.english_item)
        sugg.id = suggs.length
        suggs.push(sugg)
      }
      this.props.setSuggestions(suggs)
      let newfileList = this.state.fileList
      //console.log(res)
      newfileList[value].contentlist = res //censored content in list
      this.setState({
        fileList:newfileList,
        loading:false
      })
      //console.log(this.state.fileList)
    })
    
  }

  render() {
    let {fileList} = this.state
    let content
    if(this.state.selected==-1){
      content = <EmptyHint text="选择一个文件以查看详情"/>
    }else if(this.state.loading){
      content = <LoadingProgress/>
      
    }else{
      if(this.props.variant==='text')
        content = <TextFileContent file={fileList[this.state.selected]}/>
      else
        content = <ImageFileContent image={fileList[this.state.selected]}/>
    }
    return (
      
        <Grid container sx={{height:'100%',maxWidth:'100%'}}>
          <Grid item xs={4} sx={{height:'100%'}}>
            <List dense>
            {fileList?.map((file,index)=>(
              <ListItemFile index={index} selected={this.state.selected} file={file} onClick={this.handleClick}/>
            ))}
            </List>
          </Grid>
          <Divider orientation='vertical' flexItem sx={{height:'100%'}}/>
          <Grid item xs alignItems='center' justifyContent='center' sx={{height:'100%'}}>  
            {content}
          </Grid>
        </Grid>
        
      
    )
  }
}

GameFileList.propTypes={
  fileList:PropTypes.array,
  variant:PropTypes.oneOf(['image','text'])
}
