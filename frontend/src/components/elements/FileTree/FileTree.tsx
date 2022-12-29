import React, { useEffect, useState } from 'react'
import { Tree } from 'antd'
import { generateTreeData, ProjectFiles } from './util'
import { DataNode, DirectoryTreeProps } from 'antd/es/tree'

const {DirectoryTree} = Tree

type Props = {
    projectFiles:ProjectFiles,
    onKeyChecked?:(checkedKeysValue:React.Key[])=>void,
    disabledKeys?:React.Key[],
    checkedKeys?:React.Key[]
}

export default function FileTree(props: Props) {

    const [checkedKeys,setCheckedKeys] = useState<React.Key[]>([])
    const [treeData, setTreeData] = useState<DataNode[]>(generateTreeData(props.projectFiles,props.disabledKeys??[]))
    useEffect(()=>{
        setTreeData(generateTreeData(props.projectFiles,props.disabledKeys??[]))
        if(props.checkedKeys)
            setCheckedKeys(props.checkedKeys)
        //console.log('set')
    },[props.projectFiles,props.disabledKeys,props.checkedKeys])

    const onCheck=(checkedKeysValue:React.Key[])=>{
        setCheckedKeys(checkedKeysValue)
        if(props.onKeyChecked){
            props.onKeyChecked(checkedKeysValue)
        }
    } 

return (
    <DirectoryTree 
    treeData={treeData}
    multiple
    defaultExpandAll
    checkable
    checkedKeys={checkedKeys}
    onCheck={onCheck as DirectoryTreeProps['onCheck']}
    />
  )
}