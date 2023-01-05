import React, { Component } from 'react'
import { Card, CardHeader, CardContent, Button, Box, Divider } from '@mui/material'
import { ICheckListQuestion } from '../Interfaces'
import CheckListQuestion from '../components/elements/CheckListQuestions/CheckListQuestion'
import { Stack } from '@mui/system'
type Props = {}

type State = {}

export default class Checklist extends Component<Props, State> {
  state = {}


  render() {

    let question:JSX.Element[]=[]
    for(let item of tempquestion){
        question.push(<CheckListQuestion question={item} variant='TF'/>)
    }

    return (
      <Card sx={{maxWidth:'75vw',mx:'auto'}} elevation={8}>
        <CardHeader
            title={'合规表单-个人信息保护法'}
            titleTypographyProps={{variant:'h4',fontWeight:'bold',textAlign:'center'}}
        />
        <CardContent>
            <Divider/>
            <Stack spacing={2} px={2} pt={2}>
                {question}
                <Stack direction='row' alignItems='center' justifyContent='center' spacing={2}>
                    <Button variant='outlined' size='large' fullWidth={false} disabled>上一页</Button>
                    <Button variant='outlined' size='large' fullWidth={false}>下一页</Button>
                    <Button variant='contained' size='large' fullWidth={false}>提交</Button>
                </Stack>
                
            </Stack>
            
        </CardContent>
      </Card>
    )
  }
}


const tempquestion:ICheckListQuestion[]=[
    {
        id:0,
        label:'个人信息处理者处理个人信息时是否遵循合法、正当、必要和诚信原则，没有通过误导、欺诈、胁迫等方式处理个人信息。'
    },
    {
        id:1,
        label:'个人信息处理者处理个人信息时是否具有明确、合理的目的，并与处理目的直接相关，采取对个人权益影响最小的方式。'
    },
    {
        id:2,
        label:'个人信息处理者收集个人信息是否限于实现处理目的的最小范围，不过度收集个人信息。'
    },
    {
        id:3,
        label:'个人信息处理者处理个人信息是否遵循公开、透明原则，公开个人信息处理规则，并明示处理的目的、方式和范围。'
    },
    {
        id:4,
        label:'个人信息处理者处理个人信息时，是否保证个人信息的质量，避免因个人信息不准确、不完整对个人权益造成不利影响。'
    },
    {
        id:5,
        label:'个人信息处理者是否对其个人信息处理活动负责，并采取必要措施保障所处理的个人信息的安全。'
    },
    {
        id:6,
        label:'个人信息处理者没有非法收集、使用、加工、传输他人个人信息，没有非法买卖、提供或者公开他人个人信息；没有从事危害国家安全、公共利益的个人信息处理活动。'
    },
    {
        id:7,
        label:'个人信息处理者是否在处理个人信息前取得个人的同意'
    },
    {
        id:8,
        label:'基于个人同意处理个人信息的，个人是否有权撤回同意。'
    },
    {
        id:9,
        label:'个人不同意处理其个人信息或者撤回同意的，个人信息处理者是否仍然提供产品或者服务'
    },
]