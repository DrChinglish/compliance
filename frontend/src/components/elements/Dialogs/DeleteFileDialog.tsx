import LoadingButton from '@mui/lab/LoadingButton'
import React, { useState } from 'react'
import { FileMeta, SnackbarStatus } from '../../../Interfaces'
import PopupDialog from './PopupDialog'
import { List, ListItem, ListItemAvatar, Avatar, ListItemText} from '@mui/material'
import FolderIcon from '@mui/icons-material/Folder';
import { deleteFile } from '../../../utils/APIs'
import SnackBar from '../SnackBar'
import LoadingProgress from '../GameMeta/subComponents/LoadingProgress'

type Props = {
    fileList: FileMeta[],
    open:boolean,
    pid:number,
    onClose:(event: object, reason: string)=>void,
    updateFileList:(deletedfid:number[])=>void
}

export default function DeleteFileDialog(props: Props) {
    const [loading,setLoading] = useState(false)
    const [snackbarStatus,setSnackbarStatus] = useState<SnackbarStatus>({show:false,text:'',severity:'success'})
    const handleCancel=()=>{
        props.onClose({},'user close')
    }

    const handleDelete=()=>{
        setLoading(true)
        deleteFile(props.pid,props.fileList)
        .then(res=>{
            console.log(res)
            setLoading(false)
            if(res.status === 0){
                setSnackbarStatus({show:true,text:'删除失败。',severity:'error'})
            }else if(res.deletedfid.length === props.fileList.length){
                setSnackbarStatus({show:true,text:`成功删除了${props.fileList.length}个文件。`,severity:'success'})
            }else{
                setSnackbarStatus({show:true,text:`成功删除了${props.fileList.length}个文件中的${res.deletedfid.length}个。`,severity:'warning'})
                setTimeout(() => {
                    props.onClose({},'delete ends')
                }, 3000);
            }
            props.updateFileList(res.deletedfid)
        })
    }
  return (
    <PopupDialog open={props.open} onClose={props.onClose} title={`是否删除以下${props.fileList.length}个文件？`}
    actions={
        <>
            <LoadingButton loading={loading} variant='contained' color='error' onClick={loading?()=>{}:handleDelete}>删除</LoadingButton>
            <LoadingButton loading={loading} variant='contained' color='secondary' onClick={handleCancel}>取消</LoadingButton>
        </>
    }
    >
        <SnackBar status={snackbarStatus}/>
        {
        loading?<LoadingProgress/>:<List dense>
            {props.fileList.map((file,index)=>(
                <ListItem>
                    <ListItemAvatar><Avatar><FolderIcon/></Avatar></ListItemAvatar>
                    <ListItemText>
                        {file.name}
                    </ListItemText>
                </ListItem>
            ))}
        </List>
        }
        
    </PopupDialog>
  )
}