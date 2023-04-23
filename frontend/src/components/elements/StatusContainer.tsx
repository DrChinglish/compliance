import { Box, SxProps } from '@mui/material'
import { Theme } from '@mui/system'
import React from 'react'
import { LoadingStatus } from '../../Interfaces'
import EmptyHint from '../Hints/EmptyHint'
import ErrorHint from '../Hints/ErrorHint'
import SuccessHint from '../Hints/SuccessHint'
import LoadingProgress from './GameMeta/subComponents/LoadingProgress'

type Props = {
    status:LoadingStatus,
    initialText?:string,
    errorText?:string,
    successText?:string,
    children?:React.ReactNode,
    errorAction?:React.ReactNode,
    variant?:'decision'|'display'
    sx?:SxProps<Theme>
}

export default function StatusContainer({status,initialText,errorText,children,errorAction,successText,sx,variant='display'}: Props) {
    let content:React.ReactNode = <></>
    if(variant === "display"){//信息显示类型界面，用于展示相关信息，初状态为空
        switch(status){
            case 'initial':content = <EmptyHint text={initialText??'现在没有内容可以显示'}/>;break;
            case 'loading':content = <LoadingProgress/>;break;
            case 'success':content = children;break;
            case 'error':content = <ErrorHint text={errorText??"发生了一个错误"} extra={errorAction}/>;break;
            default: content = <EmptyHint text='未知状态'/>
        }
    }else{
        switch(status){//操作类型界面，初始有相关操作提示
            case 'initial':content = children;break;
            case 'loading':content = <LoadingProgress/>;break;
            case 'success':content = <SuccessHint label={successText??'操作成功'}/>;break;
            case 'error':content = <ErrorHint text={errorText??"发生了一个错误"} extra={errorAction}/>;break;
            default: content = <EmptyHint text='未知状态'/>
        }
    }
    
    
  return (
    <Box sx={sx}>
        {content}
    </Box>
  )
}