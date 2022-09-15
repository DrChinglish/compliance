import { Box, ListItemButton, ListItemIcon, ListItemText, List, Paper, Grid, Divider, Typography, CircularProgress, Stack, ListItem } from '@mui/material'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {FixedSizeList} from 'react-window'
import DescriptionIcon from '@mui/icons-material/Description';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import EmptyHint from './EmptyHint';

import './GameTextList.css'
import LoadingProgress from './LoadingProgress';

function ListItemFile(props){

  return(
    <ListItemButton selected={props.selected===props.index} onClick={(e)=>props.onClick(e,props.index)}>
      {ListItemFileIcon(props.file.type)}
      <ListItemText
      primary={props.file.name}
      secondary={props.file.size}
      />
    </ListItemButton>
  )
}

function TextFileContent(props){
  let text=[]
  for(let index in props.file.contentlist){
    let s = props.file.contentlist[index]
    console.log(s)
    if(s.flag == 0){ //legal
      
      text.push(<span>{s.text}</span>)
    }else{
      text.push(<span style={{background:'red', borderRadius:'3px', color:'white'}} className='highlighted'>{s.text}</span>)
    }
  }

  console.log(text.length)

  return(
    <Stack spacing={2} sx={{px:2,height:'100%',py:2}}>
      <Typography align='center' variant='h5' fontWeight='bold'>{props.file.name}</Typography>
      <Divider/>
      <List sx={{maxHeight:'70%',overflowY:'scroll',overflowX:'clip',maxWidth:'100%',borderRadius:'5px', border:"thin solid #a9a9a9"}}>
        <ListItem>
          <Box >
            {text}  
          </Box>
          
        </ListItem>
        {/* <ListItem>
          {props.file.content}
        </ListItem> */}
      </List>
    </Stack>
    
  )
}

function ListItemFileIcon(type){
  let icon
  switch(type){
    case 'text':icon = <ListItemIcon><DescriptionIcon/></ListItemIcon>; break;
    case 'picture':icon = <ListItemIcon><InsertPhotoIcon/></ListItemIcon>;break;
    default:icon = <ListItemIcon><QuestionMarkIcon/></ListItemIcon>;
  }  

  return icon
}

export default class GameTextList extends Component {
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
    fetch('/test',{
      method:'GET',
      mode:'cors'
    }).then((res)=>{
      console.log(res)
      return res.json()
    }).then((res)=>{
      let newfileList = this.state.fileList
      console.log(res)
      newfileList[value].contentlist = res.data //censored content in list
      this.setState({
        fileList:newfileList,
        loading:false
      })
      console.log(this.state.fileList)
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

GameTextList.propTypes={
  fileList:PropTypes.array
}
