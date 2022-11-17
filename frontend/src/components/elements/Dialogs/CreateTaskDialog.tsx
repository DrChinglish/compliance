import React from 'react'
import Titles from '../../typography/Titles'
import FileTree from '../FileTree/FileTree'
import { ProjectFiles } from '../FileTree/util'
import PopupDialog from './PopupDialog'
type Props = {
    open:boolean,
    onClose?:(event: object, reason: string)=>void,
    projectFiles:ProjectFiles
}

export default function CreateTaskDialog(props: Props) {
    //console.log(props.projectFiles)
  return (
    <PopupDialog open={props.open} onClose={props.onClose} title='创建处理任务'>
        <Titles>请在左侧选择需要处理的文件</Titles>
        <FileTree projectFiles={props.projectFiles}/>
    </PopupDialog>
  )
}