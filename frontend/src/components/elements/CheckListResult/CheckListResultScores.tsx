import { Divider, Stack } from '@mui/material'
import React, { useMemo } from 'react'
import NumberDisplay from '../GameMeta/subComponents/CheckListContents/CheckIndicators/NumberDisplay'
import CheckStatus from '../GameMeta/subComponents/CheckListContents/CheckIndicators/CheckStatus'
import { CheckListResultKeyLocalization, CheckListResultScore } from '../../../Interfaces/InterfaceCheckList'

type Props = {
    scores:CheckListResultScore
}

export default function CheckListResultScores({scores}: Props) {


    let display:JSX.Element[]=useMemo(()=>{
        let tmp:JSX.Element[]=[]
        for(let key in scores){
            //console.log(scores[key])
            tmp.push(<NumberDisplay value1={Math.ceil(scores[key]*10)} title={CheckListResultKeyLocalization.scores[key]} color1='#d32f2f'/>)
        }
        return tmp
    },[scores])
    
  return (
    <Stack direction='row' spacing={2} divider={<Divider orientation='vertical' sx={{height:'80%'}}/>} alignItems='center' justifyContent='center'>
        {display}
        <CheckStatus status={false}/>
    </Stack>
  )
}