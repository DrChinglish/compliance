import React, { useEffect, useState } from 'react'
import { Chip, FormControl, FormControlLabel, FormHelperText, FormLabel, Radio, RadioGroup, Stack} from '@mui/material'
import { ICheckListQuestion, QuestionVariant } from '../../../Interfaces'
import { LocallizationLawArticle, questionFilter } from '../../../utils/util'
import Paragraphs from '../../typography/Paragraphs'
type Props = {
    question:ICheckListQuestion,
    variant:QuestionVariant,
    onValueChange:(value: string)=>void,
    error:boolean,
    helperText:string,
    value:boolean,
    index:number
}

export default function CheckListQuestion({index,value,question,variant,onValueChange,error=false,helperText=''}: Props) {

    const [formError,setFormError] = useState(false)
    const [formHelperText,setFormHelperText] = useState('')
    const [formValue,setFormValue] = useState<any>('')
    useEffect(()=>{
        setFormError(error)
        setFormHelperText(helperText)
    },[error,helperText])

    useEffect(()=>{
        setFormValue(value)
    },[value])

    const handleChange=(event: React.ChangeEvent<HTMLInputElement>)=>{
        setFormValue((event.target as HTMLInputElement).value)
        onValueChange((event.target as HTMLInputElement).value)
        // setFormError(false)
    }

    let questionTF = 
    <FormControl error={formError}>
        <FormLabel id={`question-${question.id}`} sx={{fontWeight:'bold'}}>
            <Stack spacing={1} direction='row'>
                <Paragraphs variant='strong'>
                    {`${index+1}.${questionFilter(question.question)}`}
                </Paragraphs>
                <Chip variant='outlined' color='error' size='small' label='* 必填'/>
                <Chip color='primary' size='small' label={LocallizationLawArticle[question.law_article]}/>
            </Stack>
        </FormLabel>
        <RadioGroup
        row
        value={formValue}
        onChange={handleChange}
        name={question.question}
        >
            <FormControlLabel value={true} control={<Radio/>} label='是'/>
            <FormControlLabel value={false} control={<Radio/>} label='否'/>
        </RadioGroup>
        <FormHelperText>{formHelperText}</FormHelperText>
    </FormControl>

  return (
    questionTF
  )
}