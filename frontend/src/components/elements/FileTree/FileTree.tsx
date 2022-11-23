import React, { useEffect, useState } from 'react'
import { Tree } from 'antd'
import { generateTreeData, ProjectFiles } from './util'
import { DirectoryTreeProps } from 'antd/es/tree'

const {DirectoryTree} = Tree

type Props = {
    projectFiles:ProjectFiles,
    onKeyChecked?:(checkedKeysValue:React.Key[])=>void
}

export default function FileTree(props: Props) {

    const [checkedKeys,setCheckedKeys] = useState<React.Key[]>([])
    const [fileList,setFileList] = useState<ProjectFiles>(props.projectFiles)
    useEffect(()=>{
        setFileList(props.projectFiles)
        //console.log('set')
    },[props.projectFiles])

    const onCheck=(checkedKeysValue:React.Key[])=>{
        setCheckedKeys(checkedKeysValue)
        if(props.onKeyChecked){
            props.onKeyChecked(checkedKeysValue)
        }
    } 

return (
    <DirectoryTree 
    treeData={generateTreeData(fileList)}
    multiple
    defaultExpandAll
    checkable
    checkedKeys={checkedKeys}
    onCheck={onCheck as DirectoryTreeProps['onCheck']}
    />
  )
}