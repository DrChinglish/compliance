import { Box, ListItemButton, ListItemIcon, ListItemText, List, Paper, Grid, Divider, Typography, CircularProgress, Stack, ListItem } from '@mui/material'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {FixedSizeList} from 'react-window'

import EmptyHint from './subComponents/EmptyHint';
import ListItemFile from './subComponents/ListItemFile';
import TextFileContent from './subComponents/TextFileContent';
import './GameFileList.css'
import LoadingProgress from './subComponents/LoadingProgress';


export default class GameFileList extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
       selected: -1,
       fileList: this.props.fileList,
       loading:false
    }
  }

  handleClick=(e,value)=>{
    //TODO: add backend interaction here
    this.setState({
      selected: value,
      loading:true
    })
    let fetchAPI =`/${this.state.fileList[value].id}/`
    switch(this.props.variant){
      case 'text':fetchAPI = '/api/text_censor'+fetchAPI;break;
      case 'image':fetchAPI = 'to/be/implemented/'+fetchAPI;break;
    }
    fetch(fetchAPI,{
      method:'GET',
      mode:'cors'
    }).then((res)=>{
      console.log(res)
      return res.json()
    }).then((res)=>{
      let newfileList = this.state.fileList
      //console.log(res)
      newfileList[value].contentlist = res.data //censored content in list
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
      content = <TextFileContent file={fileList[this.state.selected]}/>
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
