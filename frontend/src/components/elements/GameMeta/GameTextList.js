import { Box, ListItemButton, ListItemIcon, ListItemText, List, Paper, Grid, Divider, Typography, Card, CardHeader, CardContent, Stack, ListItem } from '@mui/material'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {FixedSizeList} from 'react-window'
import DescriptionIcon from '@mui/icons-material/Description';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import EmptyHint from './EmptyHint';

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
  return(
    <Stack spacing={2} sx={{px:2,height:'100%',py:2}}>
      <Typography align='center' variant='h5' fontWeight='bold'>{props.file.name}</Typography>
      <Divider/>
      <List sx={{maxHeight:'100%',overflow:'auto'}}>
        <ListItem>
          {props.file.content}
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
       selected: -1
    }
  }

  handleClick=(e,value)=>{
    //TODO: add backend interaction here
    this.setState({
      selected: value
    })
  }

  render() {
    let {fileList} = this.props
    return (
      
        <Grid container sx={{height:'100%'}}>
          <Grid item xs={4} sx={{height:'100%'}}>
            <List dense>
            {fileList?.map((file,index)=>(
              <ListItemFile index={index} selected={this.state.selected} file={file} onClick={this.handleClick}/>
            ))}
            </List>
          </Grid>
          <Divider orientation='vertical' flexItem sx={{height:'100%'}}/>
          <Grid item xs alignItems='center' justifyContent='center' sx={{height:'100%'}}>  
            {this.state.selected == -1?<EmptyHint text="选择一个文件以查看详情"/>:<TextFileContent file={fileList[this.state.selected]}/>
            }
          </Grid>
        </Grid>
        
      
    )
  }
}

GameTextList.propTypes={
  fileList:PropTypes.array
}
