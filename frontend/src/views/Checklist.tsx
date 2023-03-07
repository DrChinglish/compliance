import React, { Component } from 'react'
import { Card, CardHeader, CardContent, Button, Stepper, Step, StepButton} from '@mui/material'
import { CheckListStep, ChecklistAnswer, ICheckListQuestion, QuestionError, WithRouterProps } from '../Interfaces'
import { Stack } from '@mui/system'
import { getPlatformProjectQuestions, submitCheckList } from '../utils/APIs'
import withRouter from '../utils/WithRouter'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckListQuestionList from '../components/elements/CheckListQuestions/CheckListQuestionList'
import SuccessHint from '../components/Hints/SuccessHint'
import CheckListResults from '../components/elements/CheckListResult/CheckListResults'
import TitleAction from '../components/elements/TitleAction'
type Props = {
    
} & WithRouterProps

type State = {
    answers:ChecklistAnswer,
    pagequestion:number,
    currentpage:number,
    questions:ICheckListQuestion[],
    errQuestion:QuestionError[],
    activeStep:number
}

class Checklist extends Component<Props, State> {

  constructor(props){
    super(props)

  }

  state = {
    answers:[] as ChecklistAnswer,
    pagequestion:10,//questions per page
    currentpage:1,//current page(starting from 1)
    questions:tempquestion, 
    errQuestion:[] as QuestionError[],
    activeStep:0
  }

  componentDidMount(): void {
    if(this.props.params.id){
      getPlatformProjectQuestions(parseInt(this.props.params.id!),undefined,
        (res)=>{
            //console.log(res)
            this.setState({
                questions:res
            })
        }
      )
    }
  }

  handleBackClick = ()=>{
    this.props.navigate("/list/platform")
  }

  handleQuestionCheck = (index: string)=>(value:string)=>{
    this.setState((state)=>{

        let newAnswers = state.answers
        if(newAnswers[index]===undefined){
            newAnswers[index] = {
                id:this.state.questions[index].id,
            }
        }
        newAnswers[index].value = value
        return {answers:newAnswers,errQuestion:{...state.errQuestion,[index]:undefined}}
    })
  }

  handlePageChange=(forward: any,jump:boolean=false)=>()=>{
    let delta=-1
    let target = 1
    if(forward){
        delta = 1
        target = Math.ceil(this.state.questions.length/this.state.pagequestion) 
    }
    this.setState((state)=>{
        return {currentpage:jump?target:state.currentpage+delta}
    })
  }

  seekQuestion = (question:number)=>{
    let page = Math.floor(question / this.state.pagequestion) +1
    let offset = question % this.state.pagequestion
    this.setState({
        currentpage:page
    })
  }

  handleSubmit=()=>{
    console.log(this.state.answers)
    let len = this.state.answers.length
    let emptyIndex = this.state.answers.findIndex((value)=>{
        return value===undefined
    })
    
    if(emptyIndex!==-1){
        console.log(emptyIndex  )
        this.setState((state)=>{
            return {errQuestion:{...state.errQuestion,[emptyIndex]:{id:state.questions[emptyIndex].id,helperText:'该项目为必填项'}}}
        },()=>{this.seekQuestion(emptyIndex)})
        console.log('empty!')
        return
    }
    if(len<this.state.questions.length){
        // Did not finish the last question
        this.setState((state)=>{
            return {errQuestion:{...state.errQuestion,[len]:{id:state.questions[len].id,helperText:'该项目为必填项'}}}
        },()=>{this.seekQuestion(len)})
        console.log('did not finish')
        return
        
    }
    submitCheckList(parseInt(this.props.params.id!),this.state.answers,undefined,
        (res)=>{
            console.log(res)
        }
        )
  }

  handleStepButtonClick=(index: any)=>()=>{
    this.setState({activeStep:index})
  }

  render() {
    let {questions,answers,activeStep} = this.state
    let step = steps[activeStep]

    return (
      <Card sx={{maxWidth:'75vw',mx:'auto'}} elevation={8}>
        <CardHeader
            title={
                <TitleAction center startActions={
                    <>
                    <Button startIcon={<ArrowBackIcon/>} size='large' onClick={this.handleBackClick}>
                        返回上级
                    </Button>
                    </>
                }>
                    合规表单
                </TitleAction>
            }
            titleTypographyProps={{variant:'h4',fontWeight:'bold',textAlign:'center'}}
        />
        <CardContent>
            <Stepper alternativeLabel activeStep={this.state.activeStep} nonLinear  >
                {steps.map((step,index)=>(
                    <Step key={step.label}>
                        <StepButton  onClick={this.handleStepButtonClick(index)}>{step.label}</StepButton>
                    </Step>
                    ))}
            </Stepper>
            <Stack spacing={2} px={2} pt={2} minHeight='75vh'>
                {(step.content instanceof Function)?(step.content!(questions,this.props.params.id))
                :step.content}
            </Stack>
            
        </CardContent>
      </Card>
    )
  }
}

