import urlmapping from "../urlMapping.json"
import { UploadFile } from "antd"
import { RcFile } from "antd/lib/upload"
import cookie from 'react-cookies'
import fetchHandle from './FetchErrorhandle'
import { ChecklistAnswer, FileInfoBasic, FileMeta } from "../Interfaces"
import { ProjectFiles } from "../components/elements/FileTree/util"
import { findElement } from "./util"

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

export async function deleteProject(pid:number,type:string,catchCallback?:(e:any)=>void,
handler?:(res:any)=>void) {
    let url:string=''
    if(type==='game'){
        url = urlmapping.apibase.game+urlmapping.apis.delete_project+pid+'/'
    }
    else if(type === 'platform'){
        url = urlmapping.apibase.platform+urlmapping.apis.delete_project+pid+'/'
    }
    else{
        url = urlmapping.apibase.other+urlmapping.apis.delete_project+pid+'/'
    }
    return fetchRequest(
        url,{
            method:'DELETE',
            mode:'cors',
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

export async function createPlatformProject(name:string,description:string,law:string[],fileList:UploadFile<any>[],catchCallback?:(e:any)=>void,
handler?:(res:any)=>void) {
    let personal = law.indexOf('personal')!==-1
    let network  = law.indexOf('network')!==-1
    let data = law.indexOf('data')!==-1
    
    let formdata = new FormData()
    fileList.forEach((file)=>{
        formdata.append('files[]',file as RcFile)
    })
    formdata.append('personal_protection_law',personal.toString())
    formdata.append('network_security_law',network.toString())
    formdata.append('data_security_law',data.toString())
    formdata.append('title',name)
    formdata.append('description',description)

    let url = `${urlmapping.apibase.platform}/projects/`

    return fetchRequest(
        url,
        {
            method:'POST',
            mode:'cors',
            body:formdata,
            credentials:'include',
            headers:{
                'X-CSRFToken':cookie.load('csrftoken')
            }
        }
        ,catchCallback,handler
    )
}

export async function getPlatformProjectList(catchCallback?:(e:any)=>void,
handler?:(res:any)=>void) {

    let url = `${urlmapping.apibase.platform}/projects/`

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

export async function getPlatformProjectQuestions(pid:number,catchCallback?:(e:any)=>void,
handler?:(res:any)=>void) {

    let url = `${urlmapping.apibase.platform}/projects/${pid}/questions/`

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
export async function submitCheckList(pid:number,answers:ChecklistAnswer,catchCallback?:(e:any)=>void,
handler?:(res:any)=>void) {

    let url = `${urlmapping.apibase.platform}/projects/${pid}/questions/`
    let formData = new FormData()
    for(let answer of answers){
        if(answer)
            formData.append(answer.id.toString(),answer.value.toString())
    }
    return fetchRequest(
        url,
        {
            method:'POST',
            body:formData,
            mode:'cors',
            credentials:'include',
            headers:{
                'X-CSRFToken':cookie.load('csrftoken')
            }
        }
        ,catchCallback,handler
    )
}



export async function setCookies() {
    return fetchRequest(
        urlmapping.apibase.other+urlmapping.apis.get_csrftoken,
        {
            method:'GET',
            mode:'cors',
            credentials:'include',
            // headers:{
            //     'X-CSRFToken':cookie.load('csrftoken')
            // }
        }
        ,undefined
        ,(res)=>{
            //console.log(res)
            if(cookie.load("csrftoken")!=undefined)
                console.log("cookie ok!")
            else
                console.log("cookie error!")
          }
    )
}

export async function getCheckListResult(pid:number,catchCallback?:(e:any)=>void,handler?:(res:any)=>void) {
    let url = `${urlmapping.apibase.platform}/projects/${pid}/results/`
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


export async function createGameProject(name:string,description:string,fileList:UploadFile<any>[],type:string,
    catchCallback?:(e:any)=>void,handler?:(res:any)=>void) {
    
    let formdata = new FormData()
    fileList.forEach((file)=>{
        formdata.append('files[]',file as RcFile)
    })
    formdata.append('title',name)
    formdata.append('description',description)
    formdata.append("category",type)

    let url = urlmapping.apibase.game+urlmapping.apis.create_project

    return fetchRequest(
        url,
        {
            method:'POST',
            mode:'cors',
            body:formdata,
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

export async function databaseScan(ip:string,user:string,pwd:string,schema:string,table:string,catchCallback?:(e:any)=>void,
handler?:(res:any)=>void) {
    let formData = new FormData()
    formData.append('ip',ip)
    formData.append('user',user)
    formData.append('pwd',pwd)
    formData.append('dbname',schema)
    formData.append('tablename',table)
    let url = `${urlmapping.apibase.platform}/projects/conndb/`
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

export async function getProjectList(category:string,catchCallback?:(e:any)=>void,
handler?:(res:any)=>void) {
    let formData = new FormData()
   // console.log(['game','platform'].findIndex((value)=>value===category)>=0)
    formData.append('category',category)
    let url:string=''
    switch(category){
        case 'game':url = urlmapping.apibase.game+ urlmapping.apis.project_list_game;break;
        case 'platform':url = urlmapping.apibase.platform+urlmapping.apis.project_list_platform; break;
        default:url = urlmapping.apibase.other+urlmapping.apis.project_list
    }
    //console.log(category)
    let method = (['game','platform'].findIndex((value)=>value===category)>=0)?'GET':'POST'
    let body = findElement(category,['game','platform']) ? undefined:formData
    return fetchRequest(
        url,
        {
            method:method,
            mode:'cors',
            body:body,
            headers:{
            'X-CSRFToken':cookie.load('csrftoken')
            }
        },catchCallback,handler
    )
}