import React, { useEffect, useState } from 'react'
import PopupDialog from './PopupDialog'
import { Upload,UploadFile} from 'antd'
import { InboxOutlined } from '@ant-design/icons'
import { Avatar, Stack, Snackbar, Alert, AlertColor, ListItem, ListItemText, List, ListItemAvatar, Button} from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton'
import  {uploadNewFile} from '../../../utils/APIs'
import Titles from '../../typography/Titles'
import { SnackbarStatus } from '../../../Interfaces'
import SnackBar from '../SnackBar'
import FolderIcon from '@mui/icons-material/Folder';
import SuccessHint from '../../Hints/SuccessHint'
const {Dragger} = Upload
type Props = {
    open:boolean,
    onClose:(event: object, reason: string)=>void,
    pid:number,
    uploadTo:(pid:number,fileList:UploadFile[],handler?:(res:any)=>void,catchCallback?:(e:any)=>void)=>Promise<any>
}

export default function UploadFileDialog(props: Props) {

    const [fileList,setFileList] = useState<UploadFile[]>([])
    const [uploading,setUploading] = useState<boolean>(false)
    const [snackbarStatus,setSnackbarStatus] = useState<SnackbarStatus>({show:false,text:'',severity:'success'})
    const [failedFiles,setFailedFile] = useState<string[]>([])
    const [showResult,setShowResult] = useState<boolean>(false)
    const [done,setDone] = useState<boolean>(false)
    const handleUpload=()=>{
        setUploading(true)
        props.uploadTo(props.pid,fileList,res=>{
            console.log(res)
            res.file_rejected&&setFailedFile(res.file_rejected)
            setUploading(false)
            setSnackbarStatus({show:true,text:res.text??'操作完成',severity:res.status===0?'warning':'success'})
            if(res.file_rejected?.length>0){
                setShowResult(true)
            }else{
                setDone(true)
            setTimeout(() => {
                console.log('close')
                handleClose('upload success')
            }, 3000);
            }
        })
        console.log(fileList)
    }

    useEffect(()=>{
        setFileList([])
        setFailedFile([])
        setShowResult(false)
        setDone(false)
        setSnackbarStatus({show:false,text:'',severity:'success'})
    },[props.open])

    const handleClose =(reason:string)=>{
        console.log('onclose')
        props.onClose({},reason)
    } 

    let uploadProps = {
        multiple: true,
        onRemove:(file: UploadFile)=>{
            // let fileList = this.state.fileList
            // const index = fileList.indexOf(file);
            // const newFileList = fileList.slice();
            // newFileList.splice(index, 1);
            // this.setState({fileList:newFileList})
            let newFileList = fileList.slice()
            newFileList.splice(fileList.indexOf(file),1)
            setFileList(newFileList)
        },
        beforeUpload:(file: UploadFile)=>{
            //console.log(file)
            setFileList((prev)=>{return [...prev,file]})
            return false
        }
    }
    let content =
    <>
        <Titles>上传失败的文件</Titles>
        <List dense>
            {failedFiles.map((file,index)=>(
                <ListItem>
                    <ListItemAvatar><Avatar><FolderIcon/></Avatar></ListItemAvatar>
                    <ListItemText>
                        {file}
                    </ListItemText>
                </ListItem>
            ))}
        </List>
    </>
    
  return (
    <PopupDialog title='上传文件' open={props.open} onClose={props.onClose}
        actions={
            showResult?<Button variant='contained' onClick={()=>handleClose('user interrupt')}>关闭</Button>:
            <LoadingButton loading={uploading} variant='contained' disabled={fileList.length===0}
            onClick={uploading?()=>{}:handleUpload}>上传</LoadingButton>
        }
    >
        <Stack>
            {
            showResult?content:(done?<SuccessHint label='上传成功'/>:
            <Dragger {...uploadProps} listType='picture-card' fileList={fileList} style={{marginBottom:'24px',maxHeight:'200px',width:'100%'}}>
                <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                </p>
                <p className="ant-upload-text">点击或拖拽上传文件</p>
                <p className="ant-upload-hint">
                支持批量上传
                </p>
            </Dragger>
            )
            }
            <SnackBar status={snackbarStatus}/>
        </Stack>

    </PopupDialog>
    
    
  )
}