export default withRouter(Checklist)
const tempquestion:ICheckListQuestion[]=[
    {
        id:0,
        law_article:'personal_protection_law',
        question:'个人信息处理者处理个人信息时是否遵循合法、正当、必要和诚信原则，没有通过误导、欺诈、胁迫等方式处理个人信息。'
    },
    {
        id:1,
        law_article:'personal_protection_law',
        question:'个人信息处理者处理个人信息时是否具有明确、合理的目的，并与处理目的直接相关，采取对个人权益影响最小的方式。'
    },
    {
        id:2,
        law_article:'personal_protection_law',
        question:'个人信息处理者收集个人信息是否限于实现处理目的的最小范围，不过度收集个人信息。'
    },
    {
        id:3,
        law_article:'personal_protection_law',
        question:'个人信息处理者处理个人信息是否遵循公开、透明原则，公开个人信息处理规则，并明示处理的目的、方式和范围。'
    },
    {
        id:4,
        law_article:'personal_protection_law',
        question:'个人信息处理者处理个人信息时，是否保证个人信息的质量，避免因个人信息不准确、不完整对个人权益造成不利影响。'
    },
    {
        id:5,
        law_article:'personal_protection_law',
        question:'个人信息处理者是否对其个人信息处理活动负责，并采取必要措施保障所处理的个人信息的安全。'
    },
    {
        id:6,
        law_article:'personal_protection_law',
        question:'个人信息处理者没有非法收集、使用、加工、传输他人个人信息，没有非法买卖、提供或者公开他人个人信息；没有从事危害国家安全、公共利益的个人信息处理活动。'
    },
    {
        id:7,
        law_article:'personal_protection_law',
        question:'个人信息处理者是否在处理个人信息前取得个人的同意'
    },
    {
        id:8,
        law_article:'personal_protection_law',
        question:'基于个人同意处理个人信息的，个人是否有权撤回同意。'
    },
    {
        id:9,
        law_article:'personal_protection_law',
        question:'个人不同意处理其个人信息或者撤回同意的，个人信息处理者是否仍然提供产品或者服务'
    }, {
        id:10,
        law_article:'personal_protection_law',
        question:'个人信息处理者处理个人信息时是否遵循合法、正当、必要和诚信原则，没有通过误导、欺诈、胁迫等方式处理个人信息。'
    },
    {
        id:11,
        law_article:'personal_protection_law',
        question:'个人信息处理者处理个人信息时是否具有明确、合理的目的，并与处理目的直接相关，采取对个人权益影响最小的方式。'
    },
    {
        id:12,
        law_article:'personal_protection_law',
        question:'个人信息处理者收集个人信息是否限于实现处理目的的最小范围，不过度收集个人信息。'
    },
    {
        id:13,
        law_article:'personal_protection_law',
        question:'个人信息处理者处理个人信息是否遵循公开、透明原则，公开个人信息处理规则，并明示处理的目的、方式和范围。'
    },
    {
        id:14,
        law_article:'personal_protection_law',
        question:'个人信息处理者处理个人信息时，是否保证个人信息的质量，避免因个人信息不准确、不完整对个人权益造成不利影响。'
    },
    {
        id:15,
        law_article:'personal_protection_law',
        question:'个人信息处理者是否对其个人信息处理活动负责，并采取必要措施保障所处理的个人信息的安全。'
    },
    {
        id:16,
        law_article:'personal_protection_law',
        question:'个人信息处理者没有非法收集、使用、加工、传输他人个人信息，没有非法买卖、提供或者公开他人个人信息；没有从事危害国家安全、公共利益的个人信息处理活动。'
    },
    {
        id:17,
        law_article:'personal_protection_law',
        question:'个人信息处理者是否在处理个人信息前取得个人的同意'
    },
    {
        id:18,
        law_article:'personal_protection_law',
        question:'基于个人同意处理个人信息的，个人是否有权撤回同意。'
    },
    {
        id:19,
        law_article:'personal_protection_law',
        question:'个人不同意处理其个人信息或者撤回同意的，个人信息处理者是否仍然提供产品或者服务'
    },
]

const steps:CheckListStep[]=[
    {
        label:'填写问卷',
        content:(question:ICheckListQuestion[],pid:number)=>(<CheckListQuestionList questions={question} pid={pid}/>)
    },
    {
        label:'等待处理',
        content:<SuccessHint label='已成功提交问卷，正在等待处理'/>
    },
    {
        label:'查看结果',
        content:(question:ICheckListQuestion[],pid:number)=>(<CheckListResults pid={pid}/>)
    },
]