import urlmapping from "../urlMapping.json"

export function getStaticResources(url:string){
    //Retreive static resources from django backend
    return urlmapping.host+'/api'+url
}

export function getProcessedFile(pid:number,fid:number,variant:'image'|'text'){
    let p1=variant==='image'?'images':'texts'
    let p2=variant==='image'?'process_img':'process_doc'
    return `${urlmapping.apibase.game}/projects/${pid}/${p1}/${fid}/${p2}`
}