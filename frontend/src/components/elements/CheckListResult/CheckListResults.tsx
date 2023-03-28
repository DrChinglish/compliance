import React, { useEffect, useState } from 'react'
import { Stack, IconButton, Divider } from '@mui/material'
import Titles from '../../typography/Titles'
import Paragraphs from '../../typography/Paragraphs'
import TitleAction from '../TitleAction'
import NumberDisplay from '../GameMeta/subComponents/CheckListContents/CheckIndicators/NumberDisplay'
import LabelCircularProgress from '../GameMeta/subComponents/CheckListContents/CheckIndicators/LabelCircularProgress'
import CheckStatus from '../GameMeta/subComponents/CheckListContents/CheckIndicators/CheckStatus'
import { getCheckListResult } from '../../../utils/APIs'
import { CheckListResult, CheckListResultKeyLocalization, RiskData, loadResultFromResponse } from '../../../Interfaces/InterfaceCheckList'
import { LoadingStatus, SnackbarStatus } from '../../../Interfaces'
import StatusContainer from '../StatusContainer'
import CheckListResultSuggestion from './CheckListResultSuggestion'
import CheckListResultData from './CheckListResultData'
import CheckListResultScores from './CheckListResultScores'
type Props = {
  pid:number
}

export default function CheckListResults({pid}: Props) {

  const [projectResult,setProjectResult] = useState<CheckListResult>()
  const [snackbarStatus,setSnackbarStatus] = useState<SnackbarStatus>({show:false,severity:'success',text:''})
  const [status,setStatus] = useState<LoadingStatus>('initial')

  const loadResult = ()=>{
    setStatus('loading')
    getCheckListResult(pid,(e)=>{
      setStatus('error')
    },
      (res)=>{
        let result = loadResultFromResponse(res)
        setProjectResult(result)
        setStatus('success')
        console.log(result)
      }
    )
  }

  useEffect(()=>{
    loadResult()
  },[])

  return (
    <StatusContainer status={status}>
       {status==='success' &&
        <Stack sx={{p:2, overflowY:'auto'}}>
        <Titles variant='left' gutterBottom>风险数据项</Titles>
        <br/>
        <Paragraphs>
          <CheckListResultData data={projectResult!.riskData as RiskData}/>
        </Paragraphs>
        <Paragraphs type='center' gutterBottom> 
            
        </Paragraphs>
        <br/>
        <Titles variant='left'>合规建议</Titles>
        <br/>
        <Stack spacing={1}>
          {projectResult?.suggestion.map(value=><CheckListResultSuggestion variant='info' label={value}/>)}
        </Stack>
        <br/>
        <Titles variant={'left'} gutterBottom>结果分析</Titles>
            <Stack direction='row' spacing={2} divider={<Divider orientation='vertical' sx={{height:'80%'}}/>} alignItems='center' justifyContent='center'>
                <CheckListResultScores scores={projectResult!.scores}/>
            </Stack>
      </Stack>
      }
      
    </StatusContainer>
    
  )
}