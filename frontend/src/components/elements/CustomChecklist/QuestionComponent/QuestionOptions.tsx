import React, { useEffect, useState } from 'react'
import { QuestionVariant } from '../../../../Interfaces'
import Titles from '../../../typography/Titles'
import QuestionFormControl from '../QuestionFormControl'
import { CustomQuestionInfo } from '../../../../Interfaces/InterfaceCustomCheckList'
import { Checkbox, IconButton, OutlinedInputProps, Paper, Stack, Table, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Paragraphs from '../../../typography/Paragraphs'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
type Props = {
    question:CustomQuestionInfo,
    onOptionsChange:(newOptions:any[])=>void
}

function EditTableHeader(){
    return(
        <TableHead>
            <TableRow>
                <TableCell>选项文字</TableCell>
                <TableCell>允许为空</TableCell>
                <TableCell>上下移动</TableCell>
            </TableRow>
        </TableHead>
    )
}


type EditableOptionProps = {
    questionIndex:number,
    questionVariant:QuestionVariant
}&OutlinedInputProps

function EditableOption({questionIndex,value,questionVariant,...rest}:EditableOptionProps){
    return(
        <QuestionFormControl questionVariant={questionVariant} questionIndex={questionIndex} error={false} 
        label={'选项内容'} {...rest} value={value}/>
    )
}



export default function QuestionOptions({question,onOptionsChange}: Props) {

    const [options,setOptions] = useState(question.options)

    useEffect(()=>{
        setOptions(question.options)
    },[question])

    const handleOptionChange:(optionindex:number)=>React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> =
    (optionindex:number)=>(e)=>{
        let newQuestion:CustomQuestionInfo = {...question}
        if(!newQuestion.options){
            newQuestion.options = []
        }
        newQuestion.options[optionindex] = e.target.value
        onOptionsChange(newQuestion.options)
        setOptions(newQuestion.options)
    }

  return (
    <TableContainer component={Paper}>
        <Table>
            <EditTableHeader/>
            {options?.map((option,index)=>(
                <TableRow>
                    <TableCell component='th' scope='row'>
                        <Stack direction='row' alignItems='center'>
                            <EditableOption questionVariant={question.variant} onChange={handleOptionChange(index)}
                            questionIndex={question.index} value={option} />
                            <IconButton><AddIcon/></IconButton>
                            <IconButton><RemoveIcon/></IconButton>
                        </Stack>
                    </TableCell>
                    <TableCell  component='th' scope='row'><Checkbox/></TableCell>
                    <TableCell  component='th' scope='row'>
                        <Stack direction='row'>
                            <IconButton><ArrowUpwardIcon/></IconButton>
                            <IconButton><ArrowDownwardIcon/></IconButton>
                        </Stack>
                    </TableCell>
                </TableRow>
            ))}
        </Table>
    </TableContainer>
  )
}