import React, { useEffect, useState } from 'react'
import Titles from '../../typography/Titles'
import FileTree from '../FileTree/FileTree'
import { getFilesFromKeys, mergeTreeData, ProjectFiles, removeFileByKeys } from '../FileTree/util'
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import PopupDialog from './PopupDialog'
import RefreshIcon from '@mui/icons-material/Refresh';
import { Button, Paper, Stack, Typography } from '@mui/material';
import { createTask } from '../../../utils/APIs';
import SnackBar from '../SnackBar';
import { SnackbarStatus } from '../../../Interfaces';
type Props = {
    pid:number,
    open:boolean,
    onClose?:(event: object, reason: string)=>void,
    projectFiles:ProjectFiles
}

export default function CreateTaskDialog(props: Props) {
    //console.log(props.projectFiles)
    const [snackbarStatus,setSnackbarStatus] = useState<SnackbarStatus>({show:false,severity:'success',text:''})
    const [checkedKeysSource, setcheckedKeysSource] = useState<React.Key[]>([])
    const [checkedKeysDest, setcheckedKeysDest] = useState<React.Key[]>([])
    const [filesSource,setFilesSource] = useState<ProjectFiles>(props.projectFiles)
    const [filesDest,setFilesDest] = useState<ProjectFiles>({})
    const [disabledKeys, setDisabledKeys] = useState<React.Key[]>([])
    useEffect(()=>{
        setFilesSource(props.projectFiles)
    },[props.projectFiles])

    const handleClickReset = () => {
        setcheckedKeysDest([])
        setFilesDest({})
        setDisabledKeys([])
        setcheckedKeysSource([])
    }
    
    const handleClickCreate=()=>{
        createTask(props.pid,filesDest,(reason)=>{setSnackbarStatus({show:true,severity:'error',text:reason})},
            res=>{
                console.log(res)
                if(res.status===1){
                    setSnackbarStatus({show:true,severity:'success',text:'任务已经成功创建'})
                }else{
                    setSnackbarStatus({show:true,severity:'warning',text:'发生了未知错误'})
                }
            }
        )
    }

    const handleTransferFiles = (direction:'add'|'remove')=>()=>{
        if(direction==='add'){
            setFilesDest(mergeTreeData(filesDest,getFilesFromKeys(filesSource,checkedKeysSource)))
            setDisabledKeys(prevkeys=>[...prevkeys, ...checkedKeysSource])
            setcheckedKeysSource([])
            
        }else{
            setFilesDest(removeFileByKeys(filesDest,checkedKeysDest))
            setDisabledKeys([...disabledKeys.filter((key)=>!checkedKeysDest.includes(key))])
            setcheckedKeysDest([])
        }
    }

    const handleUpdateKeys = (from:'source'|'dest') => (newcheckedKeys:React.Key[]) => {
        console.log(newcheckedKeys)
        if(from==='source')
            setcheckedKeysSource(newcheckedKeys)
        else
            setcheckedKeysDest(newcheckedKeys)
    }
    
  return (
    <PopupDialog open={props.open} onClose={props.onClose} title='创建处理任务' maxWidth='lg'>
        <SnackBar status={snackbarStatus}/>
        <Titles>请在左侧选择需要处理的文件</Titles>
        <br/>
        <Stack direction={'row'} spacing={2} justifyContent='center'>
            <Paper sx={{p:1,overflow:'auto',maxHeight:'50vh',minHeight:'30vh',width:'30vw'}}>
                <Typography variant='caption'>{`已选择${checkedKeysSource.length}项`}</Typography>
                <FileTree projectFiles={filesSource} onKeyChecked={handleUpdateKeys('source')}
                disabledKeys={disabledKeys} checkedKeys={checkedKeysSource}/>
            </Paper>
            <Stack spacing={2} alignItems={'center'} justifyContent='center'>
                <Button variant='outlined' onClick={handleTransferFiles('remove')}><KeyboardDoubleArrowLeftIcon/></Button>
                <Button variant='outlined' onClick={handleTransferFiles('add')}><KeyboardDoubleArrowRightIcon/></Button>
                <Button variant='outlined' onClick={handleClickReset}><RefreshIcon/></Button>
            </Stack>
            <Paper sx={{p:1,overflow:'auto',maxHeight:'50vh',minHeight:'30vh',width:'30vw'}}>
                <Typography variant='caption'>{`已选择${checkedKeysDest.length}项`}</Typography>
                <FileTree projectFiles={filesDest} onKeyChecked={handleUpdateKeys('dest')} checkedKeys={checkedKeysDest}/>
            </Paper>
        </Stack>
        <br/>
        <Stack alignItems='center'>
            <Button variant='contained' onClick={handleClickCreate}>创建</Button>
        </Stack>
        
    </PopupDialog>
  )
}