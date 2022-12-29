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



export function generateTreeData(projectFiles:ProjectFiles, disabledKeys:React.Key[]){
    let data:DataNode[]=[]
    for(let key in projectFiles){
        let dataoftype:DataNode={
            title:keyLocalization[key],
            key:key,
            disableCheckbox:disabledKeys.includes(key),
        }
        let nodeChildren:DataNode[] = []
        for(let file of projectFiles[key] ){
            if(!file.id)
                continue
            let filedetail = file as FileMeta
            let filekey = generateFileKey(file.id,key)
            nodeChildren.push({
                title:filedetail.name??`${keyLocalization[key]}-${filedetail.id}`,
                key:filekey,
                isLeaf:true,
                disableCheckbox:disabledKeys.includes(filekey),
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
        return ''
    else{
        return str[0]
    }
}

function extractFileIDFromKey(key:React.Key){
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
                if(!res[key])
                    res[key]=[]
                res[key].push(file as FileMeta)
            }
        })
    }
    console.log(`Got files:\n`,res)
    return res
}

export function setDisabled(current:ProjectFiles, keys:React.Key[], disable:boolean = true){

}

export function removeFileByKeys(current:ProjectFiles, to_delete:React.Key[]){
    for(let key of to_delete){
        let fid = extractFileIDFromKey(key)
        let type = extractFileTypeFromKey(key)
        if(fid<0||type.length===0){
            console.log(`Warning, incorrect file id or type of file ${key}.`)
            continue
        }
        if(current[type]){
            let index = current[type].findIndex((value)=>value.id===fid)
            if(index!==-1){
                current[type].splice(index,1)
            }else{
                console.log(`Warning, trying to delete file that does not exist, file id:${fid}`)
            }
            if(current[type].length===0){
                Reflect.deleteProperty(current,type)
            }
        }else{
            console.log(`Warning, trying to delete file that belongs to a non exist type:${type}`)
        }
    }
    console.log(current)
    return {...current}
}

export function mergeTreeData(current:ProjectFiles, added:ProjectFiles){
    console.log(added)
    for(let key in added){
        if(!current[key]){
            // not yet created
            current[key]=[]
        }
        let addfiles = added[key]
        console.log(addfiles)
        for(let addfile of addfiles){
            if(current[key].findIndex((file)=>file.id===addfile.id)===-1)
            current[key].push(addfile as FileMeta)
        }
    }
    console.log(`After merge:\n`,current)
    return {...current}
}


