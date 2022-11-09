import urlmapping from "../urlMapping.json"
import { UploadFile } from "antd"
import { RcFile } from "antd/lib/upload"
import cookie from 'react-cookies'
import fetchHandle from './FetchErrorhandle'
import { FileMeta } from "../Interfaces"
export function getStaticResources(url:string){
    //Retreive static resources from django backend
    return urlmapping.host+'/api'+url
}

export function getProcessedFile(pid:number,fid:number,variant:'image'|'text'){
    let p1=variant==='image'?'images':'texts'
    let p2=variant==='image'?'process_img':'process_doc'
    return `${urlmapping.apibase.game}/projects/${pid}/${p1}/${fid}/${p2}`
}

export async function uploadNewFile(pid:number,fileList:UploadFile[],catchCallback?:(e:any)=>void){
    let url = `${urlmapping.apibase.game}/projects/${pid}/upload/`
    // let method = 'POST'
    let formdata = new FormData()
    for(let file of fileList){
        formdata.append('files[]',file as RcFile)
    }
    return fetch(
        url,{
            method:'POST',
            body:formdata,
            mode:'cors',
            credentials:'include',
            headers:{
                'X-CSRFToken':cookie.load('csrftoken')
            }
        }
    )
    .then(fetchHandle)
    .then(res=>res.json())
    .catch(catchCallback?catchCallback:(reason)=>{
        console.log(reason)
    })
}

export async function deleteFile(pid:number, fileList:FileMeta[], catchCallback?:(e:any)=>void) {
    let url = `${urlmapping.apibase.game}/projects/${pid}/delete_files/`
    let deletefid:number[] = []
    fileList.forEach((value)=>{
        console.log(value)
        deletefid.push(value.id)
    })
    return fetch(
        url,
        {
            body:JSON.stringify({delete:deletefid}),
            method:'DELETE',
            mode:'cors',
            credentials:'include',
            headers:{
                'X-CSRFToken':cookie.load('csrftoken')
            }
        }
    )
    .then(fetchHandle)
    .then(res=>res.json())
    .catch(catchCallback?catchCallback:(reason)=>{
        console.log(reason)
    })
}