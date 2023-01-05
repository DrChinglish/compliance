import React from 'react'
import { Chip, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup} from '@mui/material'
import { ICheckListQuestion, QuestionVariant } from '../../../Interfaces'
type Props = {
    question:ICheckListQuestion,
    variant:QuestionVariant
}

export default function CheckListQuestion({question,variant}: Props) {

    let questionTF = 
    <FormControl>
        <FormLabel id={`question-${question.id}`} sx={{fontWeight:'bold'}}>
            {`${question.id+1}.${question.label}`}
            <Chip variant='outlined' color='error' size='small' label='* 必填'/>
        </FormLabel>
        <RadioGroup
        row
        name={question.label}>
            <FormControlLabel value={true} control={<Radio/>} label='是'/>
            <FormControlLabel value={false} control={<Radio/>} label='否'/>
        </RadioGroup>
    </FormControl>

  return (
    questionTF
  )
}