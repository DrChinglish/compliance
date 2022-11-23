import LoadingButton from '@mui/lab/LoadingButton'
import React, { useEffect, useState } from 'react'
import { FileInfoBasic, FileMeta, LoadingStatus, SnackbarStatus } from '../../../Interfaces'
import PopupDialog from './PopupDialog'
import { List, ListItem, ListItemAvatar, Avatar, ListItemText} from '@mui/material'
import FolderIcon from '@mui/icons-material/Folder';
import { deleteFile } from '../../../utils/APIs'
import SnackBar from '../SnackBar'
import StatusContainer from '../StatusContainer'

type Props = {
    fileList: FileInfoBasic[]|FileMeta[],
    open:boolean,
    pid:number,
    onClose:(event: object, reason: string)=>void,
    updateFileList?:(deletedfid:number[])=>void,
    from?:'default'|'advice'
}

export default function DeleteFileDialog(props: Props) {
    const [snackbarStatus,setSnackbarStatus] = useState<SnackbarStatus>({show:false,text:'',severity:'success'})
    const [status,setStatus] = useState<LoadingStatus>('initial')
    const handleCancel=()=>{
        props.onClose({},'user close')
    }
    useEffect(()=>{
        setStatus('initial')
        setSnackbarStatus({show:false,text:'',severity:'success'})
    },[props.open])
    const handleDelete=()=>{
        setStatus('loading')
        deleteFile(props.pid,props.fileList,props.from??'default',(reason)=>{
            setSnackbarStatus({show:true,text:`暂时无法执行该操作:${reason.name} ${reason.message}`,
            severity:'error'})
            setStatus('error')
        },res=>{
            console.log(res)
            setStatus('success')
            if(res.status === 0){
                setSnackbarStatus({show:true,text:'删除失败。',severity:'error'})
            }else if(res.deletedfid.length === props.fileList.length){
                setSnackbarStatus({show:true,text:`成功删除了${props.fileList.length}个文件。`,severity:'success'})
                setTimeout(() => {
                    props.onClose({},'delete ends')
                }, 3000);
            }else{
                setSnackbarStatus({show:true,text:`成功删除了${props.fileList.length}个文件中的${res.deletedfid.length}个。`,severity:'warning'})
                
            }
            props.updateFileList && props.updateFileList(res.deletedfid)
        })
    }
  return (
    <PopupDialog open={props.open} onClose={props.onClose} title={status==='success'?'操作完成':
    `是否删除以下${props.fileList.length}个文件？`}
    actions={
            status!=='success' &&
            <>
                <LoadingButton loading={status==='loading'} variant='contained' color='error' 
                onClick={status==='loading'?()=>{}:handleDelete}>删除</LoadingButton>
                <LoadingButton loading={status==='loading'} variant='contained' color='secondary' 
                onClick={handleCancel}>取消</LoadingButton>
            </>
    }
    >
        <SnackBar status={snackbarStatus}/>
        {
            <StatusContainer status={status} variant='decision' successText='操作完成'>
                <List dense>
                    {props.fileList.map((file,index)=>(
                        <ListItem>
                            <ListItemAvatar><Avatar><FolderIcon/></Avatar></ListItemAvatar>
                            <ListItemText>
                                {file.name??`游戏健康忠告图片 id:${file.id}`}
                            </ListItemText>
                        </ListItem>
                    ))}
                </List>
            </StatusContainer>
        }
        
    </PopupDialog>
  )
}