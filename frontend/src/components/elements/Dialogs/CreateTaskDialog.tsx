import React, { useEffect, useState } from 'react'
import Titles from '../../typography/Titles'
import FileTree from '../FileTree/FileTree'
import { getFilesFromKeys, mergeTreeData, ProjectFiles } from '../FileTree/util'
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import PopupDialog from './PopupDialog'
import { Button, Paper, Stack, Typography } from '@mui/material';
type Props = {
    open:boolean,
    onClose?:(event: object, reason: string)=>void,
    projectFiles:ProjectFiles
}

export default function CreateTaskDialog(props: Props) {
    //console.log(props.projectFiles)
    const [checkedKeysSource, setcheckedKeysSource] = useState<React.Key[]>([])
    const [checkedKeysDest, setcheckedKeysDest] = useState<React.Key[]>([])
    const [filesSource,setFilesSource] = useState<ProjectFiles>(props.projectFiles)
    const [filesDest,setFilesDest] = useState<ProjectFiles>({})

    useEffect(()=>{
        setFilesSource(props.projectFiles)
    },[props.projectFiles])

    const handleTransferFiles = (direction:'add'|'remove')=>()=>{
        if(direction==='add'){
            setFilesDest(mergeTreeData(filesDest,getFilesFromKeys(filesSource,checkedKeysSource)))
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
        <Titles>请在左侧选择需要处理的文件</Titles>
        <Stack direction={'row'} spacing={2} justifyContent='center'>
            <Paper sx={{p:1,overflow:'auto',maxHeight:'50vh',width:'30vw'}}>
                <Typography variant='caption'>{`已选择${checkedKeysSource.length}项`}</Typography>
                <FileTree projectFiles={filesSource} onKeyChecked={handleUpdateKeys('source')}/>
            </Paper>
            <Stack spacing={2} alignItems={'center'} justifyContent='center'>
                <Button variant='outlined' onClick={handleTransferFiles('remove')}><KeyboardDoubleArrowLeftIcon/></Button>
                <Button variant='outlined' onClick={handleTransferFiles('add')}><KeyboardDoubleArrowRightIcon/></Button>
            </Stack>
            <Paper sx={{p:1,overflow:'auto',maxHeight:'50vh',width:'30vw'}}>
                <Typography variant='caption'>{`已选择`}</Typography>
                <FileTree projectFiles={filesDest}/>
            </Paper>
        </Stack>
        
    </PopupDialog>
  )
}