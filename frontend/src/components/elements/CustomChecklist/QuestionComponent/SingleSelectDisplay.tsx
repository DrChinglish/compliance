import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Stack } from '@mui/material'
import React from 'react'
import { CustomQuestionInfo } from '../../../../Interfaces/InterfaceCustomCheckList'
import Paragraphs from '../../../typography/Paragraphs'

type Props = {
    question:CustomQuestionInfo
}

export default function SingleSelectDisplay({question}: Props) {
  return (
    <Stack>
      <FormControl>
        <FormLabel id={`question-${question.index}`}>
          <Paragraphs variant='strong'>
            {`${question.index}.${question.title}`}
          </Paragraphs>
        </FormLabel>
        <RadioGroup
          name={`${question.title}-singleselect`}
        >
          {question.options?.map((option,index)=>(
            <FormControlLabel value={index} control={<Radio/>} label={option} />
          ))}
        </RadioGroup>
      </FormControl>
    </Stack>
  )
}