import React, { useState } from 'react'
import { Tree } from 'antd'
import { generateTreeData, ProjectFiles } from './util'
import { DirectoryTreeProps } from 'antd/es/tree'

const {DirectoryTree} = Tree

type Props = {
    projectFiles:ProjectFiles
}

export default function FileTree(props: Props) {
    const [checkedKeys,setCheckedKeys] = useState<React.Key[]>([])

    const onCheck=(checkedKeysValue:React.Key[])=>{
        setCheckedKeys(checkedKeysValue)
    } 

return (
    <DirectoryTree
    treeData={generateTreeData(props.projectFiles)}
    multiple
    defaultExpandAll
    checkable
    checkedKeys={checkedKeys}
    onCheck={onCheck as DirectoryTreeProps['onCheck']}
    />
  )
}