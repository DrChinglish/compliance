import urlmapping from "../urlMapping.json"
import { UploadFile } from "antd"
import { RcFile } from "antd/lib/upload"
import cookie from 'react-cookies'
import fetchHandle from './FetchErrorhandle'
import { FileInfoBasic, FileMeta } from "../Interfaces"
import { ProjectFiles } from "../components/elements/FileTree/util"

export function getMediaResources(pid:number,fid:number){
    return urlmapping.host+`/api/projects/${pid}/media_file/?fid=${fid}`
}

export function getStaticResources(url:string){
    //Retreive static resources from django backend
    if(url){
        return urlmapping.host+(url.at(0)==='/'?'/api':'/api/')+url
    }else{
        return undefined
    }
   
}

export function getProcessedFile(pid:number,fid:number,variant:'image'|'text'){
    let p1=variant==='image'?'images':'texts'
 
    return `${urlmapping.apibase.game}/projects/${pid}/${p1}/${fid}/result`
}

async function fetchRequest(url:string,init?:RequestInit,catchCallback?:(e:any)=>void,
handler?:(res:any)=>void) {
    return fetch(
        url,
        init
    )
    .then(fetchHandle)
    .then(res=>res.json())
    .then(handler)
    .catch(catchCallback?catchCallback:(reason)=>{
        console.log(reason)
    })
}

export async function uploadNewFile(pid:number,fileList:UploadFile[],catchCallback?:(e:any)=>void,
handler?:(res:any)=>void){
    let url = `${urlmapping.apibase.game}/projects/${pid}/upload/`
    // let method = 'POST'
    let formdata = new FormData()
    for(let file of fileList){
        formdata.append('files[]',file as RcFile)
    }
    return fetchRequest(url,{
        method:'POST',
        body:formdata,
        mode:'cors',
        credentials:'include',
        headers:{
            'X-CSRFToken':cookie.load('csrftoken')
        }
    },catchCallback,handler)
}

export async function deleteFile(pid:number, fileList:FileInfoBasic[],from:'default'|'advice', catchCallback?:(e:any)=>void,
handler?:(res:any)=>void) {
    let url = `${urlmapping.apibase.game}/projects/${pid}/${from==='default'?'delete_files':'delete_advice_images'}/`
    let deletefid:number[] = []
    fileList.forEach((value)=>{
        console.log(value)
        deletefid.push(value.id)
    })
    return fetchRequest(
        url,
        {
            body:JSON.stringify({delete:deletefid}),
            method:'DELETE',
            mode:'cors',
            credentials:'include',
            headers:{
                'X-CSRFToken':cookie.load('csrftoken')
            }
        },catchCallback,handler
    )
}

export async function processAudio(pid:number,fid:number,catchCallback?:(e:any)=>void,
handler?:(res:any)=>void) {
    let url=`${urlmapping.apibase.game}/projects/${pid}/audios/${fid}/result`
    return fetchRequest(
        url,
        {
            method:'GET',
            mode:'cors',
            credentials:'include',
            headers:{
                'X-CSRFToken':cookie.load('csrftoken')
            }
        }
        ,catchCallback,handler
    )
}

export async function uploadHealthyReminder(pid:number,fileList:UploadFile[],catchCallback?:(e:any)=>void,
handler?:(res:any)=>void) {
    let url = `${urlmapping.apibase.game}/advices/`
    let formdata = new FormData()
    if(fileList.length>0)
        formdata.append('file',fileList[0] as RcFile)
    formdata.append('project',pid.toString() )
    return fetchRequest(url,
        {
            method:'POST',
            body:formdata,
            mode:'cors',
            credentials:'include',
            headers:{
                'X-CSRFToken':cookie.load('csrftoken')
            }
        },catchCallback,handler
    )
}

export async function getHealthyReminder(pid:number,catchCallback?:(e:any)=>void,
handler?:(res:any)=>void) {
    let url = `${urlmapping.apibase.game}/projects/${pid}/advice_images/`
    return fetchRequest(url,
        {
            method:'GET',
            mode:'cors',
            credentials:'include',
            headers:{
                'X-CSRFToken':cookie.load('csrftoken')
            }
        },catchCallback,handler
    )
}

export async function processHealthyReminder(pid:number,fid:number,catchCallback?:(e:any)=>void,
handler?:(res:any)=>void) {
    let url = `${urlmapping.apibase.game}/projects/${pid}/advice_images/${fid}/result`
    return fetchRequest(url,
        {
            method:'GET',
            mode:'cors',
            credentials:'include',
            headers:{
                'X-CSRFToken':cookie.load('csrftoken')
            }
        },catchCallback,handler
    )
}

export async function processVideo(pid:number,fid:number,catchCallback?:(e:any)=>void,
handler?:(res:any)=>void) {
    let url = `${urlmapping.apibase.game}/projects/${pid}/videos/${fid}/key_frames`
    return fetchRequest(url,
        {
            method:'GET',
            mode:'cors',
            credentials:'include',
            headers:{
                'X-CSRFToken':cookie.load('csrftoken')
            }
        },catchCallback,handler
    )
}

export async function videoResult(pid:number,fid:number,catchCallback?:(e:any)=>void,
handler?:(res:any)=>void) {
    let url = `${urlmapping.apibase.game}/files/${fid}/result_video/`
    return fetchRequest(url,
        {
            method:'GET',
            mode:'cors',
            credentials:'include',
            headers:{
                'X-CSRFToken':cookie.load('csrftoken')
            }
        },catchCallback,handler
    )
}

export async function createTask(pid:number,files:ProjectFiles ,catchCallback?:(e:any)=>void,
handler?:(res:any)=>void) {
    let formData = new FormData()
    formData.append('project',pid.toString())
    formData.append('files',JSON.stringify(files))
    console.log(formData)
    let url = `${urlmapping.apibase.game}/tasks/`
    return fetchRequest(url,
            {
                method:'POST',
                mode:'cors',
                body:formData,
                credentials:"include",
                headers:{
                    'X-CSRFToken':cookie.load('csrftoken')
                }
            },catchCallback,handler
        )
}