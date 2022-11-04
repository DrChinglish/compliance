import React, { useState } from 'react'
import PopupDialog from './PopupDialog'
import {Upload,UploadFile} from 'antd'
import { InboxOutlined } from '@ant-design/icons'
import { Stack, Snackbar, Alert, AlertColor } from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton'
import  {uploadNewFile} from '../../../utils/APIs'
const {Dragger} = Upload
type Props = {
    open:boolean,
    onClose:(event: object, reason: string)=>void,
    pid:number
}
type SnackbarStatus={
    show:boolean,
    text:string,
    severity:'success'|'warning'
}
export default function UploadFileDialog(props: Props) {

    const [fileList,setFileList] = useState<UploadFile[]>([])
    const [uploading,setUploading] = useState<boolean>(false)
    const [snackbarStatus,setSnackbarStatus] = useState<SnackbarStatus>({show:false,text:'',severity:'success'})
    const handleUpload=()=>{
        setUploading(true)
        uploadNewFile(props.pid,fileList)
        .then(res=>{
            console.log(res)
            setUploading(false)
            setSnackbarStatus({show:true,text:res.text,severity:res.status===0?'warning':'success'})
            setTimeout(() => {
                props.onClose({},'upload action over')
            }, 3000);
        })
        console.log(fileList)
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
            setFileList([...fileList,file])
            return false
        }
    }
  return (
    <PopupDialog title='上传文件' open={props.open} onClose={props.onClose}
        actions={
            <LoadingButton loading={uploading} variant='contained' onClick={uploading?()=>{}:handleUpload}>上传</LoadingButton>
        }
    >
        <Stack>
            
            <Dragger {...uploadProps} listType='picture-card' fileList={fileList} style={{marginBottom:'24px',maxHeight:'200px',width:'100%'}}>
                <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                </p>
                <p className="ant-upload-text">点击或拖拽上传文件</p>
                <p className="ant-upload-hint">
                支持批量上传
                </p>
            </Dragger>
            <Snackbar anchorOrigin={{vertical:'top',horizontal:'center'}}
                open={snackbarStatus.show} autoHideDuration={3000}>
                <Alert severity={snackbarStatus.severity as AlertColor} 
                sx={{width:'50ch'}}>
                    {snackbarStatus.text}
                </Alert>
            </Snackbar>
        </Stack>

    </PopupDialog>
    
    
  )
}