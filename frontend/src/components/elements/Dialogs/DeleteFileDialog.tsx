import LoadingButton from '@mui/lab/LoadingButton'
import React, { useEffect, useState } from 'react'
import { FileInfoBasic, FileMeta, SnackbarStatus } from '../../../Interfaces'
import PopupDialog from './PopupDialog'
import { List, ListItem, ListItemAvatar, Avatar, ListItemText} from '@mui/material'
import FolderIcon from '@mui/icons-material/Folder';
import { deleteFile } from '../../../utils/APIs'
import SnackBar from '../SnackBar'
import LoadingProgress from '../GameMeta/subComponents/LoadingProgress'
import SuccessHint from '../../Hints/SuccessHint'

type Props = {
    fileList: FileInfoBasic[]|FileMeta[],
    open:boolean,
    pid:number,
    onClose:(event: object, reason: string)=>void,
    updateFileList?:(deletedfid:number[])=>void,
    from?:'default'|'advice'
}

export default function DeleteFileDialog(props: Props) {
    const [loading,setLoading] = useState(false)
    const [snackbarStatus,setSnackbarStatus] = useState<SnackbarStatus>({show:false,text:'',severity:'success'})
    const [done,setDone] = useState(false)
    const handleCancel=()=>{
        props.onClose({},'user close')
    }
    useEffect(()=>{
        setLoading(false)
        setDone(false)
        setSnackbarStatus({show:false,text:'',severity:'success'})
    },[props.open])
    const handleDelete=()=>{
        setLoading(true)
        deleteFile(props.pid,props.fileList,props.from??'default')
        .then(res=>{
            console.log(res)
            setLoading(false)
            setDone(true)
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
    <PopupDialog open={props.open} onClose={props.onClose} title={done?'操作完成':`是否删除以下${props.fileList.length}个文件？`}
    actions={
            !done &&
            <>
                <LoadingButton loading={loading} variant='contained' color='error' onClick={loading?()=>{}:handleDelete}>删除</LoadingButton>
                <LoadingButton loading={loading} variant='contained' color='secondary' onClick={handleCancel}>取消</LoadingButton>
            </>
    }
    >
        <SnackBar status={snackbarStatus}/>
        {
        loading?<LoadingProgress/>:(done?<SuccessHint label='操作完成'/>:<List dense>
            {props.fileList.map((file,index)=>(
                <ListItem>
                    <ListItemAvatar><Avatar><FolderIcon/></Avatar></ListItemAvatar>
                    <ListItemText>
                        {file.name??`游戏健康忠告图片 id:${file.id}`}
                    </ListItemText>
                </ListItem>
            ))}
        </List>)
        }
        
    </PopupDialog>
  )
}