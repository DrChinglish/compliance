import React, { Component } from 'react'
import Paragraphs from '../../../../typography/Paragraphs'
import Titles from '../../../../typography/Titles'
import CheckStatus from './CheckIndicators/CheckStatus'
import LabelCircularProgress from './CheckIndicators/LabelCircularProgress' 

import { Backdrop, Box, Paper, Stack, Divider } from '@mui/material'
import NumberDisplay from './CheckIndicators/NumberDisplay'


export default class TextSummary extends Component {
    
  render() {
    let statusText = this.props.pass===true?`在这之中没有发现问题，审核通过。`:
    (this.props.pass===undefined?`目前审核结果未知，这可能是由于审核仍然在进行当中`:
    `在这之中发现了违规项，详情请转至“文本合规”界面查看。`)
    let summaryText = this.props.fileCount.total>0?`在项目上传的${this.props.fileCount.total}个文件中，
    共包含${this.props.fileCount.text}个文本文件，${statusText}`:
    `该项目没有上传文件，请检查项目配置信息`

    return (
        <Stack sx={{p:2, overflowY:'auto',height:'100%'}}>
            <Titles variant='left' gutterBottom>风险数据项</Titles>
            <Paragraphs>
            在data.csv等2个文件中发现了不合规信息
            </Paragraphs>
            <br/>
            <Titles variant='left' gutterBottom>合规建议</Titles>      
            <Paragraphs>{`1.建议建立覆盖数据全生命周期的安全管理制度，该项制度需要覆盖数据的收集、存储、使用、加工、传输、提供、公开、删除各个环节的处理活动。\n
            `}</Paragraphs>
            
            <Paragraphs>{`2.建议对来自第三方数据来源的合法性、正当性进行核实，并且采取数据安全尽调、合同约束管理等方式对第三方数据来源进行安全审查。\n
            `}</Paragraphs>
            <br/>
            <Titles variant='left' gutterBottom>违规法条</Titles>      
            <Paragraphs>{"数据安全法，第二十七条：开展数据处理活动应当依照法律、法规的规定，建立健全全流程数据安全管理制度，组织开展数据安全教育培训，采取相应的技术措施和其他必要措施，保障数据安全。利用互联网等信息网络开展数据处理活动，应当在网络安全等级保护制度的基础上，履行上述数据安全保护义务。重要数据的处理者应当明确数据安全负责人和管理机构，落实数据安全保护责任。\n"}</Paragraphs>
            
            <Paragraphs>{"数据安全法，第三十二条：任何组织、个人收集数据，应当采取合法、正当的方式，不得窃取或者以其他非法方式获取数据。法律、行政法规对收集、使用数据的目的、范围有规定的，应当在法律、行政法规规定的目的和范围内收集、使用数据。"}</Paragraphs>
            <br/>
            <Titles variant={'left'} gutterBottom>合规得分</Titles>
            <Stack direction='row' spacing={2} divider={<Divider orientation='vertical' sx={{height:'80%'}}/>} alignItems='center' justifyContent='center'>
                {/* <NumberDisplay value1={800} title='发现问题' color1='#d32f2f'/>
                <NumberDisplay value1={800} value2={998} title='问题文件' color1='#d32f2f'/> */}
                <LabelCircularProgress value={88} title='隐私保护'/>
                <LabelCircularProgress value={75} title='数据安全'/>
                <LabelCircularProgress value={100} title='流程规范'/>
                <LabelCircularProgress value={100} title='数据保密'/>
                <CheckStatus status={false}/>
            </Stack>
        </Stack>
    )
  }
}
