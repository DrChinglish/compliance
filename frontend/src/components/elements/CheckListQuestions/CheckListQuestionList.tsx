import React, { useMemo, useState } from 'react'
import { ChecklistAnswer, ICheckListQuestion, QuestionError, WithRouterProps } from '../../../Interfaces'
import CheckListQuestion from './CheckListQuestion'
import LinearProgressWithLabel from '../LinearProgressWithLabel'
import { Button, Stack } from '@mui/material'
import Paragraphs from '../../typography/Paragraphs'
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import { submitCheckList } from '../../../utils/APIs'
import withRouter from '../../../utils/WithRouter'
type Props = {
    questions:ICheckListQuestion[],
    pid:number
} & WithRouterProps

export default function CheckListQuestionList({questions,pid},props: Props) {

    const [errQuestion,setErrorQuestion] = useState<QuestionError[]>([])
    const [answers,setAnswers] = useState<ChecklistAnswer>([])
    const [currentPage,setCurrentPage] = useState(1)
    const [pageQuestion,setPageQuestion] = useState(10)

    const handlePageChange=(forward: any,jump:boolean=false)=>()=>{
        let delta=-1
        let target = 1
        if(forward){
            delta = 1
            target = Math.ceil(questions.length/pageQuestion) 
        }
        setCurrentPage(jump?target:currentPage+delta)
      }
    
    const seekQuestion = (question:number)=>{
        let page = Math.floor(question / pageQuestion) +1
        let offset = question % pageQuestion
        setCurrentPage(page) 
      }
    
    const handleSubmit=()=>{
        console.log(answers)
        let len = answers.length
        let emptyIndex = answers.findIndex((value)=>{
            return value===undefined
        })
        let errIndex = -1
        if(emptyIndex!==-1)
            errIndex = emptyIndex
        else if(len < questions.length)
            errIndex = len
        if(errIndex!==-1){
            console.log(errIndex)
            let newerrQuestion = [...errQuestion]
            newerrQuestion[errIndex] = {id:questions[errIndex].id,helperText:'该项目为必填项'}
            setErrorQuestion(newerrQuestion)
            seekQuestion(errIndex)
            console.log('empty!')
            return
        }
        submitCheckList(pid,answers,undefined,
            (res)=>{
                console.log(res)
            }
            )
      }

    const handleQuestionCheck = (index: string)=>(value:string)=>{
        let newAnswers = [...answers]
        if(newAnswers[index]===undefined){
            newAnswers[index] = {
                id:questions[index].id,
            }
        }
        newAnswers[index].value = value
        setAnswers(newAnswers)
        let newerrQuestion = errQuestion
        errQuestion[index] = undefined
        setErrorQuestion(newerrQuestion )

      }

    let finished = useMemo(()=>{
        return answers.filter((value)=>{
            return value!==undefined
        }).length
    },[answers])
      
    let question = useMemo(() => {
        
        let question:JSX.Element[] = []
        for(let i in questions){
            let item = questions[i]
            let error = errQuestion[i]?true:false
            let helperText = errQuestion[i]?.helperText??''
            question.push(<CheckListQuestion index={parseInt(i)} value={answers[i]?.value??''} key={i} 
            error={error} helperText={helperText} onValueChange={handleQuestionCheck(i)} question={item} 
            variant='TF'/>)
        }
        return question
    }, [questions,errQuestion,answers])

  return (
    <React.Fragment>
        {question.slice((currentPage-1)*pageQuestion,currentPage*pageQuestion)}
            <LinearProgressWithLabel value={finished/questions.length*100} />
            <Stack direction='row' alignItems='center' justifyContent='center' spacing={2}>
                <Button startIcon={<SkipPreviousIcon/>} variant='outlined' size='large' onClick={handlePageChange(false, true)} 
                fullWidth={false} disabled={currentPage===1}>首页</Button>
                <Button startIcon={<NavigateBeforeIcon/>} variant='outlined' size='large' onClick={handlePageChange(false)} 
                fullWidth={false} disabled={currentPage===1}>上一页</Button>
                <Paragraphs>
                    {`${currentPage}/${Math.ceil(question.length/pageQuestion)}`}
                </Paragraphs>
                <Button endIcon={<NavigateNextIcon/>} variant='outlined' size='large' onClick={handlePageChange(true)} 
                fullWidth={false} disabled={Math.ceil(question.length/pageQuestion)<=currentPage}>下一页</Button>
                <Button endIcon={<SkipNextIcon/>} variant='outlined' size='large' onClick={handlePageChange(true, true)} 
                fullWidth={false} disabled={Math.ceil(question.length/pageQuestion)<=currentPage}>末页</Button>
                <Button variant='contained' size='large' onClick={handleSubmit} fullWidth={false}>提交</Button>
            </Stack>
    </React.Fragment>
  )
}

