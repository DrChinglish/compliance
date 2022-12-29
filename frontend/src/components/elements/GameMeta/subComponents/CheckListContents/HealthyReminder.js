import React, { Component } from 'react'
import Paragraphs from '../../../../typography/Paragraphs'
import Titles from '../../../../typography/Titles'
import { Box, Backdrop, Paper, Stack, Divider, CircularProgress, Button, IconButton } from '@mui/material'
import LabelCircularProgress from './CheckIndicators/LabelCircularProgress'
import CheckStatus from './CheckIndicators/CheckStatus'
import EmptyHint from '../../../../Hints/EmptyHint'
import UploadIcon from '@mui/icons-material/Upload';
import ActionHint from '../../../../Hints/ActionHint'
import UploadFileDialog from '../../../Dialogs/UploadFileDialog'
import PreviewImage from '../../../PreviewImage'
import { getHealthyReminder, getStaticResources, processHealthyReminder, uploadHealthyReminder } from '../../../../../utils/APIs'
import LoadingProgress from '../LoadingProgress'
import TitleAction from '../../../TitleAction'
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import StatusContainer from '../../../StatusContainer'
import DeleteFileDialog from '../../../Dialogs/DeleteFileDialog'
import { convertBase64Image } from '../../../../../utils/util'
export default class HealthyReminder extends Component {

    componentDidMount=()=>{
      console.log('mount')
      this.setState({
        file:this.props.file
      })
    }

    constructor(props){
        super(props)
        this.state = {
            file:{
              url:'',
              id:-1
            },
            open:false,
            coverageRate:0,
            uploadDialogOpen:false,
            deleteDialogOpen:false,
            loadingNewFile:false,
            processedImage:undefined,
            resultStatus:'initial',

        }
    }

    handleClose=(e)=>{
        this.setState({open:false})
    }

    handleClickUpload=()=>{
      this.setState({
        uploadDialogOpen:true
      })
    }
    
    handleClickDelete=()=>{
      console.log('click')
      if(!this.state.deleteDialogOpen)
        this.setState({deleteDialogOpen:true})
    }

    handleDialogClose=()=>{
      this.setState({
        uploadDialogOpen:false,
        deleteDialogOpen:false
      })
      console.log(this.state)
      this.setState({loadingNewFile:true})
      getHealthyReminder(this.props.pid,undefined,res=>{
        console.log(res)
        if(res.status===1){
          //has file
          let file = res.data[0]
          this.setState({file:{url:file.url,id:file.id}, loadingNewFile:false})
        }else{
          this.setState({file:{url:'',id:-1}, loadingNewFile:false})
        }
      })
    }

    getPrecessResult=()=>{
      this.setState({resultStatus:'loading'})
      processHealthyReminder(this.props.pid,this.state.file.id,(reason)=>{this.setState({resultStatus:'error'})},
      res=>{
        let r = res.game_advice
        this.setState({coverageRate:r.coverage_rate,processedImage:r.image,resultStatus:'success'})
      })
    }

  render() {
    // console.log(this.state)
    if(this.state.file.id>0&&this.state.resultStatus==='initial'){
      this.getPrecessResult()
    }
    let contentNoFile = 
    <>
      <ActionHint text='还没有上传游戏健康忠告文件' extra={
        <>
        <Button variant='contained' startIcon={<UploadIcon/>} onClick={this.handleClickUpload} size='small'>上传文件</Button>
        <UploadFileDialog uploadTo={uploadHealthyReminder} pid={this.props.pid} 
        open={this.state.uploadDialogOpen} onClose={this.handleDialogClose}/>
        </>
      }/>
    </>
    let contentLoading = <LoadingProgress label='正在更新文件信息'/>
    let {open} = this.state
    let imagesrc = getStaticResources(this.state.file.url)??'https://img0.baidu.com/it/u=2850780439,3869294322&fm=253&fmt=auto&app=138&f=JPEG?w=916&h=500'
    let imageBig = <img src={imagesrc} onClick={this.handleClose}/>
    let content = 
    <>
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
        onClick={this.handleClose}>
            {imageBig}
        </Backdrop>
        <Box sx={{cursor:'zoom-in'}} display='flex' justifyContent='center' alignItems='center'>
            <img src={imagesrc} onClick={(e)=>{this.setState({open:true})}} style={{maxHeight:'250px',maxWidth:'100%'}}/>
        </Box>
        <br/>
        <TitleAction >
          <Titles>识别结果</Titles>
        </TitleAction>
        <Box sx={{height:'60%'}}>
          <StatusContainer status={this.state.resultStatus} 
          errorAction={<IconButton onClick={()=>this.getPrecessResult()}><RefreshIcon/></IconButton>}>
            <PreviewImage src={convertBase64Image(this.state.processedImage)}/>
            <br/>
            <Titles variant={'left'} gutterBottom>结果分析</Titles>
            <Stack direction='row' spacing={2} divider={<Divider orientation='vertical' sx={{height:'80%'}}/>} alignItems='center' justifyContent='center'>
                <LabelCircularProgress value={parseInt(this.state.coverageRate)} title='匹配程度'/>
                <CheckStatus status={parseInt(this.state.coverageRate)===100}/>
            </Stack>
          </StatusContainer>
        </Box>
        
    </>
    
    return (
      <Stack sx={{p:2, overflowY:'auto'}}>
        <Titles variant='left' gutterBottom>审核内容</Titles>
        <Paragraphs>
            检查游戏上传的开始画面中是否包含国家相关法律规定所必须拥有的“健康游戏忠告”：
            <br/>
        </Paragraphs>
        <Paragraphs variant='center' gutterBottom> 
            抵制不良游戏,拒绝盗版游戏。<br/>
            注意自我保护,谨防受骗上当。<br/>
            适度游戏益脑,沉迷游戏伤身。<br/>
            合理安排时间,享受健康生活。<br/>
        </Paragraphs>
        <TitleAction actions={this.state.file.id>0?
        <IconButton onClick={this.handleClickDelete}>
          <DeleteIcon color='error'/>
          <DeleteFileDialog fileList={[this.state.file]} pid={this.props.pid} onClose={this.handleDialogClose}
          open={this.state.deleteDialogOpen} from='advice'/>
        </IconButton>:null}>
          <Titles>项目文件</Titles>
        </TitleAction>
        <br/>
        {this.state.loadingNewFile?contentLoading:(this.state.file.id>0?content:contentNoFile)}
      </Stack>
    )
  }
}
