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
            <Titles variant='left' gutterBottom>审核内容</Titles>
            <Paragraphs>
                检查游戏的文本素材文件中是否包含违规文字信息，如敏感词，英文单词，繁体字等。
            </Paragraphs>
            <br/>
            <Titles variant='left' gutterBottom>审核概览</Titles>      
            <Paragraphs>{summaryText}</Paragraphs>
            <br/>
            <Titles variant={'left'} gutterBottom>结果分析</Titles>
            <Stack direction='row' spacing={2} divider={<Divider orientation='vertical' sx={{height:'80%'}}/>} alignItems='center' justifyContent='center'>
                <NumberDisplay value1={800} title='发现问题' color1='#d32f2f'/>
                <NumberDisplay value1={800} value2={998} title='问题文件' color1='#d32f2f'/>
                <LabelCircularProgress value={50} title='匹配程度'/>
                <CheckStatus status={this.props.pass}/>
            </Stack>
        </Stack>
    )
  }
}
