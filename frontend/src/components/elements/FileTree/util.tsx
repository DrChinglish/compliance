import { FileInfoBasic, FileMeta } from "../../../Interfaces";
import type { DataNode, DirectoryTreeProps } from 'antd/es/tree';
const FileTypes = ['text','audio','video','image']

const keyLocalization = {
    text:'文本文件',
    image:'图片文件',
    audio:'音频文件',
    video:'视频文件',
    healthyReminder:'健康游戏忠告',
}

export interface ProjectFiles{
    [key:string]: FileInfoBasic[]|FileMeta[],
}



export function generateTreeData(projectFiles:ProjectFiles){
    let data:DataNode[]=[]
    for(let key in projectFiles){
        let dataoftype:DataNode={
            title:keyLocalization[key],
            key:key
        }
        let nodeChildren:DataNode[] = []
        for(let file of projectFiles[key] ){
            if(!file.id)
                continue
            let filedetail = file as FileMeta
            nodeChildren.push({
                title:filedetail.name??`${keyLocalization[key]}-${filedetail.id}`,
                key:`${key}-${filedetail.id}`,
                isLeaf:true,
            })
        }
        dataoftype.children=nodeChildren
        dataoftype.checkable=dataoftype.children.length>0
        data.push(dataoftype)
    }
    return data
}
