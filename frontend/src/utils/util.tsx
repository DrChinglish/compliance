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

export const LocallizationLaw = {
    personal:'个人信息保护法',
    network:'网络安全法',
    data:'数据安全法'
}

export const LocallizationLawArticle = {
    personal_protection_law:'个人信息保护法',
    network_security_law:'网络安全法',
    data_security_law:'数据安全法'
}


export function questionFilter(question:string){
    let reg = RegExp('【.*?】')
    let result = question.match(reg)
    if(result?.index)
        question = question.substring(result?.index+result[0].length)
    return question
}

export function findElement<T>(element:T,array:T[]){
    return array.findIndex(value=>value===element)>=0
}
