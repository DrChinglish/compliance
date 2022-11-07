import { List, Grid, Divider, IconButton} from '@mui/material'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
// import {FixedSizeList} from 'react-window'
import urlmapping from "../../../urlMapping.json"
import RefreshIcon from '@mui/icons-material/Refresh';
import {getProcessedFile} from '../../../utils/APIs'
import EmptyHint from './subComponents/EmptyHint';
import ListItemFile from './subComponents/ListItemFile';
import TextFileContent from './subComponents/FileContents/TextFileContent';
import './GameFileList.css'
import LoadingProgress from './subComponents/LoadingProgress';
import ImageFileContent from './subComponents/FileContents/ImageFileContent'
import AudioFileContent from './subComponents/FileContents/AudioFileContent'
import VideoFileContent from './subComponents/FileContents/VideoFileContent'
import fetchHandle from '../../../utils/FetchErrorhandle';
import ErrorHint from '../ErrorHint';

export default class GameFileList extends Component {
  constructor(props) {
    super(props)
    console.log(this.props.fileList)
    this.state = {
       selected: -1,
       fileList: this.props.fileList,
       loading:false,
       loaderr:{
        status:false,
        index:-1,
        text:'未知错误'
       },

    }
  }

  generateSuggestion=(type,items)=>{
    let title
    //console.log(type,items)
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
    /*---DEV ONLY---*/
    if(['audio','video'].indexOf(this.props.variant)!==-1){
      this.setState({
        selected: value,
        loaderr:{status:false,index:-1,text:'未知错误'}
      })
      return  
    }
    /*---DEV ONLY---*/

    //TODO: add backend interaction here
    this.setState({
      selected: value,
      loading:true,
      loaderr:{status:false,index:-1,text:'未知错误'}
    })
    let fetchAPI = getProcessedFile(this.props.pid,this.state.fileList[value].id,this.props.variant)
    // switch(this.props.variant){
    //   case 'text':fetchAPI = urlmapping.apibase.game+`/projects/${this.props.pid}/texts/${this.state.fileList[value].id}/process_doc`;break;
    //   case 'image':fetchAPI = urlmapping.apibase.game+`/projects/${this.props.pid}/images/${this.state.fileList[value].id}/process_img`;break;
    // }
    fetch(fetchAPI,{
      method:'GET',
      mode:'cors'
    })
    .then(fetchHandle)
    .then((res)=>{
      return res.json()
    })
    .then((res)=>{
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
      this.props.setSuggestions(suggs,`game_${this.props.variant}`)
      let newfileList = this.state.fileList
      //console.log(res)
      newfileList[value].contentlist = res //censored content in list
      this.setState({
        fileList:newfileList,
        loading:false
      })
      //console.log(this.state.fileList)
    })
    .catch((reason)=>{
      //console.log(reason)
      this.setState({
        loading:false,
        loaderr:{
          index:value,
          status:true,
          text:`发生了一个错误：${reason.name} ${reason.message}`
        }
      })
    })
    
  }

  render() {
    let {fileList} = this.state
    let content
    if(this.state.selected==-1){
      content = <EmptyHint text="选择一个文件以查看详情"/>
    }else if(this.state.loaderr.status){
      content = <ErrorHint text={this.state.loaderr.text} 
      extra={<IconButton onClick={(e)=>this.handleClick(e,this.state.loaderr.index)}><RefreshIcon/></IconButton>}/>
    }else if(this.state.loading){
      content = <LoadingProgress/>
    } else{
      if(this.props.variant==='text')
        content = <TextFileContent file={fileList[this.state.selected]}/>
      else if(this.props.variant==='image')
        content = <ImageFileContent image={fileList[this.state.selected]}/>
      else if(this.props.variant ==='audio')
        content = <AudioFileContent audio={fileList[this.state.selected]}/>
      else
        content = <VideoFileContent video={fileList[this.state.selected]}/>
    }
    return (
      
        <Grid container sx={{height:'100%',maxWidth:'100%'}}>
          <Grid item xs={4} sx={{height:'100%'}}>
            {fileList.length>0?
            <List dense>
            {fileList?.map((file,index)=>{
              let thumbnailUrl = this.props.variant === 'image'?file.url:
              (this.props.variant==='video'?file.content.coverurl:undefined)
              return <ListItemFile index={index} selected={this.state.selected} file={file} 
              thumbnailUrl={thumbnailUrl} onClick={this.handleClick}/>
            })}
            </List>
            :<EmptyHint text='暂无文件'/>}
          </Grid>
          <Divider orientation='vertical' flexItem sx={{height:'100%'}}/>
          <Grid item xs zeroMinWidth alignItems='center' justifyContent='center' sx={{height:'100%'}}>  
            {content}
          </Grid>
        </Grid>
        
      
    )
  }
}

GameFileList.propTypes={
  fileList:PropTypes.array,
  variant:PropTypes.oneOf(['image','text','audio','video'])
}
