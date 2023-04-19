import React from 'react'
import Titles from '../../../typography/Titles'
import QuestionFormControl from '../QuestionFormControl'
import { OutlinedInputProps, Stack } from '@mui/material'
import { QuestionVariant } from '../../../../Interfaces'

type Props =  {
    questionIndex:number,
    error:boolean,
    questionVariant?:QuestionVariant
} & OutlinedInputProps

export default function QuestionTitle({questionIndex,value,error,...rest}: Props) {
  return (
    <Stack direction={'row'}>
      <Titles>{`${questionIndex}.`}</Titles>
       <QuestionFormControl questionIndex={questionIndex} error={false} label={'标题内容'} {...rest} value={value}/>
    </Stack>
    )
}