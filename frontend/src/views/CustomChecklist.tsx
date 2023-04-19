import React, { Component } from 'react'
import withRouter from '../utils/WithRouter'
import { WithRouterProps } from '../Interfaces'
import { Button, Card, CardContent, CardHeader, List, Stack, Step, StepButton, Stepper } from '@mui/material'
import TitleAction from '../components/elements/TitleAction'
import steps from 'antd/lib/steps'
import AddQuestion from '../components/elements/CustomChecklist/AddQuestion'
import EditQuestionLayout from '../components/elements/CustomChecklist/EditQuestionLayout'

type Props = {} & WithRouterProps

type State = {

     
}
class CustomChecklist extends Component<Props, State> {
  state = {}

    handleChange=(index:number)=>()=>{
        
    }

  render() { 
    return (
        <Card sx={{maxWidth:'75vw',mx:'auto'}} elevation={8}>
        <CardHeader
            title='合规表单'
            titleTypographyProps={{variant:'h4',fontWeight:'bold',textAlign:'center'}}
        />
        <CardContent>
           <AddQuestion/>
           <EditQuestionLayout question={{index:1,title:'测试问题1',variant:'TF',options:['选项1','选项2']}}/>
           <EditQuestionLayout question={{index:1,title:'测试问题3',variant:'TF',options:['选项1','选项2']}}/>
           <EditQuestionLayout question={{index:1,title:'测试问题2',variant:'TF',options:['选项1','选项2']}}/>
        </CardContent>
      </Card>
    )
  }
}

export default withRouter(CustomChecklist)