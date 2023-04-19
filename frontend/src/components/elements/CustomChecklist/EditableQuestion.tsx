import { Box, Stack } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { CustomQuestionInfo } from '../../../Interfaces/InterfaceCustomCheckList'
import Titles from '../../typography/Titles'
import QuestionFormControl from './QuestionFormControl'
import QuestionTitle from './QuestionComponent/QuestionTitle'
import QuestionOptions from './QuestionComponent/QuestionOptions'
import SingleSelectDisplay from './QuestionComponent/SingleSelectDisplay'

type Props = {
    onChange?:(value:CustomQuestionInfo)=>void,
    value:CustomQuestionInfo 
}

export default function EditableQuestion({onChange,value}: Props) {

    useEffect(()=>{
        setQuestionInfo(value)
    },[value])
    
    const handleTitleChange:React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (e)=>{
        let newvalue:CustomQuestionInfo = {...questionInfo}
        newvalue.title = e.target.value
        setQuestionInfo(newvalue)
        if(onChange){
            onChange(newvalue)
        }
    } 
    const handleOptionsChange:(newOptions:any[])=>void=(newOptions)=>{
        let newvalue:CustomQuestionInfo = {...questionInfo}
        newvalue.options = newOptions
        setQuestionInfo(newvalue)
        if(onChange){
            onChange(newvalue)
        }
    } 
    const [editMode,setEditMode] = useState(false)
    const [questionInfo,setQuestionInfo] = useState<CustomQuestionInfo>(value)
    let questionLabel = questionInfo?.title??'Undefined'
  return (
    <Box onDoubleClick={()=>setEditMode(true)} onBlur={()=>setEditMode(false)}>
        <Stack alignItems='flex-start' pl={2} minHeight={56}>
            {editMode?
            <>
                <QuestionTitle questionIndex={1} error={false} value={questionInfo?.title}
                onChange={handleTitleChange}/>
                <QuestionOptions question={questionInfo} onOptionsChange={handleOptionsChange} />
            </>
           :
            <SingleSelectDisplay question={questionInfo}/>
            }
            
        </Stack>
    </Box>
  )
}
