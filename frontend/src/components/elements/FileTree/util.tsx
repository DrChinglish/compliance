import { FileInfoBasic, FileMeta } from "../../../Interfaces";
import type { DataNode, DirectoryTreeProps } from 'antd/es/tree';
import ListItemFileIcon from "../GameMeta/subComponents/ListItemFileIcon";
import React from "react";
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
                key:generateFileKey(file.id,key),
                isLeaf:true,
                icon:(props)=>(<ListItemFileIcon type={filedetail.type} ext={filedetail.ext} size='14px' origin/>)
            })
        }
        dataoftype.children=nodeChildren
        dataoftype.checkable=dataoftype.children.length>0
        data.push(dataoftype)
    }
    return data
}

function generateFileKey(fid:number,type:string){
    return `${type}-${fid}`
}

function extractFileTypeFromKey(key: React.Key){
    let str:string[] = key.toString().split('-')
    if(str.length!=2)
        return -1
    else{
        return str[0]
    }
}

export function extractFileIDFromKey(key:React.Key){
    let str:string[] = key.toString().split('-')
    if(str.length!=2)
        return -1
    else{
        return parseInt(str[1])
    }
}

export function getFilesFromKeys(projectFiles:ProjectFiles, checkedKeys:React.Key[]){
    let res:ProjectFiles={}
    for(let key in projectFiles){
        let files=projectFiles[key]
        files.forEach((file)=>{
            if(checkedKeys.indexOf(generateFileKey(file.id,key))!==-1){
                res[key].push(file as FileMeta)
            }
        })
    }
    return res
}

export function removeFileByKeys(current:ProjectFiles, to_delete:React.Key[]){
    for(let key in to_delete){
        let fid = extractFileIDFromKey(key)
        let type = extractFileTypeFromKey(key)
        if(current[type]){
            let index = current[type].findIndex((value)=>value.id===fid)
            if(index!==-1){
                current[type].splice(index,1)
            }else{
                console.log(`Warning, trying to delete file that does not exist, file id:${fid}`)
            }
            if(current[key].length===0){
                Reflect.deleteProperty(current,key)
            }
        }else{
            console.log(`Warning, trying to delete file that belongs to a non exist type:${type}`)
        }
    }
}

export function mergeTreeData(current:ProjectFiles, added:ProjectFiles){
    for(let key in added){
        if(!current[key]){
            // not yet created
            current[key]=[]
        }
        let addfiles = added[key]
        for(let addfile of addfiles){
            if(current[key].findIndex((file)=>file.id===addfile.id)!==-1)
            current[key].push(addfile as FileMeta)
        }
    }
    return current
}