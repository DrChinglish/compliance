import React, { Component } from 'react'
import Paragraphs from '../../../../typography/Paragraphs'
import Titles from '../../../../typography/Titles'
import { Box, Backdrop, Paper, Stack, Divider, CircularProgress } from '@mui/material'
import LabelCircularProgress from '../LabelCircularProgress'
import CheckStatus from '../CheckStatus'

export default class HealthyReminder extends Component {
    constructor(props){
        super(props)
        this.state = {
            open:false,
        }
    }

    handleClose=(e)=>{
        this.setState({open:false})
    }

  render() {
    let {open} = this.state
    let imagesrc = this.props.imageurl??'https://img0.baidu.com/it/u=2850780439,3869294322&fm=253&fmt=auto&app=138&f=JPEG?w=916&h=500'
    let imageBig = <img src={imagesrc} onClick={this.handleClose}/>
    return (
      <React.Fragment>
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
        <Titles variant='left' gutterBottom>项目图片</Titles>
        <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
        onClick={this.handleClose}>
            {imageBig}
        </Backdrop>
        <Box sx={{cursor:'zoom-in'}} display='flex' justifyContent='center' alignItems='center'>
            <img src={imagesrc} onClick={(e)=>{this.setState({open:true})}} style={{maxHeight:'250px',maxWidth:'100%'}}/>
        </Box>
        <br/>
        <Titles variant='left' gutterBottom>识别结果</Titles>
        <Box sx={{height:'60%'}}>
          <Paper elevation={8} sx={{pl:2,py:2,height:'100%'}}>
            <Paragraphs sx={{overflowY:'scroll',maxHeight:'100%'}}>{`ut the four main constraints that against data trading flow: Uncontrollability of data, Inequivalence of data value, Difference of objective with data, Insufficiency of data discovery.Then, the author suggests the concept of data trading rights as an architecture to eliminate the four constraints. Furthermore, the author proposes an idea of data usage rights securities, which binds the data usage rights with the dataset and allows the data to be treated as tangible assets.Finally, the author gives a brief specification of the data market with data usage rights, illustrating the basic structure and trading procedure of it. Besides that, the author also elaborates some key technological requirements of the data market with data usage right.AdvantageThe author gives a clear review on the existing standards or pieces of literature surrounding the data trading architecture. For example, the author introduces the practice of China on data trading market.The author explains in detail the constraints on the use of data, and then introduce the role of the data trading market. The structure of the article is clear.Propose a new concept of data usage rights securities and the simple structure of the trading market with data usage rights.WeaknessesThe article needs more explanation on the way to implement data usage right securities:How to generate and issue data usage right securities?What techniques could be used to ensure the exclusivity, tangibilization, traceability and identification of the data usage right securities?What is the technical detail of the identifier signifying the dataset?Needs more explanation on the procedure of trading, especially about the data usage right securities:What is the whole process of trading using data usage right securities, from issuance to exercise?What roles do the stakeholders and objects play in the data market, please show it in a figure.The article does not meet the need of novelty, only the concept but not the detail implementation is proposed.DetailsIn part V, Fig 3 Transformation of the state of dataset and data usage rights securities are not explained very clearly. It should not only introduce the concept, but also explain the transformation processIn part VI, add tw
            ttttttttttttttttttttttttt
            ttttttt`}</Paragraphs>
          </Paper>
        </Box>
        <br/>
        <Titles variant={'left'} gutterBottom>结果分析</Titles>
        <Stack direction='row' spacing={2} divider={<Divider orientation='vertical' sx={{height:'80%'}}/>} alignItems='center' justifyContent='center'>
            <LabelCircularProgress value={50} title='匹配程度'/>
            <CheckStatus status={true}/>
        </Stack>
      </React.Fragment>
    )
  }
}
