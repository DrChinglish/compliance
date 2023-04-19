import { FormControl, InputLabel, FormHelperText, Select, SelectProps, OutlinedInput, OutlinedInputProps } from '@mui/material'
import { SelectInputProps } from '@mui/material/Select/SelectInput'

import React from 'react'
import { QuestionVariant } from '../../../Interfaces'

type Props = {
    questionIndex:number,
    error:boolean,
    questionVariant?:QuestionVariant,
    optionIndex?:number
} & OutlinedInputProps

export default function QuestionFormControl({questionIndex,error,questionVariant,optionIndex,...outlinedInputprops}: Props) {
    // let labelid = `${questionVariant}-${title}-label`
    //无questionVariant情况下认为是标题
    let formid = questionVariant?`question-${questionVariant}-${questionIndex}${optionIndex?`-${optionIndex}`:''}`
    :`question-title-${questionIndex}`
  return (
    <FormControl sx={{m:1, width:'25ch'}} variant='outlined' error={error}>
        <InputLabel htmlFor={formid}>{questionVariant?'选项内容':'标题内容'}</InputLabel>
        <OutlinedInput
            {...outlinedInputprops}
            id={formid}
            />  
        {/* <FormHelperText>{type.helperText}</FormHelperText> */}
    </FormControl>
  )
}