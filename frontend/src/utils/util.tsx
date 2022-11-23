import { ClassifiedFileList, FileMeta } from "../Interfaces"

export function getTextColorFromFlag(flag:number){
    switch(flag){
        case 1:return 'red'
        case 2:return 'orange'
        default:return 'black'
    }
}

// Only handles hh:mm:ss:ms or hh:mm:ss
export function formatTime(time:string|number){
    let itemcount = 0
    if(typeof(time)==='number')
        return time
    let times = time.split(':')
    itemcount = times.length
    if(itemcount!==3&&itemcount!==4){
        return -1
    }
    return parseFloat(times[0])*60*60+parseFloat(times[1])*60+parseFloat(times[2])+(itemcount===4?parseFloat(times[3])/1000:0.0)
}

export function classifyFiles(fileList:FileMeta[]){
    //console.log(props.fileList)
    let classifiedList:ClassifiedFileList={
        text:[],
        audio:[],
        video:[],
    }
    for(let file of fileList){
        if(!classifiedList[file.type??'other'])
            classifiedList[file.type??'other'] = []
        classifiedList[file.type??'other'].push(file)
    }
    //console.log(fileList)
   return classifiedList
}

export function convertBase64Image(b64:string){
    return `data:image/png;base64,${b64}`
}